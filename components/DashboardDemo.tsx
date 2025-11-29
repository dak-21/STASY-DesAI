import React, { useState, useEffect, useRef } from 'react';
import { CameraFeed } from './CameraFeed';
import { StatsPanel } from './StatsPanel';
import { ActionPlan } from './ActionPlan';
import { AlertSystem } from './AlertSystem';
import { HospitalNotification } from './HospitalNotification';
import { SystemStatus, BoundingBox, GridCell, LogEntry } from '../types';
import { generateEmergencyPlan } from '../services/geminiService';
import { getUserLocation, postStampedeAlert, formatLocation } from '../services/hospitalService';

// Constants from Python script
const GRID_ROWS = 8;
const GRID_COLS = 8;
const HIGH_DENSITY_THRESHOLD = 5;
const CRITICAL_DENSITY_THRESHOLD = 8;
const CRITICAL_DENSITY_CELL_COUNT_THRESHOLD = 2;

export const DashboardDemo: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>('Initializing');
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false); // Start false until video loads
  const [alerts, setAlerts] = useState<LogEntry[]>([]);
  const [dispatchCooldownUntil, setDispatchCooldownUntil] = useState<number>(0);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  // Notification state
  const [hospitalNotificationVisible, setHospitalNotificationVisible] = useState(false);
  const [hospitalNotificationData, setHospitalNotificationData] = useState({
    message: '',
    location: '',
    timestamp: new Date().toLocaleTimeString(),
    status: '',
    timeframe: ''
  });
  
  // Simulation State
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [totalPersons, setTotalPersons] = useState(0);

  // Boot Sequence Simulation
  useEffect(() => {
    const bootSequence = async () => {
      addLog("System startup initiated...", "system");
      await delay(800);
      addLog("Initializing YOLOv11 Engine...", "system");
      await delay(1200);
      addLog("Engine Ready. Waiting for video input stream.", "info");
      setStatus('Normal');
    };
    bootSequence();
  }, []);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const addLog = (msg: string, type: LogEntry['type'] = 'info') => {
    setAlerts(prev => [{
      id: Math.random().toString(36),
      timestamp: new Date().toLocaleTimeString(),
      message: msg,
      type
    }, ...prev].slice(0, 8));
  };

  // Track when CRITICAL started so we can send alerts after a duration
  const criticalStartRef = React.useRef<number | null>(null);
  const hasSentAutoAlertRef = React.useRef<boolean>(false);

  const handleVideoUpload = (file: File) => {
      setVideoFile(file);
      setIsMonitoring(true);
      addLog(`Stream connected: ${file.name}`, 'info');
      addLog(`Analysis Started: YOLOv11n`, 'system');
  };

  // Main Simulation Loop (Updates when video is active)
  useEffect(() => {
    if (!isMonitoring || !videoFile) return;

    const interval = setInterval(() => {
      updateSimulation();
    }, 500); // Update grid every 500ms for smoother visual but less chaotic than 30fps

    return () => clearInterval(interval);
  }, [isMonitoring, videoFile, status]); // Added status dependency to allow re-evaluation

  const updateSimulation = () => {
      // Since we cannot run actual Computer Vision in the browser without backend,
      // we simulate "Density fluctuation" to mimic the backend output.
      
      // 1. Generate a mock person count that fluctuates
      setTotalPersons(prev => {
          const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
          return Math.max(120, prev + change); // Keep above 120 for realistic crowd video feel
      });

      // 2. Generate Grid Density Map
      // We use a noise-like approach to make "hotspots" move organically
      const newGrid: GridCell[][] = Array(GRID_ROWS).fill(null).map(() => 
        Array(GRID_COLS).fill(null).map(() => ({ count: 0, status: 'NORMAL' }))
      );

      let highDensityCells = 0;
      let criticalDensityCells = 0;

      // Randomly decide a "hotspot" center
      const centerX = Math.floor(Math.random() * GRID_COLS);
      const centerY = Math.floor(Math.random() * GRID_ROWS);

      newGrid.forEach((row, r) => {
        row.forEach((cell, c) => {
            // Calculate distance from hotspot
            const dist = Math.sqrt(Math.pow(r - centerY, 2) + Math.pow(c - centerX, 2));
            
            // Base count + hotspot influence
            let count = Math.floor(Math.random() * 4); // 0-3 base
            if (dist < 2) count += Math.floor(Math.random() * 6) + 3; // Add 3-8 if near hotspot
            
            cell.count = count;

            if (cell.count >= CRITICAL_DENSITY_THRESHOLD) {
                cell.status = 'CRITICAL';
                criticalDensityCells++;
            } else if (cell.count >= HIGH_DENSITY_THRESHOLD) {
                cell.status = 'HIGH';
                highDensityCells++;
            }
        });
      });

      setGrid(newGrid);

      // 3. Determine Overall Status
      let overallStatus: SystemStatus = 'Normal';
      if (criticalDensityCells >= CRITICAL_DENSITY_CELL_COUNT_THRESHOLD) {
        overallStatus = 'CRITICAL RISK';
      } else if (criticalDensityCells > 0) {
        overallStatus = 'Critical Density Cell Detected';
      } else if (highDensityCells >= 3) {
         overallStatus = 'High Density Warning';
      } else if (highDensityCells > 0) {
        overallStatus = 'High Density Cell Detected';
      }

      // 4. Update System Status & Logs
      setStatus(prev => {
        if (prev !== overallStatus) {
           if (overallStatus.includes('CRITICAL')) {
             addLog(`STATUS ALERT: ${overallStatus}`, 'alert');
             // Auto-trigger AI if critical
             triggerAIResponse(300); // approximate density
             // record critical start
             if (!criticalStartRef.current) {
               criticalStartRef.current = Date.now();
               hasSentAutoAlertRef.current = false;
             }
           } else if (overallStatus.includes('High')) {
             addLog(`Warning: ${overallStatus}`, 'warning');
             // reset critical timer
             criticalStartRef.current = null;
             hasSentAutoAlertRef.current = false;
           }
           return overallStatus;
        }
        return prev;
      });
  };

  // Watch critical duration and auto-send hospital alert after 3s of continuous critical
  useEffect(() => {
    const t = setInterval(async () => {
      if (status.includes('CRITICAL')) {
        const started = criticalStartRef.current;
        if (!started) {
          criticalStartRef.current = Date.now();
          return;
        }
        const elapsed = Date.now() - started;
        if (elapsed > 3000 && !hasSentAutoAlertRef.current) {
          // Send notification to hospital
          hasSentAutoAlertRef.current = true;
          await sendHospitalAlert('Automated critical risk detected for venue. Immediate assistance required.');
        }
      } else {
        // not critical, reset
        criticalStartRef.current = null;
        // do not auto-reset hasSentAutoAlertRef here; manual override okay
      }
    }, 1000);
    return () => clearInterval(t);
  }, [status]);

  const getCooldownRemaining = () => {
    const now = Date.now();
    return Math.max(0, Math.ceil((dispatchCooldownUntil - now) / 1000));
  };

  // Sends an alert to ServiceNow with stampede data
  const sendHospitalAlert = async (message: string) => {
    const userLocation = await getUserLocation();
    const lat = userLocation?.lat ?? 40.7128;
    const lon = userLocation?.lon ?? -74.0060;
    const location = formatLocation(lat, lon);
    const timestamp = new Date().toLocaleTimeString();
    
    addLog(`Posting stampede alert to ServiceNow — ${message}`, 'alert');
    // Set cooldown for 30s to prevent repeated dispatches
    setDispatchCooldownUntil(Date.now() + 30_000);
    
    try {
      // Determine timeframe
      const timeframe = criticalStartRef.current 
        ? `${Math.round((Date.now() - criticalStartRef.current) / 1000)} seconds`
        : '3+ seconds';
      
      // Post to ServiceNow
      const posted = await postStampedeAlert(timeframe, status, location);
      
      if (posted) {
        addLog(`Alert posted to ServiceNow successfully`, 'info');
      } else {
        addLog(`Failed to post alert to ServiceNow; retrying...`, 'warning');
      }
      
      // Show notification modal
      setHospitalNotificationData({
        message,
        location,
        timestamp,
        status,
        timeframe
      });
      setHospitalNotificationVisible(true);
    } catch (e) {
      addLog(`Error posting alert: ${String(e)}`, 'alert');
    }
  };

  const getLocationString = async () => {
    return new Promise<string>((resolve) => {
      if (!navigator.geolocation) return resolve('Unknown location');
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => resolve('Unknown location'),
        { timeout: 3000 }
      );
    });
  };

  const authorizeDispatch = async () => {
    // Guard cooldown
    if (getCooldownRemaining() > 0) {
      addLog('Dispatch request suppressed: cooldown active.', 'warning');
      return;
    }
    await sendHospitalAlert('Manual dispatch authorized by operator. Immediate medical assistance requested.');
  };

  const triggerAIResponse = async (density: number) => {
    if (loadingAi) return;
    setLoadingAi(true);
    try {
      const response = await generateEmergencyPlan(density);
      setAiAnalysis(response);
    } catch (e) {
      setAiAnalysis("Failed to generate AI response. Follow standard protocol.");
    } finally {
      setLoadingAi(false);
    }
  };

  const manualTrigger = () => {
    // Force a critical status update
    addLog("MANUAL OVERRIDE: Injecting Simulated Surge Data", "warning");
    setStatus('CRITICAL RISK');
    triggerAIResponse(450);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
        <div className="bg-brand-gray rounded-2xl shadow-2xl overflow-hidden border border-gray-700 relative group min-h-[500px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent opacity-50"></div>
            <CameraFeed 
                isMonitoring={isMonitoring} 
                videoFile={videoFile}
                onFileSelected={handleVideoUpload}
                status={status}
                grid={grid}
            />
        </div>
        
        <div className={`transition-all duration-500 transform ${status.includes('CRITICAL') ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'}`}>
            <ActionPlan 
                loading={loadingAi} 
                analysis={aiAnalysis} 
                status={status}
                triggerAnalysis={() => triggerAIResponse(totalPersons)}
                authorizeDispatch={authorizeDispatch}
                dispatchCooldownRemaining={getCooldownRemaining()}
            />
        </div>
        </div>

        <div className="space-y-6">
            <AlertSystem alerts={alerts} />
            <StatsPanel 
                totalPersons={totalPersons}
                grid={grid}
                status={status} 
                manualTrigger={manualTrigger}
                isMonitoring={isMonitoring}
            />
        </div>

        {/* Hospital Notification Modal */}
        <HospitalNotification
            isVisible={hospitalNotificationVisible}
            message={hospitalNotificationData.message}
            location={hospitalNotificationData.location}
            status={hospitalNotificationData.status}
            timeframe={hospitalNotificationData.timeframe}
            timestamp={hospitalNotificationData.timestamp}
            onDismiss={() => setHospitalNotificationVisible(false)}
        />
    </div>
  );
};
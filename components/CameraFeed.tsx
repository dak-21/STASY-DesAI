import React, { useRef, useEffect, useState } from 'react';
import { Camera, Upload, Play, Film } from 'lucide-react';
import { SystemStatus, GridCell } from '../types';

interface CameraFeedProps {
  isMonitoring: boolean;
  videoFile: File | null;
  onFileSelected: (file: File) => void;
  status: SystemStatus;
  grid: GridCell[][];
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ isMonitoring, videoFile, onFileSelected, status, grid }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (videoFile && videoRef.current) {
        const url = URL.createObjectURL(videoFile);
        videoRef.current.src = url;
        videoRef.current.play();
    }
  }, [videoFile]);

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
          onFileSelected(file);
      }
  };

  const handleClickUpload = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          onFileSelected(file);
      }
  };

  return (
    <div 
        className="relative bg-black h-full min-h-[500px] w-full group overflow-hidden flex items-center justify-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="video/*" 
        className="hidden" 
      />

      {status === 'Initializing' && (
        <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center text-brand-yellow font-mono text-sm">
             <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
                 <div className="h-full bg-brand-yellow animate-progress"></div>
             </div>
             <p className="animate-pulse">BOOT SEQUENCE INITIATED...</p>
        </div>
      )}

      {/* Upload State */}
      {!videoFile && status !== 'Initializing' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900 z-10 p-6 text-center border-2 border-dashed border-gray-700 m-4 rounded-xl hover:border-brand-yellow transition-colors">
          <div className="bg-brand-yellow/10 p-6 rounded-full mb-6">
             <Film className="w-12 h-12 text-brand-yellow" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Analysis Footage</h3>
          <p className="text-gray-400 mb-6 max-w-sm">Drag and drop your event video here to run the STASY Crowd Engine simulation.</p>
          <button 
            onClick={handleClickUpload}
            className="px-8 py-3 bg-brand-yellow hover:bg-yellow-400 text-black font-bold rounded-full transition-all flex items-center gap-2 shadow-lg shadow-yellow-900/20"
          >
            <Upload size={18} /> Select Video File
          </button>
        </div>
      )}

      {/* Video Player */}
      <video
        ref={videoRef}
        playsInline
        loop
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoFile ? 'opacity-70' : 'opacity-0'}`}
      />

      {/* Grid Overlay - Only show if playing */}
      {isMonitoring && videoFile && (
        <div className="absolute inset-0 z-10 pointer-events-none">
           {/* Render Grid Cells */}
           <div className="w-full h-full grid grid-rows-8 grid-cols-8">
              {grid.map((row, r) => 
                row.map((cell, c) => (
                    <div 
                        key={`${r}-${c}`} 
                        className={`transition-all duration-500 ease-in-out
                            ${cell.status === 'CRITICAL' ? 'bg-red-600/30 backdrop-blur-[2px] shadow-[inset_0_0_20px_rgba(255,0,0,0.5)] border border-red-500/30' : 
                              cell.status === 'HIGH' ? 'bg-orange-500/20 border border-orange-500/20' : 
                              cell.count > 0 ? 'bg-blue-400/5' : 'bg-transparent'}
                        `}
                    >
                        {/* Simulation of YOLO detection markers inside active cells */}
                        {cell.count > 0 && Math.random() > 0.7 && (
                             <div className="relative w-full h-full opacity-50">
                                 <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-brand-yellow/50 -translate-x-1/2 -translate-y-1/2 rounded-sm"></div>
                             </div>
                        )}
                    </div>
                ))
              )}
           </div>
        </div>
      )}

      {/* HUD Info */}
      <div className="absolute top-4 left-4 z-20">
         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 bg-black/80 text-brand-yellow px-3 py-1 rounded-sm text-xs font-mono border border-brand-yellow/30 shadow-lg">
                <span className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span> 
                {videoFile ? 'ANALYSIS ACTIVE' : 'STANDBY'} • YOLOv11n
            </div>
            {videoFile && (
                <div className="bg-black/80 text-gray-400 px-3 py-1 rounded-sm text-[10px] font-mono border border-gray-800">
                    Source: {videoFile.name.substring(0, 20)}...
                </div>
            )}
         </div>
      </div>

      {/* Top-right CRITICAL badge */}
      {status.includes('CRITICAL') && (
        <div className="absolute top-4 right-4 z-30">
          <div className="flex items-center gap-3 bg-black/70 text-red-500 px-3 py-2 rounded-lg border border-red-600 shadow-lg">
            <div className="text-xs font-mono uppercase font-bold tracking-wider">CRITICAL RISK</div>
            <div className="text-[10px] text-gray-200 bg-red-700/20 px-2 py-0.5 rounded">Immediate</div>
          </div>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { Users, AlertOctagon, TrendingUp, Activity, Grid3X3 } from 'lucide-react';
import { SystemStatus, GridCell } from '../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatsPanelProps {
  totalPersons: number;
  grid: GridCell[][];
  status: SystemStatus;
  manualTrigger: () => void;
  isMonitoring: boolean;
}

const generateChartData = (current: number) => {
    return Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: Math.max(0, current - Math.random() * 20 + 10)
    }));
};

export const StatsPanel: React.FC<StatsPanelProps> = ({ totalPersons, grid, status, manualTrigger, isMonitoring }) => {
  const chartData = generateChartData(totalPersons);

  // Calculate Metrics from Grid
  let maxCellDensity = 0;
  grid.forEach(row => row.forEach(cell => {
      if (cell.count > maxCellDensity) maxCellDensity = cell.count;
  }));

  const getStatusColor = () => {
      if (status.includes('CRITICAL')) return 'text-red-500 bg-red-500/10 border-red-500/20';
      if (status.includes('High') || status.includes('Warning')) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      if (status === 'Initializing') return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl shadow-xl flex flex-col h-full border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-yellow" />
          Live Telemetry
        </h2>
        <span className={`px-2 py-1 rounded border text-[10px] font-bold tracking-wider uppercase max-w-[150px] truncate ${getStatusColor()}`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Users size={14} />
            <span className="text-[10px] font-medium uppercase">Est. Persons</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
            {isMonitoring ? totalPersons : '--'}
          </div>
        </div>

        <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
           <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Grid3X3 size={14} />
            <span className="text-[10px] font-medium uppercase">Peak Density</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white">
             {isMonitoring ? maxCellDensity : '--'} <span className="text-xs text-gray-600 font-normal">/ cell</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[120px] mb-6 relative">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={isMonitoring ? chartData : []}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#FFD700" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
            </AreaChart>
         </ResponsiveContainer>
      </div>

      <button 
        onClick={manualTrigger}
        disabled={!isMonitoring || status === 'Initializing'}
        className="w-full py-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-500 font-bold flex items-center justify-center gap-2 transition-colors border border-red-900/50 text-sm disabled:opacity-50"
      >
        <AlertOctagon className="w-4 h-4" />
        Inject Crowd Surge
      </button>
    </div>
  );
};
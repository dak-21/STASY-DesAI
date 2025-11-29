
import React, { useRef, useEffect } from 'react';
import { Terminal, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { LogEntry } from '../types';

interface AlertSystemProps {
    alerts: LogEntry[];
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ alerts }) => {
    return (
        <div className="bg-gray-950 text-white rounded-2xl p-6 shadow-xl h-fit border border-gray-800 font-mono">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-4">
                <h3 className="font-bold flex items-center gap-2 text-sm text-gray-400">
                    <Terminal className="text-brand-yellow" size={16} />
                    System Log
                </h3>
                <span className="text-[10px] bg-green-900/20 text-green-500 px-2 py-0.5 rounded border border-green-900/50">ONLINE</span>
            </div>
            
            <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar flex flex-col-reverse">
                {alerts.length === 0 ? (
                    <div className="text-gray-700 text-xs italic">Waiting for system events...</div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className="flex gap-3 items-start text-xs group">
                            <span className="text-gray-600 shrink-0 select-none">[{alert.timestamp}]</span>
                            <div className="flex gap-2 items-center">
                                {alert.type === 'alert' && <AlertCircle size={12} className="text-red-500" />}
                                {alert.type === 'warning' && <AlertCircle size={12} className="text-orange-500" />}
                                {alert.type === 'info' && <CheckCircle size={12} className="text-green-500" />}
                                {alert.type === 'system' && <Info size={12} className="text-blue-500" />}
                                
                                <span className={`
                                    ${alert.type === 'alert' ? 'text-red-400 font-bold' : ''}
                                    ${alert.type === 'warning' ? 'text-orange-300' : ''}
                                    ${alert.type === 'info' ? 'text-gray-300' : ''}
                                    ${alert.type === 'system' ? 'text-blue-300' : ''}
                                `}>
                                    {alert.message}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

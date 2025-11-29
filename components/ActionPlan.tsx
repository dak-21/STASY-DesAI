
import React from 'react';
import { Sparkles, Siren, Ambulance, Megaphone, RotateCcw } from 'lucide-react';
import { SystemStatus } from '../types';

interface ActionPlanProps {
    loading: boolean;
    analysis: string | null;
    status: SystemStatus;
    triggerAnalysis: () => void;
    authorizeDispatch: () => void;
    dispatchCooldownRemaining: number; // seconds remaining, 0 = ready
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ loading, analysis, status, triggerAnalysis, authorizeDispatch, dispatchCooldownRemaining }) => {
  const isSafe = !status.includes('CRITICAL');

  if (isSafe && !analysis) return null;

  return (
    <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-brand-yellow/50 relative">
      <div className="bg-black/40 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Sparkles className="text-brand-yellow w-5 h-5 animate-pulse" />
            <h3 className="font-bold text-white text-sm uppercase tracking-wider">AI Tactical Protocol</h3>
        </div>
        <button 
            onClick={triggerAnalysis} 
            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            disabled={loading}
        >
            <RotateCcw size={12} /> Refresh
        </button>
      </div>

      <div className="p-6">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-8 h-8 border-2 border-gray-800 border-t-brand-yellow rounded-full animate-spin"></div>
                <p className="text-xs text-gray-500 font-mono animate-pulse">Computing optimal response vectors...</p>
            </div>
        ) : analysis ? (
            <div className="space-y-4 font-mono text-sm">
                <div className="space-y-2">
                    {analysis.split('\n').map((line, i) => {
                        const content = line.replace(/\*\*/g, '').trim();
                        if (!content) return null;

                        if (content.toLowerCase().includes('police')) {
                            return (
                                <div key={i} className="flex gap-3 p-3 bg-blue-900/20 border border-blue-900/50 rounded-lg text-blue-200">
                                    <Siren size={16} className="shrink-0 mt-0.5"/>
                                    <span>{content}</span>
                                </div>
                            )
                        }
                        if (content.toLowerCase().includes('medical') || content.toLowerCase().includes('hospital')) {
                            return (
                                <div key={i} className="flex gap-3 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-200">
                                    <Ambulance size={16} className="shrink-0 mt-0.5"/>
                                    <span>{content}</span>
                                </div>
                            )
                        }
                        if (content.toLowerCase().includes('announcement')) {
                            return (
                                 <div key={i} className="flex gap-3 p-3 bg-yellow-900/20 border border-brand-yellow/30 rounded-lg text-yellow-200">
                                    <Megaphone size={16} className="shrink-0 mt-0.5"/>
                                    <span>{content}</span>
                                </div>
                            )
                        }
                        return <div key={i} className="text-gray-400 pl-2 border-l border-gray-700">{content}</div>;
                    })}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-800">
                    <button
                      onClick={authorizeDispatch}
                      disabled={dispatchCooldownRemaining > 0}
                      className={`py-2 rounded font-bold transition-colors ${dispatchCooldownRemaining > 0 ? 'bg-red-900/20 text-gray-300 border border-red-900/20 cursor-not-allowed' : 'bg-brand-yellow text-black hover:bg-yellow-400 shadow-lg shadow-yellow-900/20'}`}
                    >
                        {dispatchCooldownRemaining > 0 ? `Authorize Dispatch (${dispatchCooldownRemaining}s)` : 'Authorize Dispatch'}
                    </button>
                    <button className="bg-transparent border border-gray-700 text-gray-400 py-2 rounded font-bold hover:bg-white/5 transition-colors">
                        Override
                    </button>
                </div>
            </div>
        ) : (
            <div className="text-center py-6 text-gray-600 font-mono text-xs">
                Standing by for critical triggers...
            </div>
        )}
      </div>
    </div>
  );
};

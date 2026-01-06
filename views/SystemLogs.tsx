
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Terminal, 
  RefreshCw, 
  Pause, 
  Play, 
  Search, 
  Download, 
  Filter,
  Activity,
  Server,
  ShieldAlert
} from 'lucide-react';
import { LogEntry, Property } from '../types';

interface SystemLogsProps {
  isDemoMode: boolean;
  property: Property;
}

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: '15:42:01', level: 'INFO', module: 'AUTH', action: 'INIT', message: 'Auth Service initialized on port 8080', latency: '2ms' },
  { id: '2', timestamp: '15:42:05', level: 'SUCCESS', module: 'DATABASE', action: 'CONNECT', message: 'PostgreSQL Connection Established (Google Cloud Data Connect)', latency: '24ms' },
  { id: '3', timestamp: '15:42:12', level: 'INFO', module: 'SYSTEM', action: 'CRON', message: 'Running scheduled maintenance checks', latency: '150ms' },
  { id: '4', timestamp: '15:42:42', level: 'INFO', module: 'AUTH', action: 'LOGIN', message: 'User logged in as MANAGER', ip: '192.168.1.15' },
];

const LOG_TEMPLATES = [
  { level: 'INFO', module: 'AUTH', action: 'VALIDATE', message: 'Token validation successful for user session', latency: '45ms' },
  { level: 'SUCCESS', module: 'DATABASE', action: 'QUERY', message: 'Executed batch update on [bookings] table', latency: '12ms' },
  { level: 'WARN', module: 'SYSTEM', action: 'MEMORY', message: 'Heap usage at 65% capacity - Garbage collection imminent', latency: 'N/A' },
  { level: 'INFO', module: 'PAYMENT', action: 'PROCESS', message: 'Payment gateway ping successful', latency: '110ms' },
  { level: 'INFO', module: 'IOT', action: 'SYNC', message: 'Smart Lock Gateway 04 heartbeat received', latency: '8ms' },
  { level: 'ERROR', module: 'AUTH', action: 'FAIL', message: 'Failed login attempt from unregistered IP', ip: '45.33.22.11', latency: '10ms' },
];

const SystemLogs: React.FC<SystemLogsProps> = ({ isDemoMode, property }) => {
  const [logs, setLogs] = useState<LogEntry[]>(isDemoMode ? MOCK_LOGS : []);
  const [isPaused, setIsPaused] = useState(false);
  const [filterModule, setFilterModule] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-generate logs in demo mode
  useEffect(() => {
    if (!isDemoMode || isPaused) return;

    const interval = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        level: template.level as any,
        module: template.module as any,
        action: template.action,
        message: template.message,
        latency: template.latency,
        ip: template.ip
      };
      
      setLogs(prev => {
        const newLogs = [...prev, newLog];
        if (newLogs.length > 200) newLogs.shift(); // Keep buffer manageable
        return newLogs;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isDemoMode, isPaused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!isPaused && logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesModule = filterModule === 'All' || log.module === filterModule;
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            log.action.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesModule && matchesSearch;
    });
  }, [logs, filterModule, searchTerm]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'INFO': return 'text-blue-400';
      case 'WARN': return 'text-amber-400';
      case 'ERROR': return 'text-rose-500';
      case 'SUCCESS': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'AUTH': return 'text-yellow-400';
      case 'DATABASE': return 'text-purple-400';
      case 'SYSTEM': return 'text-slate-400';
      case 'PAYMENT': return 'text-green-400';
      case 'IOT': return 'text-cyan-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Terminal size={28} className="text-slate-900" />
            System Logs
          </h1>
          <p className="text-slate-500 text-sm">Real-time telemetry and audit trail for {property.name}.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm">
             <div className="px-3 flex items-center gap-2 text-slate-400 border-r border-slate-100">
                <Search size={16} />
             </div>
             <input 
               type="text" 
               placeholder="Grep logs..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-transparent border-none outline-none text-sm px-3 py-1.5 w-40 md:w-64 font-mono text-slate-600 placeholder:text-slate-300"
             />
          </div>
          
          <select 
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl text-sm font-bold px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="All">All Modules</option>
            <option value="AUTH">Auth Service</option>
            <option value="DATABASE">Database</option>
            <option value="SYSTEM">System Core</option>
            <option value="PAYMENT">Payments</option>
            <option value="IOT">IoT Devices</option>
          </select>
          
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2.5 rounded-xl border transition-all shadow-sm ${
              isPaused 
              ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100' 
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={isPaused ? "Resume Live Stream" : "Pause Live Stream"}
          >
             {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
          </button>
          
          <button 
             onClick={() => setLogs(isDemoMode ? MOCK_LOGS : [])}
             className="p-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
             title="Clear/Refresh"
          >
             <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 shrink-0">
          <div className="bg-slate-900 rounded-xl p-4 flex items-center justify-between text-white shadow-lg">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                   <Activity size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Status</p>
                   <p className="text-sm font-bold">Operational</p>
                </div>
             </div>
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-3 shadow-sm">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Server size={18} />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Connection</p>
                <p className="text-sm font-bold text-slate-700">Google Cloud SQL (Replica-01)</p>
             </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-3 shadow-sm">
             <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <ShieldAlert size={18} />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Errors (24h)</p>
                <p className="text-sm font-bold text-slate-700">0 Critical / 3 Warnings</p>
             </div>
          </div>
      </div>

      {/* Terminal Window */}
      <div className="flex-1 bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-800 font-mono text-xs md:text-sm">
         {/* Terminal Header */}
         <div className="bg-[#2d2d2d] px-4 py-2.5 flex items-center justify-between border-b border-black/50 shrink-0">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors"></div>
               <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors"></div>
               <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors"></div>
            </div>
            <div className="text-slate-400 font-medium text-xs flex items-center gap-2">
               <Terminal size={12} />
               root@stayos-server:~/logs
            </div>
            <div className="w-14"></div> {/* Spacer for center alignment */}
         </div>

         {/* Logs Content */}
         <div 
           ref={containerRef}
           className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
         >
            {filteredLogs.length > 0 ? filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 hover:bg-white/5 p-0.5 rounded transition-colors group">
                 <span className="text-slate-500 shrink-0 select-none w-20">{log.timestamp}</span>
                 <span className={`font-bold shrink-0 w-16 ${getLevelColor(log.level)}`}>[{log.level}]</span>
                 <span className={`font-bold shrink-0 w-24 ${getModuleColor(log.module)}`}>
                   {log.module}
                 </span>
                 <div className="flex-1 flex flex-wrap gap-2 text-slate-300">
                    <span className="text-blue-300 font-bold">{log.action}:</span>
                    <span>{log.message}</span>
                    {log.ip && <span className="text-slate-500 text-xs ml-2">[IP: {log.ip}]</span>}
                    {log.latency && <span className="text-slate-600 text-xs ml-auto group-hover:text-slate-400 transition-colors">{log.latency}</span>}
                 </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                 <Activity size={32} className="opacity-50" />
                 <p>No log entries found for current filter.</p>
              </div>
            )}
            
            {/* Blinking Cursor at bottom */}
            {!isPaused && (
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-emerald-500 font-bold">➜</span>
                  <span className="text-blue-400 font-bold">~</span>
                  <div className="w-2.5 h-4 bg-slate-400 animate-pulse"></div>
               </div>
            )}
            
            <div ref={logsEndRef} />
         </div>
      </div>
    </div>
  );
};

export default SystemLogs;

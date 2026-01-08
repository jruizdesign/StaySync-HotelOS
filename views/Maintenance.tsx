
import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  X,
  ArrowRight
} from 'lucide-react';
import { MaintenanceTask } from '../types';

// Backend Imports
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { getFirestore, onSnapshot, collection } from 'firebase/firestore';

interface MaintenanceProps {
  isDemoMode: boolean;
  user: any; // Passed from parent
  propertyId: string;
}

const Maintenance: React.FC<MaintenanceProps> = ({
  isDemoMode,
  user,
  propertyId
}) => {
  const queryClient = useQueryClient();
  const db = getFirestore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Completed'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<MaintenanceTask> | null>(null);

  // 1. Fetch Tasks (Postgres)
  const { data: dbTasks, isLoading } = useQuery({
    queryKey: ['maintenance', propertyId],
    queryFn: async () => {
      if (!propertyId || isDemoMode) return [];
      const res = await api.maintenance.list(propertyId);
      return res.tasks;
    },
    enabled: !!propertyId && !isDemoMode
  });

  // 2. Real-time Listener (Firestore Trigger)
  // When 'maintenance_events' collection changes, we invalidate the SQL query to re-fetch freshest data.
  // This is "Signal-based" real-time.
  useEffect(() => {
    if (!propertyId || isDemoMode) return;

    // Listen to the events collection we write to in server.js
    const unsubscribe = onSnapshot(collection(db, `hotels/${propertyId}/maintenance_events`), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          // Determine if this is a new event we haven't seen? 
          // Simple approach: Just invalidate query on ANY add to this log
          queryClient.invalidateQueries({ queryKey: ['maintenance', propertyId] });
        }
      });
    });

    return () => unsubscribe();
  }, [propertyId, isDemoMode, queryClient]);


  const tasks = dbTasks || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.maintenance.create(data),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['maintenance', propertyId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.maintenance.update(data.id, data),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['maintenance', propertyId] });
    }
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: any) => {
      const matchesSearch = task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  const openModal = (task: MaintenanceTask | null = null) => {
    setCurrentTask(task || {
      roomNumber: '',
      description: '',
      priority: 'Medium',
      status: 'Pending',
      reportedDate: new Date().toISOString(), // Use ISO for state, format in UI
      assignedTo: '',
      cost: 0,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask) return;

    if (currentTask.id) {
      updateMutation.mutate({ ...currentTask, completedDate: currentTask.status === 'Completed' ? new Date().toISOString() : undefined });
    } else {
      createMutation.mutate({ ...currentTask, propertyId });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance & Operations</h1>
          <p className="text-slate-500 text-sm">Track work orders, repairs, and operational costs.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Report Issue
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Tickets</p>
            <p className="text-3xl font-black text-slate-800 mt-1">
              {tasks.filter(t => t.status !== 'Completed').length}
            </p>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Wrench size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Critical Issues</p>
            <p className="text-3xl font-black text-rose-600 mt-1">
              {tasks.filter(t => t.priority === 'Critical' && t.status !== 'Completed').length}
            </p>
          </div>
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Maintenance Spend</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">
              ${tasks.reduce((acc, curr) => acc + (curr.cost || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks, rooms, or assignees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Pending', 'In Progress', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === status
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <div
            key={task.id}
            onClick={() => openModal(task)}
            className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                  {task.roomNumber}
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(task.status)}`}>
                {task.status}
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">{task.description}</h3>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <User size={14} />
                <span>Assigned: <span className="font-semibold text-slate-700">{task.assignedTo || 'Unassigned'}</span></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar size={14} />
                <span>Reported: {task.reportedDate}</span>
              </div>
              {task.status === 'Completed' && (
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                  <CheckCircle2 size={14} />
                  <span>Completed: {task.completedDate}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Cost Impact</p>
                <p className="text-lg font-black text-slate-800">${task.cost.toFixed(2)}</p>
              </div>
              <button className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <Wrench size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">No Tickets Found</h3>
            <p className="text-xs text-slate-400 mt-2">Adjust filters or report a new maintenance issue.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {currentTask.id ? 'Update Ticket' : 'New Maintenance Request'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Room / Area</label>
                  <input
                    required
                    type="text"
                    value={currentTask.roomNumber}
                    onChange={e => setCurrentTask({ ...currentTask, roomNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    placeholder="e.g., 101, Lobby"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</label>
                  <select
                    value={currentTask.priority}
                    onChange={e => setCurrentTask({ ...currentTask, priority: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Description</label>
                <textarea
                  required
                  value={currentTask.description}
                  onChange={e => setCurrentTask({ ...currentTask, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium h-24 resize-none"
                  placeholder="Describe the maintenance issue..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned To</label>
                  <input
                    type="text"
                    value={currentTask.assignedTo}
                    onChange={e => setCurrentTask({ ...currentTask, assignedTo: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Staff Member"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                  <select
                    value={currentTask.status}
                    onChange={e => setCurrentTask({ ...currentTask, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {currentTask.status === 'Completed' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-2 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <DollarSign size={18} />
                    <span className="font-bold">Accounting & Costing</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider">Total Cost ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentTask.cost}
                      onChange={e => setCurrentTask({ ...currentTask, cost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-800"
                      placeholder="0.00"
                    />
                    <p className="text-[10px] text-emerald-600 font-medium">This amount will be automatically logged in the accounting ledger as an expense.</p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  {currentTask.id ? 'Update Ticket' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;

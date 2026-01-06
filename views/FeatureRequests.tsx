
import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  ThumbsUp, 
  Clock, 
  CheckCircle2, 
  X, 
  ArrowUp, 
  Filter,
  Sparkles,
  Zap,
  Layout,
  GitPullRequest
} from 'lucide-react';
import { FeatureRequest, User } from '../types';

interface FeatureRequestsProps {
  requests: FeatureRequest[];
  user: User;
  onAddRequest: (req: FeatureRequest) => void;
  onUpdateRequest: (req: FeatureRequest) => void;
}

const FeatureRequests: React.FC<FeatureRequestsProps> = ({ requests, user, onAddRequest, onUpdateRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | FeatureRequest['status']>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Partial<FeatureRequest> | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            req.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => b.votes - a.votes); // Sort by votes
  }, [requests, searchTerm, statusFilter]);

  const openModal = (req: FeatureRequest | null = null) => {
    setCurrentRequest(req || {
      title: '',
      description: '',
      priority: 'Medium',
      status: 'New',
      votes: 0,
      requester: user.name,
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequest) return;

    if (currentRequest.id) {
      onUpdateRequest(currentRequest as FeatureRequest);
    } else {
      const newReq = {
        ...currentRequest,
        id: 'fr-' + Math.random().toString(36).substr(2, 6)
      } as FeatureRequest;
      onAddRequest(newReq);
    }
    setIsModalOpen(false);
  };

  const handleVote = (e: React.MouseEvent, req: FeatureRequest) => {
    e.stopPropagation();
    onUpdateRequest({ ...req, votes: req.votes + 1 });
  };

  const getStatusStyle = (status: FeatureRequest['status']) => {
    switch (status) {
      case 'Implemented': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Planned': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: FeatureRequest['status']) => {
    switch (status) {
      case 'Implemented': return CheckCircle2;
      case 'In Progress': return Zap;
      case 'Planned': return Clock;
      default: return Lightbulb;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Feature Roadmap</h1>
          <p className="text-slate-500 text-sm">Vote on new capabilities and track system updates.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          Submit Idea
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter size={16} /> Filter Roadmap
            </h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              {['All', 'New', 'Planned', 'In Progress', 'Implemented'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                    statusFilter === status 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusFilter === status ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                    {status === 'All' ? requests.length : requests.filter(r => r.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-lg">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
               <Sparkles size={20} />
             </div>
             <h3 className="font-bold text-lg mb-2">Have a vision?</h3>
             <p className="text-sm text-blue-100 leading-relaxed mb-4">
               Our engineering team reviews the most upvoted requests weekly. Your feedback directly shapes StaySyncOS.
             </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.length > 0 ? filteredRequests.map(req => {
              const StatusIcon = getStatusIcon(req.status);
              return (
                <div 
                  key={req.id}
                  onClick={() => openModal(req)}
                  className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                >
                   <div className="flex justify-between items-start mb-3">
                     <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${getStatusStyle(req.status)}`}>
                        <StatusIcon size={12} />
                        {req.status}
                     </span>
                     <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${
                       req.priority === 'High' ? 'text-rose-600 bg-rose-50' : 
                       req.priority === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100'
                     }`}>
                       {req.priority}
                     </span>
                   </div>

                   <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                     {req.title}
                   </h3>
                   <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-3">
                     {req.description}
                   </p>

                   <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-3">
                       <button 
                         onClick={(e) => handleVote(e, req)}
                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group/vote"
                       >
                         <ArrowUp size={16} className="text-slate-400 group-hover/vote:text-blue-600" />
                         <span className="text-sm font-bold text-slate-600 group-hover/vote:text-blue-600">{req.votes}</span>
                       </button>
                       <span className="text-xs text-slate-400">by {req.requester}</span>
                     </div>
                     <span className="text-xs text-slate-400 font-medium">{req.date}</span>
                   </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <Lightbulb size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-400">No requests found</h3>
                <p className="text-xs text-slate-400 mt-2">Be the first to suggest a new feature!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && currentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {currentRequest.id ? 'Edit Request' : 'Submit Feature Idea'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feature Title</label>
                <input 
                  required
                  type="text"
                  value={currentRequest.title}
                  onChange={e => setCurrentRequest({...currentRequest, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  placeholder="e.g. Mobile Check-in Kiosk"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description & Use Case</label>
                <textarea 
                  required
                  value={currentRequest.description}
                  onChange={e => setCurrentRequest({...currentRequest, description: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium h-32 resize-none"
                  placeholder="Describe what you want to achieve..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority Level</label>
                   <select 
                     value={currentRequest.priority}
                     onChange={e => setCurrentRequest({...currentRequest, priority: e.target.value as any})}
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                   >
                     <option value="Low">Low</option>
                     <option value="Medium">Medium</option>
                     <option value="High">High</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                   <select 
                     value={currentRequest.status}
                     onChange={e => setCurrentRequest({...currentRequest, status: e.target.value as any})}
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                   >
                     <option value="New">New</option>
                     <option value="Planned">Planned</option>
                     <option value="In Progress">In Progress</option>
                     <option value="Implemented">Implemented</option>
                   </select>
                </div>
              </div>

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
                  {currentRequest.id ? 'Save Updates' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureRequests;

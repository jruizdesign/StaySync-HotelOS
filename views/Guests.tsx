
import React, { useState, useMemo } from 'react';
import { 
  UserPlus, 
  Search, 
  FileText, 
  History, 
  ChevronRight, 
  ShieldCheck, 
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Upload,
  Eye,
  ArrowLeft,
  Calendar,
  DollarSign,
  Ban,
  AlertTriangle,
  Camera,
  Users,
  X,
  Plus,
  Info,
  TrendingUp,
  Filter,
  Receipt,
  Download,
  CheckCircle,
  Building2,
  FileCode,
  Image as ImageIcon,
  File
} from 'lucide-react';
import { Guest, GuestDocument, GuestHistory } from '../types';

const MOCK_GUESTS: Guest[] = [
  {
    id: 'g1',
    name: 'Sarah Marshall',
    email: 'sarah.m@example.com',
    phone: '+1 555-010-2345',
    idNumber: 'P-9920392',
    address: '123 Ocean Drive, Miami, FL',
    totalStays: 12,
    lifetimeSpend: 4250,
    status: 'VIP',
    isDNR: false,
    documents: [
      { id: 'd1', type: 'Passport', fileName: 'passport_scan.pdf', uploadDate: '2023-01-15' },
      { id: 'd2', type: 'Other', fileName: 'signed_waiver.jpg', uploadDate: '2023-10-10' },
      { id: 'd-inv-1', type: 'Invoice', fileName: 'INV-4402-23.pdf', uploadDate: '2023-10-01', amount: 850, referenceId: 'b-991' },
      { id: 'd-rec-1', type: 'Receipt', fileName: 'REC-4402-23.pdf', uploadDate: '2023-10-01', amount: 850, referenceId: 'b-991' }
    ],
    history: [
      { id: 'h1', stayDate: '2023-10-01', roomNumber: '402', amount: 850, status: 'Completed' },
      { id: 'h2', stayDate: '2023-08-15', roomNumber: 'Penthouse', amount: 1200, status: 'Completed' },
      { id: 'h3', stayDate: '2023-05-12', roomNumber: '105', amount: 450, status: 'Completed' }
    ]
  },
  {
    id: 'g2',
    name: 'David Chen',
    email: 'david.chen@techcorp.com',
    phone: '+1 555-010-8877',
    idNumber: 'DL-882103',
    address: '456 Tech Valley, San Francisco, CA',
    totalStays: 4,
    lifetimeSpend: 1800,
    status: 'Regular',
    isDNR: false,
    documents: [
      { id: 'd3', type: 'Driver License', fileName: 'dl_front.jpg', uploadDate: '2023-06-20' },
      { id: 'd-rec-2', type: 'Receipt', fileName: 'REC-2204-23.pdf', uploadDate: '2023-09-20', amount: 350 }
    ],
    history: [
      { id: 'h4', stayDate: '2023-09-20', roomNumber: '204', amount: 350, status: 'Completed' }
    ]
  },
  {
    id: 'g3',
    name: 'Marcus Thorne',
    email: 'mthorne@consulting.co',
    phone: '+1 555-011-9922',
    idNumber: 'P-2231002',
    address: '789 City Plaza, New York, NY',
    totalStays: 2,
    lifetimeSpend: 600,
    status: 'Restricted',
    isDNR: true,
    dnrReason: 'Property damage and noise complaints during last 3 stays.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    documents: [],
    history: [
      { id: 'h5', stayDate: '2023-02-14', roomNumber: '101', amount: 200, status: 'Completed' }
    ]
  }
];

const Guests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'dnr'>('all');
  const [profileTab, setProfileTab] = useState<'overview' | 'documents' | 'history'>('overview');
  const [viewingDoc, setViewingDoc] = useState<GuestDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filteredGuests = useMemo(() => {
    return guests.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                           g.idNumber.toLowerCase().includes(search.toLowerCase());
      const matchesTab = activeSubTab === 'all' ? !g.isDNR : g.isDNR;
      return matchesSearch && matchesTab;
    });
  }, [guests, search, activeSubTab]);

  const selectedGuest = useMemo(() => 
    guests.find(g => g.id === selectedGuestId), 
  [guests, selectedGuestId]);

  const handleAddGuest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newGuest: Guest = {
      id: 'g' + Math.random().toString(36).substr(2, 5),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      idNumber: formData.get('idNumber') as string,
      address: formData.get('address') as string,
      totalStays: 0,
      lifetimeSpend: 0,
      status: 'Regular',
      isDNR: false,
      documents: [],
      history: []
    };
    setGuests([newGuest, ...guests]);
    setIsAddingNew(false);
  };

  const categorizedDocs = useMemo(() => {
    if (!selectedGuest) return { identity: [], invoices: [], receipts: [], other: [] };
    return {
        identity: selectedGuest.documents.filter(d => ['Passport', 'Driver License', 'ID Card'].includes(d.type)),
        invoices: selectedGuest.documents.filter(d => d.type === 'Invoice'),
        receipts: selectedGuest.documents.filter(d => d.type === 'Receipt'),
        other: selectedGuest.documents.filter(d => d.type === 'Other')
    };
  }, [selectedGuest]);

  const DocumentCard = ({ doc, onClick }: { doc: GuestDocument; onClick: () => void }) => {
    const isPDF = doc.fileName.toLowerCase().endsWith('.pdf');
    return (
      <div 
        onClick={onClick}
        className="group relative bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer overflow-hidden"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${
            doc.type === 'Invoice' ? 'bg-amber-50 text-amber-600' :
            doc.type === 'Receipt' ? 'bg-emerald-50 text-emerald-600' :
            ['Passport', 'Driver License', 'ID Card'].includes(doc.type) ? 'bg-blue-50 text-blue-600' :
            'bg-slate-50 text-slate-600'
          }`}>
            {doc.type === 'Receipt' ? <Receipt size={20} /> : 
             doc.type === 'Invoice' ? <FileText size={20} /> :
             <ShieldCheck size={20} />}
          </div>
          <div className="flex gap-1">
             {isPDF ? <span className="text-[8px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded">PDF</span> : 
                      <span className="text-[8px] font-black bg-blue-500 text-white px-1.5 py-0.5 rounded">IMG</span>}
          </div>
        </div>
        <h4 className="text-xs font-bold text-slate-800 truncate">{doc.fileName}</h4>
        <div className="flex items-center justify-between mt-2">
           <span className="text-[9px] text-slate-400 font-bold uppercase">{doc.uploadDate}</span>
           {doc.amount && <span className="text-[9px] font-black text-slate-700">${doc.amount}</span>}
        </div>
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none"></div>
      </div>
    );
  };

  if (selectedGuest) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => {
            setSelectedGuestId(null);
            setProfileTab('overview');
          }}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Directory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
              <div className="relative group mx-auto mb-6 w-32 h-32">
                {selectedGuest.photoUrl ? (
                  <img 
                    src={selectedGuest.photoUrl} 
                    alt={selectedGuest.name}
                    className="w-32 h-32 rounded-[2rem] object-cover shadow-xl border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-[2rem] bg-blue-50 text-blue-600 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl">
                    {selectedGuest.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800">{selectedGuest.name}</h2>
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  selectedGuest.isDNR ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white shadow-sm'
                }`}>
                  {selectedGuest.isDNR ? 'DO NOT RENT' : `${selectedGuest.status} GUEST`}
                </div>
              </div>

              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                    <Mail size={16} />
                  </div>
                  <span className="text-xs font-semibold truncate">{selectedGuest.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                    <Phone size={16} />
                  </div>
                  <span className="text-xs font-semibold">{selectedGuest.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center justify-between">
                Performance <TrendingUp size={14} className="text-blue-400" />
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-2xl font-black tabular-nums">${selectedGuest.lifetimeSpend.toLocaleString()}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-500 mt-1">Lifetime Value</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 flex flex-col">
            <div className="flex items-center gap-2 p-1 bg-white border border-slate-100 rounded-2xl w-fit">
              <button 
                onClick={() => setProfileTab('overview')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  profileTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setProfileTab('documents')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  profileTab === 'documents' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                Profile Vault
                <span className={`w-5 h-5 flex items-center justify-center rounded-lg text-[10px] ${profileTab === 'documents' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                    {selectedGuest.documents.length}
                </span>
              </button>
              <button 
                onClick={() => setProfileTab('history')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  profileTab === 'history' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                Stay Ledger
              </button>
            </div>

            <div className="flex-1 min-h-[500px]">
              {profileTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2">
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <Info size={18} className="text-blue-500" />
                        Bio & Address
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Physical Address</p>
                          <p className="text-sm font-semibold text-slate-700">{selectedGuest.address}</p>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {profileTab === 'documents' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Secure Vault</h3>
                      <p className="text-xs text-slate-500 font-medium">Categorized documentation for audit and verification.</p>
                    </div>
                    <button 
                      onClick={() => setIsUploading(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                    >
                      <Upload size={16} />
                      Upload New
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Identity Category */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                         <ShieldCheck size={14} className="text-blue-500" /> Identity
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {categorizedDocs.identity.map(doc => <DocumentCard key={doc.id} doc={doc} onClick={() => setViewingDoc(doc)} />)}
                        {categorizedDocs.identity.length === 0 && <p className="col-span-2 py-8 text-center text-xs text-slate-300 font-medium border border-dashed rounded-2xl">No identity records</p>}
                      </div>
                    </div>

                    {/* Invoices Category */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                         <FileText size={14} className="text-amber-500" /> Invoices
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {categorizedDocs.invoices.map(doc => <DocumentCard key={doc.id} doc={doc} onClick={() => setViewingDoc(doc)} />)}
                        {categorizedDocs.invoices.length === 0 && <p className="col-span-2 py-8 text-center text-xs text-slate-300 font-medium border border-dashed rounded-2xl">No invoices generated</p>}
                      </div>
                    </div>

                    {/* Receipts Category */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                         <Receipt size={14} className="text-emerald-500" /> Receipts
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {categorizedDocs.receipts.map(doc => <DocumentCard key={doc.id} doc={doc} onClick={() => setViewingDoc(doc)} />)}
                        {categorizedDocs.receipts.length === 0 && <p className="col-span-2 py-8 text-center text-xs text-slate-300 font-medium border border-dashed rounded-2xl">No receipts on file</p>}
                      </div>
                    </div>

                    {/* Other Category */}
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                         <File size={14} className="text-slate-500" /> Other
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {categorizedDocs.other.map(doc => <DocumentCard key={doc.id} doc={doc} onClick={() => setViewingDoc(doc)} />)}
                        {categorizedDocs.other.length === 0 && <p className="col-span-2 py-8 text-center text-xs text-slate-300 font-medium border border-dashed rounded-2xl">No additional docs</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'history' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <History size={20} className="text-blue-600" />
                    Reservation History
                  </h3>
                  <div className="space-y-4">
                    {selectedGuest.history.map((stay) => (
                      <div key={stay.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <div>
                            <p className="font-black text-slate-800">Room #{stay.roomNumber}</p>
                            <p className="text-xs text-slate-500">{stay.stayDate}</p>
                          </div>
                          <div className="text-right">
                             <p className="font-black text-slate-800">${stay.amount}</p>
                             <span className="text-[10px] font-bold text-emerald-600 uppercase">{stay.status}</span>
                          </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Improved Document/Receipt Previewer */}
        {viewingDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setViewingDoc(null)}></div>
             <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
                
                {/* Modal Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${
                       viewingDoc.type === 'Receipt' ? 'bg-emerald-50 text-emerald-600' :
                       viewingDoc.type === 'Invoice' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                       {viewingDoc.fileName.toLowerCase().endsWith('.pdf') ? <FileText size={24} /> : <ImageIcon size={24} />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{viewingDoc.fileName}</h2>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">
                            Uploaded on {viewingDoc.uploadDate} • {viewingDoc.type} Category
                        </p>
                    </div>
                  </div>
                  <button onClick={() => setViewingDoc(null)} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all">
                    <X size={24} />
                  </button>
                </div>

                {/* Simulated Content Area (Preview) */}
                <div className="flex-1 overflow-y-auto p-12 bg-slate-100/50 flex flex-col items-center">
                    {viewingDoc.fileName.toLowerCase().endsWith('.pdf') ? (
                        /* Simulated PDF Preview */
                        <div className="w-full max-w-2xl bg-white p-12 rounded-3xl shadow-xl border border-slate-200 relative min-h-[800px] flex flex-col">
                            {/* PDF Header Mock */}
                            <div className="flex justify-between items-start mb-12 border-b border-slate-100 pb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">LUMINA GRAND</h3>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Document Registry</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-800">PAGE 1 OF 1</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">CONFIDENTIAL RECORD</p>
                                </div>
                            </div>
                            
                            {/* Document Content Mockup */}
                            <div className="space-y-8 flex-1">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-tighter">Summary of Document</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        This is a simulated preview of the digital file <strong>{viewingDoc.fileName}</strong>. 
                                        In a live environment, this space would render the actual PDF content using a 
                                        integrated PDF reader or an object embed.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse"></div>
                                        <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                                        <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                                        <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse"></div>
                                        <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse"></div>
                                    </div>
                                </div>

                                {viewingDoc.type === 'Receipt' || viewingDoc.type === 'Invoice' ? (
                                    <div className="mt-12 border-t-2 border-slate-900 pt-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-black text-slate-900">TOTAL RECORDED AMOUNT</span>
                                            <span className="text-2xl font-black text-slate-900">${viewingDoc.amount?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>

                            {/* PDF Footer Mock */}
                            <div className="mt-12 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                                Lumina HMS StaySync-OS Verification Engine • {new Date().getFullYear()}
                            </div>
                        </div>
                    ) : (
                        /* Simulated Image Preview */
                        <div className="w-full max-w-2xl flex flex-col items-center">
                             <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <div className="bg-white px-4 py-2 rounded-xl text-xs font-bold text-blue-600 shadow-xl">
                                        Digital Scan Verified
                                    </div>
                                </div>
                                <div className="w-full aspect-[4/3] bg-slate-50 flex items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200">
                                    <div className="text-center">
                                        <ImageIcon size={64} className="text-slate-200 mx-auto mb-4" />
                                        <p className="text-xs font-bold text-slate-400">Digital Image Render Placeholder</p>
                                        <p className="text-[10px] text-slate-300 mt-1 uppercase font-black tracking-widest">{viewingDoc.fileName}</p>
                                    </div>
                                </div>
                             </div>
                             <p className="mt-8 text-sm text-slate-500 font-medium max-w-md text-center">
                                Images are encrypted at rest. The Lumina Sentinel has verified the authenticity of this scan against the guest's profile metadata.
                             </p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-8 border-t border-slate-100 flex gap-4 bg-white shrink-0">
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                        <Download size={18} />
                        Download Original
                    </button>
                    <button className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                        <Mail size={18} />
                        Send as Attachment
                    </button>
                </div>
             </div>
          </div>
        )}

        {/* Upload Modal */}
        {isUploading && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsUploading(false)}></div>
             <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                   <div>
                      <h2 className="text-xl font-bold text-slate-800">Secure Document Upload</h2>
                      <p className="text-xs text-slate-500 font-medium">Add records to the profile vault.</p>
                   </div>
                   <button onClick={() => setIsUploading(false)} className="p-2 text-slate-400">
                      <X size={24} />
                   </button>
                </div>
                <form className="p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); setIsUploading(false); }}>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Type</label>
                      <select className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold appearance-none">
                         <option value="Passport">Passport (Identity)</option>
                         <option value="Driver License">Driver License (Identity)</option>
                         <option value="ID Card">ID Card (Identity)</option>
                         <option value="Invoice">Invoice</option>
                         <option value="Receipt">Receipt</option>
                         <option value="Other">Other Document</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select File</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer group">
                         <Upload size={32} className="mx-auto text-slate-300 mb-2 group-hover:text-blue-500" />
                         <p className="text-xs font-bold text-slate-500">Drag files here or click to browse</p>
                         <p className="text-[10px] text-slate-300 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                      </div>
                   </div>
                   <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsUploading(false)} className="flex-1 py-4 text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl">Cancel</button>
                      <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-200">Start Upload</button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Guest Management</h1>
          <p className="text-slate-500 text-sm mt-1">Unified profiles with automated billing and secure documentation vault.</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <UserPlus size={20} />
          Register New Guest
        </button>
      </div>

      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-[1.25rem] self-start w-fit">
        <button 
          onClick={() => setActiveSubTab('all')}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all ${
            activeSubTab === 'all' 
            ? 'bg-white text-blue-600 shadow-md' 
            : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users size={18} />
          Directory
        </button>
        <button 
          onClick={() => setActiveSubTab('dnr')}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all ${
            activeSubTab === 'dnr' 
            ? 'bg-rose-600 text-white shadow-md' 
            : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <Ban size={18} />
          DNR Sentinel
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder={activeSubTab === 'dnr' ? "Scan restricted list..." : "Find guest by name, ID, or phone..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
           <button className="p-3 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-100">
             <Filter size={18} />
           </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 ${activeSubTab === 'dnr' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
        {filteredGuests.map(guest => (
          <div 
            key={guest.id}
            onClick={() => setSelectedGuestId(guest.id)}
            className={`group cursor-pointer bg-white rounded-[2.5rem] p-8 border ${guest.isDNR ? 'border-rose-50' : 'border-slate-100'} shadow-sm hover:shadow-2xl transition-all relative overflow-hidden`}
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                {guest.photoUrl ? (
                  <img src={guest.photoUrl} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                ) : (
                  <div className={`w-16 h-16 rounded-2xl ${guest.isDNR ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'} flex items-center justify-center text-2xl font-black group-hover:scale-105 transition-all shadow-sm`}>
                    {guest.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{guest.name}</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{guest.idNumber}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                guest.isDNR ? 'bg-rose-600 text-white' :
                guest.status === 'VIP' ? 'bg-amber-100 text-amber-700' : 
                'bg-slate-100 text-slate-600'
              }`}>
                {guest.isDNR ? 'DNR' : guest.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 group-hover:bg-white transition-colors text-center">
                <p className="text-xl font-black text-slate-800 tabular-nums">{guest.totalStays}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter mt-1">Stays</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 group-hover:bg-white transition-colors text-center">
                <p className="text-xl font-black text-slate-800 tabular-nums">${guest.lifetimeSpend.toLocaleString()}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter mt-1">Lifetime</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${guest.documents.length > 0 ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-slate-200"}`}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vault: {guest.documents.length} Items</span>
              </div>
              <button className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all">
                Open Profile <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddingNew && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddingNew(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Register New Guest</h2>
              </div>
              <button onClick={() => setIsAddingNew(false)} className="p-3 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddGuest} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Legal Name</label>
                  <input name="name" required placeholder="John Q. Doe" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identification No.</label>
                  <input name="idNumber" required placeholder="Passport / DL Number" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus:ring-4 focus:ring-blue-500/10 outline-none text-sm font-bold" />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsAddingNew(false)} className="flex-1 py-5 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Discard</button>
                <button type="submit" className="flex-1 py-5 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">Complete Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guests;

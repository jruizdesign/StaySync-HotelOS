import React, { useState, useRef } from 'react';
import {
  UserPlus, Search, FileText, ArrowLeft,
  Mail, Phone, Upload, Receipt,
  Download, Sparkles, Loader2,
  ShieldCheck, MapPin, Printer, Pencil
} from 'lucide-react';
import { Guest } from '../types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface GuestsProps {
  isDemoMode: boolean;
}

// --- 1. Helper Components & Modals (Defined first for dependency availability) ---

const InfoRow = ({ icon: Icon, value }: any) => (
  <div className="flex items-center gap-3 text-slate-600">
    <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
      <Icon size={16} />
    </div>
    <span className="text-xs font-semibold truncate">{value}</span>
  </div>
);

const CreateGuestModal = ({ onClose, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.guests.create(data);
      onSuccess();
    } catch (err) {
      alert('Failed to create guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Register New Guest</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Full Name" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />
          <input name="email" type="email" placeholder="Email Address" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />
          <input name="phoneNumber" placeholder="Phone Number" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
            <button disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EditGuestModal = ({ guest, onClose, onSuccess }: { guest: Guest, onClose: () => void, onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Convert checkbox to boolean
    const payload = {
      ...data,
      isDNR: formData.get('isDNR') === 'on'
    };

    try {
      await api.guests.update(guest.id, payload);
      onSuccess();
    } catch (err) {
      alert('Failed to update guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Guest Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="name" defaultValue={guest.name} placeholder="Full Name" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />
            <input name="email" defaultValue={guest.email} type="email" placeholder="Email" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="phoneNumber" defaultValue={guest.phoneNumber || ''} placeholder="Phone" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />
            <input name="idNumber" defaultValue={guest.idNumber || ''} placeholder="ID / Passport" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />
          </div>

          <input name="address" defaultValue={guest.address || ''} placeholder="Address" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />

          <div className="flex gap-4">
            <select name="status" defaultValue={guest.status} className="flex-1 px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700">
              <option value="Regular">Regular</option>
              <option value="VIP">VIP</option>
              <option value="Restricted">Restricted</option>
            </select>
          </div>

          <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100">
            <input name="isDNR" type="checkbox" defaultChecked={guest.isDNR} id="dnr-check" className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500" />
            <label htmlFor="dnr-check" className="font-bold text-rose-700 text-sm">Mark as Do Not Rent (DNR)</label>
          </div>
          {/* Only show reason if checked? For simplicity, show always or rely on user */}
          <input name="dnrReason" defaultValue={guest.dnrReason || ''} placeholder="DNR Reason (if applicable)" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none font-bold text-slate-700" />

          <div className="pt-4 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
            <button disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// --- 2. Tab Components ---

const OverviewTab = ({ guest }: { guest: Guest }) => (
  <div className="space-y-8 animate-in fade-in">
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Reservation History</h3>
      <div className="space-y-3">
        {guest.bookings?.length > 0 ? guest.bookings?.map((booking: any) => (
          <div key={booking.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
            <div>
              <p className="font-bold text-slate-800">{booking.room?.roomNumber ? `Room ${booking.room.roomNumber}` : 'Unassigned Room'}</p>
              <p className="text-xs text-slate-500">{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            </div>
            <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold shadow-sm">{booking.status}</span>
          </div>
        )) : (
          <p className="text-slate-400 text-sm">No booking history yet.</p>
        )}
      </div>
    </div>

    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Notes</h3>
      <div className="space-y-3">
        {guest.notes?.length > 0 ? guest.notes?.map((note: any) => (
          <div key={note.id} className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-800 text-sm">
            <p>{note.content}</p>
            <p className="text-[10px] opacity-60 mt-2">{new Date(note.createdAt).toLocaleDateString()}</p>
          </div>
        )) : (
          <p className="text-slate-400 text-sm">No notes captured.</p>
        )}
      </div>
    </div>
  </div>
);

const DocumentsTab = ({ guest, onUpdate }: { guest: Guest, onUpdate: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);
    const file = e.target.files[0];
    const storageRef = ref(storage, `guests/${guest.id}/${Date.now()}_${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Save Metadata to API
      await api.guests.addDocument(guest.id, {
        fileName: file.name,
        fileUrl: url,
        type: 'Other', // Could implement AI detection here later
        amount: 0
      });
      onUpdate();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Profile Vault</h3>
        <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer group flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-xs uppercase hover:bg-blue-100 transition-colors">
          {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          Upload Document
          <input type="file" hidden ref={fileInputRef} onChange={handleUpload} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {guest.documents?.map((doc: any) => (
          <div key={doc.id} className="p-4 rounded-3xl border border-slate-100 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 bg-blue-600 text-white rounded-full block">
                <Download size={14} />
              </a>
            </div>
            <FileText size={32} className="text-slate-300 mb-3" />
            <p className="font-bold text-slate-800 text-sm truncate">{doc.fileName}</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{doc.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const CommunicationTab = ({ guest }: { guest: Guest }) => {
  const [template, setTemplate] = useState('Welcome');
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDraft = async () => {
    setIsGenerating(true);
    // Simulation of AI Generation
    setTimeout(() => {
      const drafts: any = {
        'Welcome': `Dear ${guest.name},\n\nWe are delighted to welcome you to StaySync Hotel. Your room is ready and our team is at your service.\n\nEnjoy your stay!`,
        'Feedback': `Dear ${guest.name},\n\nThank you for choosing us. We value your feedback. How was your recent stay in Room ${guest.bookings?.[0]?.room?.roomNumber || 'Unknown'}?\n\nBest regards,\nStaySync Team`,
        'Invoice': `Dear ${guest.name},\n\nPlease find attached your invoice for your recent stay. Total: $${guest.lifetimeSpend}.\n\nThank you.`
      };
      setDraft(drafts[template] || '');
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800">AI Composer</h3>
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase">Select Template</label>
          <div className="flex flex-wrap gap-2">
            {['Welcome', 'Feedback', 'Invoice', 'Policy Update'].map(t => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${template === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={generateDraft}
          disabled={isGenerating}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          Generate Draft
        </button>
      </div>

      <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Preview</p>
          {draft && <button className="text-blue-600 text-xs font-bold">Copy</button>}
        </div>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Select a template and click generate..."
          className="flex-1 w-full bg-transparent border-none resize-none outline-none text-slate-600 leading-relaxed text-sm placeholder:text-slate-300"
        />
        {draft && (
          <button className="mt-4 w-full py-3 bg-blue-100 text-blue-700 rounded-xl font-bold text-xs uppercase hover:bg-blue-200 transition-colors">
            Send Email
          </button>
        )}
      </div>
    </div>
  );
};

const FinancialsTab = ({ guest }: { guest: Guest }) => {
  const queryClient = useQueryClient();
  const handleGenerateInvoice = async () => {
    const amount = prompt("Enter invoice amount:", "0.00");
    if (!amount) return;

    try {
      await api.guests.generateInvoice(guest.id, { amount: parseFloat(amount) });
      queryClient.invalidateQueries({ queryKey: ['guest', guest.id] });
    } catch (e) {
      alert('Failed to generate invoice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Invoices & Receipts</h3>
        <button
          onClick={handleGenerateInvoice}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase transition-all hover:bg-slate-800"
        >
          <Printer size={16} /> Generate Statement
        </button>
      </div>

      <div className="space-y-3">
        {guest.invoices?.map((inv: any) => (
          <div key={inv.id} className="flex justify-between items-center p-5 bg-white border border-slate-100 shadow-sm rounded-2xl">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                <Receipt size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Invoice #{inv.id.substr(0, 8)}</p>
                <p className="text-xs text-slate-500">{new Date(inv.generatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-slate-800">${Number(inv.totalAmount).toFixed(2)}</p>
              <span className={`text-[10px] font-bold uppercase ${inv.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'}`}>{inv.status}</span>
            </div>
          </div>
        ))}
        {(!guest.invoices || guest.invoices.length === 0) && (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 text-sm font-medium">No financial records found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 3. Detail View (Dependent on Tabs) ---

const GuestDetailView: React.FC<{ guest: Guest; onBack: () => void; onUpdate: () => void; onEdit: () => void }> = ({ guest, onBack, onUpdate, onEdit }) => {
  const [tab, setTab] = useState<'overview' | 'documents' | 'communication' | 'financials'>('overview');

  return (
    <div className="animate-in slide-in-from-right-8 duration-300">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back to Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-white -z-0"></div>
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto bg-white rounded-[2rem] shadow-xl p-1 mb-6">
                {guest.photoUrl ? (
                  <img src={guest.photoUrl} className="w-full h-full object-cover rounded-[1.8rem]" />
                ) : (
                  <div className="w-full h-full bg-slate-100 rounded-[1.8rem] flex items-center justify-center text-4xl font-black text-slate-300">
                    {guest.name.charAt(0)}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight">{guest.name}</h2>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${guest.isDNR ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                {guest.isDNR ? 'Blacklisted' : guest.status || 'Regular'}
              </span>

              <div className="mt-8 space-y-4 text-left">
                <InfoRow icon={Mail} value={guest.email} />
                <InfoRow icon={Phone} value={guest.phoneNumber || 'N/A'} />
                <InfoRow icon={MapPin} value={guest.address || 'No Address'} />
              </div>

              <button onClick={onEdit} className="mt-8 w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Lifetime Value</p>
              <p className="text-4xl font-black tracking-tight">${guest.lifetimeSpend?.toLocaleString() ?? '0'}</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">{guest.totalStays ?? 0}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Total Stays</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{(guest.documents?.length) ?? 0}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 flex flex-col min-h-[600px]">
          {/* Tab Nav */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-[1.5rem] w-fit mb-8">
            {['overview', 'documents', 'communication', 'financials'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wide transition-all ${tab === t ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            {tab === 'overview' && <OverviewTab guest={guest} />}
            {tab === 'documents' && <DocumentsTab guest={guest} onUpdate={onUpdate} />}
            {tab === 'communication' && <CommunicationTab guest={guest} />}
            {tab === 'financials' && <FinancialsTab guest={guest} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4. Main Controller (Dependent on Details) ---

const Guests: React.FC<GuestsProps> = ({ isDemoMode }) => {
  const queryClient = useQueryClient();
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isDNRFilter, setIsDNRFilter] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Real Data Fetch
  const { data: fetchRes, isLoading } = useQuery({
    queryKey: ['guests', search, isDNRFilter],
    queryFn: async () => {
      const res = await api.guests.list(search, isDNRFilter);
      return res.guests;
    },
    enabled: !isDemoMode
  });

  const guests = fetchRes || [];
  const selectedGuest = guests.find((g: Guest) => g.id === selectedGuestId);
  const [details, setDetails] = useState<Guest | null>(null);

  // Fetch full details when selected
  useQuery({
    queryKey: ['guest', selectedGuestId],
    queryFn: async () => {
      if (!selectedGuestId) return null;
      const res = await api.guests.get(selectedGuestId);
      setDetails(res.guest);
      return res.guest;
    },
    enabled: !!selectedGuestId
  });

  const activeGuest = details || selectedGuest; // Fallback to list partial data while loading

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {!selectedGuestId ? (
        <>
          {/* Header Directory Mode */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Guest Directory</h1>
              <p className="text-slate-500 text-sm mt-1">Manage profiles, documents, and communications.</p>
            </div>
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <UserPlus size={20} />
              Register Guest
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsDNRFilter(!isDNRFilter)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${isDNRFilter ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              >
                <ShieldCheck size={16} />
                DNR Check
              </button>
            </div>
          </div>

          {/* Guest Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[2.5rem] animate-pulse" />)
            ) : guests.length > 0 ? (
              guests.map((guest: Guest) => (
                <div
                  key={guest.id}
                  onClick={() => setSelectedGuestId(guest.id)}
                  className={`group cursor-pointer bg-white rounded-[2.5rem] p-8 border ${guest.isDNR ? 'border-rose-100 bg-rose-50/10' : 'border-slate-100'} shadow-sm hover:shadow-2xl transition-all relative overflow-hidden`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold text-slate-500 shadow-inner">
                        {guest.photoUrl ? (
                          <img src={guest.photoUrl} alt={guest.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : guest.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{guest.name}</h3>
                        <p className={`text-xs font-bold uppercase tracking-wider mt-1 ${guest.isDNR ? 'text-rose-500' : 'text-slate-400'}`}>
                          {guest.isDNR ? 'DO NOT RENT' : guest.status}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <Mail size={14} className="shrink-0" />
                      <span className="truncate">{guest.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <Phone size={14} className="shrink-0" />
                      <span>{guest.phoneNumber || 'No phone'}</span>
                    </div>
                  </div>

                  {guest.isDNR && (
                    <div className="mt-6 p-4 bg-rose-100/50 rounded-2xl border border-rose-100">
                      <p className="text-xs font-bold text-rose-700 uppercase tracking-wide mb-1 flex items-center gap-2">
                        <ShieldCheck size={14} /> Alert
                      </p>
                      <p className="text-xs text-rose-600 leading-relaxed font-medium">
                        {guest.dnrReason || "Restricted access. Manager approval required."}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="opacity-20" />
                </div>
                <p className="font-bold">No guests found</p>
                <p className="text-sm">Try adjusting your search query.</p>
              </div>
            )}
          </div>
        </>
      ) : activeGuest && (
        <GuestDetailView
          guest={activeGuest}
          onBack={() => setSelectedGuestId(null)}
          onEdit={() => setIsEditing(true)}
          onUpdate={() => queryClient.invalidateQueries({ queryKey: ['guest', selectedGuestId] })}
        />
      )}

      {/* Create Modal */}
      {isAddingNew && (
        <CreateGuestModal onClose={() => setIsAddingNew(false)} onSuccess={() => {
          setIsAddingNew(false);
          queryClient.invalidateQueries({ queryKey: ['guests'] });
        }} />
      )}
    </div>
  );
};

export default Guests;

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoom } from '@firebasegen/default';
import { Check, ChevronRight, Hash, Layers, Loader2, BedDouble, AlertCircle, DollarSign } from 'lucide-react';

interface RoomSetupWizardProps {
    propertyId: string;
    onComplete: () => void;
}

interface FloorConfig {
    floorNumber: number;
    roomCount: number;
    startNumber: number; // e.g., 101
    roomType: string;
    price: number;
}

const RoomSetupWizard: React.FC<RoomSetupWizardProps> = ({ propertyId, onComplete }) => {
    const queryClient = useQueryClient();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [totalFloors, setTotalFloors] = useState(1);
    const [roomsPerFloor, setRoomsPerFloor] = useState(10);
    const [defaultType, setDefaultType] = useState('Double');
    const [defaultPrice, setDefaultPrice] = useState(150);
    const [configs, setConfigs] = useState<FloorConfig[]>([]);

    // Batch Creation Mutation
    const createRoomMutation = useMutation({
        mutationFn: async (vars: any) => {
            // Direct call to generated SDK
            return await createRoom(vars);
        }
    });

    const [progress, setProgress] = useState(0);
    const [totalToCreate, setTotalToCreate] = useState(0);

    const generatePreview = () => {
        const newConfigs: FloorConfig[] = [];
        for (let f = 1; f <= totalFloors; f++) {
            newConfigs.push({
                floorNumber: f,
                roomCount: roomsPerFloor,
                startNumber: f * 100 + 1, // Floor 1 start 101, Floor 2 start 201
                roomType: defaultType,
                price: defaultPrice
            });
        }
        setConfigs(newConfigs);
        setStep(2);
    };

    const handleCreate = async () => {
        setStep(3);
        let totalRooms = configs.reduce((acc, curr) => acc + curr.roomCount, 0);
        setTotalToCreate(totalRooms);
        let completed = 0;

        try {
            // Flatten into a single array of room objects
            const allRooms = configs.flatMap(config => {
                return Array.from({ length: config.roomCount }).map((_, i) => ({
                    propertyId: propertyId,
                    roomNumber: (config.startNumber + i).toString(),
                    roomType: config.roomType,
                    floor: config.floorNumber,
                    price: config.price,
                    status: 'AVAILABLE'
                }));
            });

            // Execute in batches to avoid overwhelming (though client side usually fine with Promise.all for reasonable size)
            // We will do chunks of 5
            const chunkSize = 5;
            for (let i = 0; i < allRooms.length; i += chunkSize) {
                const chunk = allRooms.slice(i, i + chunkSize);
                console.log("Creating rooms chunk:", chunk);
                await Promise.all(chunk.map(room => createRoomMutation.mutateAsync(room)));

                completed += chunk.length;
                setProgress(((completed / totalRooms) * 100));
            }

            // Success
            queryClient.invalidateQueries({ queryKey: ['dashboard', propertyId] });
            setTimeout(onComplete, 1000); // Give user a moment to see 100%

        } catch (err) {
            console.error("Failed to create rooms", err);
            alert("Error creating rooms. Check console.");
            setStep(2); // Go back to review
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 max-w-3xl mx-auto">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Room Setup Wizard</h2>
                <p className="text-slate-500 text-sm">Initialize your property's room inventory in seconds.</p>

                {/* Stepper */}
                <div className="flex justify-center items-center gap-4 mt-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                    <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                    <div className={`h-1 w-12 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>3</div>
                </div>
            </div>

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Layers size={14} /> Total Floors
                            </label>
                            <input
                                type="number"
                                min="1" max="50"
                                value={totalFloors}
                                onChange={e => setTotalFloors(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Hash size={14} /> Rooms Per Floor
                            </label>
                            <input
                                type="number"
                                min="1" max="100"
                                value={roomsPerFloor}
                                onChange={e => setRoomsPerFloor(parseInt(e.target.value) || 1)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <BedDouble size={14} /> Default Room Type
                            </label>
                            <select
                                value={defaultType}
                                onChange={(e) => setDefaultType(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Single">Single</option>
                                <option value="Double">Double</option>
                                <option value="Suite">Suite</option>
                                <option value="Penthouse">Penthouse</option>
                            </select>
                            <p className="text-[10px] text-slate-400 font-medium ml-1">You can customize individual floors in the next step.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign size={14} /> Base Price
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={defaultPrice}
                                onChange={e => setDefaultPrice(parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generatePreview}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        Generate Preview <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {configs.map((config, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm font-black text-slate-300 text-lg">
                                    {config.floorNumber}
                                </div>
                                <div className="flex-1 grid grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Start #</label>
                                        <input
                                            type="number"
                                            value={config.startNumber}
                                            onChange={e => {
                                                const newC = [...configs];
                                                newC[idx].startNumber = parseInt(e.target.value) || 0;
                                                setConfigs(newC);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Count</label>
                                        <input
                                            type="number"
                                            value={config.roomCount}
                                            onChange={e => {
                                                const newC = [...configs];
                                                newC[idx].roomCount = parseInt(e.target.value) || 0;
                                                setConfigs(newC);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Type</label>
                                        <select
                                            value={config.roomType}
                                            onChange={e => {
                                                const newC = [...configs];
                                                newC[idx].roomType = e.target.value;
                                                setConfigs(newC);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                                        >
                                            <option value="Single">Single</option>
                                            <option value="Double">Double</option>
                                            <option value="Suite">Suite</option>
                                            <option value="Penthouse">Penthouse</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Price</label>
                                        <input
                                            type="number"
                                            value={config.price}
                                            onChange={e => {
                                                const newC = [...configs];
                                                newC[idx].price = parseFloat(e.target.value) || 0;
                                                setConfigs(newC);
                                            }}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-sm font-bold text-blue-800">Ready to create?</p>
                            <p className="text-xs text-blue-600 mt-1">
                                This will generate <span className="font-black">{configs.reduce((a, c) => a + c.roomCount, 0)}</span> rooms across {configs.length} floors.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-4 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleCreate}
                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            Create Rooms <Check size={16} />
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="relative w-24 h-24 mx-auto">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-500 transition-all duration-300 ease-out" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progress) / 100} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-xl text-slate-700">
                            {Math.round(progress)}%
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Building Property...</h3>
                        <p className="text-slate-400 text-sm mt-2">Creating room records in Cloud SQL</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomSetupWizard;

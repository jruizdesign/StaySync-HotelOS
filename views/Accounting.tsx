
import React, { useMemo } from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Download, Wrench } from 'lucide-react';
import { MaintenanceTask } from '../types';

interface AccountingProps {
  isDemoMode: boolean;
  maintenanceTasks: MaintenanceTask[];
}

const Accounting: React.FC<AccountingProps> = ({ isDemoMode, maintenanceTasks }) => {
  const baseExpenses = isDemoMode ? 23199.50 : 0;
  
  // Calculate maintenance cost from passed props
  const maintenanceCost = useMemo(() => {
    return maintenanceTasks.reduce((acc, task) => acc + (task.cost || 0), 0);
  }, [maintenanceTasks]);

  const totalExpenses = baseExpenses + maintenanceCost;
  const revenue = isDemoMode ? 68400.00 : 0;
  const netBalance = revenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Accounting Ledger</h1>
          <p className="text-slate-500 text-sm">Manage financial transactions and property p&l.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
             <DollarSign size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Net Balance</p>
            <p className="text-2xl font-bold text-slate-800">${netBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
             <ArrowUpCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Revenue</p>
            <p className="text-2xl font-bold text-slate-800">${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
             <ArrowDownCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Expenses</p>
            <p className="text-2xl font-bold text-slate-800">${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <span className="text-[10px] text-slate-400 font-bold">+${maintenanceCost.toLocaleString()} from Maint.</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Dynamic Maintenance Rows */}
            {maintenanceTasks.filter(t => t.cost > 0).map(task => (
              <tr key={'maint-' + task.id} className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4 font-mono text-xs text-slate-400">#MNT-{task.id}</td>
                 <td className="px-6 py-4 text-sm text-slate-600">{task.completedDate || task.reportedDate}</td>
                 <td className="px-6 py-4 text-sm font-medium text-slate-800 flex items-center gap-2">
                    <Wrench size={14} className="text-slate-400" />
                    Maint: {task.description} (Room {task.roomNumber})
                 </td>
                 <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded uppercase">Expense</span>
                 </td>
                 <td className="px-6 py-4 font-bold text-rose-600">-${task.cost.toFixed(2)}</td>
              </tr>
            ))}

            {/* Mock Rows */}
            {isDemoMode ? [1,2,3,4,5].map(i => (
              <tr key={'tx-' + i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#TX-9021{i}</td>
                <td className="px-6 py-4 text-sm text-slate-600">Oct {20+i}, 2023</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">Guest Payment - Room #20{i}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Revenue</span>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-600">$250.00</td>
              </tr>
            )) : (
               maintenanceTasks.filter(t => t.cost > 0).length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No transactions recorded in current period.
                    </td>
                </tr>
               )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounting;

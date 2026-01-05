
import React from 'react';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Download } from 'lucide-react';

const Accounting: React.FC = () => {
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

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
             <DollarSign size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Net Balance</p>
            <p className="text-2xl font-bold text-slate-800">$45,200.50</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
             <ArrowUpCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Revenue</p>
            <p className="text-2xl font-bold text-slate-800">$68,400.00</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
             <ArrowDownCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Expenses</p>
            <p className="text-2xl font-bold text-slate-800">$23,199.50</p>
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
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">#TX-9021{i}</td>
                <td className="px-6 py-4 text-sm text-slate-600">Oct {20+i}, 2023</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">Guest Payment - Room #20{i}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Revenue</span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">$250.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounting;

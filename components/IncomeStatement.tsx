
import React from 'react';
import { 
  X, 
  Printer, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Download,
  Calendar,
  Wallet,
  TrendingUp,
  PieChart,
  ShieldCheck
} from 'lucide-react';
import { Student } from '../types';
import { MONTHS } from '../constants';

interface IncomeStatementProps {
  students: Student[];
  onClose: () => void;
  selectedMonth: number;
  selectedYear: number;
}

const IncomeStatement: React.FC<IncomeStatementProps> = ({ students, onClose, selectedMonth, selectedYear }) => {
  const currentMonthName = MONTHS[selectedMonth];
  const currentMonthId = `${selectedYear}-${selectedMonth + 1}`;

  const handlePrint = () => {
    window.print();
  };

  const totalIncome = students
    .filter(s => s.paidMonths.includes(currentMonthId))
    .reduce((acc, s) => acc + (s.monthlyFee ?? 0), 0);

  const totalExpected = students.reduce((acc, s) => acc + (s.monthlyFee ?? 0), 0);
  const collectionRate = totalExpected > 0 ? Math.round((totalIncome / totalExpected) * 100) : 0;

  const paidStudents = students.filter(s => s.paidMonths.includes(currentMonthId));

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-start justify-center overflow-y-auto p-4 md:p-10 print:p-0 print:bg-white print:block">
      {/* Control Bar (Hidden on print) */}
      <div className="fixed top-6 right-10 flex gap-3 print:hidden z-[130]">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-brightx-teal text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl transition-all"
        >
          <Printer className="w-4 h-4" /> Print Statement
        </button>
        <button 
          onClick={onClose}
          className="p-3 bg-white text-gray-400 hover:text-brightx-navy rounded-2xl shadow-xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* The Statement Document */}
      <div className="bg-white w-full max-w-[850px] shadow-2xl rounded-[1rem] p-10 md:p-16 relative border border-gray-100 print:shadow-none print:p-8 print:border-none print:max-w-none">
        
        {/* Header - Identical Branding to Progress Report */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-0 mb-4">
            <span className="text-6xl font-black text-brightx-navy tracking-tighter">Bright</span>
            <span className="text-7xl font-black text-brightx-navy tracking-tighter -ml-1 relative z-10">X</span>
            <div className="bg-brightx-teal text-white px-6 py-3 flex items-center justify-center translate-y-2">
              <span className="text-3xl font-black tracking-[0.2em] ml-2">LEARN</span>
            </div>
          </div>
          <h3 className="text-brightx-teal font-black text-sm tracking-[0.3em] uppercase mb-4">Computer Tuition Class</h3>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-16 text-center border-b border-t border-gray-50 py-10">
          <div className="flex flex-col items-center gap-2 border-r border-gray-50">
             <div className="flex gap-4 mb-4">
               <div className="bg-gray-50 p-3 rounded-full"><MapPin className="w-4 h-4 text-brightx-teal" /></div>
               <p className="text-[10px] text-left font-bold text-gray-400 uppercase leading-relaxed">
                 Bhagabanpur, Near Sporting Club,<br/>Diamond Harbour, Pin-743331
               </p>
             </div>
             <div className="text-left w-full pl-12">
                <p className="text-[11px] font-black text-brightx-navy uppercase">Surajit Halder</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">(Principal Educator)</p>
             </div>
          </div>
          <div className="flex flex-col items-start gap-4 pl-12 justify-center">
            <div className="flex items-center gap-4 text-gray-700 text-[10px] font-bold">
              <Phone className="w-4 h-4 text-brightx-teal" /> +91 74777 52450
            </div>
            <div className="flex items-center gap-4 text-gray-700 text-[10px] font-bold lowercase">
              <Mail className="w-4 h-4 text-brightx-teal" /> brightxlearn@gmail.com
            </div>
          </div>
        </div>

        {/* Document Title */}
        <div className="flex justify-center -mt-16 mb-16">
          <div className="bg-brightx-navy text-white px-10 py-3 rounded-xl shadow-xl">
            <h2 className="text-sm font-black uppercase tracking-[0.4em]">Income Statement</h2>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-brightx-teal uppercase tracking-tighter">{currentMonthName} {selectedYear}</h1>
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2 italic">Official Ledger Summary • {new Date().toLocaleDateString('en-GB')}</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-20">
          <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-4 h-4 text-brightx-teal" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Income</p>
            </div>
            <p className="text-4xl font-black text-brightx-navy tracking-tighter">₹{totalIncome.toLocaleString()}</p>
            <p className="text-[8px] font-black text-gray-300 uppercase mt-4">Revenue Confirmed</p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
            <TrendingUp className="absolute -bottom-4 -right-4 w-16 h-16 text-emerald-500/10" />
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Growth Index</p>
            </div>
            <p className="text-4xl font-black text-emerald-500 tracking-tighter">+0.0% <span className="text-lg">↗</span></p>
            <p className="text-[8px] font-black text-gray-300 uppercase mt-4">Vs. Prev Month</p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-4 h-4 text-brightx-teal" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Collection Rate</p>
            </div>
            <p className="text-4xl font-black text-brightx-teal tracking-tighter">{collectionRate}%</p>
            <p className="text-[8px] font-black text-gray-300 uppercase mt-4">₹{totalExpected.toLocaleString()} Expected</p>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6 border-l-4 border-brightx-navy pl-4">
            <h3 className="text-xs font-black text-brightx-navy uppercase tracking-widest">Detailed Fee Collections</h3>
          </div>
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-brightx-navy text-white">
                   <tr>
                      <th className="px-10 py-4 text-[9px] font-black uppercase tracking-widest">Student Identity</th>
                      <th className="px-10 py-4 text-[9px] font-black uppercase tracking-widest text-center">Batch Level</th>
                      <th className="px-10 py-4 text-[9px] font-black uppercase tracking-widest text-center">Collection Date</th>
                      <th className="px-10 py-4 text-[9px] font-black uppercase tracking-widest text-right">Fee Paid</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {paidStudents.length > 0 ? paidStudents.map((s, i) => (
                     <tr key={s.id}>
                        <td className="px-10 py-6">
                           <p className="font-black text-gray-700">{s.name}</p>
                           <p className="text-[8px] font-bold text-gray-400">{s.studentPhone}</p>
                        </td>
                        <td className="px-10 py-6 text-center font-black text-gray-400 text-[10px] uppercase">{s.studentClass}</td>
                        <td className="px-10 py-6 text-center font-black text-gray-600 text-[10px]">{s.paymentRecords?.[currentMonthId] || 'N/A'}</td>
                        <td className="px-10 py-6 text-right font-black text-brightx-teal">₹{(s.monthlyFee ?? 0).toLocaleString()}</td>
                     </tr>
                   )) : (
                     <tr>
                        <td colSpan={4} className="px-10 py-24 text-center text-[10px] font-bold text-gray-300 uppercase italic tracking-widest">
                           No income records available for this selected month.
                        </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end px-10">
          <div className="text-[8px] font-black text-gray-300 uppercase leading-relaxed max-w-[200px]">
             Certified Financial Statement • BrightXLearn Education Group • Verified Secure Ledger © {selectedYear}
          </div>
          <div className="w-64 text-center">
             <div className="w-full h-[2px] bg-brightx-navy mb-4" />
             <p className="text-[10px] font-black text-brightx-navy uppercase tracking-[0.2em]">Authorized Signature</p>
             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Surajit Halder</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IncomeStatement;

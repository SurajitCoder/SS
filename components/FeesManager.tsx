
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  Download,
  Calendar,
  ChevronDown,
  Layout,
  FileText
} from 'lucide-react';
import { Student } from '../types';
import { MONTHS, CURRENT_YEAR, CLASSES } from '../constants';
import StudentAvatar from './StudentAvatar';

interface FeesManagerProps {
  students: Student[];
  onToggleFee: (id: string, monthId: string) => void;
  onOpenStatement: (month: number, year: number) => void;
  onOpenBatchReport: (type: 'attendance' | 'exam' | 'fees', targetClass: string, month: number, year: number) => void;
}

const FeesManager: React.FC<FeesManagerProps> = ({ students, onToggleFee, onOpenStatement, onOpenBatchReport }) => {
  const [view, setView] = useState<'revenue' | 'trends'>('revenue');
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedClass, setSelectedClass] = useState('Class 3');
  
  const currentMonthId = `${selectedYear}-${selectedMonth + 1}`;
  
  const classStudents = useMemo(() => 
    students.filter(s => (selectedClass === 'All' || s.studentClass === selectedClass)),
    [students, selectedClass]
  );

  const filtered = useMemo(() => 
    classStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase())),
    [classStudents, search]
  );

  const stats = useMemo(() => {
    const target = classStudents.reduce((acc, s) => acc + (s.monthlyFee ?? 0), 0);
    const collected = classStudents
      .filter(s => s.paidMonths.includes(currentMonthId))
      .reduce((acc, s) => acc + (s.monthlyFee ?? 0), 0);
    const pendingCount = classStudents.filter(s => !s.paidMonths.includes(currentMonthId)).length;
    
    return { target, collected, pendingCount };
  }, [classStudents, currentMonthId]);

  // Generate a range of years for the selector
  const yearOptions = useMemo(() => {
    const years = [];
    const startYear = Math.min(2024, new Date().getFullYear());
    const endYear = new Date().getFullYear() + 10;
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-brightx-navy tracking-tight">Ledger Registry</h1>
          <p className="text-gray-400 font-bold mt-1">Manage accounts and tuition tracking.</p>
        </div>
        
        {/* Toggle Switch */}
        <div className="bg-white border border-gray-100 p-1 rounded-2xl flex items-center shadow-sm">
          <button 
            onClick={() => setView('revenue')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest flex items-center gap-3 transition-all ${
              view === 'revenue' ? 'bg-brightx-navy text-white shadow-lg' : 'text-gray-400 hover:text-brightx-navy'
            }`}
          >
            <Wallet className="w-4 h-4" /> REVENUE
          </button>
          <button 
            onClick={() => setView('trends')}
            className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest flex items-center gap-3 transition-all ${
              view === 'trends' ? 'bg-brightx-navy text-white shadow-lg' : 'text-gray-400 hover:text-brightx-navy'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> TRENDS
          </button>
        </div>
      </div>

      {view === 'revenue' ? (
        <div className="space-y-10">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="pl-12 pr-10 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black text-brightx-teal appearance-none outline-none shadow-sm cursor-pointer"
              >
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brightx-teal" />
            </div>

            <div className="relative">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="pl-4 pr-10 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-700 appearance-none outline-none shadow-sm cursor-pointer"
              >
                {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="pl-4 pr-10 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black text-gray-700 appearance-none outline-none shadow-sm cursor-pointer"
              >
                <option value="All">All Classes</option>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            </div>

            <div className="flex-1 relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by identity..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:border-brightx-teal font-bold shadow-sm text-xs"
              />
            </div>
          </div>

          {/* Revenue Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-[1.5rem] flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Target</p>
                <p className="text-3xl font-black text-gray-800">₹{stats.target.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-[1.5rem] flex items-center justify-center">
                <Wallet className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Collected</p>
                <p className="text-3xl font-black text-brightx-teal">₹{stats.collected.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Pending</p>
                <p className="text-3xl font-black text-red-500">{stats.pendingCount} <span className="text-xs">students</span></p>
              </div>
            </div>
          </div>

          {/* Identity Ledger List */}
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
            <div className="px-8 flex text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8">
              <span className="flex-1">Identity</span>
              <span className="w-48 text-center">Fee</span>
              <span className="w-48 text-center">Status</span>
              <span className="w-32 text-right">Action</span>
            </div>

            <div className="space-y-2">
              {filtered.map(student => {
                const isPaid = student.paidMonths.includes(currentMonthId);
                return (
                  <div key={student.id} className="p-8 rounded-[2.5rem] hover:bg-gray-50/50 transition-all flex items-center gap-8 group">
                    <div className="flex-1 flex flex-col">
                      <span className="text-lg font-black text-gray-800">{student.name}</span>
                      <span className="text-[10px] font-bold text-gray-400">{student.studentPhone}</span>
                    </div>

                    <div className="w-48 text-center">
                      <span className="text-xl font-black text-gray-800">₹{(student.monthlyFee ?? 0).toLocaleString()}</span>
                    </div>

                    <div className="w-48 flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${
                        isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                      }`}>
                        {isPaid ? 'PAID' : 'DUE'}
                      </span>
                    </div>

                    <div className="w-32 flex justify-end">
                      <button 
                        onClick={() => onToggleFee(student.id, currentMonthId)}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isPaid ? 'bg-gray-100 text-gray-400' : 'bg-brightx-teal/10 text-brightx-teal hover:bg-brightx-teal hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="py-20 text-center text-gray-300 font-bold italic">No matching identity records found.</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 duration-300">
          {/* Revenue Trail Visual */}
          <div className="md:col-span-7 bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-4 mb-16">
                <TrendingUp className="w-5 h-5 text-brightx-teal" />
                <h3 className="text-[13px] font-black text-brightx-navy uppercase tracking-[0.2em]">Revenue Trail</h3>
             </div>
             
             {/* Mock Chart using SVG */}
             <div className="h-64 w-full flex items-end justify-between gap-4 px-4 border-b border-gray-100">
                {['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'].map((m, i) => {
                  const heights = [30, 45, 60, 40, 75, 55];
                  return (
                    <div key={m} className="flex-1 flex flex-col items-center gap-4 group">
                       <div 
                         className="w-full bg-brightx-teal/10 rounded-t-xl group-hover:bg-brightx-teal transition-all duration-500" 
                         style={{ height: `${heights[i]}%` }}
                       />
                       <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest pb-4">{m}</span>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Potential Card */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-brightx-navy p-12 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-full -mr-12 -mt-12" />
              
              <div>
                <p className="text-[10px] font-black text-brightx-teal uppercase tracking-widest mb-4">Monthly Potential</p>
                <h3 className="text-6xl font-black text-white tracking-tighter">₹{stats.target.toLocaleString()}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/5">
                   <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Growth</p>
                   <p className="text-xl font-black text-emerald-400">+0.0%</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[1.5rem] border border-white/5">
                   <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">In-flow</p>
                   <p className="text-xl font-black text-brightx-teal">0%</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => onOpenStatement(selectedMonth, selectedYear)}
                  className="w-full py-5 bg-brightx-teal text-white rounded-[1.5rem] font-black flex items-center justify-center gap-4 hover:brightness-110 transition-all shadow-xl shadow-brightx-teal/20"
                >
                  <Download className="w-5 h-5" /> STATEMENT REPORT
                </button>
                {selectedClass !== 'All' && (
                  <button 
                    onClick={() => onOpenBatchReport('fees', selectedClass, selectedMonth, selectedYear)}
                    className="w-full py-5 bg-white/10 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-4 hover:bg-white/20 transition-all border border-white/10"
                  >
                    <FileText className="w-5 h-5" /> BATCH LEDGER (PDF)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesManager;

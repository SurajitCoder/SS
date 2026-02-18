
import React from 'react';
import { 
  Users, 
  UserCheck, 
  CreditCard, 
  UserX, 
  Bell, 
  Send, 
  TrendingUp, 
  Plus, 
  Layout 
} from 'lucide-react';
import { Student } from '../types';
import StudentAvatar from './StudentAvatar';

interface DashboardProps {
  stats: {
    total: number;
    attendance: number;
    paid: number;
    deactivated: number;
    showReminders: boolean;
    unpaidStudents: Student[];
    currentMonthName: string;
  };
  setActiveTab: (tab: any) => void;
  setIsFormOpen: (open: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, setActiveTab, setIsFormOpen }) => {
  return (
    <section className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-brightx-navy leading-tight">Welcome Back,<br/>Admin.</h1>
          <p className="text-gray-400 font-medium mt-2">Here is what's happening today.</p>
        </div>
        <div className="md:text-right">
          <span className="text-[10px] md:text-xs font-black text-brightx-teal uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Enrolled Students', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Today Attendance', value: stats.attendance, icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Fees Paid (Month)', value: stats.paid, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Archived Accounts', value: stats.deactivated, icon: UserX, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl md:text-3xl font-black text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {stats.showReminders && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-orange-500 p-3 rounded-2xl text-white">
              <Bell className="w-5 h-5 md:w-6 md:h-6 animate-ring" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black text-orange-900">Fee Payment Reminders</h3>
              <p className="text-orange-700 font-medium text-xs md:text-sm">
                Today is past the 12th. {stats.unpaidStudents.length} students pending for {stats.currentMonthName}.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {stats.unpaidStudents.slice(0, 6).map(s => (
              <div key={s.id} className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-between group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <StudentAvatar 
                    iconId={s.profileIcon} 
                    name={s.name} 
                    className="w-8 h-8 flex-shrink-0 bg-orange-100 text-orange-600" 
                    size={16} 
                  />
                  <div className="truncate">
                    <p className="text-sm font-bold text-gray-800 truncate">{s.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.studentClass}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('fees')}
                  className="p-2 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-brightx-navy rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <TrendingUp className="absolute -bottom-10 -right-10 w-32 md:w-48 h-32 md:h-48 opacity-10" />
        <h3 className="text-lg md:text-xl font-black mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 relative z-10">
          <button onClick={() => setIsFormOpen(true)} className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-bold text-sm md:text-base">
            New Admission <Plus className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('classroom')} className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-bold text-sm md:text-base">
            Classroom <Layout className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('fees')} className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all font-bold text-sm md:text-base">
            Collect Fees <CreditCard className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

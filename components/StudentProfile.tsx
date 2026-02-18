
import React from 'react';
import { 
  X, 
  Edit, 
  Trash2, 
  ArrowUpCircle, 
  UserX, 
  MapPin, 
  Phone, 
  Calendar,
  FileText,
  Map,
  CreditCard,
  Target,
  GraduationCap,
  Cake,
  TrendingUp,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { Student } from '../types';
import StudentAvatar from './StudentAvatar';
import { MONTHS, CURRENT_YEAR } from '../constants';

interface StudentProfileProps {
  student: Student;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onPromote: () => void;
  onDeactivate: () => void;
  onOpenReportCard: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ 
  student, onClose, onDelete, onEdit, onPromote, onDeactivate, onOpenReportCard 
}) => {
  const paidCount = student.paidMonths.filter(m => m.startsWith(CURRENT_YEAR.toString())).length;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-brightx-navy/60 backdrop-blur-md animate-in fade-in duration-300 print:hidden">
      <div className="bg-[#F8FAFC] rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[95vh]">
        
        {/* Header Section */}
        <div className="bg-brightx-navy p-8 md:p-12 relative shrink-0">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-xl transition-all">
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="bg-white p-3 rounded-[2rem] shadow-xl shrink-0">
              <StudentAvatar 
                iconId={student.profileIcon}
                name={student.name} 
                className="w-32 h-32 md:w-40 md:h-40 bg-white text-brightx-navy" 
                size={80} 
              />
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{student.name}</h2>
                <span className="px-4 py-1.5 bg-white/20 text-white rounded-full text-xs font-black tracking-widest uppercase backdrop-blur-md border border-white/10">
                  {student.studentClass}
                </span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/60">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/40" />
                  <span className="font-bold">{student.studentPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cake className="w-4 h-4 text-white/40" />
                  <span className="font-bold">{student.dob || 'Not Provided'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 mt-10">
            <button 
              onClick={onOpenReportCard}
              className="flex items-center gap-2 px-6 py-3 bg-brightx-teal text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-brightx-teal/20"
            >
              <FileText className="w-4 h-4" /> Report Card
            </button>
            <button onClick={onPromote} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20">
              <ArrowUpCircle className="w-4 h-4" /> Promote
            </button>
            <button onClick={onEdit} className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button onClick={onDeactivate} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-orange-500/20">
              <UserX className="w-4 h-4" /> Archive
            </button>
            <button onClick={onDelete} className="p-3 bg-red-500 text-white rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-red-500/20">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 no-scrollbar">
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-fit">
              <div className="flex items-center gap-3 mb-6">
                <Map className="w-4 h-4 text-gray-300" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registry Detail</h3>
              </div>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-400 text-xs">Guardian:</span>
                  <span className="font-black text-gray-800 text-sm">{student.guardianName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-400 text-xs">Guardian Phone:</span>
                  <span className="font-black text-gray-800 text-sm">{student.guardianPhone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-400 text-xs">Enrollment Date:</span>
                  <span className="font-black text-gray-800 text-sm">{student.admissionDate || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-start pt-2">
                  <span className="font-bold text-gray-400 text-xs">Address:</span>
                  <span className="font-bold text-gray-800 text-right max-w-[150px] leading-tight break-words text-xs">{student.address || 'Not Provided'}</span>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-1">Monthly Fee</span>
                <span className="text-3xl font-black text-brightx-teal">₹{(student.monthlyFee ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-4 h-4 text-gray-300" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Curriculum Progress</h3>
              </div>
              <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-brightx-teal transition-all duration-1000" 
                  style={{ width: `${student.syllabusProgress || 0}%` }} 
                />
              </div>
              <div className="text-center">
                <span className="text-xs font-black text-brightx-teal uppercase tracking-widest">
                  {student.syllabusProgress || 0}% Certified Complete
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-gray-300" />
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fees ({CURRENT_YEAR})</h3>
                </div>
                <span className="px-3 py-1 bg-brightx-teal/10 text-brightx-teal text-[10px] font-black rounded-full uppercase">
                  {paidCount} Paid
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {MONTHS.map((month, idx) => {
                  const monthId = `${CURRENT_YEAR}-${idx + 1}`;
                  const isPaid = student.paidMonths.includes(monthId);
                  return (
                    <div 
                      key={month} 
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isPaid ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50/50 border-gray-100 text-gray-400'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{month.substring(0, 3)}</span>
                      <div className={`w-3 h-3 rounded-full border-2 ${isPaid ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-6">
            <div className="bg-brightx-navy p-8 rounded-[2rem] shadow-xl text-white min-h-[180px] flex flex-col">
              <div className="flex items-center gap-3 mb-6 opacity-40">
                <Target className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Academic Snapshot</h3>
              </div>
              <div className="flex-1 flex flex-col justify-start">
                 <div className="mb-4">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Guardian Name</p>
                    <p className="text-lg font-black text-white/80">{student.guardianName || 'N/A'}</p>
                 </div>
                 <div className="w-full h-[1px] bg-white/10 mb-4" />
                 <div className="flex-1 flex items-center justify-center italic text-white/30 font-bold">
                  {student.examMarks.length > 0 ? (
                     <div className="w-full space-y-3 italic not-italic">
                        {student.examMarks.slice(0, 3).map((exam, i) => (
                          <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                            <span className="text-xs font-bold text-white/80">{exam.subject}</span>
                            <span className="text-xs font-black text-brightx-teal">{exam.marks}/{exam.total}</span>
                          </div>
                        ))}
                     </div>
                  ) : 'No exam results recorded.'}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-4 h-4 text-gray-300" />
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance Logic</h3>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div className="text-center px-4">
                  <p className="text-4xl font-black text-gray-800">{student.attendance.length}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Days Present</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-4xl font-black text-red-500">{student.absences.length}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Absences</p>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5 opacity-20">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className="h-2.5 bg-gray-200 rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

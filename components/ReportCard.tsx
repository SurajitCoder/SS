
import React from 'react';
import { 
  X, 
  Printer, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Calendar,
  Award,
  Zap,
  Star,
  GraduationCap
} from 'lucide-react';
import { Student } from '../types';
import { CURRENT_YEAR } from '../constants';

interface ReportCardProps {
  student: Student;
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ student, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'D';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4 md:p-10 print:p-0 print:bg-white print:block">
      <div className="fixed top-6 right-10 flex gap-3 print:hidden z-[110]">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-brightx-teal text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl transition-all"
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
        <button 
          onClick={onClose}
          className="p-3 bg-white text-gray-400 hover:text-brightx-navy rounded-2xl shadow-xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white w-full max-w-[850px] shadow-2xl rounded-[1rem] p-10 md:p-16 relative border border-gray-100 print:shadow-none print:p-8 print:border-none print:max-w-none">
        
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-0 mb-4">
            <span className="text-6xl font-black text-brightx-navy tracking-tighter">Bright</span>
            <span className="text-7xl font-black text-brightx-navy tracking-tighter -ml-1 relative z-10">X</span>
            <div className="bg-brightx-teal text-white px-6 py-3 flex items-center justify-center translate-y-2">
              <span className="text-3xl font-black tracking-[0.2em] ml-2">LEARN</span>
            </div>
          </div>
          <h3 className="text-brightx-teal font-black text-sm tracking-[0.3em] uppercase mb-4">Computer Tuition Class</h3>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex flex-wrap justify-center gap-x-4 gap-y-2">
            <span>Computer Science</span> | <span>Computer Application</span> | <span>Artificial Intelligence (AI)</span> | <span>Robotics</span>
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-50 rounded-full px-8 py-3 flex items-center gap-6 border border-gray-100">
            <div className="flex items-center gap-4 border-r border-gray-200 pr-6">
              <GraduationCap className="w-4 h-4 text-brightx-navy" />
              <div className="flex gap-2 text-[9px] font-black text-gray-400 uppercase">
                <span>ICSE</span><span>ISC</span><span>CBSE</span><span>WBBSE</span><span>WBCHSE</span>
              </div>
            </div>
            <div className="bg-brightx-navy text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              Class III - XII
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-16 text-center border-b border-t border-gray-50 py-8">
          <div className="flex flex-col items-center gap-2">
            <MapPin className="w-4 h-4 text-brightx-teal" />
            <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase">
              Bhagabanpur, Near Sporting Club,<br/>Diamond Harbour, Pin-743331
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[11px] font-black text-brightx-navy uppercase">Surajit Halder</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">(Computer Science Teacher)</p>
            <div className="flex items-center gap-2 text-brightx-teal text-[10px] font-bold mt-1 lowercase">
              <Globe className="w-3 h-3" /> brightxlearn.netlify.app
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-gray-700 text-[10px] font-bold">
              <Phone className="w-3 h-3 text-brightx-teal" /> +91 74777 52450
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-[10px] font-bold">
              <Mail className="w-3 h-3 text-brightx-teal" /> brightxlearn@gmail.com
            </div>
          </div>
        </div>

        <div className="flex justify-center -mt-12 mb-12">
          <div className="bg-brightx-navy text-white px-10 py-3 rounded-full shadow-xl">
            <h2 className="text-lg font-black uppercase tracking-[0.2em]">Progress Report {CURRENT_YEAR}</h2>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[2rem] p-10 grid grid-cols-2 gap-x-12 gap-y-6 mb-12 shadow-sm">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Student Name</p>
              <p className="text-2xl font-black text-brightx-navy">{student.name}</p>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Class</p>
                <p className="text-sm font-black text-gray-700">{student.studentClass}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Date of Birth</p>
                <p className="text-sm font-black text-gray-700">{student.dob || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 border-l border-gray-50 pl-12">
            <div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Guardian Name</p>
              <p className="text-lg font-black text-gray-600">{student.guardianName || 'Not Set'}</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Admission Date</p>
                <p className="text-sm font-black text-gray-700">{student.admissionDate}</p>
              </div>
              <div className="text-[9px] font-black text-brightx-teal uppercase tracking-widest border border-brightx-teal/30 px-3 py-1 rounded-md">
                BX-{student.id.toUpperCase().slice(0, 8)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-brightx-teal pl-3">
              <Calendar className="w-5 h-5 text-brightx-teal" />
              <h3 className="text-xs font-black text-brightx-navy uppercase tracking-widest">Attendance Analytics</h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-[1.5rem] p-8 flex justify-around items-center">
              <div className="text-center">
                <p className="text-3xl font-black text-brightx-teal">{student.attendance.length}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Present</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-red-500">{student.absences.length}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Absent</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6 border-l-4 border-brightx-teal pl-3">
              <Award className="w-5 h-5 text-brightx-teal" />
              <h3 className="text-xs font-black text-brightx-navy uppercase tracking-widest">Subject Performance</h3>
            </div>
            <div className="bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-brightx-navy text-white">
                  <tr>
                    <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest">Module Title</th>
                    <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-center">Score</th>
                    <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-right">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {student.examMarks.length > 0 ? student.examMarks.map((exam, i) => (
                    <tr key={i}>
                      <td className="px-6 py-3 font-bold text-gray-700 text-xs">{exam.subject}</td>
                      <td className="px-6 py-3 font-black text-brightx-navy text-xs text-center">{exam.marks}/{exam.total}</td>
                      <td className="px-6 py-3 font-black text-brightx-teal text-xs text-right">
                        {getGrade((exam.marks / exam.total) * 100)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center text-[10px] font-bold text-gray-300 uppercase italic tracking-widest">
                        No exam records available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4 border-l-4 border-brightx-teal pl-3">
            <Star className="w-5 h-5 text-brightx-teal" />
            <h3 className="text-xs font-black text-brightx-navy uppercase tracking-widest">Hall of Fame</h3>
          </div>
          {student.badges && student.badges.length > 0 ? (
            <div className="flex gap-4">
              {student.badges.map((badge, i) => (
                <div key={i} className="flex items-center gap-3 bg-yellow-50 text-yellow-700 px-6 py-3 rounded-2xl border border-yellow-100 shadow-sm">
                  <Award className="w-5 h-5" />
                  <span className="font-black text-[10px] uppercase tracking-widest">{badge}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] font-bold text-gray-300 italic uppercase pl-3">No achievements recorded yet for this session.</p>
          )}
        </div>

        <div className="mb-20">
          <div className="bg-gray-50/50 rounded-[2.5rem] p-10 border-2 border-dashed border-gray-100 relative">
            <p className="absolute -top-3 left-8 bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Instructor Remarks & Assessment</p>
            <div className="h-20" />
            <div className="w-full h-[1px] bg-gray-100 mb-8" />
          </div>
        </div>

        <div className="flex justify-between items-end px-10 relative">
          <div className="absolute right-40 -top-16 opacity-10 rotate-12 select-none print:opacity-20">
            <div className="w-40 h-40 border-[6px] border-brightx-teal rounded-full flex items-center justify-center text-center p-4">
              <span className="text-brightx-teal font-black text-sm uppercase tracking-widest">BrightXLearn Academic Verified</span>
            </div>
          </div>

          <div className="w-64 text-center">
            <div className="w-full h-[1px] bg-gray-300 mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parent / Guardian</p>
          </div>

          <div className="w-80 text-center">
            <div className="w-full h-[2px] bg-brightx-navy mb-4" />
            <p className="text-xs font-black text-brightx-navy uppercase tracking-tight">Surajit Halder</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Principal Educator</p>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-50 flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
          <span>Electronic Progress Report • BrightXLearn Education Group</span>
          <span>Session {CURRENT_YEAR} © {CURRENT_YEAR}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;


import React, { useMemo } from 'react';
import { 
  X, 
  Printer, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  UserCheck,
  Award,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { Student } from '../types';
import { MONTHS } from '../constants';

interface BatchReportProps {
  type: 'attendance' | 'exam' | 'fees';
  selectedClass: string;
  selectedMonth: number;
  selectedYear: number;
  students: Student[];
  onClose: () => void;
}

const BatchReport: React.FC<BatchReportProps> = ({ 
  type, selectedClass, selectedMonth, selectedYear, students, onClose 
}) => {
  const currentMonthName = MONTHS[selectedMonth];
  const monthId = `${selectedYear}-${selectedMonth + 1}`;
  
  const classStudents = useMemo(() => 
    students.filter(s => s.studentClass === selectedClass),
    [students, selectedClass]
  );

  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  const handlePrint = () => {
    window.print();
  };

  const renderAttendanceTable = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-[8px] border-collapse border border-gray-200">
          <thead className="bg-brightx-navy text-white">
            <tr>
              <th className="border border-gray-300 p-2 text-left sticky left-0 bg-brightx-navy">Student Name</th>
              {Array.from({ length: daysInMonth }).map((_, i) => (
                <th key={i} className="border border-gray-300 p-1 text-center min-w-[20px]">{i + 1}</th>
              ))}
              <th className="border border-gray-300 p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.map(student => {
              let presentCount = 0;
              return (
                <tr key={student.id}>
                  <td className="border border-gray-200 p-2 font-black sticky left-0 bg-white">{student.name}</td>
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                    const isPresent = student.attendance?.includes(dateStr);
                    const isAbsent = student.absences?.includes(dateStr);
                    if (isPresent) presentCount++;
                    return (
                      <td key={i} className="border border-gray-200 p-1 text-center font-bold">
                        {isPresent ? 'P' : isAbsent ? 'A' : '-'}
                      </td>
                    );
                  })}
                  <td className="border border-gray-200 p-2 text-center font-black bg-gray-50 text-brightx-teal">{presentCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderExamTable = () => {
    // Get all unique subjects for THIS month for this class
    const monthlyExams = classStudents.flatMap(s => 
      s.examMarks.filter(m => {
        const examDate = new Date(m.date);
        return examDate.getMonth() === selectedMonth && examDate.getFullYear() === selectedYear;
      })
    );

    const subjects = Array.from(new Set(monthlyExams.map(m => m.subject)));
    
    return (
      <table className="w-full text-xs border-collapse border border-gray-200">
        <thead className="bg-brightx-navy text-white">
          <tr>
            <th className="border border-gray-300 p-3 text-left">Student Name</th>
            {subjects.map(sub => <th key={sub} className="border border-gray-300 p-3 text-center">{sub}</th>)}
            <th className="border border-gray-300 p-3 text-center">Month Avg %</th>
          </tr>
        </thead>
        <tbody>
          {classStudents.map(student => {
            let totalPerc = 0;
            let count = 0;
            return (
              <tr key={student.id}>
                <td className="border border-gray-200 p-3 font-black">{student.name}</td>
                {subjects.map(sub => {
                  const mark = student.examMarks.find(m => {
                    const examDate = new Date(m.date);
                    return m.subject === sub && examDate.getMonth() === selectedMonth && examDate.getFullYear() === selectedYear;
                  });
                  if (mark) {
                    const p = Math.round((mark.marks / mark.total) * 100);
                    totalPerc += p;
                    count++;
                    return <td key={sub} className="border border-gray-200 p-3 text-center font-bold">{mark.marks}/{mark.total}</td>;
                  }
                  return <td key={sub} className="border border-gray-200 p-3 text-center text-gray-300">-</td>;
                })}
                <td className="border border-gray-200 p-3 text-center font-black bg-gray-50 text-brightx-teal">
                  {count > 0 ? `${Math.round(totalPerc / count)}%` : '0%'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const renderFeesTable = () => {
    return (
      <table className="w-full text-xs border-collapse border border-gray-200">
        <thead className="bg-brightx-navy text-white">
          <tr>
            <th className="border border-gray-300 p-4 text-left">Student Name</th>
            <th className="border border-gray-300 p-4 text-center">Amount (₹)</th>
            <th className="border border-gray-300 p-4 text-center">Payment Status</th>
            <th className="border border-gray-300 p-4 text-center">Payment Date</th>
            <th className="border border-gray-300 p-4 text-center">Student Phone</th>
          </tr>
        </thead>
        <tbody>
          {classStudents.map(student => {
            const isPaid = student.paidMonths?.includes(monthId);
            const payDate = student.paymentRecords?.[monthId];
            return (
              <tr key={student.id}>
                <td className="border border-gray-200 p-4 font-black">{student.name}</td>
                <td className="border border-gray-200 p-4 text-center font-bold">₹{(student.monthlyFee ?? 0).toLocaleString()}</td>
                <td className={`border border-gray-200 p-4 text-center font-black ${isPaid ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isPaid ? 'PAID' : 'DUE'}
                </td>
                <td className="border border-gray-200 p-4 text-center font-bold text-gray-600">
                  {isPaid ? (payDate || 'N/A') : '-'}
                </td>
                <td className="border border-gray-200 p-4 text-center text-gray-500">{student.studentPhone}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const reportTitles = {
    attendance: 'Monthly Attendance Registry',
    exam: 'Monthly Performance Review',
    fees: 'Monthly Collection Ledger'
  };

  const icons = {
    attendance: UserCheck,
    exam: Award,
    fees: CreditCard
  };

  const Icon = icons[type];

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-start justify-center overflow-y-auto p-4 md:p-10 print:p-0 print:bg-white print:block">
      <div className="fixed top-6 right-10 flex gap-3 print:hidden z-[130]">
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-brightx-teal text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl"
        >
          <Printer className="w-4 h-4" /> Print Document
        </button>
        <button 
          onClick={onClose}
          className="p-3 bg-white text-gray-400 hover:text-brightx-navy rounded-2xl shadow-xl"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white w-full max-w-[1100px] shadow-2xl rounded-[1rem] p-10 md:p-16 relative border border-gray-100 print:shadow-none print:p-4 print:border-none print:max-w-none">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-0 mb-4">
            <span className="text-5xl font-black text-brightx-navy tracking-tighter">Bright</span>
            <span className="text-6xl font-black text-brightx-navy tracking-tighter -ml-1 relative z-10">X</span>
            <div className="bg-brightx-teal text-white px-5 py-2.5 flex items-center justify-center translate-y-2">
              <span className="text-2xl font-black tracking-[0.2em] ml-2">LEARN</span>
            </div>
          </div>
          <h3 className="text-brightx-teal font-black text-[10px] tracking-[0.4em] uppercase mb-4">Computer Tuition Excellence</h3>
        </div>

        {/* Report Identification */}
        <div className="flex justify-between items-end border-b-2 border-brightx-navy pb-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-5 h-5 text-brightx-teal" />
              <h2 className="text-xl font-black text-brightx-navy uppercase tracking-widest">{reportTitles[type]}</h2>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {selectedClass} • {currentMonthName} {selectedYear}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Generation Date</p>
            <p className="text-sm font-black text-gray-700">{new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[400px]">
          {type === 'attendance' && renderAttendanceTable()}
          {type === 'exam' && renderExamTable()}
          {type === 'fees' && renderFeesTable()}
        </div>

        {/* Signatures */}
        <div className="mt-20 flex justify-between items-end px-10">
          <div className="text-[8px] font-black text-gray-300 uppercase leading-relaxed max-w-[250px]">
             BrightXLearn Education Hub • Verified Academic Records © {selectedYear} • This document is an official record of session {currentMonthName} for class {selectedClass}.
          </div>
          <div className="w-64 text-center">
             <div className="w-full h-[2px] bg-brightx-navy mb-4" />
             <p className="text-[10px] font-black text-brightx-navy uppercase tracking-[0.2em]">Authorized Administrator</p>
             <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">Surajit Halder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchReport;

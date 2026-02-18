
import React, { useState, useMemo, useEffect } from 'react';
import { 
  UserCheck, 
  Award, 
  BookOpen, 
  ClipboardList, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Search,
  FileText,
  Users,
  Calendar,
  Info,
  ChevronRight,
  UserMinus,
  Circle,
  Download,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { Student, SyllabusTopic } from '../types';
import { CLASSES, MONTHS } from '../constants';

interface ClassroomManagementProps {
  students: Student[];
  onSaveAttendance: (date: string, presentIds: string[], absentIds: string[], targetClass: string) => void;
  onSaveMarks: (targetClass: string, subject: string, date: string, marksData: { studentId: string, marks: number, total: number }[]) => void;
  syllabusTopics: SyllabusTopic[];
  onAddSyllabusTopic: (title: string, targetClass: string) => void;
  onToggleSyllabusTopic: (id: string) => void;
  onDeleteSyllabusTopic: (id: string) => void;
  onOpenReport: (type: 'attendance' | 'exam' | 'fees', targetClass: string, month: number, year: number) => void;
}

const ClassroomManagement: React.FC<ClassroomManagementProps> = ({
  students,
  onSaveAttendance,
  onSaveMarks,
  syllabusTopics,
  onAddSyllabusTopic,
  onToggleSyllabusTopic,
  onDeleteSyllabusTopic,
  onOpenReport
}) => {
  const [selectedClass, setSelectedClass] = useState('Class 3');
  const [activeTab, setActiveTab] = useState<'attendance' | 'exam' | 'report' | 'syllabus'>('attendance');
  
  // Reporting context
  const [reportMonth, setReportMonth] = useState(new Date().getMonth());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const [absentIds, setAbsentIds] = useState<string[]>([]);

  // Reset selection state when class or date changes to avoid cross-batch contamination
  useEffect(() => {
    setPresentIds([]);
    setAbsentIds([]);
  }, [selectedClass, attendanceDate]);

  // Exam state
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalMarks, setTotalMarks] = useState(100);
  const [marksData, setMarksData] = useState<Record<string, number>>({});

  // Syllabus state
  const [newTopic, setNewTopic] = useState('');

  // Filter students for the selected class
  const classStudents = useMemo(() => 
    students.filter(s => s.studentClass === selectedClass),
    [students, selectedClass]
  );

  const classSyllabus = useMemo(() => 
    syllabusTopics.filter(t => t.targetClass === selectedClass),
    [syllabusTopics, selectedClass]
  );

  const handleSaveAttendance = () => {
    if (classStudents.length === 0) {
      alert('No students found in this class to record attendance.');
      return;
    }
    onSaveAttendance(attendanceDate, presentIds, absentIds, selectedClass);
    alert('Attendance data submitted successfully!');
  };

  const handleSaveMarks = () => {
    if (classStudents.length === 0) {
      alert('No students found in this class to record marks.');
      return;
    }
    if (!examSubject.trim()) {
      alert('Please enter a subject name');
      return;
    }
    const formattedData = classStudents.map(s => ({
      studentId: s.id,
      marks: marksData[s.id] || 0,
      total: totalMarks
    }));
    onSaveMarks(selectedClass, examSubject, examDate, formattedData);
    setExamSubject('');
    setMarksData({});
    alert('Exam marks submitted successfully!');
  };

  const yearOptions = useMemo(() => {
    const years = [];
    const startYear = Math.min(2024, new Date().getFullYear());
    const endYear = new Date().getFullYear() + 10;
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  }, []);

  const unmarkedCount = Math.max(0, classStudents.length - (presentIds.length + absentIds.length));

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brightx-navy tracking-tight">Classroom Control</h1>
          <p className="text-gray-400 font-bold mt-1">{selectedClass} batch management.</p>
        </div>
        
        {/* Class Selector Bar */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {CLASSES.map(c => {
            const classNum = c.split(' ')[1];
            return (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-[11px] font-black transition-all ${
                  selectedClass === c 
                    ? 'bg-brightx-teal text-white shadow-lg shadow-brightx-teal/30 scale-110' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {classNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
        {[
          { id: 'attendance', label: 'ATTENDANCE', icon: UserCheck },
          { id: 'exam', label: 'EXAMS', icon: Award },
          { id: 'report', label: 'REPORT', icon: FileText },
          { id: 'syllabus', label: 'SYLLABUS', icon: BookOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 pb-4 text-[10px] font-black tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-brightx-teal text-brightx-teal' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Canvas */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 min-h-[600px]">
        
        {activeTab === 'attendance' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-2 duration-300">
            {/* Control Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-2xl font-black text-brightx-navy">Attendance Register</h2>
                <p className="text-sm text-gray-400 font-bold">Mark students as Present or Absent</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 px-6 py-3 rounded-2xl flex items-center gap-4 border border-gray-100">
                  <input 
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="bg-transparent text-sm font-black text-gray-700 outline-none cursor-pointer"
                  />
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <button 
                  onClick={handleSaveAttendance}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" /> SUBMIT DATA
                </button>
              </div>
            </div>

            {/* Attendance Analytics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-100 p-6 rounded-[1.5rem] flex flex-col gap-2">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Total Students</p>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-2xl font-black text-gray-800">{classStudents.length}</span>
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-[1.5rem] flex flex-col gap-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-emerald-500">Present</p>
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-2xl font-black text-gray-800">{presentIds.length}</span>
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-[1.5rem] flex flex-col gap-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-red-500">Absent</p>
                <div className="flex items-center gap-3">
                  <UserMinus className="w-4 h-4 text-red-500" />
                  <span className="text-2xl font-black text-gray-800">{absentIds.length}</span>
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-6 rounded-[1.5rem] flex flex-col gap-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Unmarked</p>
                <div className="flex items-center gap-3">
                  <Circle className="w-4 h-4 text-gray-300" />
                  <span className="text-2xl font-black text-gray-800">{unmarkedCount}</span>
                </div>
              </div>
            </div>

            {/* Register List */}
            <div className="space-y-4">
              {classStudents.length > 0 ? (
                <>
                  <div className="px-8 flex text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    <span className="w-32">Selection</span>
                    <span className="flex-1">Student Information</span>
                    <span className="w-32 text-right">Student ID</span>
                  </div>

                  {classStudents.map(student => {
                    const isPresent = presentIds.includes(student.id);
                    const isAbsent = absentIds.includes(student.id);
                    return (
                      <div key={student.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] flex items-center gap-8 hover:bg-gray-50/30 transition-all group">
                        <div className="flex gap-2 w-32">
                          <button 
                            onClick={() => {
                              setPresentIds(prev => isPresent ? prev.filter(id => id !== student.id) : [...prev, student.id]);
                              setAbsentIds(prev => prev.filter(id => id !== student.id));
                            }}
                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all flex items-center justify-center ${
                              isPresent ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-gray-50 text-gray-400'
                            }`}
                          >
                            {isPresent ? <CheckCircle2 className="w-5 h-5" /> : 'P'}
                          </button>
                          <button 
                            onClick={() => {
                              setAbsentIds(prev => isAbsent ? prev.filter(id => id !== student.id) : [...prev, student.id]);
                              setPresentIds(prev => prev.filter(id => id !== student.id));
                            }}
                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all flex items-center justify-center ${
                              isAbsent ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-50 text-gray-400'
                            }`}
                          >
                            {isAbsent ? <CheckCircle2 className="w-5 h-5" /> : 'A'}
                          </button>
                        </div>

                        <div className="flex-1 flex flex-col">
                          <span className="font-black text-brightx-navy text-lg group-hover:text-brightx-teal transition-colors">{student.name}</span>
                          <span className="text-[10px] font-bold text-gray-400">{student.studentPhone}</span>
                        </div>

                        <div className="w-32 text-right">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">BX-{student.id.toUpperCase().slice(0, 8)}</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4 grayscale opacity-40">
                  <Users className="w-16 h-16 text-gray-300" />
                  <div>
                    <p className="text-xl font-black text-brightx-navy">No students enrolled</p>
                    <p className="text-sm font-bold text-gray-400">There are no active students in {selectedClass} yet.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction Tip */}
            {classStudents.length > 0 && (
              <div className="bg-indigo-50/50 p-6 rounded-[2rem] flex gap-4 items-center">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                  <Info className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-bold text-indigo-900/60 leading-relaxed italic">
                  Tip: Selecting "P" marks them as Present. Selecting "A" marks them as Absent for today's record. You can change your selection before clicking "Submit Data".
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-2 duration-300">
            {/* Download Buttons Section */}
            <div className="bg-brightx-navy p-10 rounded-[3rem] flex flex-col gap-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
               
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brightx-teal/20 rounded-2xl flex items-center justify-center border border-brightx-teal/30">
                      <Download className="w-7 h-7 text-brightx-teal" />
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-black tracking-tight">Generate Batch Reports</h3>
                      <p className="text-white/50 text-xs font-bold mt-1">Select period and type to download printable documents</p>
                    </div>
                 </div>

                 {/* Period Selectors */}
                 <div className="flex flex-wrap items-center gap-4 bg-white/5 p-2 rounded-[1.5rem] border border-white/5">
                    <div className="relative">
                      <select 
                        value={reportMonth}
                        onChange={(e) => setReportMonth(Number(e.target.value))}
                        className="pl-4 pr-10 py-2.5 bg-transparent text-white text-xs font-black appearance-none outline-none cursor-pointer"
                      >
                        {MONTHS.map((m, i) => <option key={m} value={i} className="text-black">{m}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
                    </div>
                    <div className="w-[1px] h-6 bg-white/10" />
                    <div className="relative">
                      <select 
                        value={reportYear}
                        onChange={(e) => setReportYear(Number(e.target.value))}
                        className="pl-4 pr-10 py-2.5 bg-transparent text-white text-xs font-black appearance-none outline-none cursor-pointer"
                      >
                        {yearOptions.map(y => <option key={y} value={y} className="text-black">{y}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 pointer-events-none" />
                    </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  <button 
                    onClick={() => onOpenReport('attendance', selectedClass, reportMonth, reportYear)}
                    className="bg-white/10 hover:bg-white text-white hover:text-brightx-navy p-6 rounded-[1.5rem] font-black text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 group"
                  >
                    <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" /> Attendance Report
                  </button>
                  <button 
                    onClick={() => onOpenReport('exam', selectedClass, reportMonth, reportYear)}
                    className="bg-white/10 hover:bg-white text-white hover:text-brightx-navy p-6 rounded-[1.5rem] font-black text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 group"
                  >
                    <Award className="w-5 h-5 group-hover:scale-110 transition-transform" /> Exam Performance
                  </button>
                  <button 
                    onClick={() => onOpenReport('fees', selectedClass, reportMonth, reportYear)}
                    className="bg-brightx-teal/80 hover:bg-white text-white hover:text-brightx-navy p-6 rounded-[1.5rem] font-black text-[11px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-4 group shadow-lg shadow-brightx-teal/20"
                  >
                    <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" /> Batch Fee Ledger
                  </button>
               </div>
            </div>

            {/* Class Selection for Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {CLASSES.map(c => {
                const classTopics = syllabusTopics.filter(t => t.targetClass === c);
                const progress = classTopics.length > 0 ? Math.round((classTopics.filter(t => t.completed).length / classTopics.length) * 100) : 0;
                const isActive = selectedClass === c;
                return (
                  <button 
                    key={c}
                    onClick={() => setSelectedClass(c)}
                    className={`p-6 rounded-[1.5rem] border text-left transition-all relative overflow-hidden group ${
                      isActive ? 'border-brightx-teal bg-white shadow-lg' : 'border-gray-50 bg-gray-50/30'
                    }`}
                  >
                    <div className={`absolute right-0 top-0 w-1 h-full ${isActive ? 'bg-brightx-teal' : 'bg-transparent'}`} />
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">{c}</p>
                    <p className="text-2xl font-black text-gray-800">{progress}%</p>
                  </button>
                );
              })}
            </div>

            {/* Detailed Student Performance List */}
            <div className="space-y-6">
              <div className="px-8 flex text-[10px] font-black text-gray-300 uppercase tracking-widest">
                <span className="flex-1">Student</span>
                <span className="w-32 text-center">Sessions</span>
                <span className="w-32 text-center">Avg. Score</span>
                <span className="w-48 text-right">Status</span>
              </div>

              {classStudents.map(student => {
                const avgScore = student.examMarks.length > 0 ? Math.round(student.examMarks.reduce((acc, curr) => acc + (curr.marks / curr.total), 0) / student.examMarks.length * 100) : 0;
                return (
                  <div key={student.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] flex items-center gap-8 hover:bg-gray-50/30 transition-all group">
                    <div className="flex-1 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-gray-300" />
                      </div>
                      <span className="font-black text-gray-700">{student.name}</span>
                    </div>
                    
                    <div className="w-32 text-center font-black text-gray-400">{student.attendance.length}</div>
                    
                    <div className="w-32 text-center font-black text-brightx-teal">{avgScore}%</div>

                    <div className="w-48 flex items-center gap-4 justify-end">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brightx-teal" style={{ width: `${student.syllabusProgress}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-gray-300">{student.syllabusProgress}%</span>
                    </div>
                  </div>
                );
              })}

              {classStudents.length === 0 && (
                <div className="py-20 text-center text-gray-300 italic font-bold">
                  No student records available for {selectedClass}.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
            <div>
              <h2 className="text-2xl font-black text-brightx-navy">Bulk Exam Entry</h2>
              <p className="text-sm text-gray-400 font-bold">Record examination scores for the entire batch.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject Title</label>
                <input 
                  type="text" 
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-brightx-teal outline-none font-bold text-gray-700"
                  placeholder="e.g., Python GUI Basics"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Exam Date</label>
                <input 
                  type="date" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-brightx-teal outline-none font-bold text-gray-700"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Marks</label>
                <input 
                  type="number" 
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-brightx-teal outline-none font-bold text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-4">
              {classStudents.length > 0 ? classStudents.map(s => (
                <div key={s.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] flex items-center justify-between group">
                  <span className="font-black text-gray-700">{s.name}</span>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number"
                      value={marksData[s.id] || ''}
                      onChange={(e) => setMarksData(prev => ({ ...prev, [s.id]: Number(e.target.value) }))}
                      className="w-24 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none font-black text-right text-brightx-navy"
                      placeholder="Score"
                    />
                    <span className="text-[10px] font-black text-gray-300 uppercase">/ {totalMarks}</span>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-gray-300 italic font-bold">No students in this class.</div>
              )}
            </div>

            <button 
              onClick={handleSaveMarks}
              disabled={classStudents.length === 0}
              className="w-full mt-10 bg-brightx-navy text-white py-5 rounded-[2rem] font-black shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Award className="w-5 h-5" /> SAVE ALL EXAM RECORDS
            </button>
          </div>
        )}

        {activeTab === 'syllabus' && (
           <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-brightx-navy">Syllabus Tracker</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-brightx-teal">{classSyllabus.length} Modules</span>
                </div>
             </div>
             
             <form onSubmit={(e) => {
               e.preventDefault();
               if(newTopic.trim()) { onAddSyllabusTopic(newTopic, selectedClass); setNewTopic(''); }
             }} className="flex gap-4">
               <input 
                 type="text" 
                 value={newTopic}
                 onChange={e => setNewTopic(e.target.value)}
                 className="flex-1 px-8 py-4 bg-gray-50 rounded-[2rem] border border-gray-100 outline-none font-bold"
                 placeholder="Enter new syllabus module title..."
               />
               <button className="bg-brightx-navy text-white px-10 py-4 rounded-[2rem] font-black text-xs tracking-widest">ADD</button>
             </form>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {classSyllabus.map(topic => (
                 <div key={topic.id} className="p-6 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => onToggleSyllabusTopic(topic.id)}
                         className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${topic.completed ? 'bg-brightx-teal text-white' : 'bg-gray-50 text-gray-300 border border-gray-100'}`}
                       >
                         <CheckCircle2 className="w-4 h-4" />
                       </button>
                       <span className={`font-bold ${topic.completed ? 'text-gray-300 line-through' : 'text-gray-800'}`}>{topic.title}</span>
                    </div>
                    <button onClick={() => onDeleteSyllabusTopic(topic.id)} className="p-2 text-gray-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
               {classSyllabus.length === 0 && (
                 <div className="col-span-full py-10 text-center text-gray-300 font-bold italic">No syllabus modules defined yet for {selectedClass}.</div>
               )}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomManagement;


import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Users, 
  CreditCard, 
  Plus, 
  ShieldCheck,
  Award,
  LayoutDashboard,
  Clock,
  Layout,
  History,
  Menu,
  Download,
  Upload,
  RefreshCw,
  Cloud,
  CheckCircle,
  AlertCircle,
  X as CloseIcon,
  LogOut
} from 'lucide-react';
import { Student, StudentStatus, Schedule, SyllabusTopic, AuditLogEntry } from './types';
import { ADMIN_PASSWORD, CLASSES, MONTHS, CURRENT_YEAR } from './constants';
import StudentForm from './components/StudentForm';
import StudentProfile from './components/StudentProfile';
import ClassroomManagement from './components/ClassroomManagement';
import FeesManager from './components/FeesManager';
import DeactivatedAccounts from './components/DeactivatedAccounts';
import SecurityModal from './components/SecurityModal';
import DailySchedule from './components/DailySchedule';
import Dashboard from './components/Dashboard';
import ReportCard from './components/ReportCard';
import IncomeStatement from './components/IncomeStatement';
import BatchReport from './components/BatchReport';

const STORAGE_KEY = 'BRIGHTXLEARN_DATA_V4';
// Public persistent key-value store for cross-device sync
const SYNC_API = 'https://kvdb.io/A9p7u8s8w8e8r8t8y27pYyR9p7u/'; 

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [syncKey, setSyncKey] = useState(localStorage.getItem('BX_SYNC_KEY') || '');
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'directory' | 'classroom' | 'fees' | 'deactivated' | 'schedule' | 'sync'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [syllabusTopics, setSyllabusTopics] = useState<SyllabusTopic[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [reportCardStudentId, setReportCardStudentId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const isInitialMount = useRef(true);

  // Load initial data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setStudents(parsed.students || []);
      setSchedules(parsed.schedules || []);
      setSyllabusTopics(parsed.syllabusTopics || []);
      setAuditLogs(parsed.auditLogs || []);
    }
  }, []);

  // Sync / Save Function
  const saveToStorage = useCallback((st: Student[], sch: Schedule[], syl: SyllabusTopic[], logs: AuditLogEntry[]) => {
    const dataString = JSON.stringify({ students: st, schedules: sch, syllabusTopics: syl, auditLogs: logs });
    localStorage.setItem(STORAGE_KEY, dataString);
  }, []);

  // Auto-Push to Cloud when state changes (Debounced)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!syncKey || !isLoggedIn) return;

    const timer = setTimeout(async () => {
      setIsSyncing(true);
      try {
        const data = { students, schedules, syllabusTopics, auditLogs };
        await fetch(`${SYNC_API}${syncKey}`, {
          method: 'POST',
          body: JSON.stringify(data)
        });
        setLastSynced(new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Auto-sync failed", e);
      } finally {
        setIsSyncing(false);
      }
    }, 2000); // 2 second debounce to prevent excessive API calls

    return () => clearTimeout(timer);
  }, [students, schedules, syllabusTopics, auditLogs, syncKey, isLoggedIn]);

  const addAuditLog = useCallback((event: string) => {
    const newEntry: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      event,
      timestamp: new Date().toLocaleString()
    };
    setAuditLogs(prev => {
      const updated = [newEntry, ...prev].slice(0, 200);
      saveToStorage(students, schedules, syllabusTopics, updated);
      return updated;
    });
  }, [students, schedules, syllabusTopics, saveToStorage]);

  const handlePullSync = async (targetKey?: string) => {
    const key = targetKey || syncKey;
    if (!key) return;
    
    setIsSyncing(true);
    try {
      const res = await fetch(`${SYNC_API}${key}`);
      if (!res.ok) throw new Error("Key not found");
      const data = await res.json();
      setStudents(data.students || []);
      setSchedules(data.schedules || []);
      setSyllabusTopics(data.syllabusTopics || []);
      setAuditLogs(data.auditLogs || []);
      saveToStorage(data.students, data.schedules, data.syllabusTopics, data.auditLogs);
      setLastSynced(new Date().toLocaleTimeString());
      return true;
    } catch (e) {
      console.error("Cloud pull failed", e);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      if (syncKey) {
        localStorage.setItem('BX_SYNC_KEY', syncKey);
        await handlePullSync(syncKey); // Pull data from cloud immediately on login
      }
      setIsLoggedIn(true);
      addAuditLog("Admin Logged In");
    } else {
      alert("Invalid Admin Password!");
    }
  };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [securityModal, setSecurityModal] = useState<{ isOpen: boolean; action: () => void } | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);

  const [isIncomeStatementOpen, setIsIncomeStatementOpen] = useState(false);
  const [statementContext, setStatementContext] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });

  const [batchReportState, setBatchReportState] = useState<{
    isOpen: boolean;
    type: 'attendance' | 'exam' | 'fees';
    targetClass: string;
    month: number;
    year: number;
  }>({
    isOpen: false,
    type: 'attendance',
    targetClass: 'Class 3',
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  const addOrUpdateStudent = (data: any) => {
    let updatedStudents: Student[];
    if (editingStudent) {
      updatedStudents = students.map(s => s.id === editingStudent.id ? { ...s, ...data } : s);
      addAuditLog(`Updated profile: ${data.name}`);
    } else {
      const newStudent: Student = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        status: StudentStatus.ACTIVE,
        paidMonths: [],
        attendance: [],
        absences: [],
        examMarks: [],
        syllabusProgress: 0,
        badges: []
      };
      updatedStudents = [...students, newStudent];
      addAuditLog(`New Admission: ${data.name}`);
    }
    setStudents(updatedStudents);
    saveToStorage(updatedStudents, schedules, syllabusTopics, auditLogs);
    setIsFormOpen(false);
    setEditingStudent(undefined);
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setSecurityModal({
      isOpen: true,
      action: () => {
        addAuditLog(`Permanent Delete: ${student?.name}`);
        const updated = students.filter(s => s.id !== id);
        setStudents(updated);
        saveToStorage(updated, schedules, syllabusTopics, auditLogs);
        setSelectedStudentId(null);
      }
    });
  };

  const toggleFeeStatus = (studentId: string, month: string) => {
    const student = students.find(s => s.id === studentId);
    if (student?.paidMonths.includes(month)) {
      setSecurityModal({
        isOpen: true,
        action: () => {
          addAuditLog(`Unchecked fee for ${student?.name} (${month})`);
          const updated = students.map(s => {
            if (s.id === studentId) {
              const newRecords = { ...(s.paymentRecords || {}) };
              delete newRecords[month];
              return { ...s, paidMonths: s.paidMonths.filter(m => m !== month), paymentRecords: newRecords };
            }
            return s;
          });
          setStudents(updated);
          saveToStorage(updated, schedules, syllabusTopics, auditLogs);
        }
      });
    } else {
      addAuditLog(`Fee Paid: ${student?.name} for ${month}`);
      const updated = students.map(s => {
        if (s.id === studentId) {
          const today = new Date().toISOString().split('T')[0];
          return { ...s, paidMonths: [...(s.paidMonths || []), month], paymentRecords: { ...(s.paymentRecords || {}), [month]: today } };
        }
        return s;
      });
      setStudents(updated);
      saveToStorage(updated, schedules, syllabusTopics, auditLogs);
    }
  };

  // Fix: Added missing updateAttendance function
  const updateAttendance = (date: string, presentIds: string[], absentIds: string[], targetClass: string) => {
    const updated = students.map(s => {
      if (s.studentClass === targetClass) {
        let attendance = [...(s.attendance || [])];
        let absences = [...(s.absences || [])];
        attendance = attendance.filter(d => d !== date);
        absences = absences.filter(d => d !== date);
        if (presentIds.includes(s.id)) attendance.push(date);
        else if (absentIds.includes(s.id)) absences.push(date);
        return { ...s, attendance, absences };
      }
      return s;
    });
    setStudents(updated);
    saveToStorage(updated, schedules, syllabusTopics, auditLogs);
    addAuditLog(`Attendance recorded for ${targetClass} on ${date}`);
  };

  // Fix: Added missing updateBulkMarks function
  const updateBulkMarks = (targetClass: string, subject: string, date: string, marksData: { studentId: string, marks: number, total: number }[]) => {
    const updated = students.map(s => {
      const markEntry = marksData.find(m => m.studentId === s.id);
      if (markEntry) {
        const newMarks = [...(s.examMarks || []), { subject, marks: markEntry.marks, total: markEntry.total, date }];
        return { ...s, examMarks: newMarks };
      }
      return s;
    });
    setStudents(updated);
    saveToStorage(updated, schedules, syllabusTopics, auditLogs);
    addAuditLog(`Exam marks updated for ${targetClass}: ${subject}`);
  };

  // Fix: Added missing addSyllabusTopic function
  const addSyllabusTopic = (title: string, targetClass: string) => {
    const newTopic: SyllabusTopic = { id: Math.random().toString(36).substr(2, 9), title, completed: false, targetClass };
    const updated = [...syllabusTopics, newTopic];
    setSyllabusTopics(updated);
    saveToStorage(students, schedules, updated, auditLogs);
    addAuditLog(`Added syllabus topic: ${title} for ${targetClass}`);
  };

  // Fix: Added missing toggleSyllabusTopic function
  const toggleSyllabusTopic = (id: string) => {
    const updated = syllabusTopics.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setSyllabusTopics(updated);
    saveToStorage(students, schedules, updated, auditLogs);
  };

  // Fix: Added missing deleteSyllabusTopic function
  const deleteSyllabusTopic = (id: string) => {
    const updated = syllabusTopics.filter(t => t.id !== id);
    setSyllabusTopics(updated);
    saveToStorage(students, schedules, updated, auditLogs);
  };

  // Fix: Added missing handleOpenBatchReport function
  const handleOpenBatchReport = (type: 'attendance' | 'exam' | 'fees', targetClass: string, month: number, year: number) => {
    setBatchReportState({ isOpen: true, type, targetClass, month, year });
  };

  // Fix: Added missing handleOpenStatement function
  const handleOpenStatement = (month: number, year: number) => {
    setStatementContext({ month, year });
    setIsIncomeStatementOpen(true);
  };

  // Fix: Added missing addSchedule function
  const addSchedule = (sch: any) => {
    const newSchedule: Schedule = { ...sch, id: Math.random().toString(36).substr(2, 9), completed: false };
    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    saveToStorage(students, updated, syllabusTopics, auditLogs);
    addAuditLog(`Task Added: ${sch.title}`);
  };

  // Fix: Added missing deleteSchedule function
  const deleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    setSchedules(updated);
    saveToStorage(students, updated, syllabusTopics, auditLogs);
  };

  // Fix: Added missing toggleSchedule function
  const toggleSchedule = (id: string) => {
    const updated = schedules.map(s => s.id === id ? { ...s, completed: !s.completed } : s);
    setSchedules(updated);
    saveToStorage(students, updated, syllabusTopics, auditLogs);
  };

  // Fix: Added missing promoteStudent function
  const promoteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    const currentIndex = CLASSES.indexOf(student.studentClass);
    if (currentIndex < CLASSES.length - 1) {
      const nextClass = CLASSES[currentIndex + 1];
      const updated = students.map(s => s.id === id ? { ...s, studentClass: nextClass } : s);
      setStudents(updated);
      saveToStorage(updated, schedules, syllabusTopics, auditLogs);
      addAuditLog(`Promoted ${student.name} to ${nextClass}`);
    }
  };

  // Fix: Added missing toggleDeactivation function
  const toggleDeactivation = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    const newStatus = student.status === StudentStatus.ACTIVE ? StudentStatus.DEACTIVATED : StudentStatus.ACTIVE;
    const updated = students.map(s => s.id === id ? { ...s, status: newStatus } : s);
    setStudents(updated);
    saveToStorage(updated, schedules, syllabusTopics, auditLogs);
    addAuditLog(`${newStatus === StudentStatus.ACTIVE ? 'Reactivated' : 'Archived'}: ${student.name}`);
  };

  const activeStudents = useMemo(() => students.filter(s => s.status === StudentStatus.ACTIVE), [students]);
  const deactivatedStudents = useMemo(() => students.filter(s => s.status === StudentStatus.DEACTIVATED), [students]);
  const filteredStudents = useMemo(() => activeStudents.filter(s => (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentPhone.includes(searchTerm)) && (classFilter === 'All' || s.studentClass === classFilter)), [activeStudents, searchTerm, classFilter]);

  const dashboardStats = useMemo(() => {
    const monthId = `${CURRENT_YEAR}-${new Date().getMonth() + 1}`;
    return {
      total: activeStudents.length,
      attendance: activeStudents.filter(s => (s.attendance || []).includes(new Date().toISOString().split('T')[0])).length,
      paid: activeStudents.filter(s => (s.paidMonths || []).includes(monthId)).length,
      deactivated: deactivatedStudents.length,
      showReminders: new Date().getDate() >= 12,
      unpaidStudents: activeStudents.filter(s => !(s.paidMonths || []).includes(monthId)),
      currentMonthName: MONTHS[new Date().getMonth()]
    };
  }, [activeStudents, deactivatedStudents]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brightx-navy px-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-10">
            <h1 className="text-4xl font-black text-brightx-navy mb-2 tracking-tighter">Bright<span className="bg-brightx-teal text-white px-2 ml-1">X</span></h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Admin Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Center Access Key</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-brightx-teal outline-none transition-all font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cloud Sync ID (Optional)</label>
              <input 
                type="text" 
                value={syncKey}
                onChange={(e) => setSyncKey(e.target.value.toUpperCase().replace(/\s/g, ''))}
                placeholder="Enter Center Sync ID..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-brightx-teal outline-none transition-all font-black tracking-widest text-brightx-teal"
              />
              <p className="text-[9px] text-gray-400 font-bold italic px-1">Tip: Enter your ID to load data from your other devices.</p>
            </div>
            <button type="submit" className="w-full bg-brightx-navy hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
              {isSyncing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              ENTER DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  const Logo = () => (
    <div className="flex items-center gap-0 select-none scale-75 origin-left">
      <span className="text-3xl font-black text-brightx-navy tracking-tighter">Bright</span>
      <span className="text-4xl font-black text-brightx-navy tracking-tighter -ml-0.5 mr-[-0.2em] relative z-10">X</span>
      <div className="bg-brightx-teal text-white px-4 py-2 flex items-center justify-center translate-y-1">
        <span className="text-xl font-black tracking-[0.2em] ml-2">LEARN</span>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-gray-200 z-50 transition-transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-8 flex items-center justify-between">
          <Logo />
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400"><CloseIcon className="w-6 h-6" /></button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
            { id: 'directory', icon: Users, label: 'Students' },
            { id: 'classroom', icon: Layout, label: 'Classroom' },
            { id: 'fees', icon: CreditCard, label: 'Accounts' },
            { id: 'schedule', icon: Clock, label: 'Schedule' },
            { id: 'sync', icon: Cloud, label: 'Cloud Config' },
            { id: 'deactivated', icon: History, label: 'Archives' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-brightx-navy text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-brightx-teal' : ''}`} /> 
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-100">
           <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm">
             <LogOut className="w-5 h-5" /> Logout Center
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="lg:hidden"><Logo /></div>
          <div className="hidden lg:flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
               {isSyncing ? 'Syncing Cloud...' : `Cloud Saved ${lastSynced || ''}`}
             </span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-brightx-navy bg-gray-50 rounded-xl"><Menu className="w-6 h-6" /></button>
        </header>

        <div className="flex-1 p-4 md:p-10 overflow-auto">
          {activeTab === 'dashboard' && <Dashboard stats={dashboardStats} setActiveTab={setActiveTab} setIsFormOpen={setIsFormOpen} />}
          {activeTab === 'directory' && (
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-black text-brightx-navy">Student Registry</h1>
                <button onClick={() => { setEditingStudent(undefined); setIsFormOpen(true); }} className="bg-brightx-teal text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 font-black shadow-lg">
                  <Plus className="w-5 h-5" /> NEW ADMISSION
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredStudents.map(student => (
                  <div key={student.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 cursor-pointer" onClick={() => setSelectedStudentId(student.id)}>
                    <h3 className="text-xl font-black text-gray-800 truncate">{student.name}</h3>
                    <p className="text-xs text-gray-400 font-bold mb-4">{student.studentClass}</p>
                    <p className="text-[10px] font-black text-brightx-teal uppercase tracking-widest">{student.studentPhone}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'classroom' && (
            <ClassroomManagement 
              students={activeStudents} 
              onSaveAttendance={updateAttendance} 
              onSaveMarks={updateBulkMarks} 
              syllabusTopics={syllabusTopics}
              onAddSyllabusTopic={addSyllabusTopic}
              onToggleSyllabusTopic={toggleSyllabusTopic}
              onDeleteSyllabusTopic={deleteSyllabusTopic}
              onOpenReport={handleOpenBatchReport}
            />
          )}
          {activeTab === 'fees' && <FeesManager students={activeStudents} onToggleFee={toggleFeeStatus} onOpenStatement={handleOpenStatement} onOpenBatchReport={handleOpenBatchReport} />}
          {activeTab === 'schedule' && <DailySchedule schedules={schedules} onAdd={addSchedule} onDelete={deleteSchedule} onToggle={toggleSchedule} />}
          {activeTab === 'sync' && (
            <section className="max-w-2xl mx-auto space-y-10">
              <div className="text-center">
                <Cloud className="w-16 h-16 text-brightx-teal mx-auto mb-4" />
                <h1 className="text-3xl font-black text-brightx-navy">Cloud Sync Config</h1>
                <p className="text-gray-400 font-medium">Manage how your data travels between devices.</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Center ID</label>
                   <input 
                     type="text" 
                     value={syncKey}
                     onChange={(e) => setSyncKey(e.target.value.toUpperCase().replace(/\s/g, ''))}
                     className="w-full px-8 py-5 bg-gray-50 rounded-2xl font-black tracking-widest text-brightx-navy text-xl outline-none border-2 border-transparent focus:border-brightx-teal"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handlePullSync()} className="bg-brightx-navy text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3">
                    <Download className="w-5 h-5" /> RE-SYNC NOW
                  </button>
                  <button onClick={() => addAuditLog("Manual Push Triggered")} className="bg-brightx-teal text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3">
                    <Upload className="w-5 h-5" /> FORCE SAVE
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {isFormOpen && <StudentForm onClose={() => setIsFormOpen(false)} onSubmit={addOrUpdateStudent} initialData={editingStudent} />}
      {selectedStudentId && (
        <StudentProfile 
          student={students.find(s => s.id === selectedStudentId)!}
          onClose={() => setSelectedStudentId(null)}
          onDelete={() => deleteStudent(selectedStudentId)}
          onEdit={() => { setEditingStudent(students.find(s => s.id === selectedStudentId)); setIsFormOpen(true); setSelectedStudentId(null); }}
          onPromote={() => promoteStudent(selectedStudentId)}
          onDeactivate={() => { toggleDeactivation(selectedStudentId); setSelectedStudentId(null); }}
          onOpenReportCard={() => setReportCardStudentId(selectedStudentId)}
        />
      )}
      {reportCardStudentId && <ReportCard student={students.find(s => s.id === reportCardStudentId)!} onClose={() => setReportCardStudentId(null)} />}
      {isIncomeStatementOpen && <IncomeStatement students={activeStudents} onClose={() => setIsIncomeStatementOpen(false)} selectedMonth={statementContext.month} selectedYear={statementContext.year} />}
      {batchReportState.isOpen && <BatchReport type={batchReportState.type} selectedClass={batchReportState.targetClass} selectedMonth={batchReportState.month} selectedYear={batchReportState.year} students={activeStudents} onClose={() => setBatchReportState(prev => ({ ...prev, isOpen: false }))} />}
      {securityModal && <SecurityModal isOpen={securityModal.isOpen} onConfirm={() => { securityModal.action(); setSecurityModal(null); }} onClose={() => setSecurityModal(null)} />}
    </div>
  );
};

export default App;

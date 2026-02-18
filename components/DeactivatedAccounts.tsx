
import React from 'react';
import { History, RotateCcw, UserX } from 'lucide-react';
import { Student, AuditLogEntry } from '../types';
import StudentAvatar from './StudentAvatar';

interface DeactivatedAccountsProps {
  students: Student[];
  auditLogs: AuditLogEntry[];
  onReactivate: (id: string) => void;
}

const DeactivatedAccounts: React.FC<DeactivatedAccountsProps> = ({ students, auditLogs, onReactivate }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black text-brightx-navy">Archives</h2>
          <p className="text-gray-400 font-medium">Recently deactivated student profiles.</p>
        </div>
        
        <div className="space-y-4">
          {students.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <StudentAvatar name={s.name} className="w-12 h-12 bg-gray-100 text-gray-300 grayscale" size={24} />
                <div>
                  <p className="font-bold text-gray-400 line-through">{s.name}</p>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{s.studentClass}</p>
                </div>
              </div>
              <button 
                onClick={() => onReactivate(s.id)}
                className="p-3 bg-brightx-teal/10 text-brightx-teal hover:bg-brightx-teal hover:text-white rounded-xl transition-all shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          ))}
          {students.length === 0 && (
            <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
              <UserX className="w-12 h-12 mb-4" />
              <p className="font-bold">Archives are currently empty.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black text-brightx-navy">Audit Logs</h2>
          <p className="text-gray-400 font-medium">Historical system activity tracking.</p>
        </div>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden max-h-[600px] overflow-y-auto">
          <div className="space-y-6">
            {auditLogs.map(log => (
              <div key={log.id} className="flex gap-4 group">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-brightx-teal group-hover:scale-150 transition-transform" />
                  <div className="w-[1px] h-full bg-gray-100" />
                </div>
                <div>
                  <p className="text-xs font-black text-brightx-navy leading-tight mb-1">{log.event}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactivatedAccounts;


import React, { useState } from 'react';
import { Clock, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Schedule } from '../types';

interface DailyScheduleProps {
  schedules: Schedule[];
  onAdd: (sch: any) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ schedules, onAdd, onDelete, onToggle }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<'training' | 'admin'>('training');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title, time, type, date: new Date().toISOString() });
      setTitle('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-black text-brightx-navy">Daily Training Schedule</h1>
        <p className="text-gray-400 font-medium mt-2">Plan and track your batch timings and admin tasks.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Task / Batch Title</label>
          <input 
            type="text" 
            placeholder="e.g., Python Advanced Batch"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-brightx-teal outline-none font-bold"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Time</label>
          <input 
            type="time" 
            value={time}
            onChange={e => setTime(e.target.value)}
            className="w-full px-5 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-brightx-teal outline-none font-bold"
          />
        </div>
        <button type="submit" className="bg-brightx-navy text-white h-12 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> ADD TASK
        </button>
      </form>

      <div className="space-y-4">
        {schedules.map(sch => (
          <div key={sch.id} className={`bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm group transition-all ${sch.completed ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-6">
              <button onClick={() => onToggle(sch.id)} className={`transition-all ${sch.completed ? 'text-brightx-teal' : 'text-gray-200'}`}>
                {sch.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
              </button>
              <div>
                <h3 className={`font-black text-lg ${sch.completed ? 'line-through text-gray-400' : 'text-brightx-navy'}`}>{sch.title}</h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{sch.time}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => onDelete(sch.id)}
              className="p-3 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySchedule;


import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  User, 
  GraduationCap, 
  Monitor, 
  Cpu, 
  Zap, 
  Star, 
  Heart, 
  Shield, 
  Ghost, 
  Coffee, 
  Camera, 
  Smartphone, 
  Code2, 
  Terminal, 
  Bot
} from 'lucide-react';
import { Student } from '../types';
import { CLASSES } from '../constants';

interface StudentFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Student;
}

const PROFILE_ICONS = [
  { id: 'user', icon: User },
  { id: 'grad', icon: GraduationCap },
  { id: 'monitor', icon: Monitor },
  { id: 'cpu', icon: Cpu },
  { id: 'zap', icon: Zap },
  { id: 'star', icon: Star },
  { id: 'heart', icon: Heart },
  { id: 'shield', icon: Shield },
  { id: 'ghost', icon: Ghost },
  { id: 'coffee', icon: Coffee },
  { id: 'camera', icon: Camera },
  { id: 'phone', icon: Smartphone },
  { id: 'code', icon: Code2 },
  { id: 'terminal', icon: Terminal },
  { id: 'bot', icon: Bot },
];

const StudentForm: React.FC<StudentFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    dob: initialData?.dob || '',
    guardianName: initialData?.guardianName || '',
    studentPhone: initialData?.studentPhone || '',
    guardianPhone: initialData?.guardianPhone || '',
    address: initialData?.address || '',
    studentClass: initialData?.studentClass || 'Class 3',
    admissionDate: initialData?.admissionDate || new Date().toISOString().split('T')[0],
    monthlyFee: initialData?.monthlyFee || 0,
    profileIcon: initialData?.profileIcon || 'user',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.dob) newErrors.dob = "Date of Birth is required";
    if (!formData.guardianName.trim()) newErrors.guardianName = "Guardian Name is required";
    
    if (!formData.studentPhone) {
      newErrors.studentPhone = "Student phone is required";
    } else if (!phoneRegex.test(formData.studentPhone)) {
      newErrors.studentPhone = "Must be exactly 10 digits";
    }

    if (!formData.guardianPhone) {
      newErrors.guardianPhone = "Guardian phone is required";
    } else if (!phoneRegex.test(formData.guardianPhone)) {
      newErrors.guardianPhone = "Must be exactly 10 digits";
    }

    if (formData.monthlyFee === undefined || formData.monthlyFee <= 0) {
      newErrors.monthlyFee = "Monthly fee is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block";
  const inputStyle = (field: string) => `w-full px-5 py-3 bg-white border ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl outline-none focus:border-brightx-navy focus:ring-1 focus:ring-brightx-navy transition-all font-bold text-gray-700 placeholder:text-gray-300`;

  const handlePhoneInput = (value: string) => {
    // Only numbers and max 10 digits
    return value.replace(/\D/g, '').slice(0, 10);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-brightx-navy/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[1.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[95vh]">
        <div className="bg-brightx-navy p-6 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-white">{initialData ? 'Update Profile' : 'Student Admission'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 no-scrollbar">
          <div>
            <label className={labelStyle}>Select Profile Identity</label>
            <div className="flex flex-wrap gap-3">
              {PROFILE_ICONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, profileIcon: item.id })}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    formData.profileIcon === item.id 
                      ? 'bg-brightx-teal text-white shadow-lg shadow-brightx-teal/30 scale-110' 
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label className={labelStyle}>Student Full Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className={inputStyle('name')}
                placeholder="Ex: John Doe"
              />
              {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.name}</p>}
            </div>

            <div>
              <label className={labelStyle}>Guardian Phone (10-digit) *</label>
              <input 
                type="tel" 
                maxLength={10}
                value={formData.guardianPhone}
                onChange={e => setFormData({...formData, guardianPhone: handlePhoneInput(e.target.value)})}
                className={inputStyle('guardianPhone')}
                placeholder="10 digit number"
              />
              {errors.guardianPhone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.guardianPhone}</p>}
            </div>

            <div>
              <label className={labelStyle}>Date of Birth *</label>
              <input 
                type="date" 
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
                className={inputStyle('dob')}
              />
              {errors.dob && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.dob}</p>}
            </div>

            <div>
              <label className={labelStyle}>Academic Class</label>
              <select 
                value={formData.studentClass}
                onChange={e => setFormData({...formData, studentClass: e.target.value})}
                className={inputStyle('studentClass')}
              >
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Guardian Name *</label>
              <input 
                type="text" 
                value={formData.guardianName}
                onChange={e => setFormData({...formData, guardianName: e.target.value})}
                className={inputStyle('guardianName')}
                placeholder="Father/Mother name"
              />
              {errors.guardianName && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.guardianName}</p>}
            </div>

            <div>
              <label className={labelStyle}>Admission Date</label>
              <input 
                type="date" 
                value={formData.admissionDate}
                onChange={e => setFormData({...formData, admissionDate: e.target.value})}
                className={inputStyle('admissionDate')}
              />
            </div>

            <div>
              <label className={labelStyle}>Student Phone (10-digit) *</label>
              <input 
                type="tel" 
                maxLength={10}
                value={formData.studentPhone}
                onChange={e => setFormData({...formData, studentPhone: handlePhoneInput(e.target.value)})}
                className={inputStyle('studentPhone')}
                placeholder="10 digit number"
              />
              {errors.studentPhone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.studentPhone}</p>}
            </div>

            <div>
              <label className={labelStyle}>Monthly Fee (₹) *</label>
              <input 
                type="number" 
                value={formData.monthlyFee}
                onChange={e => setFormData({...formData, monthlyFee: Number(e.target.value)})}
                className={inputStyle('monthlyFee')}
                placeholder="0"
              />
              {errors.monthlyFee && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.monthlyFee}</p>}
            </div>

            <div className="col-span-full">
              <label className={labelStyle}>Address Detail</label>
              <textarea 
                rows={3}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className={`${inputStyle('address')} resize-none`}
                placeholder="Street name, landmark..."
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 flex gap-4 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-50 text-gray-500 font-black hover:bg-gray-50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="flex-[1.5] bg-brightx-navy text-white py-4 px-6 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" /> {initialData ? 'Update Record' : 'Confirm Admission'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;

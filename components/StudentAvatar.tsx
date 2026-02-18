
import React from 'react';
import { 
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

interface StudentAvatarProps {
  iconId?: string;
  name: string;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<string, any> = {
  user: User,
  grad: GraduationCap,
  monitor: Monitor,
  cpu: Cpu,
  zap: Zap,
  star: Star,
  heart: Heart,
  shield: Shield,
  ghost: Ghost,
  coffee: Coffee,
  camera: Camera,
  phone: Smartphone,
  code: Code2,
  terminal: Terminal,
  bot: Bot,
};

const StudentAvatar: React.FC<StudentAvatarProps> = ({ 
  iconId, 
  name, 
  className = "", 
  size = 20 
}) => {
  const IconComponent = iconId ? ICON_MAP[iconId] : null;
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  return (
    <div className={`rounded-xl flex items-center justify-center shrink-0 overflow-hidden font-black ${className}`}>
      {IconComponent ? (
        <IconComponent size={size} />
      ) : (
        <span style={{ fontSize: `${size / 2}px` }}>{initials}</span>
      )}
    </div>
  );
};

export default StudentAvatar;

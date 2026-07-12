export interface StaffMember {
  name: string;
  isHead: boolean;
  role?: string;
}

export interface Shift {
  time: string;
  leadsAndMembers: StaffMember[];
  location: string;
}

export interface ProtocolStep {
  title: string;
  description: string;
  action: string;
  badge?: string;
  badgeType?: 'info' | 'warning' | 'danger';
}

export interface FirstAidItem {
  id: string;
  title: string;
  iconName: string;
  isCritical: boolean;
  category: 'injury' | 'emergency' | 'general' | 'illness';
  symptoms?: string[];
  guideline: string[];
  extraNote?: string;
  contactImmediate?: boolean;
}

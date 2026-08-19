export type RoleType = 
  | 'club_president'
  | 'staff_hussein'
  | 'staff_mousa'
  | 'staff_musleh'
  | 'admin';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: RoleType;
  clubName?: string;
  staffId?: string;
  title: string;
  email: string;
  phone?: string;
  office?: string;
  avatarBg?: string;
  password?: string;
  bio?: string;
  category?: string;
  membersCount?: number;
  socialHandle?: string;
  statusAvailability?: 'available' | 'busy' | 'away';
  isCustom?: boolean;
}

export type TaskStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'needs_info';

export type RequestStatus = 
  | 'submitted'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type DepartmentId = 
  // حسين رمضان
  | 'transport'
  | 'housing_services'
  | 'electrical'
  | 'it'
  | 'events_buildings'
  // موسى آل سنان
  | 'halls_venues'
  | 'announcements'
  | 'printing'
  | 'pr_media'
  // مصلح الشمراني
  | 'security'
  | 'catering';

export interface StaffMember {
  id: string;
  name: string;
  shortName: string;
  roleCode: RoleType;
  title: string;
  phone: string;
  email: string;
  office: string;
  avatarBg: string;
  departmentIds: DepartmentId[];
  notes?: string;
  sharedWithStudents: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  departmentId: DepartmentId;
  staffId: string;
  iconName: string;
  description: string;
  fields: ServiceField[];
  restrictedToVip?: boolean;
}

export interface SecurityGuestEntry {
  id: string;
  name: string; // الاسم
  nationalId: string; // الهوية / الإقامة
  plateNumber: string; // رقم اللوحة بالإنجليزي فقط
  carType: string; // نوع السيارة
  carModel: string; // الموديل
  carColor: string; // اللون
  ownerName: string; // اسم المالك
  companionsCount: number; // عدد المرافقين
}

export interface ServiceField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'time' | 'checkbox' | 'file';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: any;
  unit?: string;
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorRole: RoleType;
  message: string;
  timestamp: string;
  isInternal?: boolean;
}

export interface Task {
  id: string;
  requestId: string;
  serviceId: string;
  serviceName: string;
  departmentId: DepartmentId;
  departmentName: string;
  staffId: string;
  staffName: string;
  status: TaskStatus;
  priority: 'normal' | 'high' | 'urgent';
  details: Record<string, any>;
  notes?: string;
  completionDate?: string;
  rejectionReason?: string;
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ClubRequest {
  id: string;
  requestNumber: string;
  clubName: string;
  presidentName: string;
  presidentPhone: string;
  presidentEmail: string;
  eventTitle: string;
  eventType: 'workshop' | 'hackathon' | 'exhibition' | 'lecture' | 'sports' | 'trip' | 'other';
  eventDate: string;
  startTime: string;
  endTime: string;
  locationSummary: string;
  expectedAttendees: number;
  description: string;
  budget?: string;
  status: RequestStatus;
  tasks: Task[];
  hasOfficialLetter?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  targetRole: RoleType | 'all';
  requestId?: string;
  taskId?: string;
  timestamp: string;
  read: boolean;
  type: 'new_request' | 'status_change' | 'comment' | 'alert';
}

export interface DepartmentInfo {
  id: DepartmentId;
  name: string;
  staffId: string;
  staffName: string;
  icon: string;
  color: string;
  badgeBg: string;
  description: string;
  note?: string;
}

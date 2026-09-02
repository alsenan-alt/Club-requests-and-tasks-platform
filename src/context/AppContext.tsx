import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  RoleType, 
  ClubRequest, 
  Task, 
  TaskStatus, 
  NotificationItem, 
  StaffMember,
  RequestStatus,
  UserAccount,
  ServiceItem,
  ServiceField,
  DepartmentId
} from '../types';
import { 
  STAFF_MEMBERS, 
  DEPARTMENTS, 
  AVAILABLE_SERVICES, 
  INITIAL_REQUESTS, 
  INITIAL_NOTIFICATIONS,
  USER_ACCOUNTS,
  CLUBS_LIST 
} from '../data/initialData';
import { fetchGistDatabase, pushGistDatabase, GistDatabasePayload } from '../services/gistSyncService';
import { 
  TRANSLATIONS, 
  Language, 
  translateDynamic, 
  translateServiceData, 
  translateDepartmentData, 
  translateFieldLabel, 
  translateOptionValue, 
  translateUnit 
} from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
  tDynamic: (text: any) => string;
  tService: (serviceId: string, originalName?: string, originalDesc?: string) => { name: string; description: string };
  tDepartment: (deptId: string, originalName?: string, originalDesc?: string) => { name: string; description: string };
  tField: (fieldIdOrLabel: string, fallback?: string) => string;
  tOption: (option: string) => string;
  tUnit: (unit?: string) => string;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
  currentUser: UserAccount | null;
  userAccounts: UserAccount[];
  login: (userId: string) => void;
  validateAndLogin: (userIdOrUsername: string, passwordInput: string) => { success: boolean; message?: string };
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; message: string };
  logout: () => void;
  registerNewClubPresident: (formData: {
    clubName: string;
    presidentName: string;
    username: string;
    password?: string;
    email: string;
    phone: string;
    supervisorId?: string;
    supervisorName?: string;
    category?: string;
    office?: string;
    bio?: string;
  }) => UserAccount;
  registerNewSupervisor: (formData: {
    name: string;
    title?: string;
    department?: string;
    email?: string;
    phone?: string;
    username?: string;
    password?: string;
    office?: string;
    bio?: string;
    supervisedClubNames?: string[];
  }) => UserAccount;
  deleteClubAccount: (clubUserId: string) => { success: boolean; message: string };
  deleteSupervisorAccount: (supervisorId: string) => { success: boolean; message: string };
  updateUserProfile: (updatedFields: Partial<UserAccount>, targetUserId?: string) => void;
  approveRequestBySupervisor: (requestId: string, supervisorNotes?: string) => void;
  rejectRequestBySupervisor: (requestId: string, reason: string) => void;
  requestChangesBySupervisor: (requestId: string, notes: string) => void;
  currentRole: RoleType;
  currentStaff: StaffMember | undefined;
  staffMembers: StaffMember[];
  activeClubName: string;
  clubsList: string[];
  requests: ClubRequest[];
  visibleRequests: ClubRequest[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  createNewRequest: (formData: {
    clubName?: string;
    presidentName?: string;
    presidentPhone?: string;
    presidentEmail?: string;
    eventTitle: string;
    eventType: any;
    eventDate: string;
    startTime: string;
    endTime: string;
    locationSummary: string;
    expectedAttendees: number;
    description: string;
    budget?: string;
    servicesData: Record<string, { serviceId: string; priority: 'normal' | 'high' | 'urgent'; details: Record<string, any> }>;
  }) => ClubRequest;
  createSingleServiceRequest: (
    serviceId: string, 
    details: Record<string, any>, 
    clubName?: string, 
    presidentName?: string, 
    eventTitle?: string, 
    eventDate?: string, 
    priority?: 'normal' | 'high' | 'urgent'
  ) => ClubRequest;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus, notes?: string, commentText?: string) => void;
  addTaskComment: (taskId: string, message: string) => void;
  addTaskDetail: (taskId: string, label: string, value: any) => void;
  deleteTaskDetail: (taskId: string, keyOrLabel: string) => void;
  updateTaskDetail: (taskId: string, keyOrLabel: string, value: any) => void;
  updateTaskExternalUrl: (taskId: string, externalUrl: string) => void;
  addGuestToTask: (taskId: string, guest: any) => void;
  removeGuestFromTask: (taskId: string, guestId: string) => void;
  deleteTask: (taskId: string) => { success: boolean; message: string };
  deleteRequest: (requestId: string) => { success: boolean; message: string };
  services: ServiceItem[];
  updateServiceInfo: (serviceId: string, updates: { name?: string; description?: string; iconName?: string; restrictedToVip?: boolean }) => { success: boolean; message: string };
  addServiceField: (serviceId: string, newField: ServiceField) => { success: boolean; message: string };
  updateServiceField: (serviceId: string, fieldId: string, updatedField: Partial<ServiceField>) => { success: boolean; message: string };
  deleteServiceField: (serviceId: string, fieldId: string) => { success: boolean; message: string };
  resetServiceToDefault: (serviceId?: string) => void;
  addNewCustomService: (serviceData: { name: string; departmentId: DepartmentId; description: string; iconName?: string; staffId?: string; restrictedToVip?: boolean; fields?: ServiceField[] }) => { success: boolean; service: ServiceItem; message: string };
  deleteService: (serviceId: string) => { success: boolean; message: string };
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  isNewRequestModalOpen: boolean;
  setIsNewRequestModalOpen: (open: boolean) => void;
  isQuickServiceModalOpen: boolean;
  setIsQuickServiceModalOpen: (open: boolean) => void;
  activeQuickServiceId: string | null;
  setActiveQuickServiceId: (id: string | null) => void;
  isUserProfileModalOpen: boolean;
  setIsUserProfileModalOpen: (open: boolean) => void;
  isSyncModalOpen: boolean;
  setIsSyncModalOpen: (open: boolean) => void;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncTime: string | null;
  syncError: string | null;
  triggerManualSync: () => Promise<void>;
  triggerManualPush: () => Promise<void>;
  resetToSampleData: () => void;
  currentAcademicYear: string;
  setCurrentAcademicYear: (year: string) => void;
  clearAllRequests: (options?: { academicYear?: string; archiveReason?: string }) => { success: boolean; message: string };
  portalTheme: string;
  setPortalTheme: (themeId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: 'club_app_language_v2',
  USER: 'club_auth_user_v2',
  ACCOUNTS: 'club_accounts_list_v2',
  REQUESTS: 'club_requests_app_v2',
  NOTIFICATIONS: 'club_notifications_app_v2',
  SERVICES: 'club_services_config_v2',
  DELETED_SERVICES: 'club_deleted_services_ids_v2',
  ACADEMIC_YEAR: 'club_current_academic_year_v2',
  LAST_MODIFIED: 'club_last_modified_timestamp_v2',
  PORTAL_THEME: 'club_portal_theme_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language State (ar / en)
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (saved === 'ar' || saved === 'en') return saved;
    } catch (e) {
      console.error(e);
    }
    return 'ar';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const dir: 'rtl' | 'ltr' = language === 'ar' ? 'rtl' : 'ltr';
  const isRtl = language === 'ar';

  const t = (key: string, defaultText?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return defaultText || key;
  };

  const tDynamic = (text: any): string => {
    return translateDynamic(text, language);
  };

  const tService = (serviceId: string, originalName?: string, originalDesc?: string) => {
    return translateServiceData(serviceId, language, originalName, originalDesc);
  };

  const tDepartment = (deptId: string, originalName?: string, originalDesc?: string) => {
    return translateDepartmentData(deptId, language, originalName, originalDesc);
  };

  const tField = (fieldIdOrLabel: string, fallback?: string): string => {
    return translateFieldLabel(fieldIdOrLabel, language, fallback);
  };

  const tOption = (option: string): string => {
    return translateOptionValue(option, language);
  };

  const tUnit = (unit?: string): string => {
    return translateUnit(unit, language);
  };

  // Portal Theme State (Customizable by Admin & users)
  const [portalTheme, setPortalThemeState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTAL_THEME);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return 'emerald';
  });

  const setPortalTheme = (themeId: string) => {
    setPortalThemeState(themeId);
    localStorage.setItem(STORAGE_KEYS.PORTAL_THEME, themeId);
  };

  // Academic Year State
  const [currentAcademicYear, setCurrentAcademicYearState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACADEMIC_YEAR);
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return '1447-1448هـ (2026-2027)';
  });

  const setCurrentAcademicYear = (year: string) => {
    setCurrentAcademicYearState(year);
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_YEAR, year);
    markLocalDataModified();
  };

  // Accounts State (including custom registered clubs & supervisors)
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) {
        const parsed: UserAccount[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const parsedIds = new Set(parsed.map(u => u.id));
          // Missing defaults (especially supervisors and clubs from USER_ACCOUNTS)
          const missingDefaults = USER_ACCOUNTS.filter(u => !parsedIds.has(u.id));
          // Also ensure any existing account in USER_ACCOUNTS is merged with full metadata if old structure had missing fields
          const updatedParsed = parsed.map(u => {
            const defaultAcc = USER_ACCOUNTS.find(d => d.id === u.id);
            if (defaultAcc) {
              return {
                ...defaultAcc,
                ...u,
                supervisedClubNames: u.supervisedClubNames || defaultAcc.supervisedClubNames,
                supervisorId: u.supervisorId || defaultAcc.supervisorId,
                supervisorName: u.supervisorName || defaultAcc.supervisorName,
              };
            }
            return u;
          });
          return [...updatedParsed, ...missingDefaults];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return USER_ACCOUNTS;
  });

  // Services Catalog & Fields Configuration State
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_SERVICES);
      const deletedIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];
      const deletedSet = new Set(deletedIds);

      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed: ServiceItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out explicitly deleted services
          const filteredParsed = parsed.filter(s => !deletedSet.has(s.id));
          const existingIds = new Set(filteredParsed.map(s => s.id));
          // Only add default services that have not been explicitly deleted
          const missingDefaults = AVAILABLE_SERVICES.filter(s => !existingIds.has(s.id) && !deletedSet.has(s.id));
          const merged = filteredParsed.map(s => {
            if (s.id === 'srv_catering_vip') {
              return { ...s, restrictedToVip: false };
            }
            return s;
          });
          return [...merged, ...missingDefaults];
        }
      }
      return AVAILABLE_SERVICES.filter(s => !deletedSet.has(s.id));
    } catch (e) {
      console.error(e);
    }
    return AVAILABLE_SERVICES;
  });

  // Authentication State - Default to null so the Start Page is ALWAYS the secure Login Portal
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [requests, setRequests] = useState<ClubRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isQuickServiceModalOpen, setIsQuickServiceModalOpen] = useState(false);
  const [activeQuickServiceId, setActiveQuickServiceId] = useState<string | null>(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Cloud Gist Sync State
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isInitialHydrated, setIsInitialHydrated] = useState(false);

  // Helper to record local modification timestamp
  const markLocalDataModified = () => {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, String(now));
    return now;
  };

  // Function to pull latest data from Gist with smart conflict prevention
  const pullFromCloudGist = async (isBackground = false) => {
    if (!isBackground) setCloudSyncStatus('syncing');
    setSyncError(null);
    try {
      const result = await fetchGistDatabase();
      if (result.success && result.data) {
        const cloudData = result.data;
        const cloudTime = cloudData.lastUpdated ? new Date(cloudData.lastUpdated).getTime() : 0;
        
        const localSavedTimestampStr = localStorage.getItem(STORAGE_KEYS.LAST_MODIFIED);
        const localTime = localSavedTimestampStr ? parseInt(localSavedTimestampStr, 10) : 0;

        // If local modifications are newer than what came from cloud, preserve local edits and push to cloud!
        if (localTime > cloudTime + 1000) {
          console.log('Local changes are newer than cloud data. Preserving local modifications & pushing to sync.');
          pushToCloudGist();
          setIsInitialHydrated(true);
          return;
        }

        // Cloud is newer or equal, safely sync
        if (Array.isArray(cloudData.requests)) {
          setRequests(cloudData.requests);
          localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(cloudData.requests));
        }
        if (Array.isArray(cloudData.userAccounts) && cloudData.userAccounts.length > 0) {
          setUserAccounts(cloudData.userAccounts);
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(cloudData.userAccounts));
        }
        if (Array.isArray(cloudData.services) && cloudData.services.length > 0) {
          const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_SERVICES);
          const deletedIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];
          const deletedSet = new Set(deletedIds);

          const filteredCloudServices = cloudData.services.filter(s => !deletedSet.has(s.id));
          const existingIds = new Set(filteredCloudServices.map(s => s.id));
          const missingDefaults = AVAILABLE_SERVICES.filter(s => !existingIds.has(s.id) && !deletedSet.has(s.id));
          const normalized = filteredCloudServices.map(s => {
            if (s.id === 'srv_catering_vip') {
              return { ...s, restrictedToVip: false };
            }
            return s;
          });
          const mergedServices = [...normalized, ...missingDefaults];
          setServices(mergedServices);
          localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(mergedServices));
        }
        if (Array.isArray(cloudData.notifications)) {
          setNotifications(cloudData.notifications);
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(cloudData.notifications));
        }
        
        const newTimestamp = cloudTime || Date.now();
        localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, String(newTimestamp));

        const nowFormatted = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(nowFormatted);
        setCloudSyncStatus('synced');
      } else if (result.error) {
        setSyncError(result.error);
        setCloudSyncStatus('error');
      }
    } catch (e: any) {
      console.error('Error in pullFromCloudGist:', e);
      setSyncError(e.message || 'فشل الاتصال بـ GitHub Gist');
      setCloudSyncStatus('error');
    } finally {
      setIsInitialHydrated(true);
    }
  };

  // Function to push full local state to Gist
  const pushToCloudGist = async (customPayload?: GistDatabasePayload) => {
    setCloudSyncStatus('syncing');
    setSyncError(null);
    try {
      const nowIso = new Date().toISOString();
      const nowTimestamp = Date.now();

      const payload: GistDatabasePayload = customPayload || {
        version: 2,
        lastUpdated: nowIso,
        updatedBy: currentUser?.name || 'مستخدم النظام',
        requests,
        userAccounts,
        services,
        notifications,
        clubsList: CLUBS_LIST,
      };

      // Mark local timestamp
      localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, String(nowTimestamp));

      const pushRes = await pushGistDatabase(payload, currentUser?.name);
      if (pushRes.success) {
        const nowFormatted = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(nowFormatted);
        setCloudSyncStatus('synced');
        setSyncError(null);
      } else {
        setSyncError(pushRes.error || 'تم حفظ البيانات محلياً وجاري المزامنة');
        // Do not switch to error if local data is safely intact in localStorage
        setCloudSyncStatus('synced');
      }
    } catch (e: any) {
      console.warn('Push exception:', e);
      setSyncError(e.message || 'تم حفظ البيانات محلياً');
      setCloudSyncStatus('synced');
    }
  };

  // Initial mount: Pull cloud data from Gist
  useEffect(() => {
    pullFromCloudGist(false);
  }, []);

  // Periodic polling every 30 seconds for cross-device live sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && cloudSyncStatus !== 'syncing') {
        pullFromCloudGist(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [cloudSyncStatus]);

  // Debounced auto-save to Gist when state changes (after initial hydration)
  useEffect(() => {
    if (!isInitialHydrated) return;

    const timer = setTimeout(() => {
      const payload: GistDatabasePayload = {
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser?.name || 'تحديث تلقائي',
        requests,
        userAccounts,
        services,
        notifications,
        clubsList: CLUBS_LIST,
      };
      
      pushGistDatabase(payload, currentUser?.name).then(res => {
        if (res.success) {
          const nowFormatted = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          setLastSyncTime(nowFormatted);
          setCloudSyncStatus('synced');
        }
      }).catch(err => {
        console.warn('Background Gist push failed:', err);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [requests, userAccounts, services, notifications, isInitialHydrated]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  const login = (userId: string) => {
    const found = userAccounts.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      setSelectedRequestId(null);
    }
  };

  const validateAndLogin = (userIdOrUsername: string, passwordInput: string): { success: boolean; message?: string } => {
    const trimmedInput = (passwordInput || '').trim();
    const found = userAccounts.find(u => u.id === userIdOrUsername || u.username === userIdOrUsername || u.role === userIdOrUsername);
    
    if (!found) {
      return { success: false, message: 'لم يتم العثور على الحساب المحدد' };
    }

    const expectedPassword = (found.password || '123').trim();
    if (trimmedInput !== expectedPassword) {
      return { success: false, message: 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى' };
    }

    setCurrentUser(found);
    setSelectedRequestId(null);
    return { success: true };
  };

  const changePassword = (oldPassword: string, newPassword: string): { success: boolean; message: string } => {
    if (!currentUser) {
      return { success: false, message: 'لا يوجد مستخدم مسجل حالياً' };
    }

    const currentActualPassword = (currentUser.password || '123').trim();
    if (oldPassword.trim() !== currentActualPassword) {
      return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };
    }

    if (!newPassword || newPassword.trim().length < 3) {
      return { success: false, message: 'يجب أن تتكون كلمة المرور الجديدة من 3 خانات على الأقل' };
    }

    const updatedAccount: UserAccount = {
      ...currentUser,
      password: newPassword.trim(),
    };

    setCurrentUser(updatedAccount);
    setUserAccounts(prev => prev.map(acc => acc.id === currentUser.id ? updatedAccount : acc));

    return { success: true, message: 'تم تحديث كلمة المرور وتعيينها بنجاح!' };
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedRequestId(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  // Register New Club President & Club Account
  const registerNewClubPresident = (formData: {
    clubName: string;
    presidentName: string;
    username: string;
    password?: string;
    email: string;
    phone: string;
    supervisorId?: string;
    supervisorName?: string;
    category?: string;
    office?: string;
    bio?: string;
  }): UserAccount => {
    const cleanClubName = formData.clubName.startsWith('نادي ') ? formData.clubName : `نادي ${formData.clubName}`;
    const newUserId = `user_club_${Date.now()}`;
    const colorGradients = [
      'from-emerald-600 to-teal-700',
      'from-blue-600 to-cyan-700',
      'from-purple-600 to-indigo-700',
      'from-amber-600 to-orange-700',
      'from-rose-600 to-pink-700',
      'from-teal-600 to-emerald-800'
    ];
    const randomBg = colorGradients[Math.floor(Math.random() * colorGradients.length)];

    const resolvedSupervisor = formData.supervisorId 
      ? userAccounts.find(u => u.id === formData.supervisorId)
      : undefined;

    const newAccount: UserAccount = {
      id: newUserId,
      username: formData.username.trim() || `club_${Date.now().toString().slice(-4)}`,
      password: (formData.password || '123').trim(),
      name: formData.presidentName.trim(),
      role: 'club_president',
      clubName: cleanClubName,
      title: `رئيس ${cleanClubName}`,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      supervisorId: formData.supervisorId || resolvedSupervisor?.id,
      supervisorName: formData.supervisorName || resolvedSupervisor?.name,
      office: formData.office?.trim() || 'المجمع الطلابي - مقر الأندية',
      avatarBg: randomBg,
      bio: formData.bio?.trim() || `النادي الطلابي المعتمد: ${cleanClubName}`,
      category: formData.category || 'عام',
      membersCount: 25,
      isCustom: true,
    };

    // Update user accounts including the new account and update supervisor's supervisedClubNames
    setUserAccounts(prev => {
      const updated = [newAccount, ...prev];
      if (newAccount.supervisorId) {
        return updated.map(u => {
          if (u.id === newAccount.supervisorId) {
            const existingClubs = u.supervisedClubNames || [];
            if (!existingClubs.includes(cleanClubName)) {
              return {
                ...u,
                supervisedClubNames: [...existingClubs, cleanClubName]
              };
            }
          }
          return u;
        });
      }
      return updated;
    });

    setCurrentUser(newAccount);
    setSelectedRequestId(null);

    // Welcome & Supervisor Notifications
    const timestamp = new Date().toISOString();
    const newNotifs: NotificationItem[] = [
      {
        id: `notif-${Date.now()}`,
        title: `مرحباً بك في منظومة الأندية!`,
        message: `تم تفعيل حساب ${cleanClubName} برئاسة ${formData.presidentName} بنجاح. المشرف المسند: ${newAccount.supervisorName || 'الإدارة العامة'}.`,
        targetRole: 'club_president',
        timestamp,
        read: false,
        type: 'alert',
      },
      {
        id: `notif-admin-${Date.now()}`,
        title: `تسجيل نادٍ جديد: ${cleanClubName}`,
        message: `قام ${formData.presidentName} بتسجيل ${cleanClubName} تحت إشراف (${newAccount.supervisorName || 'غير محدد'}).`,
        targetRole: 'admin',
        timestamp,
        read: false,
        type: 'alert',
      },
    ];

    if (newAccount.supervisorId) {
      newNotifs.push({
        id: `notif-sup-${Date.now()}`,
        title: `تعيين إشراف على نادٍ جديد: ${cleanClubName}`,
        message: `تم تسجيل ${cleanClubName} وتعيينكم مشرفاً أكاديمياً للنادي بواسطة الرئيس ${formData.presidentName}.`,
        targetRole: 'club_supervisor',
        timestamp,
        read: false,
        type: 'alert',
      });
    }

    setNotifications(prev => [...newNotifs, ...prev]);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
      });
    } catch (e) {
      // ignore
    }

    return newAccount;
  };

  // Register New Club Supervisor
  const registerNewSupervisor = (formData: {
    name: string;
    title?: string;
    department?: string;
    email?: string;
    phone?: string;
    username?: string;
    password?: string;
    office?: string;
    bio?: string;
    supervisedClubNames?: string[];
  }): UserAccount => {
    const newUserId = `user_sup_${Date.now().toString().slice(-6)}`;
    const cleanName = formData.name.trim();

    const colorGradients = [
      'from-amber-600 to-orange-700',
      'from-orange-600 to-amber-700',
      'from-yellow-600 to-amber-800',
      'from-amber-500 to-red-600'
    ];
    const randomBg = colorGradients[Math.floor(Math.random() * colorGradients.length)];

    const newAccount: UserAccount = {
      id: newUserId,
      username: formData.username?.trim() || `supervisor_${Date.now().toString().slice(-4)}`,
      password: (formData.password || '123').trim(),
      name: cleanName,
      role: 'club_supervisor',
      title: formData.title?.trim() || 'مشرف نادي طلابي',
      department: formData.department?.trim() || 'إشراف الأندية الطلابية',
      email: formData.email?.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@kfupm.edu.sa`,
      phone: formData.phone?.trim() || '',
      office: formData.office?.trim() || 'مبنى العمادة / الكلية',
      avatarBg: randomBg,
      bio: formData.bio?.trim() || `مشرف أكاديمي معتمد للأندية الطلابية بجامعة الملك فهد للبترول والمعادن.`,
      supervisedClubNames: formData.supervisedClubNames || [],
      isCustom: true,
    };

    setUserAccounts(prev => [newAccount, ...prev]);
    setCurrentUser(newAccount);
    setSelectedRequestId(null);

    // Notifications
    const timestamp = new Date().toISOString();
    const newNotifs: NotificationItem[] = [
      {
        id: `notif-sup-reg-${Date.now()}`,
        title: `مرحباً بك في منظومة الإشراف الأكاديمي!`,
        message: `تم تفعيل حساب المشرف ${cleanName} بنجاح. يمكنك الآن مراجعة واعتماد طلبات وفعاليات الأندية المسندة إليك.`,
        targetRole: 'club_supervisor',
        timestamp,
        read: false,
        type: 'alert',
      },
      {
        id: `notif-admin-sup-${Date.now()}`,
        title: `تسجيل مشرف جديد: ${cleanName}`,
        message: `تم تسجيل ${cleanName} (${newAccount.department}) كمشرف أكاديمي للأندية الطلابية.`,
        targetRole: 'admin',
        timestamp,
        read: false,
        type: 'alert',
      },
    ];

    setNotifications(prev => [...newNotifs, ...prev]);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#10b981', '#3b82f6']
      });
    } catch (e) {
      // ignore
    }

    return newAccount;
  };

  // Delete Supervisor Account
  const deleteSupervisorAccount = (supervisorId: string): { success: boolean; message: string } => {
    const target = userAccounts.find(u => u.id === supervisorId);
    if (!target) {
      return { success: false, message: 'لم يتم العثور على حساب المشرف المحدد' };
    }
    if (target.role !== 'club_supervisor') {
      return { success: false, message: 'لا يمكن حذف هذا الحساب لأنه ليس مشرفاً' };
    }

    const supName = target.name;
    setUserAccounts(prev => prev.filter(u => u.id !== supervisorId));

    if (currentUser?.id === supervisorId) {
      const fallbackUser = userAccounts.find(u => u.role === 'admin') || userAccounts[0];
      setCurrentUser(fallbackUser);
    }

    const timestamp = new Date().toISOString();
    setNotifications(prev => [
      {
        id: `notif-sup-del-${Date.now()}`,
        title: `حذف حساب مشرف: ${supName}`,
        message: `تم إزالة حساب المشرف ${supName} من سجل المشرفين المعتمدين.`,
        targetRole: 'admin',
        timestamp,
        read: false,
        type: 'alert',
      },
      ...prev,
    ]);

    return { success: true, message: `تم حذف حساب المشرف (${supName}) بنجاح` };
  };

  // Delete Club Account (Admin capability)
  const deleteClubAccount = (clubUserId: string): { success: boolean; message: string } => {
    const target = userAccounts.find(u => u.id === clubUserId);
    if (!target) {
      return { success: false, message: 'لم يتم العثور على حساب النادي المحدد' };
    }
    if (target.role !== 'club_president') {
      return { success: false, message: 'لا يمكن حذف هذا الحساب لأنه ليس نادياً طلابياً' };
    }

    const clubNameToDelete = target.clubName || target.name;
    setUserAccounts(prev => prev.filter(u => u.id !== clubUserId));

    // If current logged-in user is this deleted club, auto-switch to admin or default
    if (currentUser?.id === clubUserId) {
      const fallbackUser = userAccounts.find(u => u.role === 'admin') || userAccounts[0];
      setCurrentUser(fallbackUser);
    }

    // Add admin notification
    const timestamp = new Date().toISOString();
    setNotifications(prev => [
      {
        id: `notif-del-${Date.now()}`,
        title: `حذف نادي: ${clubNameToDelete}`,
        message: `تم حذف حساب ${clubNameToDelete} نهائياً من سجل الأندية الطلابية.`,
        targetRole: 'admin',
        timestamp,
        read: false,
        type: 'alert',
      },
      ...prev,
    ]);

    return { success: true, message: `تم حذف حساب (${clubNameToDelete}) من المنظومة بنجاح` };
  };

  // Update user profile
  const updateUserProfile = (updatedFields: Partial<UserAccount>, targetUserId?: string) => {
    const userIdToUpdate = targetUserId || currentUser?.id;
    if (!userIdToUpdate) return;

    let targetAccount: UserAccount | undefined;

    setUserAccounts(prev => prev.map(acc => {
      if (acc.id === userIdToUpdate) {
        const updated = { ...acc, ...updatedFields };
        targetAccount = updated;
        if (currentUser?.id === userIdToUpdate) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return acc;
    }));

    // If club president or account with clubName was updated, sync all existing requests for that club
    const clubNameToMatch = targetAccount?.clubName || (currentUser?.id === userIdToUpdate ? currentUser?.clubName : undefined);
    if (clubNameToMatch) {
      setRequests(prev => prev.map(r => {
        if (r.clubName === clubNameToMatch) {
          return {
            ...r,
            clubName: updatedFields.clubName || r.clubName,
            presidentName: updatedFields.name !== undefined ? updatedFields.name : r.presidentName,
            presidentPhone: updatedFields.phone !== undefined ? updatedFields.phone : r.presidentPhone,
            presidentEmail: updatedFields.email !== undefined ? updatedFields.email : r.presidentEmail,
          };
        }
        return r;
      }));
    }
  };

  const currentRole: RoleType = currentUser?.role || 'club_president';
  const activeClubName = currentUser?.clubName || CLUBS_LIST[0];

  // Dynamic clubs list
  const clubsList = Array.from(new Set([
    ...userAccounts.filter(u => u.role === 'club_president' && u.clubName).map(u => u.clubName!),
    ...CLUBS_LIST
  ]));

  // Dynamic staff members with live profile information from userAccounts
  const staffMembers: StaffMember[] = useMemo(() => {
    return STAFF_MEMBERS.map(staff => {
      const staffAccount = userAccounts.find(u => u.staffId === staff.id || u.role === staff.roleCode);
      if (staffAccount) {
        return {
          ...staff,
          name: staffAccount.name || staff.name,
          phone: staffAccount.phone || staff.phone,
          email: staffAccount.email || staff.email,
          office: staffAccount.office || staff.office,
          avatarBg: staffAccount.avatarBg || staff.avatarBg,
          title: staffAccount.title || staff.title,
        };
      }
      return staff;
    });
  }, [userAccounts]);

  const currentStaff: StaffMember | undefined = useMemo(() => {
    const matched = currentUser?.staffId 
      ? staffMembers.find(s => s.id === currentUser.staffId)
      : staffMembers.find(s => s.roleCode === currentRole);
    
    if (matched && currentUser && (currentUser.role.startsWith('staff_') || currentUser.staffId)) {
      return {
        ...matched,
        name: currentUser.name || matched.name,
        phone: currentUser.phone || matched.phone,
        email: currentUser.email || matched.email,
        office: currentUser.office || matched.office,
        title: currentUser.title || matched.title,
        avatarBg: currentUser.avatarBg || matched.avatarBg,
      };
    }
    return matched;
  }, [currentUser, currentRole, staffMembers]);

  // ==========================================
  // Strict Privacy Filter for Requests & Tasks
  // ==========================================
  const visibleRequests: ClubRequest[] = requests.filter(req => {
    if (!currentUser) return false;
    // 1. Admin sees everything for supervision
    if (currentUser.role === 'admin') return true;

    // 2. Club Supervisor sees requests from supervised clubs
    if (currentUser.role === 'club_supervisor') {
      const supervisedList = currentUser.supervisedClubNames || [];
      return (
        req.supervisorId === currentUser.id ||
        req.supervisorName === currentUser.name ||
        supervisedList.includes(req.clubName) ||
        userAccounts.some(u => u.clubName === req.clubName && (u.supervisorId === currentUser.id || u.supervisorName === currentUser.name))
      );
    }

    // 3. Club President ONLY sees their own club's requests
    if (currentUser.role === 'club_president') {
      return req.clubName === currentUser.clubName;
    }

    // 4. Staff Member ONLY sees requests that contain tasks assigned to them AND are approved by supervisor (not pending_supervisor)
    if (currentStaff) {
      if (req.status === 'pending_supervisor') return false;
      return req.tasks.some(t => t.staffId === currentStaff.id);
    }

    return false;
  }).map(req => {
    // If user is a staff member, privacy protection hides other staff's private details
    if (currentStaff && currentUser?.role !== 'admin' && currentUser?.role !== 'club_supervisor') {
      return {
        ...req,
        // Only include tasks belonging to this staff member
        tasks: req.tasks.filter(t => t.staffId === currentStaff.id),
      };
    }
    return req;
  });

  const unreadNotificationCount = notifications.filter(n => {
    if (n.read) return false;
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (n.targetRole === 'all') return true;
    return n.targetRole === currentUser.role;
  }).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => {
      if (n.targetRole === currentUser.role || currentUser.role === 'admin' || n.targetRole === 'all') {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  // Re-calculate overall request status
  const calculateRequestStatus = (tasks: Task[]): RequestStatus => {
    if (tasks.length === 0) return 'submitted';
    const allCompleted = tasks.every(t => t.status === 'completed');
    if (allCompleted) return 'completed';
    const anyRejected = tasks.every(t => t.status === 'rejected');
    if (anyRejected) return 'rejected';
    const anyActive = tasks.some(t => t.status === 'in_progress' || t.status === 'completed');
    if (anyActive) return 'in_progress';
    return 'submitted';
  };

  // Supervisor Approval Workflow Methods
  const approveRequestBySupervisor = (requestId: string, supervisorNotes?: string) => {
    const timestamp = new Date().toISOString();
    let targetReq: ClubRequest | undefined;

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      const updated: ClubRequest = {
        ...req,
        status: 'submitted',
        supervisorStatus: 'approved',
        supervisorApprovalDate: timestamp,
        supervisorNotes: supervisorNotes || req.supervisorNotes || 'تمت الموافقة والاعتماد من مشرف النادي.',
        updatedAt: timestamp,
      };
      targetReq = updated;
      return updated;
    }));

    if (targetReq) {
      const newNotifs: NotificationItem[] = [];
      const staffIdsTargeted = Array.from(new Set(targetReq.tasks.map(t => t.staffId)));

      // Notify targeted staff members now that supervisor has approved
      staffIdsTargeted.forEach(staffId => {
        const staff = staffMembers.find(s => s.id === staffId) || STAFF_MEMBERS.find(s => s.id === staffId);
        if (staff) {
          const staffTasks = targetReq!.tasks.filter(t => t.staffId === staffId);
          newNotifs.push({
            id: `notif-${Date.now()}-${staffId}`,
            title: `مهام معتمدة جديدة من ${targetReq!.clubName}`,
            message: `اعتمد المشرف فعالية (${targetReq!.eventTitle}) وتم توجيه ${staffTasks.length} مهام لاختصاصك.`,
            targetRole: staff.roleCode,
            requestId: targetReq!.id,
            timestamp,
            read: false,
            type: 'new_request',
          });
        }
      });

      // Notify Club President
      newNotifs.push({
        id: `notif-${Date.now()}-club-approved`,
        title: `تم اعتماد فعاليتك من المشرف! 🎉`,
        message: `اعتمد مشرف النادي طلب (${targetReq.eventTitle}) وأحيلت المهام مباشرة للموظفين المختصين للتنفيذ.`,
        targetRole: 'club_president',
        requestId: targetReq.id,
        timestamp,
        read: false,
        type: 'status_change',
      });

      // Notify Admin
      newNotifs.push({
        id: `notif-${Date.now()}-admin-approved`,
        title: `اعتماد مشرف: ${targetReq.clubName}`,
        message: `تم اعتماد طلب (${targetReq.eventTitle}) من قبل المشرف وإحالته لإجراءات التنفيذ.`,
        targetRole: 'admin',
        requestId: targetReq.id,
        timestamp,
        read: false,
        type: 'status_change',
      });

      setNotifications(prev => [...newNotifs, ...prev]);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#3b82f6', '#f59e0b']
        });
      } catch (e) {}
    }
  };

  const rejectRequestBySupervisor = (requestId: string, reason: string) => {
    const timestamp = new Date().toISOString();
    let targetReq: ClubRequest | undefined;

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      const updated: ClubRequest = {
        ...req,
        status: 'rejected',
        supervisorStatus: 'rejected',
        supervisorNotes: reason,
        updatedAt: timestamp,
      };
      targetReq = updated;
      return updated;
    }));

    if (targetReq) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}-club-rej`,
          title: `اعتذار مشرف النادي عن الفعالية`,
          message: `اعتذر المشرف عن اعتماد (${targetReq?.eventTitle}): "${reason}"`,
          targetRole: 'club_president',
          requestId,
          timestamp,
          read: false,
          type: 'alert',
        },
        ...prev,
      ]);
    }
  };

  const requestChangesBySupervisor = (requestId: string, notes: string) => {
    const timestamp = new Date().toISOString();
    let targetReq: ClubRequest | undefined;

    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      const updated: ClubRequest = {
        ...req,
        supervisorStatus: 'needs_info',
        supervisorNotes: notes,
        updatedAt: timestamp,
      };
      targetReq = updated;
      return updated;
    }));

    if (targetReq) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}-club-info`,
          title: `ملاحظات وتعديلات من مشرف النادي`,
          message: `طلب المشرف تعديلات بخصوص (${targetReq?.eventTitle}): "${notes}"`,
          targetRole: 'club_president',
          requestId,
          timestamp,
          read: false,
          type: 'alert',
        },
        ...prev,
      ]);
    }
  };

  // Automated routing & request creation with privacy isolation
  const createNewRequest = (formData: {
    clubName?: string;
    presidentName?: string;
    presidentPhone?: string;
    presidentEmail?: string;
    eventTitle: string;
    eventType: any;
    eventDate: string;
    startTime: string;
    endTime: string;
    locationSummary: string;
    expectedAttendees: number;
    description: string;
    budget?: string;
    servicesData: Record<string, { serviceId: string; priority: 'normal' | 'high' | 'urgent'; details: Record<string, any> }>;
  }): ClubRequest => {
    const timestamp = new Date().toISOString();
    const count = requests.length + 1;
    const reqNum = `طلب #${1040 + count}`;
    const reqId = `REQ-${new Date().getFullYear()}-${String(count).padStart(3, '0')}`;

    // Enforce club identity from authenticated session
    const resolvedClubName = (currentUser?.role === 'club_president' && currentUser.clubName)
      ? currentUser.clubName
      : (formData.clubName || activeClubName);

    const resolvedPresidentName = (currentUser?.role === 'club_president' && currentUser.name)
      ? currentUser.name
      : (formData.presidentName || 'رئيس النادي الطلابي');

    const resolvedPresidentEmail = (currentUser?.role === 'club_president' && currentUser.email)
      ? currentUser.email
      : (formData.presidentEmail || 'club@student.kfupm.edu.sa');

    const resolvedPresidentPhone = (currentUser?.role === 'club_president' && currentUser.phone)
      ? currentUser.phone
      : (formData.presidentPhone || '0550000000');

    // Resolve club supervisor
    const clubAccount = userAccounts.find(u => u.role === 'club_president' && (u.clubName === resolvedClubName || u.id === currentUser?.id));
    const resolvedSupervisorId = currentUser?.supervisorId || clubAccount?.supervisorId;
    const resolvedSupervisorName = currentUser?.supervisorName || clubAccount?.supervisorName || (resolvedSupervisorId ? userAccounts.find(u => u.id === resolvedSupervisorId)?.name : undefined);

    const hasSupervisor = Boolean(resolvedSupervisorId || resolvedSupervisorName);

    // Auto-generate routed tasks
    const tasks: Task[] = Object.entries(formData.servicesData).map(([srvKey, srvData], index) => {
      const srvDef = services.find(s => s.id === srvData.serviceId) || AVAILABLE_SERVICES.find(s => s.id === srvData.serviceId);
      const deptDef = srvDef ? DEPARTMENTS[srvDef.departmentId] : undefined;
      const staff = staffMembers.find(sm => sm.id === srvDef?.staffId) || STAFF_MEMBERS.find(sm => sm.id === srvDef?.staffId);

      return {
        id: `TSK-${100 * count + index + 1}`,
        requestId: reqId,
        serviceId: srvData.serviceId,
        serviceName: srvDef?.name || 'خدمة محددة',
        departmentId: srvDef?.departmentId || 'events_buildings',
        departmentName: deptDef?.name || 'القسم المعني',
        staffId: srvDef?.staffId || 'hussein_ramadan',
        staffName: staff?.shortName || 'الموظف المعني',
        status: 'pending' as TaskStatus,
        priority: srvData.priority || 'normal',
        details: srvData.details,
        comments: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    });

    const newRequest: ClubRequest = {
      id: reqId,
      requestNumber: reqNum,
      clubName: resolvedClubName,
      presidentName: resolvedPresidentName,
      presidentPhone: resolvedPresidentPhone,
      presidentEmail: resolvedPresidentEmail,
      supervisorId: resolvedSupervisorId,
      supervisorName: resolvedSupervisorName,
      supervisorStatus: hasSupervisor ? 'pending' : 'approved',
      eventTitle: formData.eventTitle,
      eventType: formData.eventType,
      eventDate: formData.eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      locationSummary: formData.locationSummary,
      expectedAttendees: Number(formData.expectedAttendees) || 50,
      description: formData.description,
      budget: formData.budget,
      status: hasSupervisor ? 'pending_supervisor' : 'submitted',
      tasks,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newNotifs: NotificationItem[] = [];

    if (hasSupervisor) {
      // 1. Notify the supervisor to review and approve
      newNotifs.push({
        id: `notif-${Date.now()}-sup`,
        title: `طلب اعتماد فعالية جديد: ${resolvedClubName}`,
        message: `تم رفع طلب (${formData.eventTitle}) للاعتماد من قِبلكم لإحالته للموظفين المعنيين.`,
        targetRole: 'club_supervisor',
        requestId: reqId,
        timestamp,
        read: false,
        type: 'new_request',
      });

      // 2. Confirmation to the club president
      newNotifs.push({
        id: `notif-${Date.now()}-pres`,
        title: `تم رفع الطلب للمشرف (${resolvedSupervisorName || 'المشرف الأكاديمي'})`,
        message: `تم إرسال طلب فعالية (${formData.eventTitle}) بنجاح وبانتظار اعتماد المشرف للانتقال للتنفيذ.`,
        targetRole: 'club_president',
        requestId: reqId,
        timestamp,
        read: false,
        type: 'status_change',
      });
    } else {
      // If no supervisor, route directly to staff members
      const staffIdsTargeted = Array.from(new Set(tasks.map(t => t.staffId)));
      staffIdsTargeted.forEach(staffId => {
        const staff = staffMembers.find(s => s.id === staffId) || STAFF_MEMBERS.find(s => s.id === staffId);
        if (staff) {
          const staffTasks = tasks.filter(t => t.staffId === staffId);
          newNotifs.push({
            id: `notif-${Date.now()}-${staffId}`,
            title: `مهام جديدة من ${resolvedClubName}`,
            message: `تم توجيه ${staffTasks.length} مهمة بخصوص (${formData.eventTitle}) إلى إدارتك.`,
            targetRole: staff.roleCode,
            requestId: reqId,
            timestamp,
            read: false,
            type: 'new_request',
          });
        }
      });
    }

    setRequests(prev => [newRequest, ...prev]);
    setNotifications(prev => [...newNotifs, ...prev]);

    // Celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#2563eb', '#f59e0b', '#7c3aed']
      });
    } catch (e) {
      // ignore
    }

    return newRequest;
  };

  const createSingleServiceRequest = (
    serviceId: string, 
    details: Record<string, any>, 
    clubName?: string, 
    presidentName?: string, 
    eventTitle?: string, 
    eventDate?: string, 
    priority: 'normal' | 'high' | 'urgent' = 'normal'
  ): ClubRequest => {
    const srv = AVAILABLE_SERVICES.find(s => s.id === serviceId);
    const resolvedClub = (currentUser?.role === 'club_president' && currentUser.clubName)
      ? currentUser.clubName
      : (clubName || activeClubName);

    return createNewRequest({
      clubName: resolvedClub,
      presidentName: currentUser?.name || presidentName || 'رئيس النادي',
      presidentPhone: currentUser?.phone || '0550000000',
      presidentEmail: currentUser?.email || 'club@student.kfupm.edu.sa',
      eventTitle: eventTitle || `طلب خدمة ${srv?.name || 'سريعة'} - ${resolvedClub}`,
      eventType: 'other',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      startTime: '16:00',
      endTime: '20:00',
      locationSummary: 'المقر المحدد في الطلب',
      expectedAttendees: 50,
      description: `طلب خدمة فردية مباشرة وموجهة من قبل رئيس النادي.`,
      servicesData: {
        [serviceId]: {
          serviceId,
          priority,
          details,
        },
      },
    });
  };

  const updateTaskStatus = (
    taskId: string, 
    newStatus: TaskStatus, 
    notes?: string, 
    commentText?: string
  ) => {
    const timestamp = new Date().toISOString();

    setRequests(prev => {
      return prev.map(req => {
        const hasTask = req.tasks.some(t => t.id === taskId);
        if (!hasTask) return req;

        const updatedTasks = req.tasks.map(t => {
          if (t.id !== taskId) return t;

          const updatedComments = [...t.comments];
          if (commentText && commentText.trim()) {
            updatedComments.push({
              id: `comm-${Date.now()}`,
              authorName: currentStaff?.shortName || (currentRole === 'admin' ? 'إدارة النشاط' : currentUser?.name || 'رئيس النادي'),
              authorRole: currentRole,
              message: commentText.trim(),
              timestamp,
            });
          }

          return {
            ...t,
            status: newStatus,
            notes: notes !== undefined ? notes : t.notes,
            completionDate: newStatus === 'completed' ? timestamp : t.completionDate,
            comments: updatedComments,
            updatedAt: timestamp,
          };
        });

        const newReqStatus = calculateRequestStatus(updatedTasks);

        return {
          ...req,
          status: newReqStatus,
          tasks: updatedTasks,
          updatedAt: timestamp,
        };
      });
    });

    // Notify club president of task update
    const currentReq = requests.find(r => r.tasks.some(t => t.id === taskId));
    const targetTask = currentReq?.tasks.find(t => t.id === taskId);

    if (currentReq && targetTask) {
      const statusLabels: Record<TaskStatus, string> = {
        pending: 'قيد الانتظار',
        in_progress: 'جارٍ التنفيذ',
        completed: 'تم الإنجاز بنجاح',
        rejected: 'تم الاعتذار عن الطلب',
        needs_info: 'يتطلب معلومات إضافية',
      };

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `تحديث في مهمة: ${targetTask.serviceName}`,
          message: `قام ${currentStaff?.shortName || 'الموظف المسؤول'} بتغيير حالة المهمة إلى (${statusLabels[newStatus]}).`,
          targetRole: 'club_president',
          requestId: currentReq.id,
          taskId: targetTask.id,
          timestamp,
          read: false,
          type: 'status_change',
        },
        ...prev,
      ]);
    }
  };

  const addTaskComment = (taskId: string, message: string) => {
    if (!message.trim()) return;
    const timestamp = new Date().toISOString();

    setRequests(prev => {
      return prev.map(req => {
        if (!req.tasks.some(t => t.id === taskId)) return req;

        const updatedTasks = req.tasks.map(t => {
          if (t.id !== taskId) return t;

          const newComment = {
            id: `comm-${Date.now()}`,
            authorName: currentStaff?.shortName || (currentRole === 'admin' ? 'إشراف إدارة النشاط' : currentUser?.name || 'رئيس النادي'),
            authorRole: currentRole,
            message: message.trim(),
            timestamp,
          };

          return {
            ...t,
            comments: [...t.comments, newComment],
            updatedAt: timestamp,
          };
        });

        return {
          ...req,
          tasks: updatedTasks,
          updatedAt: timestamp,
        };
      });
    });
  };

  // Staff & Admin: Add/Update a service detail
  const addTaskDetail = (taskId: string, label: string, value: any) => {
    if (!label || !label.trim()) return;
    const timestamp = new Date().toISOString();

    setRequests(prev => {
      return prev.map(req => {
        if (!req.tasks.some(t => t.id === taskId)) return req;

        const updatedTasks = req.tasks.map(t => {
          if (t.id !== taskId) return t;

          const currentDetails = { ...(t.details || {}) };
          currentDetails[label.trim()] = value;

          // Add automated log comment
          const logComment = {
            id: `comm-detail-${Date.now()}`,
            authorName: currentStaff?.shortName || (currentRole === 'admin' ? 'إدارة النشاط' : currentUser?.name || 'المستخدم'),
            authorRole: currentRole,
            message: `قام بتحديث/إضافة تفصيل: (${label.trim()}: ${typeof value === 'object' ? 'بيانات متقدمة' : value})`,
            timestamp,
          };

          return {
            ...t,
            details: currentDetails,
            comments: [...(t.comments || []), logComment],
            updatedAt: timestamp,
          };
        });

        return {
          ...req,
          tasks: updatedTasks,
          updatedAt: timestamp,
        };
      });
    });
  };

  // Staff & Admin: Delete a service detail
  const deleteTaskDetail = (taskId: string, keyOrLabel: string) => {
    if (!keyOrLabel) return;
    const timestamp = new Date().toISOString();

    setRequests(prev => {
      return prev.map(req => {
        if (!req.tasks.some(t => t.id === taskId)) return req;

        const updatedTasks = req.tasks.map(t => {
          if (t.id !== taskId) return t;

          const currentDetails = { ...(t.details || {}) };
          delete currentDetails[keyOrLabel];

          const logComment = {
            id: `comm-del-detail-${Date.now()}`,
            authorName: currentStaff?.shortName || (currentRole === 'admin' ? 'إدارة النشاط' : currentUser?.name || 'المستخدم'),
            authorRole: currentRole,
            message: `قام بحذف تفصيل: (${keyOrLabel})`,
            timestamp,
          };

          return {
            ...t,
            details: currentDetails,
            comments: [...(t.comments || []), logComment],
            updatedAt: timestamp,
          };
        });

        return {
          ...req,
          tasks: updatedTasks,
          updatedAt: timestamp,
        };
      });
    });
  };

  // Staff & Admin: Generic task detail update
  const updateTaskDetail = (taskId: string, keyOrLabel: string, value: any) => {
    addTaskDetail(taskId, keyOrLabel, value);
  };

  // Staff & Admin: Update external landing page / website URL
  const updateTaskExternalUrl = (taskId: string, externalUrl: string) => {
    const timestamp = new Date().toISOString();
    const cleanUrl = externalUrl.trim();

    setRequests(prev => {
      return prev.map(req => {
        if (!req.tasks.some(t => t.id === taskId)) return req;

        const updatedTasks = req.tasks.map(t => {
          if (t.id !== taskId) return t;

          const logComment = {
            id: `comm-url-${Date.now()}`,
            authorName: currentStaff?.shortName || (currentRole === 'admin' ? 'إدارة النشاط' : currentUser?.name || 'المستخدم'),
            authorRole: currentRole,
            message: cleanUrl 
              ? `قام بإرفاق رابط موقع/صفحة خارجية للمهمة: (${cleanUrl})` 
              : 'قام بإزالة رابط الصفحة الخارجية للمهمة',
            timestamp,
          };

          return {
            ...t,
            externalUrl: cleanUrl || undefined,
            comments: [...(t.comments || []), logComment],
            updatedAt: timestamp,
          };
        });

        return {
          ...req,
          tasks: updatedTasks,
          updatedAt: timestamp,
        };
      });
    });
  };

  // Dynamic Security Guest Management
  const addGuestToTask = (taskId: string, guest: any) => {
    const timestamp = new Date().toISOString();

    setRequests(prev => {
      return prev.map(req => {
        if (!req.tasks.some(t => t.id === taskId)) return req;

        const updatedTasks = req.tasks.map(t => {
          if (t.id !== taskId) return t;

          const currentDetails = { ...(t.details || {}) };
          const currentList = Array.isArray(currentDetails.guestsList) ? [...currentDetails.guestsList] : [];
          currentList.push(guest);
          currentDetails.guestsList = currentList;
          currentDetails.visitor_count = currentList.length;

          return {
            ...t,
            details: currentDetails,
            updatedAt: timestamp,
          };
        });

        return {
          ...req,
          tasks: updatedTasks,
          updatedAt: timestamp,
        };
      });
    });
  };

  const removeGuestFromTask = (taskId: string, guestId: string) => {
    const timestamp = new Date().toISOString();

    setRequests(prev => {
      return prev.map(req => {
        if (!req.tasks.some(t => t.id === taskId)) return req;

        const updatedTasks = req.tasks.map(t => {
          if (t.id !== taskId) return t;

          const currentDetails = { ...(t.details || {}) };
          const currentList = Array.isArray(currentDetails.guestsList) 
            ? currentDetails.guestsList.filter((g: any) => g.id !== guestId)
            : [];
          currentDetails.guestsList = currentList;
          currentDetails.visitor_count = currentList.length;

          return {
            ...t,
            details: currentDetails,
            updatedAt: timestamp,
          };
        });

        return {
          ...req,
          tasks: updatedTasks,
          updatedAt: timestamp,
        };
      });
    });
  };

  const deleteTask = (taskId: string): { success: boolean; message: string } => {
    let deletedServiceName = '';
    let parentEventTitle = '';
    let remainingCount = 0;
    const timestamp = new Date().toISOString();

    setRequests(prev => {
      const targetReq = prev.find(r => r.tasks.some(t => t.id === taskId));
      if (!targetReq) return prev;

      const targetTask = targetReq.tasks.find(t => t.id === taskId);
      if (targetTask) {
        deletedServiceName = targetTask.serviceName;
      }
      parentEventTitle = targetReq.eventTitle;

      const remainingTasks = targetReq.tasks.filter(t => t.id !== taskId);
      remainingCount = remainingTasks.length;

      // If no tasks remain, remove the entire request
      if (remainingTasks.length === 0) {
        return prev.filter(r => r.id !== targetReq.id);
      }

      // Otherwise, update tasks and re-calculate status
      const updatedStatus = calculateRequestStatus(remainingTasks);
      return prev.map(r => {
        if (r.id !== targetReq.id) return r;
        return {
          ...r,
          status: updatedStatus,
          tasks: remainingTasks,
          updatedAt: timestamp,
        };
      });
    });

    if (selectedRequestId && requests.find(r => r.id === selectedRequestId && r.tasks.length <= 1 && r.tasks.some(t => t.id === taskId))) {
      setSelectedRequestId(null);
    }

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-del-tsk-${Date.now()}`,
        title: `حذف مهمة: ${deletedServiceName || 'خدمة'}`,
        message: remainingCount === 0 
          ? `تم حذف المهمة وإلغاء الطلب (${parentEventTitle}) لعدم وجود مهام متبقية.`
          : `تم حذف مهمة (${deletedServiceName}) من طلب الفعالية (${parentEventTitle}).`,
        targetRole: 'all',
        timestamp,
        read: false,
        type: 'alert',
      },
      ...prev,
    ]);

    return { 
      success: true, 
      message: remainingCount === 0 
        ? `تم حذف المهمة وإلغاء الطلب (${parentEventTitle}) بنجاح` 
        : `تم حذف مهمة (${deletedServiceName}) بنجاح` 
    };
  };

  const deleteRequest = (requestId: string): { success: boolean; message: string } => {
    let deletedTitle = '';
    let reqNum = '';
    const target = requests.find(r => r.id === requestId);
    if (target) {
      deletedTitle = target.eventTitle;
      reqNum = target.requestNumber;
    }
    const timestamp = new Date().toISOString();

    setRequests(prev => prev.filter(r => r.id !== requestId));
    if (selectedRequestId === requestId) {
      setSelectedRequestId(null);
    }

    if (deletedTitle) {
      setNotifications(prev => [
        {
          id: `notif-del-req-${Date.now()}`,
          title: `حذف طلب: ${deletedTitle}`,
          message: `تم حذف طلب الفعالية (${deletedTitle} - ${reqNum}) وكافة المهام التابعة له نهائياً.`,
          targetRole: 'all',
          timestamp,
          read: false,
          type: 'alert',
        },
        ...prev,
      ]);
    }

    return { success: true, message: `تم حذف الطلب (${deletedTitle || requestId}) بالكامل بنجاح` };
  };

  // Update Service Title / Name, Description, and Icon
  const updateServiceInfo = (
    serviceId: string, 
    updates: { name?: string; description?: string; iconName?: string; restrictedToVip?: boolean }
  ): { success: boolean; message: string } => {
    let updatedTitle = '';
    let nextServices: ServiceItem[] = [];

    setServices(prev => {
      nextServices = prev.map(s => {
        if (s.id === serviceId) {
          updatedTitle = updates.name?.trim() || s.name;
          return {
            ...s,
            name: updates.name?.trim() ? updates.name.trim() : s.name,
            description: updates.description !== undefined ? updates.description.trim() : s.description,
            iconName: updates.iconName || s.iconName,
            restrictedToVip: updates.restrictedToVip !== undefined ? updates.restrictedToVip : s.restrictedToVip,
          };
        }
        return s;
      });
      return nextServices;
    });

    markLocalDataModified();
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(nextServices));

    // Instant cloud synchronization push
    setTimeout(() => {
      pushToCloudGist({
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser?.name || 'تعديل عنوان خدمة',
        requests,
        userAccounts,
        services: nextServices,
        notifications,
        clubsList: CLUBS_LIST,
      });
    }, 50);

    return { 
      success: true, 
      message: `تم تحديث مسمى وبيانات الخدمة (${updatedTitle}) بنجاح!` 
    };
  };

  // Staff Service Fields Configuration Methods
  const addServiceField = (serviceId: string, newField: any): { success: boolean; message: string } => {
    let serviceName = '';
    let nextServices: ServiceItem[] = [];

    setServices(prev => {
      nextServices = prev.map(s => {
        if (s.id === serviceId) {
          serviceName = s.name;
          const fieldId = newField.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
          return {
            ...s,
            fields: [...s.fields.filter(f => f.id !== fieldId), { ...newField, id: fieldId }]
          };
        }
        return s;
      });
      return nextServices;
    });

    markLocalDataModified();
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(nextServices));

    setTimeout(() => {
      pushToCloudGist({
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser?.name || 'إضافة تفصيل خدمة',
        requests,
        userAccounts,
        services: nextServices,
        notifications,
        clubsList: CLUBS_LIST,
      });
    }, 50);

    return { success: true, message: `تمت إضافة تفصيل/حقل (${newField.label}) إلى خدمة (${serviceName}) بنجاح!` };
  };

  const updateServiceField = (serviceId: string, fieldId: string, updatedField: any): { success: boolean; message: string } => {
    let serviceName = '';
    let nextServices: ServiceItem[] = [];

    setServices(prev => {
      nextServices = prev.map(s => {
        if (s.id === serviceId) {
          serviceName = s.name;
          return {
            ...s,
            fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updatedField } : f)
          };
        }
        return s;
      });
      return nextServices;
    });

    markLocalDataModified();
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(nextServices));

    setTimeout(() => {
      pushToCloudGist({
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser?.name || 'تحديث تفصيل خدمة',
        requests,
        userAccounts,
        services: nextServices,
        notifications,
        clubsList: CLUBS_LIST,
      });
    }, 50);

    return { success: true, message: `تم تحديث بيانات التفصيل في خدمة (${serviceName}) بنجاح!` };
  };

  const deleteServiceField = (serviceId: string, fieldId: string): { success: boolean; message: string } => {
    let serviceName = '';
    let nextServices: ServiceItem[] = [];

    setServices(prev => {
      nextServices = prev.map(s => {
        if (s.id === serviceId) {
          serviceName = s.name;
          return {
            ...s,
            fields: s.fields.filter(f => f.id !== fieldId)
          };
        }
        return s;
      });
      return nextServices;
    });

    markLocalDataModified();
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(nextServices));

    setTimeout(() => {
      pushToCloudGist({
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser?.name || 'حذف تفصيل خدمة',
        requests,
        userAccounts,
        services: nextServices,
        notifications,
        clubsList: CLUBS_LIST,
      });
    }, 50);

    return { success: true, message: `تم حذف التفصيل من خدمة (${serviceName}) بنجاح!` };
  };

  const resetServiceToDefault = (serviceId?: string) => {
    let nextServices: ServiceItem[] = [];
    if (serviceId) {
      const defaultSrv = AVAILABLE_SERVICES.find(s => s.id === serviceId);
      if (defaultSrv) {
        // Remove from deleted list if it was deleted
        const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_SERVICES);
        let deletedIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];
        deletedIds = deletedIds.filter(id => id !== serviceId);
        localStorage.setItem(STORAGE_KEYS.DELETED_SERVICES, JSON.stringify(deletedIds));

        setServices(prev => {
          const exists = prev.some(s => s.id === serviceId);
          if (exists) {
            nextServices = prev.map(s => s.id === serviceId ? JSON.parse(JSON.stringify(defaultSrv)) : s);
          } else {
            nextServices = [...prev, JSON.parse(JSON.stringify(defaultSrv))];
          }
          return nextServices;
        });
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.DELETED_SERVICES);
      nextServices = AVAILABLE_SERVICES;
      setServices(AVAILABLE_SERVICES);
    }
    markLocalDataModified();
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(nextServices));
    setTimeout(() => pushToCloudGist(), 50);
  };

  const addNewCustomService = (serviceData: { 
    name: string; 
    departmentId: DepartmentId; 
    description: string; 
    iconName?: string; 
    staffId?: string;
    restrictedToVip?: boolean;
    fields?: ServiceField[]; 
  }): { success: boolean; service: ServiceItem; message: string } => {
    const assignedStaffId = serviceData.staffId || DEPARTMENTS[serviceData.departmentId]?.staffId || currentStaff?.id || 'hussein_ramadan';
    const newService: ServiceItem = {
      id: `srv_custom_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: serviceData.name.trim(),
      departmentId: serviceData.departmentId,
      staffId: assignedStaffId,
      iconName: serviceData.iconName || 'Sparkles',
      description: serviceData.description.trim() || 'خدمة مخصصة جديدة مضافة من قبل المشرف',
      restrictedToVip: Boolean(serviceData.restrictedToVip),
      fields: serviceData.fields && serviceData.fields.length > 0 
        ? serviceData.fields 
        : [
          { 
            id: `field_desc_${Date.now()}`, 
            label: 'مواصفات وتفاصيل الخدمة المطلوبة', 
            type: 'textarea', 
            placeholder: 'اكتب مواصفات وتفاصيل طلبك هنا بدقة...', 
            required: true 
          }
        ],
    };

    let nextServices: ServiceItem[] = [];
    setServices(prev => {
      nextServices = [...prev, newService];
      return nextServices;
    });

    markLocalDataModified();
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(nextServices));

    setTimeout(() => {
      pushToCloudGist({
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser?.name || 'إضافة نموذج خدمة جديدة',
        requests,
        userAccounts,
        services: nextServices,
        notifications,
        clubsList: CLUBS_LIST,
      });
    }, 50);

    return {
      success: true,
      service: newService,
      message: `تم إنشاء وإدراج خدمة (${newService.name}) في دليل نماذج الخدمات بنجاح!`
    };
  };

  const deleteService = (serviceId: string): { success: boolean; message: string } => {
    let deletedServiceName = '';
    const targetService = services.find(s => s.id === serviceId);
    if (targetService) {
      deletedServiceName = targetService.name;
    }

    // Persist deleted service ID to prevent re-creation upon refresh or pull
    const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_SERVICES);
    let deletedIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];
    if (!deletedIds.includes(serviceId)) {
      deletedIds.push(serviceId);
      localStorage.setItem(STORAGE_KEYS.DELETED_SERVICES, JSON.stringify(deletedIds));
    }

    let nextServices: ServiceItem[] = [];
    setServices(prev => {
      nextServices = prev.filter(s => s.id !== serviceId);
      return nextServices;
    });

    markLocalDataModified();
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(nextServices));

    setTimeout(() => {
      pushToCloudGist({
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser?.name || 'حذف نموذج خدمة',
        requests,
        userAccounts,
        services: nextServices,
        notifications,
        clubsList: CLUBS_LIST,
      });
    }, 50);

    return {
      success: true,
      message: `تم حذف خدمة (${deletedServiceName || serviceId}) من دليل الخدمات بنجاح.`
    };
  };

  const clearAllRequests = (options?: { academicYear?: string; archiveReason?: string }): { success: boolean; message: string } => {
    const prevCount = requests.length;
    const prevTasksCount = requests.reduce((acc, r) => acc + (r.tasks?.length || 0), 0);
    const newYear = options?.academicYear?.trim() || currentAcademicYear;
    const reason = options?.archiveReason?.trim() || 'بدء عام أكاديمي جديد وتصفير الطلبات';

    // Clear requests in state and storage
    setRequests([]);
    setSelectedRequestId(null);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([]));

    // Update academic year if provided
    if (options?.academicYear?.trim()) {
      setCurrentAcademicYearState(options.academicYear.trim());
      localStorage.setItem(STORAGE_KEYS.ACADEMIC_YEAR, options.academicYear.trim());
    }

    // Create an announcement / system notification for the clear action
    const resetNotification: NotificationItem = {
      id: `notif-reset-${Date.now()}`,
      title: `بدء فترة أكاديمية جديدة (${newYear})`,
      message: `قام المشرف (${currentUser?.name || 'إدارة النشاط'}) بتصفير جميع طلبات الأندية (${prevCount} طلب) تمهيداً لبدء استقبال طلبات ${newYear}. السبب: ${reason}.`,
      targetRole: 'all',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'alert',
    };

    const nextNotifications = [resetNotification, ...notifications.slice(0, 30)];
    setNotifications(nextNotifications);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(nextNotifications));

    markLocalDataModified();

    // Push cleared state immediately to cloud Gist
    setTimeout(() => {
      pushToCloudGist({
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: `${currentUser?.name || 'إدارة النشاط'} - ${reason}`,
        requests: [],
        userAccounts,
        services,
        notifications: nextNotifications,
        clubsList: CLUBS_LIST,
      });
    }, 50);

    return {
      success: true,
      message: `تم تصفير وحذف جميع طلبات الأندية (${prevCount} طلب، ${prevTasksCount} مهمة) بنجاح وبدء العام الدراسي (${newYear}).`
    };
  };

  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.DELETED_SERVICES);
    setRequests(INITIAL_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setServices(AVAILABLE_SERVICES);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userAccounts,
        login,
        validateAndLogin,
        changePassword,
        logout,
        registerNewClubPresident,
        registerNewSupervisor,
        deleteClubAccount,
        deleteSupervisorAccount,
        updateUserProfile,
        approveRequestBySupervisor,
        rejectRequestBySupervisor,
        requestChangesBySupervisor,
        currentRole,
        currentStaff,
        staffMembers,
        activeClubName,
        clubsList,
        requests,
        visibleRequests,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createNewRequest,
        createSingleServiceRequest,
        updateTaskStatus,
        addTaskComment,
        addTaskDetail,
        deleteTaskDetail,
        updateTaskDetail,
        updateTaskExternalUrl,
        addGuestToTask,
        removeGuestFromTask,
        deleteTask,
        deleteRequest,
        services,
        updateServiceInfo,
        addServiceField,
        updateServiceField,
        deleteServiceField,
        resetServiceToDefault,
        addNewCustomService,
        deleteService,
        selectedRequestId,
        setSelectedRequestId,
        isNewRequestModalOpen,
        setIsNewRequestModalOpen,
        isQuickServiceModalOpen,
        setIsQuickServiceModalOpen,
        activeQuickServiceId,
        setActiveQuickServiceId,
        isUserProfileModalOpen,
        setIsUserProfileModalOpen,
        isSyncModalOpen,
        setIsSyncModalOpen,
        cloudSyncStatus,
        lastSyncTime,
        syncError,
        triggerManualSync: () => pullFromCloudGist(false),
        triggerManualPush: pushToCloudGist,
        resetToSampleData,
        currentAcademicYear,
        setCurrentAcademicYear,
        clearAllRequests,
        portalTheme,
        setPortalTheme,
        language,
        setLanguage,
        t,
        tDynamic,
        tService,
        tDepartment,
        tField,
        tOption,
        tUnit,
        dir,
        isRtl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

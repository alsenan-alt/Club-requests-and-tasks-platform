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
import {
  subscribeToAllAppData,
  seedInitialFirestoreDataIfEmpty,
  saveRequestDoc,
  deleteRequestDoc,
  saveUserAccountDoc,
  deleteUserAccountDoc,
  saveServiceDoc,
  deleteServiceDoc,
  saveNotificationDoc,
  deleteNotificationDoc,
  bulkSyncStateToFirestore,
} from '../api';

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
    autoLogin?: boolean;
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
    autoLogin?: boolean;
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
  editAndResubmitRequest: (
    requestId: string,
    updatedData: {
      eventTitle?: string;
      eventType?: any;
      eventDate?: string;
      startTime?: string;
      endTime?: string;
      locationSummary?: string;
      expectedAttendees?: number;
      description?: string;
      budget?: string;
      servicesData?: Record<string, { serviceId: string; priority: 'normal' | 'high' | 'urgent'; details: Record<string, any> }>;
      presidentNotes?: string;
    }
  ) => { success: boolean; message: string; request?: ClubRequest };
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
  editingRequest: ClubRequest | null;
  setEditingRequest: (req: ClubRequest | null) => void;
  isEditRequestModalOpen: boolean;
  setIsEditRequestModalOpen: (open: boolean) => void;
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
  DELETED_ACCOUNTS: 'club_deleted_accounts_ids_v2',
  REQUESTS: 'club_requests_app_v2',
  NOTIFICATIONS: 'club_notifications_app_v2',
  SERVICES: 'club_services_config_v2',
  DELETED_SERVICES: 'club_deleted_services_ids_v2',
  ACADEMIC_YEAR: 'club_current_academic_year_v2',
  LAST_MODIFIED: 'club_last_modified_timestamp_v2',
  PORTAL_THEME: 'club_portal_theme_v2',
};

// Robust helper functions for Arabic club name matching & normalization
export const normalizeClubName = (name?: string): string => {
  if (!name) return '';
  return name
    .trim()
    .replace(/^نادي\s+/, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .toLowerCase();
};

export const isSameClubName = (name1?: string, name2?: string): boolean => {
  if (!name1 || !name2) return false;
  const n1 = name1.trim();
  const n2 = name2.trim();
  if (n1 === n2) return true;
  return normalizeClubName(n1) === normalizeClubName(n2);
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
      const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
      const deletedIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];
      const deletedSet = new Set(deletedIds);

      // Pre-seeded mock supervisor IDs to clean up if not desired
      const legacyMockSupervisorIds = new Set([
        'user_supervisor_khalid',
        'user_supervisor_fahad',
        'user_supervisor_abdulaziz',
        'user_supervisor_mohammed',
        'user_supervisor_omari'
      ]);

      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) {
        const parsed: UserAccount[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out deleted accounts and legacy mock supervisor accounts
          const filteredParsed = parsed.filter(u => 
            !deletedSet.has(u.id) && 
            !deletedSet.has(u.username) && 
            !legacyMockSupervisorIds.has(u.id)
          );
          const parsedIds = new Set(filteredParsed.map(u => u.id));
          // Missing defaults from USER_ACCOUNTS (which now only contain staff, admin, and active clubs)
          const missingDefaults = USER_ACCOUNTS.filter(u => 
            !parsedIds.has(u.id) && 
            !deletedSet.has(u.id) && 
            !deletedSet.has(u.username)
          );
          
          const updatedParsed = filteredParsed.map(u => {
            const defaultAcc = USER_ACCOUNTS.find(d => d.id === u.id);
            let baseClubs = u.supervisedClubNames || defaultAcc?.supervisedClubNames || [];
            // Clean out deleted clubs from supervisor's list
            baseClubs = baseClubs.filter(c => 
              !deletedSet.has(c) && 
              !deletedSet.has(normalizeClubName(c)) && 
              !deletedSet.has(c.replace(/^نادي\s+/, '')) && 
              !deletedSet.has(`نادي ${c.replace(/^نادي\s+/, '')}`)
            );

            if (defaultAcc) {
              return {
                ...defaultAcc,
                ...u,
                supervisedClubNames: baseClubs,
                supervisorId: u.supervisorId || defaultAcc.supervisorId,
                supervisorName: u.supervisorName || defaultAcc.supervisorName,
              };
            }
            if (u.role === 'club_supervisor') {
              return {
                ...u,
                supervisedClubNames: baseClubs,
              };
            }
            return u;
          });
          const merged = [...updatedParsed, ...missingDefaults];
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(merged));
          return merged;
        }
      }
      return USER_ACCOUNTS
        .filter(u => !deletedSet.has(u.id) && !deletedSet.has(u.username) && !(u.clubName && deletedSet.has(u.clubName)))
        .map(u => {
          if (u.role === 'club_supervisor' && u.supervisedClubNames) {
            return {
              ...u,
              supervisedClubNames: u.supervisedClubNames.filter(c => 
                !deletedSet.has(c) && 
                !deletedSet.has(normalizeClubName(c)) && 
                !deletedSet.has(c.replace(/^نادي\s+/, ''))
              ),
            };
          }
          return u;
        });
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
  const [editingRequest, setEditingRequest] = useState<ClubRequest | null>(null);
  const [isEditRequestModalOpen, setIsEditRequestModalOpen] = useState(false);
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

  // Function to pull latest data from Gist / Server with smart conflict prevention and deletion tracking
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

        // Consolidate deleted items from cloud & local
        const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
        const localDeletedIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];
        const cloudDeletedIds: string[] = Array.isArray(cloudData.deletedAccountIds) ? cloudData.deletedAccountIds : [];
        const mergedDeletedAccountIds = Array.from(new Set([...localDeletedIds, ...cloudDeletedIds]));
        localStorage.setItem(STORAGE_KEYS.DELETED_ACCOUNTS, JSON.stringify(mergedDeletedAccountIds));
        const deletedAccountSet = new Set(mergedDeletedAccountIds);

        const deletedServicesSaved = localStorage.getItem(STORAGE_KEYS.DELETED_SERVICES);
        const localDeletedServices: string[] = deletedServicesSaved ? JSON.parse(deletedServicesSaved) : [];
        const cloudDeletedServices: string[] = Array.isArray(cloudData.deletedServiceIds) ? cloudData.deletedServiceIds : [];
        const mergedDeletedServiceIds = Array.from(new Set([...localDeletedServices, ...cloudDeletedServices]));
        localStorage.setItem(STORAGE_KEYS.DELETED_SERVICES, JSON.stringify(mergedDeletedServiceIds));
        const deletedServiceSet = new Set(mergedDeletedServiceIds);

        // If local modifications are strictly newer than what came from cloud, preserve local edits and push to cloud!
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
          const legacyMockSupervisorIds = new Set([
            'user_supervisor_khalid',
            'user_supervisor_fahad',
            'user_supervisor_abdulaziz',
            'user_supervisor_mohammed',
            'user_supervisor_omari'
          ]);

          const filteredCloudAccounts = cloudData.userAccounts
            .filter(u => 
              !deletedAccountSet.has(u.id) && 
              !deletedAccountSet.has(u.username) && 
              !(u.clubName && (
                deletedAccountSet.has(u.clubName) || 
                deletedAccountSet.has(normalizeClubName(u.clubName)) || 
                deletedAccountSet.has(`نادي ${normalizeClubName(u.clubName)}`)
              )) &&
              !legacyMockSupervisorIds.has(u.id)
            )
            .map(u => {
              if (u.role === 'club_supervisor' && u.supervisedClubNames) {
                return {
                  ...u,
                  supervisedClubNames: u.supervisedClubNames.filter(c => 
                    !deletedAccountSet.has(c) && 
                    !deletedAccountSet.has(normalizeClubName(c)) && 
                    !deletedAccountSet.has(c.replace(/^نادي\s+/, '')) && 
                    !deletedAccountSet.has(`نادي ${c.replace(/^نادي\s+/, '')}`)
                  )
                };
              }
              return u;
            });

          const cloudIds = new Set(filteredCloudAccounts.map(u => u.id));
          
          // Also preserve locally created accounts that haven't been deleted
          const localSaved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
          let localCustomAccounts: UserAccount[] = [];
          if (localSaved) {
            try {
              const localParsed: UserAccount[] = JSON.parse(localSaved);
              if (Array.isArray(localParsed)) {
                localCustomAccounts = localParsed.filter(u => 
                  !cloudIds.has(u.id) && 
                  !deletedAccountSet.has(u.id) && 
                  !deletedAccountSet.has(u.username) &&
                  !(u.clubName && (
                    deletedAccountSet.has(u.clubName) || 
                    deletedAccountSet.has(normalizeClubName(u.clubName)) || 
                    deletedAccountSet.has(`نادي ${normalizeClubName(u.clubName)}`)
                  )) &&
                  !legacyMockSupervisorIds.has(u.id)
                );
              }
            } catch (e) {}
          }

          // Only add default essential staff/admin accounts if missing, never resurrect deleted clubs/supervisors
          const missingDefaults = USER_ACCOUNTS.filter(u => 
            !cloudIds.has(u.id) && 
            !localCustomAccounts.some(loc => loc.id === u.id) &&
            !deletedAccountSet.has(u.id) && 
            !deletedAccountSet.has(u.username) &&
            (u.role === 'admin' || u.role.startsWith('staff_'))
          );
          const mergedAccounts = [...filteredCloudAccounts, ...localCustomAccounts, ...missingDefaults];
          setUserAccounts(mergedAccounts);
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(mergedAccounts));
          
          // Keep current logged-in user in sync
          if (currentUser) {
            const freshUser = mergedAccounts.find(u => u.id === currentUser.id);
            if (freshUser) {
              setCurrentUser(freshUser);
              localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
            } else if (deletedAccountSet.has(currentUser.id)) {
              // Current user was deleted on another device, switch to admin or null
              const adminAcc = mergedAccounts.find(u => u.role === 'admin') || null;
              setCurrentUser(adminAcc);
              if (adminAcc) {
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(adminAcc));
              } else {
                localStorage.removeItem(STORAGE_KEYS.USER);
              }
            }
          }
        }

        if (Array.isArray(cloudData.services) && cloudData.services.length > 0) {
          const filteredCloudServices = cloudData.services.filter(s => !deletedServiceSet.has(s.id));
          const existingIds = new Set(filteredCloudServices.map(s => s.id));
          const missingDefaults = AVAILABLE_SERVICES.filter(s => !existingIds.has(s.id) && !deletedServiceSet.has(s.id));
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
      setSyncError(e.message || 'فشل الاتصال بـ السحابة');
      setCloudSyncStatus('error');
    } finally {
      setIsInitialHydrated(true);
    }
  };

  // Function to push full local state to Server and Gist with instant deletion tracking
  const pushToCloudGist = async (customPayload?: Partial<GistDatabasePayload>) => {
    setCloudSyncStatus('syncing');
    setSyncError(null);
    try {
      const nowIso = new Date().toISOString();
      const nowTimestamp = Date.now();

      // Retrieve deleted account and service IDs
      const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
      const deletedAccountIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];

      const deletedServicesSaved = localStorage.getItem(STORAGE_KEYS.DELETED_SERVICES);
      const deletedServiceIds: string[] = deletedServicesSaved ? JSON.parse(deletedServicesSaved) : [];

      // Filter clubsList to exclude any deleted club names
      const deletedSet = new Set(deletedAccountIds);
      const dynamicClubs = Array.from(new Set([
        ...(customPayload?.userAccounts || userAccounts).filter(u => u.role === 'club_president' && u.clubName && !deletedSet.has(u.clubName) && !deletedSet.has(u.id)).map(u => u.clubName!),
        ...CLUBS_LIST.filter(c => !deletedSet.has(c))
      ]));

      const payload: GistDatabasePayload = {
        version: 2,
        lastUpdated: nowIso,
        updatedBy: currentUser?.name || 'مستخدم النظام',
        requests: customPayload?.requests || requests,
        userAccounts: customPayload?.userAccounts || userAccounts,
        services: customPayload?.services || services,
        notifications: customPayload?.notifications || notifications,
        clubsList: customPayload?.clubsList || dynamicClubs,
        deletedAccountIds: customPayload?.deletedAccountIds || deletedAccountIds,
        deletedServiceIds: customPayload?.deletedServiceIds || deletedServiceIds,
      };

      // Mark local timestamp
      localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, String(nowTimestamp));

      // Instant Firestore real-time synchronization
      bulkSyncStateToFirestore({
        requests: payload.requests,
        userAccounts: payload.userAccounts,
        services: payload.services,
        notifications: payload.notifications,
      }).catch(err => console.warn('Firestore live push notice:', err));

      const pushRes = await pushGistDatabase(payload, currentUser?.name);
      if (pushRes.success) {
        const nowFormatted = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(nowFormatted);
        setCloudSyncStatus('synced');
        setSyncError(null);
      } else {
        setSyncError(pushRes.error || 'تم حفظ البيانات محلياً وجاري المزامنة السحابية');
        setCloudSyncStatus('synced');
      }
    } catch (e: any) {
      console.warn('Push exception:', e);
      setSyncError(e.message || 'تم حفظ البيانات محلياً');
      setCloudSyncStatus('synced');
    }
  };

    // 1. Firebase Firestore Real-Time Live Sync & Initial Seeding
  useEffect(() => {
    // Seed initial data if Firestore is fresh/empty with full current state (including custom supervisors)
    seedInitialFirestoreDataIfEmpty({
      userAccounts: userAccounts.length > 0 ? userAccounts : USER_ACCOUNTS,
      requests: requests.length > 0 ? requests : INITIAL_REQUESTS,
      services: services.length > 0 ? services : AVAILABLE_SERVICES,
      notifications: notifications.length > 0 ? notifications : INITIAL_NOTIFICATIONS,
    }).then(() => {
      // Ensure all custom accounts (supervisors, clubs) and data are actively persisted to Firestore
      bulkSyncStateToFirestore({
        userAccounts,
        requests,
        services,
        notifications,
      }).catch(err => console.warn('Firestore initial bulk sync notice:', err));
    }).catch(err => console.warn('Firestore seed check notice:', err));

    // Subscribe to real-time live updates across all devices
    const unsubscribeFirestore = subscribeToAllAppData({
      onRequestsChange: (incomingRequests) => {
        if (incomingRequests && incomingRequests.length > 0) {
          setRequests(incomingRequests);
          localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(incomingRequests));
          setCloudSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      },
      onUsersChange: (incomingUsers) => {
        if (incomingUsers && incomingUsers.length > 0) {
          const legacyMockSupervisorIds = new Set([
            'user_supervisor_khalid',
            'user_supervisor_fahad',
            'user_supervisor_abdulaziz',
            'user_supervisor_mohammed',
            'user_supervisor_omari'
          ]);
          const filtered = incomingUsers.filter(u => !legacyMockSupervisorIds.has(u.id));
          const existingIds = new Set(filtered.map(u => u.id));
          
          // Also preserve any custom accounts (like newly registered supervisors/clubs) from local state and save to Firestore
          const localCustomAccounts = userAccounts.filter(u => u.isCustom && !existingIds.has(u.id));
          localCustomAccounts.forEach(customAcc => {
            saveUserAccountDoc(customAcc).catch(e => console.warn('Sync custom account to Firestore error:', e));
          });

          const missingDefaults = USER_ACCOUNTS.filter(u => !existingIds.has(u.id) && (u.role === 'admin' || u.role.startsWith('staff_')));
          const merged = [...filtered, ...localCustomAccounts, ...missingDefaults];
          
          setUserAccounts(merged);
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(merged));
          setCloudSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

          // Update currentUser reference if updated
          setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const updatedProfile = merged.find(u => u.id === prevUser.id);
            if (updatedProfile) {
              localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedProfile));
              return updatedProfile;
            }
            return prevUser;
          });
        }
      },
      onServicesChange: (incomingServices) => {
        if (incomingServices && incomingServices.length > 0) {
          setServices(incomingServices);
          localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(incomingServices));
          setCloudSyncStatus('synced');
        }
      },
      onNotificationsChange: (incomingNotifs) => {
        if (incomingNotifs && incomingNotifs.length > 0) {
          setNotifications(incomingNotifs);
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(incomingNotifs));
        }
      },
      onError: (err) => {
        console.warn('Firestore live listener notice:', err);
      }
    });

    return () => {
      unsubscribeFirestore();
    };
  }, []);

  // Initial mount: Pull cloud data from Server/Gist as backup
  useEffect(() => {
    pullFromCloudGist(false);
  }, []);

  // Periodic rapid polling every 3 seconds for cross-device live sync & focus auto-refresh
  useEffect(() => {
    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible' && cloudSyncStatus !== 'syncing') {
        pullFromCloudGist(true);
      }
    };

    window.addEventListener('focus', handleFocusOrVisible);
    document.addEventListener('visibilitychange', handleFocusOrVisible);

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && cloudSyncStatus !== 'syncing') {
        pullFromCloudGist(true);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocusOrVisible);
      document.removeEventListener('visibilitychange', handleFocusOrVisible);
    };
  }, [cloudSyncStatus]);

  // Debounced auto-save to Gist when state changes (after initial hydration)
  useEffect(() => {
    if (!isInitialHydrated) return;

    const timer = setTimeout(() => {
      const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
      const deletedAccountIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];

      const deletedServicesSaved = localStorage.getItem(STORAGE_KEYS.DELETED_SERVICES);
      const deletedServiceIds: string[] = deletedServicesSaved ? JSON.parse(deletedServicesSaved) : [];

      const deletedSet = new Set(deletedAccountIds);
      const dynamicClubs = Array.from(new Set([
        ...userAccounts.filter(u => u.role === 'club_president' && u.clubName && !deletedSet.has(u.clubName) && !deletedSet.has(u.id)).map(u => u.clubName!),
        ...CLUBS_LIST.filter(c => !deletedSet.has(c))
      ]));

      const payload: GistDatabasePayload = {
        version: 2,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser?.name || 'تحديث تلقائي',
        requests,
        userAccounts,
        services,
        notifications,
        clubsList: dynamicClubs,
        deletedAccountIds,
        deletedServiceIds,
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

    markLocalDataModified();
    setCurrentUser(updatedAccount);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedAccount));

    // Persist directly to Firestore
    saveUserAccountDoc(updatedAccount).catch(e => console.warn('Firestore change password error:', e));

    setUserAccounts(prev => {
      const updated = prev.map(acc => acc.id === currentUser.id ? updatedAccount : acc);
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
      return updated;
    });

    // Immediate background push to Cloud
    pushToCloudGist();

    return { success: true, message: 'تم تحديث وحفظ كلمة المرور الجديدة بنجاح!' };
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
    autoLogin?: boolean;
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
    let updatedAccounts: UserAccount[] = [];
    const prevAccounts = userAccounts;
    const baseUpdated = [newAccount, ...prevAccounts.filter(u => u.id !== newUserId && !isSameClubName(u.clubName, cleanClubName))];
    if (newAccount.supervisorId) {
      updatedAccounts = baseUpdated.map(u => {
        if (u.id === newAccount.supervisorId || (newAccount.supervisorName && u.name === newAccount.supervisorName)) {
          const existingClubs = u.supervisedClubNames || [];
          if (!existingClubs.some(c => isSameClubName(c, cleanClubName))) {
            return {
              ...u,
              supervisedClubNames: [...existingClubs, cleanClubName]
            };
          }
        }
        return u;
      });
    } else {
      updatedAccounts = baseUpdated;
    }

    setUserAccounts(updatedAccounts);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedAccounts));

    // Remove from deleted list if previously existed
    let cleanDeletedIds: string[] = [];
    try {
      const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
      if (deletedIdsSaved) {
        const deletedIds: string[] = JSON.parse(deletedIdsSaved);
        cleanDeletedIds = deletedIds.filter(id => 
          id !== newUserId && 
          id !== newAccount.username && 
          !isSameClubName(id, cleanClubName) && 
          !isSameClubName(id, formData.clubName)
        );
        localStorage.setItem(STORAGE_KEYS.DELETED_ACCOUNTS, JSON.stringify(cleanDeletedIds));
      }
    } catch (e) {}

    if (formData.autoLogin !== false) {
      setCurrentUser(newAccount);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newAccount));
      setSelectedRequestId(null);
    } else if (currentUser) {
      const freshUser = updatedAccounts.find(u => u.id === currentUser.id);
      if (freshUser) {
        setCurrentUser(freshUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
      }
    }

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
    markLocalDataModified();

    // Persist directly to Firestore
    saveUserAccountDoc(newAccount).catch(e => console.warn('Firestore save club president error:', e));
    if (newAccount.supervisorId) {
      const sup = updatedAccounts.find(u => u.id === newAccount.supervisorId);
      if (sup) saveUserAccountDoc(sup).catch(e => console.warn('Firestore save supervisor update error:', e));
    }

    // Instant cloud synchronization push
    pushToCloudGist({
      userAccounts: updatedAccounts,
      deletedAccountIds: cleanDeletedIds,
    });

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
    autoLogin?: boolean;
  }): UserAccount => {
    const newUserId = `user_sup_${Date.now()}`;
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

    const nextAccounts = [newAccount, ...userAccounts.filter(u => u.id !== newUserId)];
    setUserAccounts(nextAccounts);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(nextAccounts));

    // Remove from deleted list if previously existed
    let cleanDeletedIds: string[] = [];
    try {
      const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
      if (deletedIdsSaved) {
        const deletedIds: string[] = JSON.parse(deletedIdsSaved);
        cleanDeletedIds = deletedIds.filter(id => id !== newUserId && id !== newAccount.username && id !== cleanName);
        localStorage.setItem(STORAGE_KEYS.DELETED_ACCOUNTS, JSON.stringify(cleanDeletedIds));
      }
    } catch (e) {}

    if (formData.autoLogin !== false) {
      setCurrentUser(newAccount);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newAccount));
      setSelectedRequestId(null);
    }

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
    markLocalDataModified();

    // Persist directly to Firestore
    saveUserAccountDoc(newAccount).catch(e => console.warn('Firestore save supervisor error:', e));

    // Instant cloud synchronization push
    pushToCloudGist({
      userAccounts: nextAccounts,
      deletedAccountIds: cleanDeletedIds,
    });

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
    const target = userAccounts.find(u => u.id === supervisorId || u.username === supervisorId);
    if (!target) {
      return { success: false, message: 'لم يتم العثور على حساب المشرف المحدد' };
    }
    if (target.role !== 'club_supervisor') {
      return { success: false, message: 'لا يمكن حذف هذا الحساب لأنه ليس مشرفاً' };
    }

    const supName = target.name;
    const supUsername = target.username;

    // Save to DELETED_ACCOUNTS in localStorage to permanently prevent re-creation or sync resurrecting it
    let updatedDeletedIds: string[] = [];
    try {
      const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
      const deletedIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];
      updatedDeletedIds = Array.from(new Set([...deletedIds, supervisorId, target.id, supUsername, supName].filter(Boolean)));
      localStorage.setItem(STORAGE_KEYS.DELETED_ACCOUNTS, JSON.stringify(updatedDeletedIds));
    } catch (e) {
      console.error('Error saving deleted supervisor:', e);
    }

    const cleanedAccounts = userAccounts
      .filter(u => u.id !== supervisorId && u.id !== target.id && u.username !== supUsername)
      .map(u => {
        // Clear supervisor link if this supervisor was assigned to clubs
        if (u.supervisorId === supervisorId || u.supervisorId === target.id || (u.supervisorName && isSameClubName(u.supervisorName, supName))) {
          return {
            ...u,
            supervisorId: undefined,
            supervisorName: undefined,
          };
        }
        return u;
      });

    setUserAccounts(cleanedAccounts);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(cleanedAccounts));

    if (currentUser) {
      if (currentUser.id === supervisorId || currentUser.id === target.id) {
        const fallbackUser = cleanedAccounts.find(u => u.role === 'admin') || cleanedAccounts[0];
        setCurrentUser(fallbackUser);
        if (fallbackUser) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fallbackUser));
        }
      } else {
        const freshUser = cleanedAccounts.find(u => u.id === currentUser.id);
        if (freshUser) {
          setCurrentUser(freshUser);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
        }
      }
    }

    // Delete from Firestore
    deleteUserAccountDoc(supervisorId).catch(e => console.warn('Firestore delete user error:', e));
    if (target.id !== supervisorId) {
      deleteUserAccountDoc(target.id).catch(e => console.warn('Firestore delete user error:', e));
    }

    markLocalDataModified();

    const timestamp = new Date().toISOString();
    setNotifications(prev => [
      {
        id: `notif-sup-del-${Date.now()}`,
        title: `حذف حساب مشرف: ${supName}`,
        message: `تم إزالة حساب المشرف ${supName} من سجل المشرفين المعتمدين نهائياً.`,
        targetRole: 'admin',
        timestamp,
        read: false,
        type: 'alert',
      },
      ...prev,
    ]);

    // Instant cloud synchronization push
    pushToCloudGist({
      userAccounts: cleanedAccounts,
      deletedAccountIds: updatedDeletedIds,
    });

    return { success: true, message: `تم حذف حساب المشرف (${supName}) نهائياً` };
  };

  // Delete Club Account (Admin capability)
  const deleteClubAccount = (clubUserId: string): { success: boolean; message: string } => {
    const target = userAccounts.find(u => 
      u.id === clubUserId || 
      u.username === clubUserId || 
      (u.clubName && isSameClubName(u.clubName, clubUserId)) ||
      (u.name && isSameClubName(u.name, clubUserId))
    );

    if (!target) {
      return { success: false, message: 'لم يتم العثور على حساب النادي المحدد' };
    }
    if (target.role !== 'club_president') {
      return { success: false, message: 'لا يمكن حذف هذا الحساب لأنه ليس نادياً طلابياً' };
    }

    const clubNameToDelete = target.clubName || target.name;
    const clubUsername = target.username;
    const cleanWithoutNadi = clubNameToDelete.replace(/^نادي\s+/, '').trim();
    const cleanWithNadi = clubNameToDelete.startsWith('نادي ') ? clubNameToDelete : `نادي ${clubNameToDelete}`;

    let updatedDeletedIds: string[] = [];
    try {
      const deletedIdsSaved = localStorage.getItem(STORAGE_KEYS.DELETED_ACCOUNTS);
      const deletedIds: string[] = deletedIdsSaved ? JSON.parse(deletedIdsSaved) : [];
      updatedDeletedIds = Array.from(new Set([
        ...deletedIds, 
        clubUserId, 
        target.id, 
        clubUsername, 
        clubNameToDelete,
        cleanWithoutNadi,
        cleanWithNadi,
        normalizeClubName(clubNameToDelete),
        target.clubName || '',
        target.name || ''
      ].filter(Boolean)));
      localStorage.setItem(STORAGE_KEYS.DELETED_ACCOUNTS, JSON.stringify(updatedDeletedIds));
    } catch (e) {
      console.error('Error saving deleted club:', e);
    }

    // Filter out deleted club account AND remove club from all supervisors' supervisedClubNames
    const cleanedAccounts = userAccounts
      .filter(u => {
        if (u.id === clubUserId || u.id === target.id) return false;
        if (target.username && u.username === target.username) return false;
        if (u.role === 'club_president' && (
          isSameClubName(u.clubName, clubNameToDelete) || 
          isSameClubName(u.name, clubNameToDelete) ||
          isSameClubName(u.clubName, cleanWithoutNadi) ||
          isSameClubName(u.clubName, cleanWithNadi)
        )) return false;
        return true;
      })
      .map(u => {
        if (u.role === 'club_supervisor') {
          const currentSupervised = u.supervisedClubNames || [];
          const filtered = currentSupervised.filter(c => 
            !isSameClubName(c, clubNameToDelete) &&
            !isSameClubName(c, cleanWithoutNadi) &&
            !isSameClubName(c, cleanWithNadi) &&
            !isSameClubName(c, target.clubName) &&
            !isSameClubName(c, target.name)
          );
          return {
            ...u,
            supervisedClubNames: filtered,
          };
        }
        return u;
      });

    setUserAccounts(cleanedAccounts);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(cleanedAccounts));

    // If current logged-in user is this deleted club or supervisor, refresh currentUser immediately
    if (currentUser) {
      if (
        currentUser.id === clubUserId || 
        currentUser.id === target.id || 
        (currentUser.clubName && isSameClubName(currentUser.clubName, clubNameToDelete))
      ) {
        const fallbackUser = cleanedAccounts.find(u => u.role === 'admin') || cleanedAccounts[0];
        setCurrentUser(fallbackUser);
        if (fallbackUser) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fallbackUser));
        }
      } else {
        const freshUser = cleanedAccounts.find(u => u.id === currentUser.id);
        if (freshUser) {
          setCurrentUser(freshUser);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
        }
      }
    }

    // Delete from Firestore
    deleteUserAccountDoc(clubUserId).catch(e => console.warn('Firestore delete user error:', e));
    if (target.id !== clubUserId) {
      deleteUserAccountDoc(target.id).catch(e => console.warn('Firestore delete user error:', e));
    }

    markLocalDataModified();

    // Add admin notification
    const timestamp = new Date().toISOString();
    setNotifications(prev => [
      {
        id: `notif-del-${Date.now()}`,
        title: `حذف نادي: ${clubNameToDelete}`,
        message: `تم حذف حساب ${clubNameToDelete} نهائياً وإلغاء ارتباطه بقائمة المشرف الأكاديمي.`,
        targetRole: 'admin',
        timestamp,
        read: false,
        type: 'alert',
      },
      ...prev,
    ]);

    // Instant cloud synchronization push
    const updatedClubs = Array.from(new Set([
      ...cleanedAccounts.filter(u => u.role === 'club_president' && u.clubName).map(u => u.clubName!),
      ...CLUBS_LIST.filter(c => !isSameClubName(c, clubNameToDelete) && !isSameClubName(c, cleanWithoutNadi))
    ]));

    pushToCloudGist({
      userAccounts: cleanedAccounts,
      clubsList: updatedClubs,
      deletedAccountIds: updatedDeletedIds,
    });

    return { success: true, message: `تم حذف حساب (${clubNameToDelete}) وفك ارتباطه بقائمة المشرف الأكاديمي نهائياً` };
  };

  // Update user profile
  const updateUserProfile = (updatedFields: Partial<UserAccount>, targetUserId?: string) => {
    const userIdToUpdate = targetUserId || currentUser?.id;
    if (!userIdToUpdate) return;

    markLocalDataModified();

    let targetAccount: UserAccount | undefined;

    setUserAccounts(prev => {
      const updatedList = prev.map(acc => {
        if (acc.id === userIdToUpdate) {
          const updated = { ...acc, ...updatedFields };
          targetAccount = updated;
          if (currentUser?.id === userIdToUpdate) {
            setCurrentUser(updated);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
          }
          return updated;
        }
        return acc;
      });
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedList));
      return updatedList;
    });

    // If club president or account with clubName was updated, sync all existing requests for that club
    const clubNameToMatch = targetAccount?.clubName || (currentUser?.id === userIdToUpdate ? currentUser?.clubName : undefined);
    if (clubNameToMatch) {
      setRequests(prev => {
        const updatedReqs = prev.map(r => {
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
        });
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedReqs));
        return updatedReqs;
      });
    }

    // Immediate background push to cloud
    pushToCloudGist();
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

      markLocalDataModified();
      // Immediate instant push to Cloud and Server without delay
      pushToCloudGist({
        requests: [targetReq, ...requests.filter(r => r.id !== requestId)],
        notifications: [...newNotifs, ...notifications],
      });

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
      const newNotifs: NotificationItem[] = [
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
      ];
      setNotifications(prev => [...newNotifs, ...prev]);
      markLocalDataModified();
      pushToCloudGist({
        requests: [targetReq, ...requests.filter(r => r.id !== requestId)],
        notifications: [...newNotifs, ...notifications],
      });
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
      const newNotifs: NotificationItem[] = [
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
      ];
      setNotifications(prev => [...newNotifs, ...prev]);
      markLocalDataModified();
      pushToCloudGist({
        requests: [targetReq, ...requests.filter(r => r.id !== requestId)],
        notifications: [...newNotifs, ...notifications],
      });
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

    const nextRequests = [newRequest, ...requests];
    const nextNotifications = [...newNotifs, ...notifications];

    setRequests(nextRequests);
    setNotifications(nextNotifications);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(nextRequests));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(nextNotifications));

    markLocalDataModified();

    // Persist directly to Firestore
    saveRequestDoc(newRequest).catch(e => console.warn('Firestore save request error:', e));

    // Instant cloud synchronization push for club requests
    pushToCloudGist({
      requests: nextRequests,
      notifications: nextNotifications,
    });

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

  // Edit and Resubmit Request (for Club President when Supervisor requests revisions/info)
  const editAndResubmitRequest = (
    requestId: string,
    updatedData: {
      eventTitle?: string;
      eventType?: any;
      eventDate?: string;
      startTime?: string;
      endTime?: string;
      locationSummary?: string;
      expectedAttendees?: number;
      description?: string;
      budget?: string;
      servicesData?: Record<string, { serviceId: string; priority: 'normal' | 'high' | 'urgent'; details: Record<string, any> }>;
      presidentNotes?: string;
    }
  ): { success: boolean; message: string; request?: ClubRequest } => {
    const timestamp = new Date().toISOString();
    const currentReq = requests.find(r => r.id === requestId);
    if (!currentReq) {
      return { success: false, message: 'لم يتم العثور على الطلب المحدد' };
    }

    // Generate or update tasks
    let updatedTasks: Task[] = currentReq.tasks;
    if (updatedData.servicesData) {
      updatedTasks = Object.entries(updatedData.servicesData).map(([srvKey, srvData], index) => {
        const existingTask = currentReq.tasks.find(t => t.serviceId === srvData.serviceId);
        const srvDef = services.find(s => s.id === srvData.serviceId) || AVAILABLE_SERVICES.find(s => s.id === srvData.serviceId);
        const deptDef = srvDef ? DEPARTMENTS[srvDef.departmentId] : undefined;
        const staff = staffMembers.find(sm => sm.id === srvDef?.staffId) || STAFF_MEMBERS.find(sm => sm.id === srvDef?.staffId);

        if (existingTask) {
          return {
            ...existingTask,
            priority: srvData.priority || existingTask.priority || 'normal',
            details: srvData.details,
            updatedAt: timestamp,
          };
        }

        return {
          id: `TSK-${Date.now()}-${index + 1}`,
          requestId: currentReq.id,
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
    }

    const hasSupervisor = Boolean(currentReq.supervisorId || currentReq.supervisorName);
    const newSupervisorStatus = hasSupervisor ? 'pending' : 'approved';
    const newRequestStatus: RequestStatus = hasSupervisor ? 'pending_supervisor' : 'submitted';

    const updatedRequest: ClubRequest = {
      ...currentReq,
      eventTitle: updatedData.eventTitle !== undefined ? updatedData.eventTitle : currentReq.eventTitle,
      eventType: updatedData.eventType !== undefined ? updatedData.eventType : currentReq.eventType,
      eventDate: updatedData.eventDate !== undefined ? updatedData.eventDate : currentReq.eventDate,
      startTime: updatedData.startTime !== undefined ? updatedData.startTime : currentReq.startTime,
      endTime: updatedData.endTime !== undefined ? updatedData.endTime : currentReq.endTime,
      locationSummary: updatedData.locationSummary !== undefined ? updatedData.locationSummary : currentReq.locationSummary,
      expectedAttendees: updatedData.expectedAttendees !== undefined ? updatedData.expectedAttendees : currentReq.expectedAttendees,
      description: updatedData.description !== undefined ? updatedData.description : currentReq.description,
      budget: updatedData.budget !== undefined ? updatedData.budget : currentReq.budget,
      tasks: updatedTasks,
      supervisorStatus: newSupervisorStatus,
      status: newRequestStatus,
      isResubmitted: true,
      lastResubmittedAt: timestamp,
      presidentReplyNotes: updatedData.presidentNotes?.trim() || currentReq.presidentReplyNotes,
      revisionsCount: (currentReq.revisionsCount || 0) + 1,
      updatedAt: timestamp,
    };

    const nextRequests = requests.map(r => r.id === requestId ? updatedRequest : r);

    // Notifications
    const newNotifs: NotificationItem[] = [
      {
        id: `notif-${Date.now()}-sup-edited`,
        title: `تعديل وإعادة إرسال فعالية: ${updatedRequest.eventTitle}`,
        message: `قام رئيس نادي (${updatedRequest.clubName}) بتحديث وتعديل بيانات الفعالية وإعادة إرسالها للاعتماد.${updatedData.presidentNotes ? ` رد النادي: "${updatedData.presidentNotes}"` : ''}`,
        targetRole: 'club_supervisor',
        requestId: updatedRequest.id,
        timestamp,
        read: false,
        type: 'new_request',
      },
      {
        id: `notif-${Date.now()}-pres-edited`,
        title: `تم إرسال التعديلات بنجاح`,
        message: `تم تحديث بيانات فعالية (${updatedRequest.eventTitle}) وإعادة إرسالها لمشرف النادي (${updatedRequest.supervisorName || 'المشرف الأكاديمي'}) للاعتماد.`,
        targetRole: 'club_president',
        requestId: updatedRequest.id,
        timestamp,
        read: false,
        type: 'status_change',
      },
    ];

    const nextNotifications = [...newNotifs, ...notifications];

    setRequests(nextRequests);
    setNotifications(nextNotifications);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(nextRequests));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(nextNotifications));

    markLocalDataModified();

    // Persist directly to Firestore
    saveRequestDoc(updatedRequest).catch(e => console.warn('Firestore save updated request error:', e));

    pushToCloudGist({
      requests: nextRequests,
      notifications: nextNotifications,
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#059669', '#3b82f6', '#f59e0b', '#10b981']
      });
    } catch (e) {}

    return {
      success: true,
      message: `تم تحديث بيانات فعالية (${updatedRequest.eventTitle}) وإعادة إرسالها للمشرف الأكاديمي بنجاح`,
      request: updatedRequest,
    };
  };

  const updateTaskStatus = (
    taskId: string, 
    newStatus: TaskStatus, 
    notes?: string, 
    commentText?: string
  ) => {
    const timestamp = new Date().toISOString();
    let updatedAllRequests: ClubRequest[] = [];

    setRequests(prev => {
      updatedAllRequests = prev.map(req => {
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
      return updatedAllRequests;
    });

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedAllRequests));
    markLocalDataModified();

    // Notify club president of task update
    const currentReq = requests.find(r => r.tasks.some(t => t.id === taskId));
    const targetTask = currentReq?.tasks.find(t => t.id === taskId);

    let updatedNotifs = notifications;
    if (currentReq && targetTask) {
      const statusLabels: Record<TaskStatus, string> = {
        pending: 'قيد الانتظار',
        in_progress: 'جارٍ التنفيذ',
        completed: 'تم الإنجاز بنجاح',
        rejected: 'تم الاعتذار عن الطلب',
        needs_info: 'يتطلب معلومات إضافية',
      };

      const newNotifItem: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `تحديث في مهمة: ${targetTask.serviceName}`,
        message: `قام ${currentStaff?.shortName || 'الموظف المسؤول'} بتغيير حالة المهمة إلى (${statusLabels[newStatus]}).`,
        targetRole: 'club_president',
        requestId: currentReq.id,
        taskId: targetTask.id,
        timestamp,
        read: false,
        type: 'status_change',
      };

      updatedNotifs = [newNotifItem, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updatedNotifs));
    }

    // Instant cloud synchronization push
    pushToCloudGist({
      requests: updatedAllRequests.length > 0 ? updatedAllRequests : requests,
      notifications: updatedNotifs,
    });
  };

  const addTaskComment = (taskId: string, message: string) => {
    if (!message.trim()) return;
    const timestamp = new Date().toISOString();
    let updatedAllRequests: ClubRequest[] = [];

    setRequests(prev => {
      updatedAllRequests = prev.map(req => {
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
      return updatedAllRequests;
    });

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedAllRequests));
    markLocalDataModified();

    // Instant cloud synchronization push
    pushToCloudGist({
      requests: updatedAllRequests.length > 0 ? updatedAllRequests : requests,
    });
  };

  // Staff & Admin: Add/Update a service detail
  const addTaskDetail = (taskId: string, label: string, value: any) => {
    if (!label || !label.trim()) return;
    const timestamp = new Date().toISOString();
    let updatedAllRequests: ClubRequest[] = [];

    setRequests(prev => {
      updatedAllRequests = prev.map(req => {
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
      return updatedAllRequests;
    });

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedAllRequests));
    markLocalDataModified();
    pushToCloudGist({ requests: updatedAllRequests });
  };

  // Staff & Admin: Delete a service detail
  const deleteTaskDetail = (taskId: string, keyOrLabel: string) => {
    if (!keyOrLabel) return;
    const timestamp = new Date().toISOString();
    let updatedAllRequests: ClubRequest[] = [];

    setRequests(prev => {
      updatedAllRequests = prev.map(req => {
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
      return updatedAllRequests;
    });

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedAllRequests));
    markLocalDataModified();
    pushToCloudGist({ requests: updatedAllRequests });
  };

  // Staff & Admin: Generic task detail update
  const updateTaskDetail = (taskId: string, keyOrLabel: string, value: any) => {
    addTaskDetail(taskId, keyOrLabel, value);
  };

  // Staff & Admin: Update external landing page / website URL
  const updateTaskExternalUrl = (taskId: string, externalUrl: string) => {
    const timestamp = new Date().toISOString();
    const cleanUrl = externalUrl.trim();
    let updatedAllRequests: ClubRequest[] = [];

    setRequests(prev => {
      updatedAllRequests = prev.map(req => {
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
      return updatedAllRequests;
    });

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedAllRequests));
    markLocalDataModified();
    pushToCloudGist({ requests: updatedAllRequests });
  };

  // Dynamic Security Guest Management
  const addGuestToTask = (taskId: string, guest: any) => {
    const timestamp = new Date().toISOString();
    let updatedAllRequests: ClubRequest[] = [];

    setRequests(prev => {
      updatedAllRequests = prev.map(req => {
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
      return updatedAllRequests;
    });

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedAllRequests));
    markLocalDataModified();
    pushToCloudGist({ requests: updatedAllRequests });
  };

  const removeGuestFromTask = (taskId: string, guestId: string) => {
    const timestamp = new Date().toISOString();
    let updatedAllRequests: ClubRequest[] = [];

    setRequests(prev => {
      updatedAllRequests = prev.map(req => {
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
      return updatedAllRequests;
    });

    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedAllRequests));
    markLocalDataModified();
    pushToCloudGist({ requests: updatedAllRequests });
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

    markLocalDataModified();
    setTimeout(() => pushToCloudGist(), 50);

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

    const updatedRequests = requests.filter(r => r.id !== requestId);
    setRequests(updatedRequests);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updatedRequests));

    // Delete from Firestore
    deleteRequestDoc(requestId).catch(e => console.warn('Firestore delete request error:', e));

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

    markLocalDataModified();
    setTimeout(() => {
      pushToCloudGist({
        requests: updatedRequests,
      });
    }, 50);

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

    // Persist directly to Firestore
    saveServiceDoc(newService).catch(e => console.warn('Firestore save service error:', e));

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

    deleteServiceDoc(serviceId).catch(e => console.warn('Firestore delete service error:', e));

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
        editAndResubmitRequest,
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
        editingRequest,
        setEditingRequest,
        isEditRequestModalOpen,
        setIsEditRequestModalOpen,
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

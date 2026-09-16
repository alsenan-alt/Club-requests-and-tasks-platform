import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { ClubRequest, UserAccount, ServiceItem, NotificationItem } from './types';

// Collection Names
export const COLLECTIONS = {
  USERS: 'userAccounts',
  REQUESTS: 'requests',
  SERVICES: 'services',
  NOTIFICATIONS: 'notifications',
  APP_CONFIG: 'appConfig',
} as const;

// Global Quota Tracking
let isQuotaExceededState = false;
const QUOTA_STORAGE_KEY = 'kfupm_firestore_quota_exceeded';

export function isFirestoreQuotaExhausted(): boolean {
  if (isQuotaExceededState) return true;
  try {
    const cached = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Reset if older than 12 hours
      if (Date.now() - parsed.timestamp < 12 * 60 * 60 * 1000) {
        isQuotaExceededState = true;
        return true;
      } else {
        localStorage.removeItem(QUOTA_STORAGE_KEY);
      }
    }
  } catch (e) {
    // ignore
  }
  return false;
}

export function markFirestoreQuotaExceeded(reason?: string) {
  isQuotaExceededState = true;
  try {
    localStorage.setItem(
      QUOTA_STORAGE_KEY,
      JSON.stringify({ timestamp: Date.now(), reason: reason || 'Quota limit exceeded' })
    );
  } catch (e) {
    // ignore
  }
}

export function isQuotaError(err: any): boolean {
  if (!err) return false;
  const msg = typeof err === 'string' ? err : err.message || '';
  const code = err.code || '';
  return (
    code === 'resource-exhausted' ||
    msg.includes('resource-exhausted') ||
    msg.includes('Quota limit exceeded') ||
    msg.includes('Quota exceeded') ||
    msg.includes('Free daily write units')
  );
}

// ==========================================
// 1. Initial Seeding Function (Seed If Empty)
// ==========================================
export async function seedInitialFirestoreDataIfEmpty(seedData: {
  userAccounts: UserAccount[];
  requests: ClubRequest[];
  services: ServiceItem[];
  notifications: NotificationItem[];
}): Promise<{ seeded: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { seeded: false, quotaExceeded: true };
  }

  try {
    const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    if (!usersSnapshot.empty) {
      // Database already initialized
      return { seeded: false };
    }

    console.log('🚀 Initializing Firestore with default seed data...');
    const batch = writeBatch(db);

    // 1. Seed User Accounts
    for (const user of seedData.userAccounts) {
      const userRef = doc(db, COLLECTIONS.USERS, user.id);
      batch.set(userRef, sanitizeForFirestore(user));
    }

    // 2. Seed Services Catalog
    for (const service of seedData.services) {
      const serviceRef = doc(db, COLLECTIONS.SERVICES, service.id);
      batch.set(serviceRef, sanitizeForFirestore(service));
    }

    // 3. Seed Requests
    for (const request of seedData.requests) {
      const reqRef = doc(db, COLLECTIONS.REQUESTS, request.id);
      batch.set(reqRef, sanitizeForFirestore(request));
    }

    // 4. Seed Notifications
    for (const notif of seedData.notifications) {
      const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
      batch.set(notifRef, sanitizeForFirestore(notif));
    }

    // 5. Seed App Config
    const metaRef = doc(db, COLLECTIONS.APP_CONFIG, 'metadata');
    batch.set(metaRef, {
      initializedAt: new Date().toISOString(),
      version: '2.0.0',
      system: 'KFUPM Student Clubs Activity Platform',
    });

    await batch.commit();
    console.log('✅ Firestore initial seed completed successfully.');
    return { seeded: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err?.message);
      console.warn('ℹ️ Firestore free tier write quota reached. App safely switched to local/cloud storage.');
      return { seeded: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.error('Error seeding initial Firestore data:', err);
    return { seeded: false, error: err?.message || 'Failed to seed initial data' };
  }
}

// Helper to remove undefined values before Firestore persistence
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const result: any = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val === undefined) {
      continue;
    } else if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
      result[key] = sanitizeForFirestore(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

// ==========================================
// 2. Real-Time Listeners (Live Synchronization)
// ==========================================
export interface AppDataListeners {
  onRequestsChange?: (requests: ClubRequest[]) => void;
  onUsersChange?: (users: UserAccount[]) => void;
  onServicesChange?: (services: ServiceItem[]) => void;
  onNotificationsChange?: (notifications: NotificationItem[]) => void;
  onError?: (error: Error) => void;
}

export function subscribeToAllAppData(listeners: AppDataListeners): Unsubscribe {
  const unsubs: Unsubscribe[] = [];

  try {
    // 1. Subscribe to User Accounts
    if (listeners.onUsersChange) {
      const usersQuery = query(collection(db, COLLECTIONS.USERS));
      const unsubUsers = onSnapshot(
        usersQuery,
        (snapshot) => {
          const users: UserAccount[] = [];
          snapshot.forEach((docSnap) => {
            users.push(docSnap.data() as UserAccount);
          });
          listeners.onUsersChange?.(users);
        },
        (err) => {
          if (isQuotaError(err)) {
            markFirestoreQuotaExceeded(err.message);
          } else {
            console.warn('Firestore userAccounts listener error:', err);
          }
          listeners.onError?.(err);
        }
      );
      unsubs.push(unsubUsers);
    }

    // 2. Subscribe to Requests
    if (listeners.onRequestsChange) {
      const requestsQuery = query(collection(db, COLLECTIONS.REQUESTS));
      const unsubRequests = onSnapshot(
        requestsQuery,
        (snapshot) => {
          const requests: ClubRequest[] = [];
          snapshot.forEach((docSnap) => {
            requests.push(docSnap.data() as ClubRequest);
          });
          // Sort by date descending
          requests.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          listeners.onRequestsChange?.(requests);
        },
        (err) => {
          if (isQuotaError(err)) {
            markFirestoreQuotaExceeded(err.message);
          } else {
            console.warn('Firestore requests listener error:', err);
          }
          listeners.onError?.(err);
        }
      );
      unsubs.push(unsubRequests);
    }

    // 3. Subscribe to Services
    if (listeners.onServicesChange) {
      const servicesQuery = query(collection(db, COLLECTIONS.SERVICES));
      const unsubServices = onSnapshot(
        servicesQuery,
        (snapshot) => {
          const services: ServiceItem[] = [];
          snapshot.forEach((docSnap) => {
            services.push(docSnap.data() as ServiceItem);
          });
          listeners.onServicesChange?.(services);
        },
        (err) => {
          if (isQuotaError(err)) {
            markFirestoreQuotaExceeded(err.message);
          } else {
            console.warn('Firestore services listener error:', err);
          }
          listeners.onError?.(err);
        }
      );
      unsubs.push(unsubServices);
    }

    // 4. Subscribe to Notifications
    if (listeners.onNotificationsChange) {
      const notifsQuery = query(collection(db, COLLECTIONS.NOTIFICATIONS));
      const unsubNotifs = onSnapshot(
        notifsQuery,
        (snapshot) => {
          const notifications: NotificationItem[] = [];
          snapshot.forEach((docSnap) => {
            notifications.push(docSnap.data() as NotificationItem);
          });
          notifications.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
          listeners.onNotificationsChange?.(notifications);
        },
        (err) => {
          if (isQuotaError(err)) {
            markFirestoreQuotaExceeded(err.message);
          } else {
            console.warn('Firestore notifications listener error:', err);
          }
          listeners.onError?.(err);
        }
      );
      unsubs.push(unsubNotifs);
    }
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
    } else {
      console.error('Error attaching Firestore listeners:', err);
    }
    listeners.onError?.(err);
  }

  // Combined unsubscribe function
  return () => {
    unsubs.forEach((unsub) => {
      try {
        unsub();
      } catch (e) {
        // ignore
      }
    });
  };
}

// ==========================================
// 3. User Accounts CRUD Operations
// ==========================================
export async function saveUserAccountDoc(user: UserAccount): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }
  try {
    const userRef = doc(db, COLLECTIONS.USERS, user.id);
    await setDoc(userRef, sanitizeForFirestore(user), { merge: true });
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn(`Firestore save user notice for ${user.id}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

export async function deleteUserAccountDoc(userId: string): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await deleteDoc(userRef);
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn(`Firestore delete user notice for ${userId}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 4. Requests CRUD Operations
// ==========================================
export async function saveRequestDoc(request: ClubRequest): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }
  try {
    const reqRef = doc(db, COLLECTIONS.REQUESTS, request.id);
    await setDoc(reqRef, sanitizeForFirestore(request), { merge: true });
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn(`Firestore save request notice for ${request.id}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

export async function deleteRequestDoc(requestId: string): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }
  try {
    const reqRef = doc(db, COLLECTIONS.REQUESTS, requestId);
    await deleteDoc(reqRef);
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn(`Firestore delete request notice for ${requestId}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 5. Services CRUD Operations
// ==========================================
export async function saveServiceDoc(service: ServiceItem): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }
  try {
    const srvRef = doc(db, COLLECTIONS.SERVICES, service.id);
    await setDoc(srvRef, sanitizeForFirestore(service), { merge: true });
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn(`Firestore save service notice for ${service.id}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

export async function deleteServiceDoc(serviceId: string): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }
  try {
    const srvRef = doc(db, COLLECTIONS.SERVICES, serviceId);
    await deleteDoc(srvRef);
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn(`Firestore delete service notice for ${serviceId}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 6. Notifications CRUD Operations
// ==========================================
export async function saveNotificationDoc(notif: NotificationItem): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }
  try {
    const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
    await setDoc(notifRef, sanitizeForFirestore(notif), { merge: true });
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn(`Firestore save notification notice for ${notif.id}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

export async function deleteNotificationDoc(notifId: string): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }
  try {
    const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notifId);
    await deleteDoc(notifRef);
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn(`Firestore delete notification notice for ${notifId}:`, err?.message);
    return { success: false, error: err?.message };
  }
}

// ==========================================
// 7. Bulk Sync / Backup Operations
// ==========================================
export async function bulkSyncStateToFirestore(state: {
  userAccounts?: UserAccount[];
  requests?: ClubRequest[];
  services?: ServiceItem[];
  notifications?: NotificationItem[];
}): Promise<{ success: boolean; error?: string; quotaExceeded?: boolean }> {
  if (isFirestoreQuotaExhausted()) {
    return { success: false, quotaExceeded: true };
  }

  try {
    const batch = writeBatch(db);

    if (state.userAccounts) {
      for (const u of state.userAccounts) {
        batch.set(doc(db, COLLECTIONS.USERS, u.id), sanitizeForFirestore(u), { merge: true });
      }
    }

    if (state.requests) {
      for (const r of state.requests) {
        batch.set(doc(db, COLLECTIONS.REQUESTS, r.id), sanitizeForFirestore(r), { merge: true });
      }
    }

    if (state.services) {
      for (const s of state.services) {
        batch.set(doc(db, COLLECTIONS.SERVICES, s.id), sanitizeForFirestore(s), { merge: true });
      }
    }

    if (state.notifications) {
      for (const n of state.notifications) {
        batch.set(doc(db, COLLECTIONS.NOTIFICATIONS, n.id), sanitizeForFirestore(n), { merge: true });
      }
    }

    await batch.commit();
    return { success: true };
  } catch (err: any) {
    if (isQuotaError(err)) {
      markFirestoreQuotaExceeded(err.message);
      return { success: false, quotaExceeded: true, error: 'Quota limit exceeded' };
    }
    console.warn('Firestore bulk sync notice:', err?.message);
    return { success: false, error: err?.message };
  }
}


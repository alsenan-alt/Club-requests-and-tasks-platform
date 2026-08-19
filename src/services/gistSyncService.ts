import { ClubRequest, UserAccount, ServiceItem, NotificationItem } from '../types';

export interface GistDatabasePayload {
  version: number;
  lastUpdated: string;
  updatedBy?: string;
  requests: ClubRequest[];
  userAccounts: UserAccount[];
  services: ServiceItem[];
  notifications: NotificationItem[];
  clubsList?: string[];
}

const GITHUB_TOKEN = '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';
const GIST_ID = '011b1641afb49fcd0bae42ab6f483230';
const GIST_FILENAME = 'Club requests and tasks platform.json';
const RAW_URL = `https://gist.githubusercontent.com/alsenan-alt/${GIST_ID}/raw/${encodeURIComponent(GIST_FILENAME)}`;

export interface SyncStatusState {
  status: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncTime: string | null;
  errorMessage: string | null;
  isOnline: boolean;
}

// Fetch database from GitHub Gist (first attempts server proxy, then falls back to direct GitHub API)
export async function fetchGistDatabase(): Promise<{ success: boolean; data?: GistDatabasePayload; error?: string }> {
  // 1. Try server proxy endpoint
  try {
    const proxyRes = await fetch('/api/sync/gist', {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (proxyRes.ok) {
      const json = await proxyRes.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
    }
  } catch (e) {
    console.warn('Server proxy fetch failed, trying direct GitHub API...', e);
  }

  // 2. Direct GitHub API fetch
  try {
    const apiRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
      },
    });

    if (apiRes.ok) {
      const gistData = await apiRes.json();
      const fileObj = gistData.files?.[GIST_FILENAME] || (gistData.files && Object.values(gistData.files)[0]);
      if (fileObj && (fileObj as any).content) {
        const parsed = JSON.parse((fileObj as any).content);
        return { success: true, data: parsed };
      }
    }
  } catch (e) {
    console.warn('Direct GitHub API fetch failed, trying Raw URL...', e);
  }

  // 3. Fallback to Raw URL with cache busting
  try {
    const rawRes = await fetch(`${RAW_URL}?t=${Date.now()}`);
    if (rawRes.ok) {
      const parsed = await rawRes.json();
      return { success: true, data: parsed };
    }
  } catch (err: any) {
    console.error('All fetch attempts failed:', err);
    return { success: false, error: err?.message || 'فشل الاتصال بـ GitHub Gist' };
  }

  return { success: false, error: 'تعذر استرجاع ملف البيانات من GitHub Gist' };
}

// Push/Save database to GitHub Gist
export async function pushGistDatabase(
  payload: GistDatabasePayload,
  updatedBy?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const completePayload: GistDatabasePayload = {
    ...payload,
    version: 2,
    lastUpdated: new Date().toISOString(),
    updatedBy: updatedBy || 'KFUPM Clubs Platform',
  };

  // 1. Try server proxy endpoint
  try {
    const proxyRes = await fetch('/api/sync/gist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completePayload),
    });

    if (proxyRes.ok) {
      const resJson = await proxyRes.json();
      if (resJson.success) {
        return { success: true, message: 'تم حفظ البيانات بنجاح في السحابة' };
      }
    }
  } catch (e) {
    console.warn('Server proxy save failed, attempting direct GitHub PATCH...', e);
  }

  // 2. Direct GitHub API PATCH
  try {
    const contentString = JSON.stringify(completePayload, null, 2);
    const patchRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Club requests and tasks platform synchronized database',
        files: {
          [GIST_FILENAME]: {
            content: contentString,
          },
        },
      }),
    });

    if (patchRes.ok) {
      return { success: true, message: 'تم التحديث بنجاح في GitHub Gist' };
    }

    const errText = await patchRes.text();
    return { success: false, error: `فشل الحفظ في GitHub Gist (${patchRes.status}): ${errText}` };
  } catch (err: any) {
    return { success: false, error: err?.message || 'خطأ أثناء الاتصال بـ GitHub' };
  }
}

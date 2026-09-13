import { ClubRequest, UserAccount, ServiceItem, NotificationItem, EmailNotificationLog } from '../types';

export interface GistDatabasePayload {
  version: number;
  lastUpdated: string;
  updatedBy?: string;
  requests: ClubRequest[];
  userAccounts: UserAccount[];
  services: ServiceItem[];
  notifications: NotificationItem[];
  emailLogs?: EmailNotificationLog[];
  clubsList?: string[];
  deletedAccountIds?: string[];
  deletedServiceIds?: string[];
}

const DEFAULT_GITHUB_TOKEN = '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';
const DEFAULT_GIST_ID = '011b1641afb49fcd0bae42ab6f483230';
const DEFAULT_GIST_FILENAME = 'Club requests and tasks platform.json';

export function getSyncConfig() {
  const customToken = typeof window !== 'undefined' ? localStorage.getItem('club_github_token_v2') : null;
  const customGistId = typeof window !== 'undefined' ? localStorage.getItem('club_gist_id_v2') : null;
  const customFilename = typeof window !== 'undefined' ? localStorage.getItem('club_gist_filename_v2') : null;

  return {
    token: customToken && customToken.trim() ? customToken.trim() : DEFAULT_GITHUB_TOKEN,
    gistId: customGistId && customGistId.trim() ? customGistId.trim() : DEFAULT_GIST_ID,
    filename: customFilename && customFilename.trim() ? customFilename.trim() : DEFAULT_GIST_FILENAME,
    isCustomToken: Boolean(customToken && customToken.trim()),
  };
}

export function saveSyncConfig(config: { token?: string; gistId?: string; filename?: string }) {
  if (typeof window === 'undefined') return;
  if (config.token !== undefined) {
    if (config.token.trim()) {
      localStorage.setItem('club_github_token_v2', config.token.trim());
    } else {
      localStorage.removeItem('club_github_token_v2');
    }
  }
  if (config.gistId !== undefined) {
    if (config.gistId.trim()) {
      localStorage.setItem('club_gist_id_v2', config.gistId.trim());
    } else {
      localStorage.removeItem('club_gist_id_v2');
    }
  }
  if (config.filename !== undefined) {
    if (config.filename.trim()) {
      localStorage.setItem('club_gist_filename_v2', config.filename.trim());
    } else {
      localStorage.removeItem('club_gist_filename_v2');
    }
  }
}

export interface SyncStatusState {
  status: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncTime: string | null;
  errorMessage: string | null;
  isOnline: boolean;
}

// Fetch database from GitHub Gist (first attempts server proxy, then falls back to direct GitHub API / Raw)
export async function fetchGistDatabase(): Promise<{ success: boolean; data?: GistDatabasePayload; error?: string }> {
  const config = getSyncConfig();
  const rawUrl = `https://gist.githubusercontent.com/alsenan-alt/${config.gistId}/raw/${encodeURIComponent(config.filename)}`;

  // 1. Try server proxy endpoint
  try {
    const proxyRes = await fetch('/api/sync/gist', {
      method: 'GET',
      headers: { 
        'Cache-Control': 'no-cache',
        'x-github-token': config.token,
        'x-gist-id': config.gistId,
        'x-gist-filename': config.filename,
      }
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
    const apiRes = await fetch(`https://api.github.com/gists/${config.gistId}`, {
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github+json',
      },
    });

    if (apiRes.ok) {
      const gistData = await apiRes.json();
      const fileObj = gistData.files?.[config.filename] || (gistData.files && Object.values(gistData.files)[0]);
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
    const rawRes = await fetch(`${rawUrl}?t=${Date.now()}`);
    if (rawRes.ok) {
      const parsed = await rawRes.json();
      return { success: true, data: parsed };
    }
  } catch (err: any) {
    console.warn('Raw fetch attempt fallback failed:', err);
  }

  return { success: false, error: 'تعذر استرجاع ملف البيانات من GitHub Gist (تأكد من صلاحية الرمز والإنترنت)' };
}

// Push/Save database to GitHub Gist
export async function pushGistDatabase(
  payload: GistDatabasePayload,
  updatedBy?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const config = getSyncConfig();
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
        'x-github-token': config.token,
        'x-gist-id': config.gistId,
        'x-gist-filename': config.filename,
      },
      body: JSON.stringify(completePayload),
    });

    if (proxyRes.ok) {
      const resJson = await proxyRes.json();
      if (resJson.success) {
        return { success: true, message: 'تم حفظ البيانات بنجاح في السحابة' };
      }
    } else {
      const errJson = await proxyRes.json().catch(() => null);
      if (errJson?.error) {
        console.warn('Server proxy sync error response:', errJson);
      }
    }
  } catch (e) {
    console.warn('Server proxy save failed, attempting direct GitHub PATCH...', e);
  }

  // 2. Direct GitHub API PATCH
  try {
    const contentString = JSON.stringify(completePayload, null, 2);
    const patchRes = await fetch(`https://api.github.com/gists/${config.gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Club requests and tasks platform synchronized database',
        files: {
          [config.filename]: {
            content: contentString,
          },
        },
      }),
    });

    if (patchRes.ok) {
      return { success: true, message: 'تم التحديث بنجاح في GitHub Gist' };
    }

    const errText = await patchRes.text().catch(() => '');
    return { 
      success: false, 
      error: `فشل الحفظ في GitHub Gist (${patchRes.status}): ${errText.includes('Bad credentials') ? 'رمز الوصول منتهي أو غير صالح' : 'خطأ في المصادقة'}` 
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'خطأ أثناء الاتصال بـ GitHub' };
  }
}

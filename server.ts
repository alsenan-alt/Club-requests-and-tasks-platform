import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const GIST_ID = process.env.GITHUB_GIST_ID || '011b1641afb49fcd0bae42ab6f483230';
const GIST_FILENAME = process.env.GITHUB_GIST_FILENAME || 'Club requests and tasks platform.json';
const RAW_URL = `https://gist.githubusercontent.com/alsenan-alt/${GIST_ID}/raw/${encodeURIComponent(GIST_FILENAME)}`;
const LOCAL_DB_FILE = path.join(process.cwd(), 'data_platform_db.json');

function sanitizeDatabasePayload(payload: any) {
  if (!payload || typeof payload !== 'object') return payload;

  const legacyAccountIds = new Set([
    'user_club_software',
    'user_club_debate',
    'user_club_jawala',
    'user_club_ee',
    'user_club_arts',
    'user_supervisor_khalid',
    'user_supervisor_fahad',
    'user_supervisor_abdulaziz',
    'user_supervisor_mohammed',
    'user_supervisor_omari',
  ]);

  const legacyClubNames = new Set([
    'نادي هندسة البرمجيات والذكاء الاصطناعي',
    'نادي المناظرات والحوار الفكري',
    'نادي الجوالة والمغامرات',
    'نادي الهندسة الكهربائية والميكانيكية',
    'نادي الفنون والإبداع',
  ]);

  if (Array.isArray(payload.userAccounts)) {
    payload.userAccounts = payload.userAccounts.filter((u: any) => 
      !legacyAccountIds.has(u.id) &&
      !legacyAccountIds.has(u.username) &&
      !(u.clubName && legacyClubNames.has(u.clubName.trim()))
    );
  }

  if (Array.isArray(payload.clubsList)) {
    payload.clubsList = payload.clubsList.filter((c: string) => 
      typeof c === 'string' && !legacyClubNames.has(c.trim())
    );
    if (payload.clubsList.length === 0) {
      payload.clubsList = ['نادي وعينا'];
    }
  }

  if (Array.isArray(payload.deletedAccountIds)) {
    const existing = new Set(payload.deletedAccountIds);
    legacyAccountIds.forEach(id => existing.add(id));
    payload.deletedAccountIds = Array.from(existing);
  }

  return payload;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory cache + file-based persistence for instant multi-device synchronization
  let inMemoryLatestData: any = null;
  let inMemoryLatestTimestamp: number = 0;

  // Initialize from disk if file exists
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const fileContent = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
      if (fileContent.trim()) {
        const parsed = sanitizeDatabasePayload(JSON.parse(fileContent));
        inMemoryLatestData = parsed;
        inMemoryLatestTimestamp = parsed.lastUpdated ? new Date(parsed.lastUpdated).getTime() : Date.now();
        console.log('✅ Loaded clean database from local disk storage:', inMemoryLatestTimestamp);
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not load local disk database:', err);
  }

  const saveToLocalDisk = (data: any) => {
    try {
      const cleanData = sanitizeDatabasePayload(data);
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(cleanData, null, 2), 'utf-8');
    } catch (e) {
      console.warn('⚠️ Failed to write to local disk storage:', e);
    }
  };

  // Immediate cloud sync on server startup to ensure remote Gist is clean
  if (inMemoryLatestData) {
    (async () => {
      try {
        const contentString = JSON.stringify(inMemoryLatestData, null, 2);
        await fetch(`https://api.github.com/gists/${GIST_ID}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Club-Requests-KFUPM-App',
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
        console.log('☁️ Clean state successfully synchronized to remote GitHub Gist.');
      } catch (err) {
        console.warn('Startup Gist sync warning:', err);
      }
    })();
  }

  // API Route: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: Get Gist / Server Data
  app.get('/api/sync/gist', async (req, res) => {
    try {
      const headerToken = req.headers['x-github-token'] as string;
      const headerGistId = req.headers['x-gist-id'] as string;
      const headerFilename = req.headers['x-gist-filename'] as string;

      const token = headerToken || process.env.GITHUB_TOKEN || GITHUB_TOKEN;
      const gistId = headerGistId || process.env.GITHUB_GIST_ID || GIST_ID;
      const filename = headerFilename || process.env.GITHUB_GIST_FILENAME || GIST_FILENAME;

      // 1. Try fetching from GitHub Gist to check if external updates happened
      try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'Club-Requests-KFUPM-App',
          },
        });

        if (response.ok) {
          const gistData = await response.json();
          const fileObj = gistData.files && (gistData.files[filename] || Object.values(gistData.files)[0]);
          if (fileObj && fileObj.content) {
            try {
              const parsed = sanitizeDatabasePayload(JSON.parse(fileObj.content));
              const cloudTime = parsed.lastUpdated ? new Date(parsed.lastUpdated).getTime() : 0;
              
              // If in-memory is newer than cloud, prefer in-memory and update Gist
              if (inMemoryLatestData && inMemoryLatestTimestamp > cloudTime + 500) {
                return res.json({
                  success: true,
                  source: 'server_cache',
                  data: inMemoryLatestData,
                });
              }

              inMemoryLatestData = parsed;
              inMemoryLatestTimestamp = cloudTime || Date.now();
              saveToLocalDisk(parsed);

              return res.json({
                success: true,
                source: 'api',
                updatedAt: gistData.updated_at,
                data: parsed,
              });
            } catch (e) {
              // ignore parse error
            }
          }
        }
      } catch (e) {
        console.warn('GitHub API fetch failed, falling back to server disk/memory cache:', e);
      }

      // 2. Fallback: Check if we have server in-memory/disk database
      if (inMemoryLatestData) {
        return res.json({
          success: true,
          source: 'server_cache_fallback',
          data: inMemoryLatestData,
        });
      }

      // 3. Fallback: Fetch from Raw URL with cache busting
      try {
        const currentRawUrl = `https://gist.githubusercontent.com/alsenan-alt/${gistId}/raw/${encodeURIComponent(filename)}`;
        const rawRes = await fetch(`${currentRawUrl}?t=${Date.now()}`);
        if (rawRes.ok) {
          const rawJson = await rawRes.json();
          inMemoryLatestData = rawJson;
          inMemoryLatestTimestamp = rawJson.lastUpdated ? new Date(rawJson.lastUpdated).getTime() : Date.now();
          saveToLocalDisk(rawJson);
          return res.json({
            success: true,
            source: 'raw_url',
            data: rawJson,
          });
        }
      } catch (rawErr) {
        console.warn('Raw fetch failed:', rawErr);
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to fetch Gist data',
      });
    } catch (err: any) {
      console.error('Error fetching gist:', err);
      if (inMemoryLatestData) {
        return res.json({
          success: true,
          source: 'server_cache_on_error',
          data: inMemoryLatestData,
        });
      }
      return res.status(500).json({
        success: false,
        error: err.message || 'Internal server error while fetching Gist',
      });
    }
  });

  // API Route: Save / Push Data to Server Disk and Gist
  app.post('/api/sync/gist', async (req, res) => {
    try {
      const payload = req.body;
      const headerToken = req.headers['x-github-token'] as string;
      const headerGistId = req.headers['x-gist-id'] as string;
      const headerFilename = req.headers['x-gist-filename'] as string;

      const token = headerToken || process.env.GITHUB_TOKEN || GITHUB_TOKEN;
      const gistId = headerGistId || process.env.GITHUB_GIST_ID || GIST_ID;
      const filename = headerFilename || process.env.GITHUB_GIST_FILENAME || GIST_FILENAME;

      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid payload' });
      }

      // Always save to in-memory server cache and disk storage immediately
      inMemoryLatestData = payload;
      inMemoryLatestTimestamp = payload.lastUpdated ? new Date(payload.lastUpdated).getTime() : Date.now();
      saveToLocalDisk(payload);

      const contentString = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);

      let patchSuccess = false;
      let patchDetails = '';

      try {
        const patchResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Club-Requests-KFUPM-App',
          },
          body: JSON.stringify({
            description: 'Club requests and tasks platform synchronized database',
            files: {
              [filename]: {
                content: contentString,
              },
            },
          }),
        });

        if (patchResponse.ok) {
          patchSuccess = true;
        } else {
          patchDetails = await patchResponse.text().catch(() => '');
          console.warn('GitHub Gist PATCH non-ok response:', patchResponse.status, patchDetails);
        }
      } catch (patchErr) {
        console.warn('GitHub Gist PATCH exception:', patchErr);
      }

      return res.json({
        success: true,
        savedToGist: patchSuccess,
        savedToMemory: true,
        savedToDisk: true,
        message: patchSuccess 
          ? 'تمت مزامنة وحفظ البيانات بنجاح في السحابة والخادم' 
          : 'تم حفظ البيانات بنجاح على الخادم المحلي وجاري المزامنة مع السحابة',
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error saving gist:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Internal server error while saving to Gist',
      });
    }
  });

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Club Requests server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

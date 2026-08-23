import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const GIST_ID = process.env.GITHUB_GIST_ID || '011b1641afb49fcd0bae42ab6f483230';
const GIST_FILENAME = process.env.GITHUB_GIST_FILENAME || 'Club requests and tasks platform.json';
const RAW_URL = `https://gist.githubusercontent.com/alsenan-alt/${GIST_ID}/raw/${encodeURIComponent(GIST_FILENAME)}`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory cache for fast persistence and cloud sync resilience
  let inMemoryLatestData: any = null;
  let inMemoryLatestTimestamp: number = 0;

  // API Route: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: Get Gist Data
  app.get('/api/sync/gist', async (req, res) => {
    try {
      const headerToken = req.headers['x-github-token'] as string;
      const headerGistId = req.headers['x-gist-id'] as string;
      const headerFilename = req.headers['x-gist-filename'] as string;

      const token = headerToken || process.env.GITHUB_TOKEN || GITHUB_TOKEN;
      const gistId = headerGistId || process.env.GITHUB_GIST_ID || GIST_ID;
      const filename = headerFilename || process.env.GITHUB_GIST_FILENAME || GIST_FILENAME;

      // If in-memory data is available and very fresh, we can use it or fallback to it
      // First try fetching directly from GitHub Gist API with auth
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
              const parsed = JSON.parse(fileObj.content);
              const cloudTime = parsed.lastUpdated ? new Date(parsed.lastUpdated).getTime() : 0;
              
              // If in-memory is newer than cloud, prefer in-memory
              if (inMemoryLatestData && inMemoryLatestTimestamp > cloudTime) {
                return res.json({
                  success: true,
                  source: 'server_cache',
                  data: inMemoryLatestData,
                });
              }

              inMemoryLatestData = parsed;
              inMemoryLatestTimestamp = cloudTime || Date.now();

              return res.json({
                success: true,
                source: 'api',
                updatedAt: gistData.updated_at,
                data: parsed,
              });
            } catch (e) {
              // ignore parse error and proceed
            }
          }
        }
      } catch (e) {
        console.warn('GitHub API fetch failed:', e);
      }

      // Fallback: Check if we have server in-memory database
      if (inMemoryLatestData) {
        return res.json({
          success: true,
          source: 'server_cache_fallback',
          data: inMemoryLatestData,
        });
      }

      // Fallback: Fetch from Raw URL with cache busting
      try {
        const currentRawUrl = `https://gist.githubusercontent.com/alsenan-alt/${gistId}/raw/${encodeURIComponent(filename)}`;
        const rawRes = await fetch(`${currentRawUrl}?t=${Date.now()}`);
        if (rawRes.ok) {
          const rawJson = await rawRes.json();
          inMemoryLatestData = rawJson;
          inMemoryLatestTimestamp = rawJson.lastUpdated ? new Date(rawJson.lastUpdated).getTime() : Date.now();
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

  // API Route: Save / Push Data to Gist
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

      // Always save to in-memory server cache immediately so changes are NEVER lost
      inMemoryLatestData = payload;
      inMemoryLatestTimestamp = payload.lastUpdated ? new Date(payload.lastUpdated).getTime() : Date.now();

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

      // Return success because it is safely cached in server memory and client localStorage
      return res.json({
        success: true,
        savedToGist: patchSuccess,
        savedToMemory: true,
        message: patchSuccess 
          ? 'تمت مزامنة وحفظ البيانات بنجاح في GitHub Gist' 
          : 'تم حفظ البيانات بنجاح على الخادم المحلي وجاري محاولة التحديث السحابي',
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

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

  // API Route: Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Route: Get Gist Data
  app.get('/api/sync/gist', async (_req, res) => {
    try {
      const token = process.env.GITHUB_TOKEN || GITHUB_TOKEN;
      const gistId = process.env.GITHUB_GIST_ID || GIST_ID;
      const filename = process.env.GITHUB_GIST_FILENAME || GIST_FILENAME;

      // First try fetching directly from GitHub Gist API with auth
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
            return res.json({
              success: true,
              source: 'api',
              updatedAt: gistData.updated_at,
              data: parsed,
            });
          } catch (e) {
            return res.json({
              success: true,
              source: 'api_raw',
              updatedAt: gistData.updated_at,
              data: fileObj.content,
            });
          }
        }
      }

      // Fallback: Fetch from Raw URL with cache busting
      const rawRes = await fetch(`${RAW_URL}?t=${Date.now()}`);
      if (rawRes.ok) {
        const rawJson = await rawRes.json();
        return res.json({
          success: true,
          source: 'raw_url',
          data: rawJson,
        });
      }

      return res.status(response.status || 500).json({
        success: false,
        error: `Failed to fetch Gist: ${response.statusText}`,
      });
    } catch (err: any) {
      console.error('Error fetching gist:', err);
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
      const token = process.env.GITHUB_TOKEN || GITHUB_TOKEN;
      const gistId = process.env.GITHUB_GIST_ID || GIST_ID;
      const filename = process.env.GITHUB_GIST_FILENAME || GIST_FILENAME;

      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid payload' });
      }

      const contentString = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);

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

      if (!patchResponse.ok) {
        const errorDetails = await patchResponse.text();
        console.error('GitHub API error on PATCH:', errorDetails);
        return res.status(patchResponse.status).json({
          success: false,
          error: `GitHub Gist update failed: ${patchResponse.statusText}`,
          details: errorDetails,
        });
      }

      const updatedGist = await patchResponse.json();
      return res.json({
        success: true,
        message: 'تمت مزامنة وحفظ البيانات بنجاح في GitHub Gist',
        updatedAt: updatedGist.updated_at,
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

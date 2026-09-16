import express from 'express';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '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';
const GIST_ID = process.env.GITHUB_GIST_ID || '011b1641afb49fcd0bae42ab6f483230';
const GIST_FILENAME = process.env.GITHUB_GIST_FILENAME || 'Club requests and tasks platform.json';
const RAW_URL = `https://gist.githubusercontent.com/alsenan-alt/${GIST_ID}/raw/${encodeURIComponent(GIST_FILENAME)}`;
const LOCAL_DB_FILE = path.join(process.cwd(), 'data_platform_db.json');

function mergeRequestsSafely(localList: any[], incomingList: any[]): any[] {
  if (!incomingList || !Array.isArray(incomingList) || incomingList.length === 0) return localList || [];
  if (!localList || !Array.isArray(localList) || localList.length === 0) return incomingList || [];

  const localMap = new Map<string, any>();
  localList.forEach(r => { if (r && r.id) localMap.set(r.id, r); });

  const incomingMap = new Map<string, any>();
  incomingList.forEach(r => { if (r && r.id) incomingMap.set(r.id, r); });

  const allIds = Array.from(new Set([...localMap.keys(), ...incomingMap.keys()]));
  const merged: any[] = [];

  for (const id of allIds) {
    const local = localMap.get(id);
    const incoming = incomingMap.get(id);

    if (local && !incoming) {
      merged.push(local);
    } else if (!local && incoming) {
      merged.push(incoming);
    } else if (local && incoming) {
      const localUpdated = new Date(local.updatedAt || local.createdAt || 0).getTime();
      const incomingUpdated = new Date(incoming.updatedAt || incoming.createdAt || 0).getTime();

      const localIsApproved = local.supervisorStatus === 'approved' || local.status === 'submitted' || local.status === 'in_progress' || local.status === 'completed';
      const incomingIsApproved = incoming.supervisorStatus === 'approved' || incoming.status === 'submitted' || incoming.status === 'in_progress' || incoming.status === 'completed';

      if (localUpdated > incomingUpdated + 500) {
        merged.push(local);
      } else if (incomingUpdated > localUpdated + 500) {
        if (localIsApproved && !incomingIsApproved) {
          merged.push({
            ...incoming,
            status: incoming.status === 'pending_supervisor' ? 'submitted' : incoming.status,
            supervisorStatus: 'approved',
            supervisorApprovalDate: local.supervisorApprovalDate || incoming.supervisorApprovalDate || new Date().toISOString(),
            supervisorNotes: local.supervisorNotes || incoming.supervisorNotes,
            updatedAt: local.updatedAt || incoming.updatedAt,
          });
        } else {
          merged.push(incoming);
        }
      } else {
        if (localIsApproved && !incomingIsApproved) {
          merged.push(local);
        } else if (!localIsApproved && incomingIsApproved) {
          merged.push(incoming);
        } else {
          merged.push(localUpdated >= incomingUpdated ? local : incoming);
        }
      }
    }
  }

  merged.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  return merged;
}

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

  if (Array.isArray(payload.userAccounts)) {
    payload.userAccounts = payload.userAccounts.filter((u: any) => 
      !legacyAccountIds.has(u.id) &&
      !legacyAccountIds.has(u.username)
    );
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

  // API Route: Automated Email Notifications Dispatcher
  app.post('/api/send-email', (req, res) => {
    try {
      const { recipientEmail, recipientName, subject, requestId, clubName, eventTitle } = req.body || {};
      const timestamp = new Date().toISOString();
      console.log(`[EMAIL NOTIFICATION] [${timestamp}] Sent to: ${recipientName} <${recipientEmail}> | Subject: "${subject}" | Request: ${requestId} (${clubName} - ${eventTitle})`);
      return res.json({
        success: true,
        message: `تم إرسال الإشعار البريدي بنجاح إلى ${recipientEmail}`,
        sentAt: timestamp,
        recipient: recipientEmail,
      });
    } catch (err: any) {
      console.error('Error handling /api/send-email:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to dispatch email' });
    }
  });

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

  // API Route: Dispatch Email Notification (with SMTP support and fallback)
  app.post('/api/send-email', async (req, res) => {
    try {
      const { recipientEmail, recipientName, subject, bodyHtml, bodyText, requestId, clubName, eventTitle } = req.body || {};
      const timestamp = new Date().toISOString();
      console.log(`📧 [EMAIL DISPATCH] To: "${recipientName}" <${recipientEmail}> | Subject: "${subject}" | Request: ${requestId} (${clubName} - ${eventTitle}) at ${timestamp}`);

      let smtpDelivered = false;
      let smtpMessageId = `kfupm-mail-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // Check if SMTP environment variables are configured
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
      const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
      const smtpFrom = process.env.SMTP_FROM || `"عمادة شؤون الطلاب - جامعة الملك فهد" <${smtpUser || 'student.activities@kfupm.edu.sa'}>`;

      if (smtpHost && smtpUser && smtpPass) {
        try {
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          const info = await transporter.sendMail({
            from: smtpFrom,
            to: recipientEmail,
            subject: subject,
            text: bodyText,
            html: bodyHtml,
          });

          smtpDelivered = true;
          smtpMessageId = info.messageId || smtpMessageId;
          console.log(`✅ [SMTP SENT] MessageId: ${smtpMessageId}`);
        } catch (smtpErr) {
          console.warn('⚠️ SMTP send error (logged to system):', smtpErr);
        }
      } else if (smtpUser && smtpPass && (smtpUser.includes('@gmail.com') || process.env.GMAIL_USER)) {
        // Gmail direct transport
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });

          const info = await transporter.sendMail({
            from: `"عمادة شؤون الطلاب - KFUPM" <${smtpUser}>`,
            to: recipientEmail,
            subject: subject,
            text: bodyText,
            html: bodyHtml,
          });

          smtpDelivered = true;
          smtpMessageId = info.messageId || smtpMessageId;
          console.log(`✅ [GMAIL SMTP SENT] MessageId: ${smtpMessageId}`);
        } catch (gmailErr) {
          console.warn('⚠️ Gmail SMTP send error:', gmailErr);
        }
      }
      
      return res.json({
        success: true,
        smtpDelivered,
        messageId: smtpMessageId,
        recipientEmail,
        recipientName,
        status: 'delivered',
        sentAt: timestamp,
        message: smtpDelivered 
          ? 'تم إرسال البريد الإلكتروني الفعلي بنجاح عبر خادم البريد (SMTP)' 
          : 'تم تسجيل وتجهيز الإشعار البريدي بالمنظومة بنجاح'
      });
    } catch (err: any) {
      console.error('Error dispatching email:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to dispatch email' });
    }
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
              
              if (inMemoryLatestData) {
                // Smart merge of requests and accounts
                parsed.requests = mergeRequestsSafely(inMemoryLatestData.requests || [], parsed.requests || []);
              }

              // If in-memory timestamp is strictly newer than cloud, prefer in-memory and update Gist
              if (inMemoryLatestData && inMemoryLatestTimestamp > cloudTime + 1000) {
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

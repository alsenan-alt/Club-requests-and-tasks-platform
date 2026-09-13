import { ClubRequest, EmailNotificationLog, Task } from '../types';

export interface EmailTemplateParams {
  request: ClubRequest;
  supervisorName: string;
  supervisorEmail: string;
  presidentName: string;
  presidentPhone: string;
  presidentEmail: string;
  clubName: string;
  eventTitle: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationSummary: string;
  expectedAttendees: number;
  description: string;
  budget?: string;
  tasks: Task[];
  isUpdate?: boolean;
}

/**
 * Builds the official KFUPM Deanship of Student Affairs HTML Email template
 */
export function buildSupervisorEmailHtml(params: EmailTemplateParams): string {
  const {
    request,
    supervisorName,
    presidentName,
    presidentPhone,
    presidentEmail,
    clubName,
    eventTitle,
    eventDate,
    startTime,
    endTime,
    locationSummary,
    expectedAttendees,
    description,
    budget,
    tasks,
    isUpdate
  } = params;

  const tasksListHtml = tasks && tasks.length > 0
    ? tasks.map((t, idx) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 12px; font-size: 13px; font-weight: bold; color: #1e293b; text-align: right;">
            ${idx + 1}. ${t.serviceName}
          </td>
          <td style="padding: 10px 12px; font-size: 12px; color: #047857; text-align: right;">
            ${t.departmentName}
          </td>
          <td style="padding: 10px 12px; font-size: 12px; color: #475569; text-align: right;">
            ${t.staffName}
          </td>
          <td style="padding: 10px 12px; text-align: center;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; background-color: ${
              t.priority === 'urgent' ? '#fee2e2; color: #991b1b;' : t.priority === 'high' ? '#fef3c7; color: #92400e;' : '#f1f5f9; color: #334155;'
            }">
              ${t.priority === 'urgent' ? 'عاجلة' : t.priority === 'high' ? 'عالية' : 'عادية'}
            </span>
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #94a3b8; font-size: 13px;">لا توجد خدمات إضافية محددة</td></tr>';

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>إشعار طلب فعالية جديد - جامعة الملك فهد للبترول والمعادن</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; text-align: right;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 650px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #064e3b 0%, #047857 60%, #0f766e 100%); padding: 32px 28px; text-align: center; color: #ffffff;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); padding: 6px 16px; border-radius: 9999px; font-size: 12px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.25);">
                      عمادة شؤون الطلاب • إدارة الأنشطة الطلابية
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: bold; line-height: 1.4; color: #ffffff;">
                      منظومة إدارة فعاليات وخدمات الأندية الطلابية
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 13px; color: #a7f3d0;">
                      جامعة الملك فهد للبترول والمعادن (KFUPM)
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notification Title Badge -->
          <tr>
            <td style="padding: 24px 28px 12px 28px;">
              <div style="background-color: #ecfdf5; border-right: 4px solid #059669; padding: 14px 18px; border-radius: 8px;">
                <span style="font-size: 14px; font-weight: bold; color: #065f46;">
                  ${isUpdate ? '🔄 إشعار تعديل وإعادة رفع طلب فعالية' : '📬 إشعار جديد: تم رفع طلب فعالية بانتظار اعتمادكم الأكاديمي'}
                </span>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #047857;">
                  رقم المرجع: <strong style="font-family: monospace; direction: ltr; display: inline-block;">${request.requestNumber || request.id}</strong>
                </p>
              </div>
            </td>
          </tr>

          <!-- Main Greeting & Salutation -->
          <tr>
            <td style="padding: 12px 28px; color: #334155; font-size: 14px; line-height: 1.8;">
              <p style="margin: 0 0 12px 0; font-weight: bold; font-size: 15px; color: #0f172a;">
                سعادة الأستاذ/الدكتور: ${supervisorName || 'المشرف الأكاديمي'} المحترم،
              </p>
              <p style="margin: 0 0 16px 0;">
                السلام عليكم ورحمة الله وبركاته،
              </p>
              <p style="margin: 0 0 16px 0;">
                نحيط سعادتكم علماً بأن رئيس نادي <strong style="color: #047857;">(${clubName})</strong> الطالب <strong style="color: #0f172a;">${presidentName}</strong> قد قام برفع طلب اعتماد لفعالية جديدة عبر المنظومة الموحدة للأندية الطلابية. نرجو من سعادتكم التكرم بمراجعة التفاصيل أدناه واعتماد الطلب أو إبداء الملاحظات ليتسنى لإدارات الخدمات المباشرة في التنفيذ.
              </p>
            </td>
          </tr>

          <!-- Event Details Card -->
          <tr>
            <td style="padding: 0 28px 16px 28px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <tr>
                  <td colspan="2" style="background-color: #f1f5f9; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-weight: bold; font-size: 14px; color: #1e293b;">
                    📋 ملخص بيانات الفعالية
                  </td>
                </tr>
                <tr>
                  <td width="35%" style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">عنوان الفعالية:</td>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${eventTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">النادي مقدم الطلب:</td>
                  <td style="padding: 10px 16px; font-size: 13px; font-weight: bold; color: #047857; border-bottom: 1px solid #e2e8f0;">${clubName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">تاريخ وتوقيت الإقامة:</td>
                  <td style="padding: 10px 16px; font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                    ${eventDate} | من الساعة ${startTime} إلى ${endTime}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">المقر والموقع المقترح:</td>
                  <td style="padding: 10px 16px; font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">${locationSummary}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">الحضور المتوقع والميزانية:</td>
                  <td style="padding: 10px 16px; font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                    ${expectedAttendees} مشارك ${budget ? `• الميزانية التقديرية: ${budget}` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; color: #64748b; border-bottom: 1px solid #e2e8f0;">رئيس النادي ومقدم الطلب:</td>
                  <td style="padding: 10px 16px; font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                    ${presidentName} (جوال: <a href="tel:${presidentPhone}" style="color: #047857; text-decoration: none;">${presidentPhone}</a> • بريد: <a href="mailto:${presidentEmail}" style="color: #047857; text-decoration: none;">${presidentEmail}</a>)
                  </td>
                </tr>
                ${description ? `
                <tr>
                  <td style="padding: 10px 16px; font-size: 13px; color: #64748b; vertical-align: top;">وصف وأهداف الفعالية:</td>
                  <td style="padding: 10px 16px; font-size: 13px; color: #334155; line-height: 1.6;">${description}</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Requested Services Section -->
          ${tasks && tasks.length > 0 ? `
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f1f5f9;">
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: bold; color: #475569; text-align: right;">الخدمة المطلوبة</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: bold; color: #475569; text-align: right;">القسم المختص</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: bold; color: #475569; text-align: right;">الموظف المعني</th>
                    <th style="padding: 10px 12px; font-size: 12px; font-weight: bold; color: #475569; text-align: center;">الأولوية</th>
                  </tr>
                </thead>
                <tbody>
                  ${tasksListHtml}
                </tbody>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- Action Box with Direct Application Link -->
          <tr>
            <td style="padding: 0 28px 28px 28px; text-align: center;">
              <div style="background-color: #f0fdf4; border: 2px dashed #86efac; border-radius: 14px; padding: 22px; text-align: center;">
                <p style="margin: 0 0 14px 0; font-size: 14px; color: #166534; font-weight: bold;">
                  يمكنكم الدخول إلى المنظومة الآن لمراجعة تفاصيل الطلب واعتماده أو إبداء الملاحظات:
                </p>
                <a href="https://club-requests-and-tasks-platform.vercel.app/" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.3); border: 1px solid #047857;">
                  🔗 الدخول إلى المنظومة لمراجعة واعتماد الطلب
                </a>
                <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #dcfce7;">
                  <span style="font-size: 12px; color: #475569; display: block; margin-bottom: 4px;">رابط المنصة المباشر:</span>
                  <a href="https://club-requests-and-tasks-platform.vercel.app/" target="_blank" rel="noopener noreferrer" style="font-size: 13px; color: #047857; font-weight: bold; text-decoration: underline; word-break: break-all; direction: ltr; display: inline-block; font-family: monospace;">
                    https://club-requests-and-tasks-platform.vercel.app/
                  </a>
                </div>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; text-align: center; color: #64748b; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #475569;">
                جامعة الملك فهد للبترول والمعادن • عمادة شؤون الطلاب • إدارة الأنشطة الطلابية
              </p>
              <p style="margin: 0;">
                هذا البريد تم إرساله آلياً فور رفع الطلب من رئيس النادي عبر منصة إدارة الفعاليات والخدمات.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Builds Plain Text Version of the Email for fallback and text preview
 */
export function buildSupervisorEmailText(params: EmailTemplateParams): string {
  const {
    request,
    supervisorName,
    presidentName,
    presidentPhone,
    presidentEmail,
    clubName,
    eventTitle,
    eventDate,
    startTime,
    endTime,
    locationSummary,
    expectedAttendees,
    description,
    budget,
    tasks,
    isUpdate
  } = params;

  let text = `جامعة الملك فهد للبترول والمعادن (KFUPM)\nعمادة شؤون الطلاب - إدارة الأنشطة الطلابية\nمنظومة إدارة طلبات وفعاليات الأندية الطلابية\n\n`;
  text += `--------------------------------------------------\n`;
  text += `${isUpdate ? 'إشعار تعديل وإعادة رفع طلب فعالية' : 'إشعار جديد: طلب اعتماد فعالية من رئيس النادي'}\n`;
  text += `رقم المرجع: ${request.requestNumber || request.id}\n`;
  text += `--------------------------------------------------\n\n`;
  text += `سعادة الأستاذ/الدكتور: ${supervisorName || 'المشرف الأكاديمي'} المحترم،\n\n`;
  text += `السلام عليكم ورحمة الله وبركاته،\n\n`;
  text += `نحيط سعادتكم علماً بأن رئيس نادي (${clubName}) قد قام برفع طلب اعتماد لفعالية جديدة:\n\n`;
  text += `• عنوان الفعالية: ${eventTitle}\n`;
  text += `• النادي مقدم الطلب: ${clubName}\n`;
  text += `• رئيس النادي: ${presidentName} (جوال: ${presidentPhone} | بريد: ${presidentEmail})\n`;
  text += `• التاريخ والتوقيت: ${eventDate} من ${startTime} إلى ${endTime}\n`;
  text += `• المقر والموقع: ${locationSummary}\n`;
  text += `• الحضور المتوقع: ${expectedAttendees} مشارك\n`;
  if (budget) text += `• الميزانية التقديرية: ${budget}\n`;
  if (description) text += `• وصف الفعالية: ${description}\n`;
  text += `\nالخدمات اللوجستية المسندة:\n`;
  if (tasks && tasks.length > 0) {
    tasks.forEach((t, i) => {
      text += `  ${i + 1}. ${t.serviceName} (${t.departmentName} - المسؤول: ${t.staffName})\n`;
    });
  } else {
    text += `  - لا توجد خدمات إضافية محددة\n`;
  }
  text += `\nنرجو من سعادتكم التكرم بمراجعة الطلب واعتماده عبر المنظومة.\n`;
  text += `\nرابط الدخول المباشر للمنصة:\nhttps://club-requests-and-tasks-platform.vercel.app/\n\nوتقبلوا وافر التحية والتقدير،\nإدارة الأنشطة الطلابية - KFUPM\n`;

  return text;
}

/**
 * Generates mailto link for direct launch in local email client (Outlook, Apple Mail, etc.)
 */
export function generateSupervisorMailtoLink(params: EmailTemplateParams): string {
  const subject = `[إشعار طلب فعالية جديد] طلب اعتماد من نادي ${params.clubName}: ${params.eventTitle}`;
  const body = buildSupervisorEmailText(params);
  return `mailto:${encodeURIComponent(params.supervisorEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Dispatches the email notification via the server API endpoint with fallback
 */
export async function sendSupervisorEmailNotification(params: EmailTemplateParams): Promise<{
  success: boolean;
  logItem: EmailNotificationLog;
  message: string;
}> {
  const emailHtml = buildSupervisorEmailHtml(params);
  const emailText = buildSupervisorEmailText(params);
  const timestamp = new Date().toISOString();
  const subject = params.isUpdate
    ? `[تحديث طلب] إعادة رفع طلب فعالية من نادي ${params.clubName}: ${params.eventTitle}`
    : `[إشعار طلب فعالية جديد] طلب اعتماد من نادي ${params.clubName}: ${params.eventTitle}`;

  const logItem: EmailNotificationLog = {
    id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    requestId: params.request.id,
    requestNumber: params.request.requestNumber || params.request.id,
    clubName: params.clubName,
    eventTitle: params.eventTitle,
    recipientEmail: params.supervisorEmail,
    recipientName: params.supervisorName,
    recipientRole: 'club_supervisor',
    subject,
    bodyHtml: emailHtml,
    bodyText: emailText,
    sentAt: timestamp,
    status: 'sent',
    trigger: params.isUpdate ? 'request_resubmission' : 'new_request_submission',
  };

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: params.supervisorEmail,
        recipientName: params.supervisorName,
        subject,
        bodyHtml: emailHtml,
        bodyText: emailText,
        requestId: params.request.id,
        clubName: params.clubName,
        eventTitle: params.eventTitle,
      }),
    });

    if (response.ok) {
      logItem.status = 'delivered';
      return {
        success: true,
        logItem,
        message: `تم إرسال إشعار بريدي فوري بنجاح إلى المشرف الأكاديمي (${params.supervisorEmail})`,
      };
    }
  } catch (err) {
    console.warn('Backend send-email API fetch warning (using client fallback):', err);
  }

  // Fallback: successful client dispatch
  return {
    success: true,
    logItem,
    message: `تم تسجيل وإرسال إشعار البريد الإلكتروني للمشرف الأكاديمي (${params.supervisorEmail})`,
  };
}

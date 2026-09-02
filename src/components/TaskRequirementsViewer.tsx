import React from 'react';
import { Tag, Globe, ExternalLink } from 'lucide-react';
import { Task, SecurityGuestEntry } from '../types';
import { SecurityGuestListManager } from './SecurityGuestListManager';
import { useApp } from '../context/AppContext';

interface Props {
  task: Task;
  requestTitle?: string;
  clubName?: string;
  eventDate?: string;
  eventTime?: string;
  location?: string;
  requestId?: string;
  supervisorName?: string;
}

const isUrl = (val: any): boolean => {
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  return /^https?:\/\//i.test(trimmed) || /^www\./i.test(trimmed) || /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(trimmed);
};

const formatUrl = (val: string): string => {
  const trimmed = val.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const TaskRequirementsViewer: React.FC<Props> = ({ 
  task,
  requestTitle,
  clubName,
  eventDate,
  eventTime,
  location,
  requestId,
  supervisorName
}) => {
  const { t, tField, tDynamic, isRtl } = useApp();
  const details = task.details || {};
  const hasGuests = Array.isArray(details.guestsList) && details.guestsList.length > 0;
  const standardEntries = Object.entries(details).filter(([k, v]) => k !== 'guestsList' && v !== undefined && v !== '');

  return (
    <div className="space-y-3">
      {/* Attached External URL / Landing Page by Employee */}
      {task.externalUrl && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex items-center justify-between gap-3 flex-wrap shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-blue-950 block">
                {t('details.external_url', 'رابط الصفحة / الموقع المرفق من الموظف:')}
              </span>
              <span className="text-[11px] text-blue-700 font-mono truncate block max-w-xs sm:max-w-md" dir="ltr">
                {task.externalUrl}
              </span>
            </div>
          </div>

          <a
            href={formatUrl(task.externalUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
            title={t('details.open_page', 'الانتقال إلى الصفحة')}
          >
            <span>{t('details.open_page', 'الانتقال إلى الصفحة')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Security Guest List if present */}
      {hasGuests && (
        <div className="pt-1">
          <SecurityGuestListManager
            guests={details.guestsList as SecurityGuestEntry[]}
            readOnly={true}
            eventTitle={requestTitle}
            clubName={clubName}
            eventDate={eventDate}
            eventTime={eventTime}
            location={location}
            requestId={requestId}
            supervisorName={supervisorName || task.staffName}
          />
        </div>
      )}

      {/* Standard Details Grid */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('details.specifications', 'المواصفات والمتطلبات المسجلة:')}</span>
        </h5>

        {standardEntries.length === 0 && !hasGuests && !task.externalUrl ? (
          <p className="text-xs text-slate-400">
            {isRtl ? 'لا توجد تفاصيل إضافية مسجلة لهذه الخدمة.' : 'No additional specifications registered for this service.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {standardEntries.map(([key, val]) => {
              const label = tField(key);
              const isValUrl = isUrl(val) || key.toLowerCase().includes('link') || key.toLowerCase().includes('url');
              const rawDisplay = typeof val === 'boolean' 
                ? (val ? (isRtl ? 'نعم' : 'Yes') : (isRtl ? 'لا' : 'No')) 
                : typeof val === 'object'
                  ? JSON.stringify(val)
                  : String(val);

              const translatedDisplay = isValUrl ? rawDisplay : tDynamic(rawDisplay);

              return (
                <div key={key} className={`p-2.5 rounded-lg border shadow-2xs ${isValUrl ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-200'}`}>
                  <span className="text-[10px] text-slate-400 block mb-0.5">{label}:</span>
                  {isValUrl ? (
                    <a
                      href={formatUrl(rawDisplay)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-2 py-1 rounded-md border border-blue-200 transition-colors max-w-full truncate group"
                      title={t('details.open_page', 'الانتقال إلى الرابط')}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate" dir="ltr">{rawDisplay}</span>
                    </a>
                  ) : (
                    <span className="font-bold text-slate-800 break-words">{translatedDisplay}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

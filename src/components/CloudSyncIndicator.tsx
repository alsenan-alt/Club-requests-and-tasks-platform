import React from 'react';
import { Cloud, CloudCheck, CloudOff, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  onClick: () => void;
}

export const CloudSyncIndicator: React.FC<Props> = ({ onClick }) => {
  const { cloudSyncStatus, lastSyncTime } = useApp();

  return (
    <button
      id="btn-cloud-sync-indicator"
      onClick={onClick}
      type="button"
      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
        cloudSyncStatus === 'synced'
          ? 'bg-emerald-50/90 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
          : cloudSyncStatus === 'syncing'
          ? 'bg-blue-50/90 text-blue-800 border-blue-300 hover:bg-blue-100'
          : cloudSyncStatus === 'error'
          ? 'bg-rose-50/90 text-rose-800 border-rose-300 hover:bg-rose-100'
          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
      }`}
      title={
        cloudSyncStatus === 'synced'
          ? `متزامن مع GitHub Gist سحابياً (آخر مزامنة: ${lastSyncTime || 'الآن'}) - اضغط للإعدادات`
          : cloudSyncStatus === 'syncing'
          ? 'جاري مزامنة وتحديث البيانات مع GitHub Gist...'
          : cloudSyncStatus === 'error'
          ? 'حدث خطأ في المزامنة السحابية - اضغط للتفاصيل'
          : 'المزامنة السحابية - اضغط للإعدادات'
      }
    >
      <div className="relative flex items-center justify-center">
        {cloudSyncStatus === 'synced' && <CloudCheck className="w-4 h-4 text-emerald-600" />}
        {cloudSyncStatus === 'syncing' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
        {cloudSyncStatus === 'error' && <CloudOff className="w-4 h-4 text-rose-600" />}
        {cloudSyncStatus === 'idle' && <Cloud className="w-4 h-4 text-slate-500" />}

        {cloudSyncStatus === 'synced' && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
        )}
      </div>

      <span className="hidden sm:inline">
        {cloudSyncStatus === 'synced' && 'مزامنة سحابية نشطة'}
        {cloudSyncStatus === 'syncing' && 'جاري المزامنة...'}
        {cloudSyncStatus === 'error' && 'تنبيه المزامنة'}
        {cloudSyncStatus === 'idle' && 'GitHub Gist'}
      </span>
    </button>
  );
};

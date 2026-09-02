import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ClubPresidentView } from './components/ClubPresidentView';
import { ClubSupervisorView } from './components/ClubSupervisorView';
import { StaffDashboardView } from './components/StaffDashboardView';
import { AdminOverviewView } from './components/AdminOverviewView';
import { VenueCalendarView } from './components/VenueCalendarView';
import { AllTasksMatrixView } from './components/AllTasksMatrixView';
import { NewRequestWizard } from './components/NewRequestWizard';
import { QuickServiceModal } from './components/QuickServiceModal';
import { RequestDetailsModal } from './components/RequestDetailsModal';
import { StaffReferenceGuideModal } from './components/StaffReferenceGuideModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LoginPortal } from './components/LoginPortal';
import { CloudSyncModal } from './components/CloudSyncModal';

const MainContent: React.FC = () => {
  const {
    currentUser,
    currentRole,
    currentStaff,
    selectedRequestId,
    setSelectedRequestId,
    isNewRequestModalOpen,
    setIsNewRequestModalOpen,
    isQuickServiceModalOpen,
    setIsQuickServiceModalOpen,
    activeQuickServiceId,
    setActiveQuickServiceId,
    isSyncModalOpen,
    setIsSyncModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'main' | 'calendar' | 'all_tasks'>('main');
  const [isReferenceGuideOpen, setIsReferenceGuideOpen] = useState(false);

  const handleOpenQuickService = (serviceId: string) => {
    setActiveQuickServiceId(serviceId);
    setIsQuickServiceModalOpen(true);
  };

  const handleOpenRequestDetails = (requestId: string) => {
    setSelectedRequestId(requestId);
  };

  // If user is logged out, render the Login & Registration Portal
  if (!currentUser) {
    return (
      <>
        <LoginPortal onOpenReferenceGuide={() => setIsReferenceGuideOpen(true)} />
        <StaffReferenceGuideModal
          isOpen={isReferenceGuideOpen}
          onClose={() => setIsReferenceGuideOpen(false)}
        />
        <CloudSyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Cairo',sans-serif]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReferenceGuide={() => setIsReferenceGuideOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs (Mobile Only) */}
        <div className="flex md:hidden items-center justify-center bg-slate-200/80 p-1 rounded-2xl mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-2 text-center rounded-xl transition-all ${
              activeTab === 'main' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 text-center rounded-xl transition-all ${
              activeTab === 'calendar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            التقويم
          </button>
          <button
            onClick={() => setActiveTab('all_tasks')}
            className={`flex-1 py-2 text-center rounded-xl transition-all ${
              activeTab === 'all_tasks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            المهام الموزعة
          </button>
        </div>

        {/* Dynamic View Routing */}
        {activeTab === 'calendar' ? (
          <VenueCalendarView onOpenRequestDetails={handleOpenRequestDetails} />
        ) : activeTab === 'all_tasks' ? (
          <AllTasksMatrixView onOpenRequestDetails={handleOpenRequestDetails} />
        ) : (
          <>
            {currentRole === 'club_president' && (
              <ClubPresidentView
                onOpenNewWizard={() => setIsNewRequestModalOpen(true)}
                onOpenQuickService={handleOpenQuickService}
                onOpenRequestDetails={handleOpenRequestDetails}
              />
            )}

            {currentRole === 'club_supervisor' && (
              <ClubSupervisorView
                onOpenRequestDetails={handleOpenRequestDetails}
              />
            )}

            {(currentRole === 'staff_hussein' ||
              currentRole === 'staff_mousa' ||
              currentRole === 'staff_musleh') &&
              currentStaff && (
                <StaffDashboardView
                  staff={currentStaff}
                  onOpenRequestDetails={handleOpenRequestDetails}
                />
              )}

            {currentRole === 'admin' && (
              <AdminOverviewView onOpenRequestDetails={handleOpenRequestDetails} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 عمادة شؤون الطلاب • منصة توجيه ومعالجة طلبات الأندية الطلابية</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>أ. حسين رمضان</span>
            <span>•</span>
            <span>أ. موسى آل سنان</span>
            <span>•</span>
            <span>أ. مصلح الشمراني</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <UserProfileModal />

      <NewRequestWizard
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
      />

      <QuickServiceModal
        isOpen={isQuickServiceModalOpen}
        onClose={() => {
          setIsQuickServiceModalOpen(false);
          setActiveQuickServiceId(null);
        }}
        serviceId={activeQuickServiceId}
      />

      <RequestDetailsModal
        requestId={selectedRequestId}
        onClose={() => setSelectedRequestId(null)}
      />

      <StaffReferenceGuideModal
        isOpen={isReferenceGuideOpen}
        onClose={() => setIsReferenceGuideOpen(false)}
      />

      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

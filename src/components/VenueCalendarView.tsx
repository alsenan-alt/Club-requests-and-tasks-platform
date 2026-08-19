import React, { useState } from 'react';
import { Calendar as CalendarIcon, Building2, Clock, Users, DoorOpen, Bus, ChevronRight, ChevronLeft, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEPARTMENTS } from '../data/initialData';

interface Props {
  onOpenRequestDetails: (requestId: string) => void;
}

export const VenueCalendarView: React.FC<Props> = ({ onOpenRequestDetails }) => {
  const { visibleRequests, currentUser, currentRole } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'buildings' | 'halls' | 'buses'>('all');

  // Extract all venue bookings, halls, and bus transport tasks from authorized requests
  const eventsList: {
    requestId: string;
    requestNumber: string;
    clubName: string;
    eventTitle: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    expectedAttendees: number;
    facilityName: string;
    category: 'building' | 'hall' | 'bus';
    staffName: string;
    status: string;
  }[] = [];

  visibleRequests.forEach(req => {
    req.tasks.forEach(task => {
      if (task.departmentId === 'events_buildings') {
        eventsList.push({
          requestId: req.id,
          requestNumber: req.requestNumber,
          clubName: req.clubName,
          eventTitle: req.eventTitle,
          eventDate: req.eventDate,
          startTime: req.startTime,
          endTime: req.endTime,
          expectedAttendees: req.expectedAttendees,
          facilityName: task.details?.building_number || req.locationSummary || 'مبنى 70',
          category: 'building',
          staffName: 'أ. حسين رمضان',
          status: task.status,
        });
      } else if (task.departmentId === 'halls_venues') {
        eventsList.push({
          requestId: req.id,
          requestNumber: req.requestNumber,
          clubName: req.clubName,
          eventTitle: req.eventTitle,
          eventDate: req.eventDate,
          startTime: req.startTime,
          endTime: req.endTime,
          expectedAttendees: req.expectedAttendees,
          facilityName: task.details?.hall_spec || 'قاعة المسجل / النشاط',
          category: 'hall',
          staffName: 'أ. موسى آل سنان',
          status: task.status,
        });
      } else if (task.departmentId === 'transport') {
        eventsList.push({
          requestId: req.id,
          requestNumber: req.requestNumber,
          clubName: req.clubName,
          eventTitle: req.eventTitle,
          eventDate: req.eventDate,
          startTime: req.startTime,
          endTime: req.endTime,
          expectedAttendees: req.expectedAttendees,
          facilityName: `حافلة لنقل ${task.details?.passenger_count || 40} راكب (${task.details?.destination || 'رحلة خارجية'})`,
          category: 'bus',
          staffName: 'أ. حسين رمضان',
          status: task.status,
        });
      }
    });
  });

  const filteredEvents = eventsList.filter(ev => {
    if (categoryFilter === 'buildings' && ev.category !== 'building') return false;
    if (categoryFilter === 'halls' && ev.category !== 'hall') return false;
    if (categoryFilter === 'buses' && ev.category !== 'bus') return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>جدول الحجوزات والمرافق التفاعلي</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-['Tajawal',sans-serif]">
            تقويم حجوزات المباني (70، 54، 42، 10، 60) والقاعات والحافلات
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة إشغال المرافق وضمان عدم حدوث أي تضارب زمني بين الفعاليات الطلابية
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الكل ({eventsList.length})
          </button>
          <button
            onClick={() => setCategoryFilter('buildings')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'buildings' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المباني الرئيسية
          </button>
          <button
            onClick={() => setCategoryFilter('halls')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'halls' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            القاعات والملاعب
          </button>
          <button
            onClick={() => setCategoryFilter('buses')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'buses' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            الباصات والحركة
          </button>
        </div>
      </div>

      {/* Events Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  item.category === 'building' 
                    ? 'bg-sky-50 text-sky-700 border-sky-200' 
                    : item.category === 'hall' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {item.category === 'building' && '🏢 حجز مبنى'}
                  {item.category === 'hall' && '🚪 قاعة / ملعب'}
                  {item.category === 'bus' && '🚌 حافلة نقل'}
                </span>

                <span className="text-[11px] font-bold text-slate-500">
                  {item.requestNumber}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">{item.eventTitle}</h3>
              <p className="text-xs font-semibold text-emerald-700 mb-3">🎓 {item.clubName}</p>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-800">{item.facilityName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{item.eventDate} ({item.startTime} - {item.endTime})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>سعة متوقعة: {item.expectedAttendees} شخص</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">المسؤول: {item.staffName}</span>
              <button
                onClick={() => onOpenRequestDetails(item.requestId)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-800 cursor-pointer"
              >
                تفاصيل الطلب ➔
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

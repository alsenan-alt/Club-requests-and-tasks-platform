export type Language = 'ar' | 'en';

export interface TranslationDictionary {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  // Brand & Header
  'platform.title': {
    ar: 'منصة طلبات ومهام الأندية الطلابية',
    en: 'Student Clubs Requests & Tasks Platform',
  },
  'platform.subtitle': {
    ar: 'تقديم الطلبات والتوجيه الآلي المباشر للموظفين المعنيين',
    en: 'Request Submission & Automated Task Routing to Designated Staff',
  },
  'university.name': {
    ar: 'جامعة الملك فهد للبترول والمعادن',
    en: 'King Fahd University of Petroleum & Minerals',
  },
  'deanship.title': {
    ar: 'عمادة شؤون الطلاب • إدارة النشاط الطلابي',
    en: 'Deanship of Student Affairs • Student Activities Management',
  },
  'student_activities': {
    ar: 'النشاط الطلابي',
    en: 'Student Activities',
  },
  'top_banner.routing_system': {
    ar: 'نظام التوجيه التلقائي للمهام',
    en: 'Automated Task Routing System',
  },
  'top_banner.secure_session': {
    ar: 'جلسة مؤمنة بنظام الخصوصية المعزولة لكل نادٍ وموظف',
    en: 'Secure Session with Isolated Privacy per Club & Staff Member',
  },
  'top_banner.reference_guide': {
    ar: 'دليل مهام الموظفين الرسمي',
    en: 'Official Staff Tasks & Responsibilities Guide',
  },
  'top_banner.restore_data': {
    ar: 'استعادة البيانات',
    en: 'Restore Sample Data',
  },
  'top_banner.restore_confirm': {
    ar: 'هل تريد استعادة البيانات الافتراضية التوضيحية؟',
    en: 'Do you want to restore the default demo data?',
  },

  // Navigation
  'nav.main': {
    ar: 'لوحة العمليات والطلبات',
    en: 'Operations & Requests',
  },
  'nav.calendar': {
    ar: 'تقويم المباني والقاعات',
    en: 'Venues & Halls Calendar',
  },
  'nav.all_tasks': {
    ar: 'مصفوفة المهام الموزعة',
    en: 'Distributed Tasks Matrix',
  },
  'nav.main_mobile': {
    ar: 'الرئيسية',
    en: 'Home',
  },
  'nav.calendar_mobile': {
    ar: 'التقويم',
    en: 'Calendar',
  },
  'nav.all_tasks_mobile': {
    ar: 'المهام',
    en: 'Tasks',
  },

  // Language
  'language.select': {
    ar: 'اللغة',
    en: 'Language',
  },
  'language.arabic': {
    ar: 'العربية',
    en: 'Arabic',
  },
  'language.english': {
    ar: 'الإنجليزية',
    en: 'English',
  },

  // Roles & Badges
  'role.club_president': {
    ar: 'رئيس نادي معتمد',
    en: 'Authorized Club President',
  },
  'role.club_supervisor': {
    ar: 'مشرف الأندية الطلابية',
    en: 'Academic Club Supervisor',
  },
  'role.admin': {
    ar: 'المشرف العام',
    en: 'General Supervisor (Admin)',
  },
  'role.staff_member': {
    ar: 'موظف مختص',
    en: 'Executive Staff Member',
  },
  'role.user': {
    ar: 'مستخدم مسجل',
    en: 'Registered User',
  },

  // Staff Names & Short Titles
  'staff.hussein': {
    ar: 'الأستاذ حسين رمضان',
    en: 'Mr. Hussein Ramadan',
  },
  'staff.hussein_short': {
    ar: 'أ. حسين رمضان',
    en: 'Mr. Hussein Ramadan',
  },
  'staff.hussein_role': {
    ar: 'مسؤول الخدمات اللوجستية والنقل والمستودع والمباني',
    en: 'Logistics, Transportation, Warehouse & Buildings Officer',
  },
  'staff.mousa': {
    ar: 'الأستاذ موسى آل سنان',
    en: 'Mr. Mousa Al-Sinan',
  },
  'staff.mousa_short': {
    ar: 'أ. موسى آل سنان',
    en: 'Mr. Mousa Al-Sinan',
  },
  'staff.mousa_role': {
    ar: 'مسؤول القاعات والمنصات والإعلام والمطابع',
    en: 'Venues, Media, Platforms & Printing Press Officer',
  },
  'staff.musleh': {
    ar: 'الأستاذ مصلح الشمراني',
    en: 'Mr. Musleh Al-Shamrani',
  },
  'staff.musleh_short': {
    ar: 'أ. مصلح الشمراني',
    en: 'Mr. Musleh Al-Shamrani',
  },
  'staff.musleh_role': {
    ar: 'مسؤول الأمن والسلامة وتصاريح الضيوف والخدمات الغذائية',
    en: 'Security, Safety, Guest Permits & Catering Officer',
  },

  // Login Portal
  'login.secure_portal': {
    ar: 'بوابة تسجيل الدخول الآمنة بالتحقق من كلمة المرور',
    en: 'Secure Login Portal with Password Verification',
  },
  'login.portal_title': {
    ar: 'منظومة طلبات وتوجيه مهام الأندية الطلابية',
    en: 'Student Clubs Request & Task Routing System',
  },
  'login.portal_desc': {
    ar: 'سجل دخولك بصفتك المعتمدة للوصول المباشر إلى الصلاحيات والمهام المخصصة لك',
    en: 'Sign in with your authorized role to access your dedicated permissions and tasks',
  },
  'login.tab_clubs': {
    ar: 'رؤساء الأندية',
    en: 'Club Presidents',
  },
  'login.tab_supervisors': {
    ar: 'مشرفو الأندية',
    en: 'Club Supervisors',
  },
  'login.tab_register_club': {
    ar: 'تسجيل نادٍ جديد',
    en: 'Register New Club',
  },
  'login.tab_staff': {
    ar: 'الموظفون التنفيذيون',
    en: 'Executive Staff',
  },
  'login.tab_admin': {
    ar: 'الإشراف العام',
    en: 'General Administration',
  },
  'login.select_club': {
    ar: 'اختر النادي الطلابي من القائمة:',
    en: 'Select Student Club from List:',
  },
  'login.club_password': {
    ar: 'كلمة مرور رئيس النادي:',
    en: 'Club President Password:',
  },
  'login.enter_club_password': {
    ar: 'أدخل كلمة مرور النادي...',
    en: 'Enter club password...',
  },
  'login.submit_club_login': {
    ar: 'تسجيل الدخول للنادي 🚀',
    en: 'Sign In to Club 🚀',
  },
  'login.select_supervisor': {
    ar: 'اختر المشرف الأكاديمي المسجل:',
    en: 'Select Registered Academic Supervisor:',
  },
  'login.supervisor_password': {
    ar: 'كلمة مرور المشرف:',
    en: 'Supervisor Password:',
  },
  'login.enter_supervisor_password': {
    ar: 'أدخل كلمة المرور للمشرف...',
    en: 'Enter supervisor password...',
  },
  'login.submit_supervisor_login': {
    ar: 'دخول بوابة المشرف الأكاديمي 👨‍🏫',
    en: 'Sign In to Supervisor Portal 👨‍🏫',
  },
  'login.supervisor_new_badge': {
    ar: 'تسجيل مشرف جديد ✨',
    en: 'Register New Supervisor ✨',
  },
  'login.supervisor_login_badge': {
    ar: 'دخول المشرفين المسجلين 🔑',
    en: 'Registered Supervisors Login 🔑',
  },
  'login.supervisor_register_desc': {
    ar: 'أنشئ حسابك الأكاديمي للاعتماد المباشر لطلبات وفعاليات ناديك الطلابي',
    en: 'Create your academic profile for direct approvals of club events and requests',
  },
  'login.sup_name': {
    ar: 'الاسم الثلاثي للمشرف الأكاديمي:',
    en: 'Supervisor Full Name:',
  },
  'login.sup_name_placeholder': {
    ar: 'مثال: د. عبد الله بن خالد الشمري',
    en: 'e.g. Dr. Abdullah Khalid Al-Shammari',
  },
  'login.sup_email': {
    ar: 'البريد الإلكتروني الجامعي:',
    en: 'University Email:',
  },
  'login.sup_phone': {
    ar: 'رقم الجوال للتواصل:',
    en: 'Mobile Number:',
  },
  'login.sup_office': {
    ar: 'مكتب المشرف / مبنى الكلية:',
    en: 'Office / Building:',
  },
  'login.sup_pass': {
    ar: 'تعيين كلمة مرور للمشرف:',
    en: 'Set Supervisor Password:',
  },
  'login.sup_pass_confirm': {
    ar: 'تأكيد كلمة المرور:',
    en: 'Confirm Password:',
  },
  'login.sup_bio': {
    ar: 'نبذة أو اهتمامات إشرافية (اختياري):',
    en: 'Bio / Supervisory Interests (Optional):',
  },
  'login.sup_submit_register': {
    ar: 'تسجيل وتفعيل حساب المشرف فوراً ✨',
    en: 'Register & Activate Supervisor Account ✨',
  },
  'login.select_staff': {
    ar: 'اختر الموظف التنفيذي لتسجيل الدخول:',
    en: 'Select Executive Staff Member to Sign In:',
  },
  'login.staff_password': {
    ar: 'كلمة مرور الموظف:',
    en: 'Staff Member Password:',
  },
  'login.enter_staff_password': {
    ar: 'أدخل كلمة مرور الموظف...',
    en: 'Enter staff password...',
  },
  'login.submit_staff_login': {
    ar: 'دخول لوحة مهام الموظف 👔',
    en: 'Access Staff Tasks Dashboard 👔',
  },
  'login.admin_password': {
    ar: 'كلمة مرور إدارة النشاط الطلابي:',
    en: 'Student Activities Admin Password:',
  },
  'login.enter_admin_password': {
    ar: 'أدخل كلمة مرور المشرف العام...',
    en: 'Enter general supervisor password...',
  },
  'login.submit_admin_login': {
    ar: 'دخول لوحة الإشراف العام 👑',
    en: 'Access General Admin Dashboard 👑',
  },

  // Club Registration
  'reg.title': {
    ar: 'تسجيل وتفعيل نادٍ طلابي جديد',
    en: 'Register & Activate a New Student Club',
  },
  'reg.subtitle': {
    ar: 'أنشئ حساب ناديك الآن لتقديم الطلبات ومتابعة التوجيه الفوري',
    en: 'Create your club account to submit requests and track automated routing',
  },
  'reg.club_name': {
    ar: 'اسم النادي الطلابي الرسمي:',
    en: 'Official Student Club Name:',
  },
  'reg.club_name_placeholder': {
    ar: 'مثال: نادي الابتكار والذكاء الاصطناعي',
    en: 'e.g., Innovation & AI Club',
  },
  'reg.president_name': {
    ar: 'اسم رئيس النادي الثلاثي:',
    en: 'Club President Full Name:',
  },
  'reg.president_name_placeholder': {
    ar: 'مثال: فهد بن سلطان القحطاني',
    en: 'e.g., Fahad Sultan Al-Qahtani',
  },
  'reg.username': {
    ar: 'اسم المستخدم للدخول:',
    en: 'Login Username:',
  },
  'reg.category': {
    ar: 'تصنيف النادي:',
    en: 'Club Category:',
  },
  'reg.supervisor': {
    ar: 'مشرف النادي الطلابي (لاعتماد الفعاليات والطلبات):',
    en: 'Club Supervisor (For Request Approvals):',
  },
  'reg.supervisor_unregistered_link': {
    ar: 'مشرفك غير مسجل؟ اضغط لإضافته',
    en: 'Supervisor not registered? Click to add',
  },
  'reg.select_supervisor_placeholder': {
    ar: '-- اختر المشرف الأكاديمي المسؤول عن النادي --',
    en: '-- Select Academic Supervisor Responsible for Club --',
  },
  'reg.submit_button': {
    ar: 'تفعيل وتسجيل النادي فوراً 🚀',
    en: 'Activate & Register Club Now 🚀',
  },

  // Common Actions & Buttons
  'action.new_request': {
    ar: 'تقديم طلب جديد',
    en: 'Submit New Request',
  },
  'action.quick_services': {
    ar: 'خدمات سريعة فورية',
    en: 'Instant Quick Services',
  },
  'action.save': {
    ar: 'حفظ',
    en: 'Save',
  },
  'action.save_changes': {
    ar: 'حفظ التعديلات',
    en: 'Save Changes',
  },
  'action.cancel': {
    ar: 'إلغاء',
    en: 'Cancel',
  },
  'action.close': {
    ar: 'إغلاق',
    en: 'Close',
  },
  'action.delete': {
    ar: 'حذف',
    en: 'Delete',
  },
  'action.edit': {
    ar: 'تعديل',
    en: 'Edit',
  },
  'action.confirm': {
    ar: 'تأكيد',
    en: 'Confirm',
  },
  'action.approve': {
    ar: 'موافقة واعتماد',
    en: 'Approve & Forward',
  },
  'action.reject': {
    ar: 'رفض',
    en: 'Reject',
  },
  'action.request_changes': {
    ar: 'طلب تعديلات',
    en: 'Request Changes',
  },
  'action.view_details': {
    ar: 'عرض التفاصيل',
    en: 'View Details',
  },
  'action.logout': {
    ar: 'تسجيل الخروج',
    en: 'Sign Out',
  },
  'action.profile': {
    ar: 'الملف الشخصي',
    en: 'User Profile',
  },
  'action.mark_all_read': {
    ar: 'تحديد الكل كمقروء',
    en: 'Mark All as Read',
  },
  'action.search': {
    ar: 'بحث...',
    en: 'Search...',
  },
  'action.filter': {
    ar: 'تصفية',
    en: 'Filter',
  },
  'action.all': {
    ar: 'الكل',
    en: 'All',
  },
  'action.export': {
    ar: 'تصدير',
    en: 'Export',
  },
  'action.print': {
    ar: 'طباعة',
    en: 'Print',
  },
  'action.back': {
    ar: 'العودة',
    en: 'Back',
  },
  'action.send': {
    ar: 'إرسال',
    en: 'Send',
  },
  'action.add': {
    ar: 'إضافة',
    en: 'Add',
  },

  // Statuses
  'status.pending_supervisor': {
    ar: 'بانتظار موافقة المشرف',
    en: 'Pending Supervisor',
  },
  'status.submitted': {
    ar: 'تم التوجيه للموظفين',
    en: 'Routed to Staff',
  },
  'status.in_progress': {
    ar: 'قيد التنفيذ',
    en: 'In Progress',
  },
  'status.completed': {
    ar: 'مكتمل ومعتمد',
    en: 'Completed',
  },
  'status.rejected': {
    ar: 'مرفوض',
    en: 'Rejected',
  },
  'status.needs_info': {
    ar: 'مطلوب تعديلات / معلومات',
    en: 'Needs Information',
  },
  'status.pending': {
    ar: 'جديدة / قيد الانتظار',
    en: 'Pending',
  },

  // Priorities
  'priority.normal': {
    ar: 'عادي',
    en: 'Normal',
  },
  'priority.high': {
    ar: 'مرتفع',
    en: 'High',
  },
  'priority.urgent': {
    ar: 'عاجل جداً',
    en: 'Urgent',
  },

  // Notifications
  'notifications.title': {
    ar: 'الإشعارات والتنبيهات',
    en: 'Notifications & Alerts',
  },
  'notifications.empty': {
    ar: 'لا توجد إشعارات جديدة حالياً',
    en: 'No new notifications currently',
  },

  // Request & Task Table Headers
  'table.request_no': {
    ar: 'رقم الطلب',
    en: 'Request #',
  },
  'table.event_title': {
    ar: 'عنوان الفعالية / الطلب',
    en: 'Event / Request Title',
  },
  'table.club_name': {
    ar: 'النادي',
    en: 'Club',
  },
  'table.date_time': {
    ar: 'الموعد والوقت',
    en: 'Date & Time',
  },
  'table.location': {
    ar: 'الموقع / القاعة',
    en: 'Location / Venue',
  },
  'table.tasks_progress': {
    ar: 'تقدم المهام',
    en: 'Tasks Progress',
  },
  'table.status': {
    ar: 'الحالة',
    en: 'Status',
  },
  'table.actions': {
    ar: 'الإجراءات',
    en: 'Actions',
  },
  'table.staff_assignee': {
    ar: 'الموظف المسؤول',
    en: 'Assigned Staff',
  },
  'table.priority': {
    ar: 'الأولوية',
    en: 'Priority',
  },
  'table.department': {
    ar: 'القسم',
    en: 'Department',
  },
  'table.service': {
    ar: 'الخدمة المطلوبة',
    en: 'Requested Service',
  },
  'table.task_id': {
    ar: 'رمز المهمة',
    en: 'Task ID',
  },

  // Footer
  'footer.deanship': {
    ar: 'عمادة شؤون الطلاب • منصة توجيه ومعالجة طلبات الأندية الطلابية',
    en: 'Deanship of Student Affairs • Student Clubs Request Routing & Processing Platform',
  },

  // Club President Dashboard
  'club.welcome_back': {
    ar: 'أهلاً بك يا رئيس النادي',
    en: 'Welcome Back, Club President',
  },
  'club.overview_desc': {
    ar: 'متابعة شاملة لجميع فعاليات النادي، المهام الموزعة على الموظفين، وحالات الاعتماد',
    en: 'Comprehensive tracking of all club events, distributed staff tasks, and approvals',
  },
  'club.stats_total_requests': {
    ar: 'إجمالي الطلبات',
    en: 'Total Requests',
  },
  'club.stats_in_progress': {
    ar: 'طلبات قيد التنفيذ',
    en: 'In Progress Requests',
  },
  'club.stats_completed': {
    ar: 'فعاليات منجزة',
    en: 'Completed Events',
  },
  'club.stats_pending_sup': {
    ar: 'بانتظار موافقة المشرف',
    en: 'Awaiting Supervisor',
  },

  // Supervisor Dashboard
  'sup.welcome_back': {
    ar: 'مرحباً بك، المشرف الأكاديمي',
    en: 'Welcome, Academic Supervisor',
  },
  'sup.overview_desc': {
    ar: 'بوابة المراجعة والاعتماد الأكاديمي لطلبات وفعاليات الأندية الطلابية المسندة إليك',
    en: 'Academic review and approval portal for events of student clubs assigned to you',
  },
  'sup.pending_approval_badge': {
    ar: 'طلبات تتطلب موافقتك واعتمادك',
    en: 'Requests Requiring Your Approval',
  },
  'sup.approved_forwarded': {
    ar: 'تم اعتمادها وتوجيهها للموظفين',
    en: 'Approved & Forwarded to Staff',
  },

  // Staff Dashboard
  'staff.welcome_back': {
    ar: 'لوحة المهام التنفيذية للموظف',
    en: 'Executive Staff Tasks Dashboard',
  },
  'staff.active_tasks_count': {
    ar: 'مهام مسندة إليك في أقسامك',
    en: 'Tasks assigned to your departments',
  },
  'staff.column_pending': {
    ar: 'مهام جديدة بانتظار البدء',
    en: 'New Tasks Pending',
  },
  'staff.column_in_progress': {
    ar: 'مهام جارية وقيد التنفيذ',
    en: 'Tasks In Progress',
  },
  'staff.column_completed': {
    ar: 'مهام مكتملة ومنجزة',
    en: 'Completed Tasks',
  },
  'staff.column_rejected': {
    ar: 'مهام معتذر عنها / مرفوضة',
    en: 'Declined / Rejected Tasks',
  },

  // Admin Dashboard
  'admin.welcome_back': {
    ar: 'لوحة الإشراف العام - النشاط الطلابي',
    en: 'General Supervision Dashboard - Student Activities',
  },
  'admin.overview_desc': {
    ar: 'الرقابة الشاملة على أداء الأندية، توزيع أحمال الموظفين، واعتمادات المشرفين الأكاديميين',
    en: 'Complete oversight of club activities, staff workload distribution, and supervisor approvals',
  },
  'admin.total_clubs': {
    ar: 'الأندية النشطة',
    en: 'Active Clubs',
  },
  'admin.total_supervisors': {
    ar: 'المشرفون المعتمدون',
    en: 'Approved Supervisors',
  },
  'admin.total_tasks': {
    ar: 'إجمالي المهام الموزعة',
    en: 'Total Distributed Tasks',
  },
  'admin.clear_all_requests': {
    ar: 'تصفير وأرشفة جميع الطلبات',
    en: 'Reset & Archive All Requests',
  },

  // Calendar
  'calendar.title': {
    ar: 'تقويم حجوزات القاعات والمنشآت',
    en: 'Venues & Halls Bookings Calendar',
  },
  'calendar.subtitle': {
    ar: 'استعراض مواعيد الفعاليات المحجوزة في القاعات والمباني لمنع التعارض',
    en: 'View scheduled club events across venues to prevent booking conflicts',
  },
  'calendar.filter_venue': {
    ar: 'تصفية حسب الموقع / القاعة:',
    en: 'Filter by Venue / Hall:',
  },

  // Tasks Matrix
  'matrix.title': {
    ar: 'مصفوفة المهام الموزعة والشاملة',
    en: 'Comprehensive Distributed Tasks Matrix',
  },
  'matrix.subtitle': {
    ar: 'استعراض دقيق لكافة المهام الفردية الموجهة للموظفين مع تفاصيل الخدمات والطلبات',
    en: 'Detailed overview of all individual tasks routed to staff with service specifics',
  },
  'matrix.filter_staff': {
    ar: 'تصفية حسب الموظف:',
    en: 'Filter by Staff Member:',
  },
  'matrix.filter_status': {
    ar: 'تصفية حسب الحالة:',
    en: 'Filter by Status:',
  },

  // New Request Wizard
  'wizard.title': {
    ar: 'معالج تقديم طلب فعالية وتوجيه المهام',
    en: 'Event Request & Task Routing Wizard',
  },
  'wizard.heading': {
    ar: 'طلب فعالية جديدة مع التوزيع الآلي للمهام',
    en: 'New Event Request with Automated Task Routing',
  },
  'wizard.step1': {
    ar: '1. بيانات الفعالية',
    en: '1. Event Info',
  },
  'wizard.step2': {
    ar: '2. اختيار الخدمات',
    en: '2. Select Services',
  },
  'wizard.step3': {
    ar: '3. تفاصيل الخدمات',
    en: '3. Service Details',
  },
  'wizard.step4': {
    ar: '4. معاينة التوجيه والاعتماد',
    en: '4. Review & Submit',
  },
  'wizard.step1_tip': {
    ar: 'المرحلة الأولى: قم بتعبئة بيانات الفعالية الأساسية. في الخطوة التالية، ستتمكن من تحديد الخدمات المطلوبة ليقوم النظام بتوجيهها آلياً للموظفين المعنيين.',
    en: 'Step 1: Fill in the basic event information. In the next step, select required services to automatically route them to designated staff.',
  },
  'wizard.step2_tip': {
    ar: 'المرحلة الثانية: اختر الخدمات والتجهيزات التي تحتاجها فعاليتك. يوضح كل قسم اسم الموظف المسؤول الذي ستوجه إليه المهمة تلقائياً.',
    en: 'Step 2: Choose services and logistics for your event. Each section shows the responsible staff member receiving the routed task.',
  },
  'wizard.step3_tip': {
    ar: 'المرحلة الثالثة: حدد المواصفات الدقيقة والأولويات لكل خدمة تم اختيارها ليتمكن الموظفون من تنفيذها بدقة.',
    en: 'Step 3: Specify exact requirements and priorities for each selected service for accurate execution by staff.',
  },
  'wizard.step4_tip': {
    ar: 'المرحلة الرابعة: راجع ملخص التوجيه النهائي وتوزيع المهام على الموظفين قبل إرسال الطلب للاعتماد.',
    en: 'Step 4: Review final task routing and staff distribution before submitting for supervisor approval.',
  },
  'wizard.club_name': {
    ar: 'اسم النادي الطلابي مقدم الطلب',
    en: 'Submitting Student Club Name',
  },
  'wizard.president_name': {
    ar: 'اسم رئيس النادي / المفوض بالطلب',
    en: 'Club President / Authorized Submitter',
  },
  'wizard.phone': {
    ar: 'رقم الجوال للتواصل والمتابعة',
    en: 'Contact Mobile Number',
  },
  'wizard.email': {
    ar: 'البريد الإلكتروني الجامعي',
    en: 'University Email',
  },
  'wizard.event_title': {
    ar: 'عنوان الفعالية البارز',
    en: 'Prominent Event Title',
  },
  'wizard.event_type': {
    ar: 'نوع الفعالية',
    en: 'Event Type',
  },
  'wizard.event_date': {
    ar: 'تاريخ الفعالية',
    en: 'Event Date',
  },
  'wizard.start_time': {
    ar: 'وقت البدء',
    en: 'Start Time',
  },
  'wizard.end_time': {
    ar: 'وقت الانتهاء',
    en: 'End Time',
  },
  'wizard.start_end_time': {
    ar: 'وقت البدء والانتهاء',
    en: 'Start & End Time',
  },
  'wizard.location': {
    ar: 'المقر المقترح للفعالية',
    en: 'Proposed Event Venue / Location',
  },
  'wizard.attendees': {
    ar: 'العدد المتوقع للمشاركين',
    en: 'Expected Attendees Count',
  },
  'wizard.description': {
    ar: 'نبذة ووصف الفعالية والأهداف',
    en: 'Event Description & Objectives',
  },
  'wizard.description_placeholder': {
    ar: 'اكتب نبذة مختصرة عن الفعالية، الفئات المستهدفة، والمخرجات المرجوة...',
    en: 'Write a brief description of the event, target audience, and expected outcomes...',
  },
  'wizard.next_step': {
    ar: 'التالي: اختيار الخدمات',
    en: 'Next: Select Services',
  },
  'wizard.next_details': {
    ar: 'التالي: تفاصيل الخدمات',
    en: 'Next: Service Details',
  },
  'wizard.next_review': {
    ar: 'التالي: مراجعة التوجيه',
    en: 'Next: Review Routing',
  },
  'wizard.prev_step': {
    ar: 'السابق',
    en: 'Previous',
  },
  'wizard.submit_request': {
    ar: 'إرسال الطلب للاعتماد والتوجيه 🚀',
    en: 'Submit Request for Approval & Routing 🚀',
  },

  // Quick Service Modal
  'quick.badge': {
    ar: 'طلب خدمة فردية سريعة',
    en: 'Instant Quick Single Service Request',
  },
  'quick.direct_routing': {
    ar: 'توجيه مباشر إلى:',
    en: 'Direct Routing To:',
  },
  'quick.purpose': {
    ar: 'عنوان المناسبة أو الغرض',
    en: 'Event / Request Purpose Title',
  },
  'quick.needed_date': {
    ar: 'تاريخ الحاجة للخدمة',
    en: 'Date Service Needed',
  },
  'quick.submit': {
    ar: 'إرسال طلب الخدمة الفوري 🚀',
    en: 'Submit Quick Service Request 🚀',
  },

  // Details Modal
  'details.submission_date': {
    ar: 'تاريخ التقديم:',
    en: 'Submission Date:',
  },
  'details.submitted_by': {
    ar: 'مقدم من:',
    en: 'Submitted By:',
  },
  'details.responsible': {
    ar: 'المسؤول:',
    en: 'Responsible:',
  },
  'details.print_view': {
    ar: 'عرض نموذج الطباعة الرسمي',
    en: 'Official Print View',
  },
  'details.interactive_view': {
    ar: 'العودة للمتابعة التفاعلية',
    en: 'Interactive Tracking View',
  },
  'details.event_time': {
    ar: 'تاريخ ووقت الفعالية:',
    en: 'Event Date & Time:',
  },
  'details.proposed_venue': {
    ar: 'المقر المقترح:',
    en: 'Proposed Venue:',
  },
  'details.expected_count': {
    ar: 'العدد المتوقع:',
    en: 'Expected Count:',
  },
  'details.progress_rate': {
    ar: 'نسبة استكمال المهام:',
    en: 'Tasks Completion Rate:',
  },
  'details.desc_objectives': {
    ar: 'وصف الفعالية والأهداف:',
    en: 'Event Description & Objectives:',
  },
  'details.routed_tasks': {
    ar: 'المهام الموزعة وحالة الإنجاز',
    en: 'Distributed Tasks & Progress Status',
  },
  'details.staff_in_charge': {
    ar: 'الموظف المعني:',
    en: 'Staff in Charge:',
  },
  'details.phone': {
    ar: 'هاتف:',
    en: 'Phone:',
  },
  'details.office': {
    ar: 'مكتب:',
    en: 'Office:',
  },
  'details.specifications': {
    ar: 'المواصفات والمتطلبات المسجلة:',
    en: 'Registered Specifications & Requirements:',
  },
  'details.external_url': {
    ar: 'رابط الصفحة / الموقع المرفق من الموظف:',
    en: 'Attached Page / Link by Staff:',
  },
  'details.open_page': {
    ar: 'الانتقال إلى الصفحة',
    en: 'Open Page',
  },
  'details.comments_log': {
    ar: 'سجل التنسيق والملاحظات والمحادثة:',
    en: 'Coordination Notes & Activity Log:',
  },
  'details.add_comment_placeholder': {
    ar: 'أضف ملاحظة أو استفساراً حول هذه المهمة...',
    en: 'Add a note or inquiry regarding this task...',
  },
  'details.no_comments': {
    ar: 'لا توجد ملاحظات أو تعليقات مسجلة بعد.',
    en: 'No notes or comments recorded yet.',
  },
};

// ==========================================
// DYNAMIC MULTILINGUAL DICTIONARY FOR DATA
// ==========================================

export const DYNAMIC_DATA_DICTIONARY: Record<string, { ar: string; en: string }> = {
  // Departments
  'transport': {
    ar: 'قسم الحركة',
    en: 'Transportation Department',
  },
  'قسم الحركة': {
    ar: 'قسم الحركة',
    en: 'Transportation Department',
  },
  'housing_services': {
    ar: 'قسم الإسكان والخدمات المكتبية',
    en: 'Housing & Office Services',
  },
  'قسم الإسكان والخدمات المكتبية': {
    ar: 'قسم الإسكان والخدمات المكتبية',
    en: 'Housing & Office Services',
  },
  'electrical': {
    ar: 'قسم الكهرباء',
    en: 'Electrical Department',
  },
  'قسم الكهرباء': {
    ar: 'قسم الكهرباء',
    en: 'Electrical Department',
  },
  'it': {
    ar: 'قسم تقنية المعلومات (IT)',
    en: 'Information Technology (IT) Department',
  },
  'قسم تقنية المعلومات (IT)': {
    ar: 'قسم تقنية المعلومات (IT)',
    en: 'Information Technology (IT) Department',
  },
  'events_buildings': {
    ar: 'قسم إدارة الفعاليات والمباني',
    en: 'Events & Buildings Management',
  },
  'قسم إدارة الفعاليات والمباني': {
    ar: 'قسم إدارة الفعاليات والمباني',
    en: 'Events & Buildings Management',
  },
  'halls_venues': {
    ar: 'حجز القاعات والملاعب',
    en: 'Halls & Venues Booking',
  },
  'حجز القاعات والملاعب': {
    ar: 'حجز القاعات والملاعب',
    en: 'Halls & Venues Booking',
  },
  'announcements': {
    ar: 'إعلان الفعاليات',
    en: 'Event Announcements',
  },
  'إعلان الفعاليات': {
    ar: 'إعلان الفعاليات',
    en: 'Event Announcements',
  },
  'printing': {
    ar: 'قسم المطابع',
    en: 'Printing Press Department',
  },
  'قسم المطابع': {
    ar: 'قسم المطابع',
    en: 'Printing Press Department',
  },
  'pr_media': {
    ar: 'العلاقات العامة والإعلام',
    en: 'Public Relations & Media',
  },
  'العلاقات العامة والإعلام': {
    ar: 'العلاقات العامة والإعلام',
    en: 'Public Relations & Media',
  },
  'security': {
    ar: 'قسم الأمن والسلامة',
    en: 'Security & Safety Department',
  },
  'قسم الأمن والسلامة': {
    ar: 'قسم الأمن والسلامة',
    en: 'Security & Safety Department',
  },
  'catering': {
    ar: 'الخدمات الغذائية والضيافة',
    en: 'Catering & Hospitality Services',
  },
  'الخدمات الغذائية والضيافة': {
    ar: 'الخدمات الغذائية والضيافة',
    en: 'Catering & Hospitality Services',
  },

  // Department Descriptions
  'توفير وحجز الباصات للرحلات والزيارات ونقل ضيوف الفعاليات': {
    ar: 'توفير وحجز الباصات للرحلات والزيارات ونقل ضيوف الفعاليات',
    en: 'Booking buses for trips, visits, and transporting event guests',
  },
  'توفير الكراسي، الطاولات، السجاد، الستيج (المسرح)، البارتيشن، حواجز فعاليات التنظيم': {
    ar: 'توفير الكراسي، الطاولات، السجاد، الستيج (المسرح)، البارتيشن، حواجز فعاليات التنظيم',
    en: 'Providing chairs, tables, carpets, stages, partitions, and crowd barriers',
  },
  'توصيلات الكهرباء وتجهيز الإضاءات والأنوار والإنارة الخاصة بالموقع': {
    ar: 'توصيلات الكهرباء وتجهيز الإضاءات والأنوار والإنارة الخاصة بالموقع',
    en: 'Power extensions, stage lighting, and venue illumination setup',
  },
  'الأنظمة الصوتية، توفير الشاشات وأجهزة العرض، توفير الإنترنت والواي فاي': {
    ar: 'الأنظمة الصوتية، توفير الشاشات وأجهزة العرض، توفير الإنترنت والواي فاي',
    en: 'Audio systems, LED displays, projectors, and Wi-Fi enhancement',
  },
  'حجز المباني الرئيسية للفعاليات (مبنى 70، مبنى 54، مبنى 42، مبنى 10، مبنى 60)': {
    ar: 'حجز المباني الرئيسية للفعاليات (مبنى 70، مبنى 54، مبنى 42، مبنى 10، مبنى 60)',
    en: 'Booking main event venues (Bldg 70, Bldg 54, Bldg 42, Bldg 10, Bldg 60)',
  },
  'قاعات المسجل (تسجيل مباشر)، قاعات إدارة النشاط، وقاعات رؤساء الأقسام والملاعب': {
    ar: 'قاعات المسجل (تسجيل مباشر)، قاعات إدارة النشاط، وقاعات رؤساء الأقسام والملاعب',
    en: 'Registrar halls (direct booking), activity halls, dept head halls, and sports fields',
  },
  'إرسال الإعلانات الرسمية عبر البريد الإلكتروني الجامعي أو عبر منصة The Fives': {
    ar: 'إرسال الإعلانات الرسمية عبر البريد الإلكتروني الجامعي أو عبر منصة The Fives',
    en: 'Broadcasting official announcements via university email or The Fives app',
  },
  'طباعة المطبوعات الورقية والبروشورات، وطباعة شهادات الحضور والشكر والتقدير': {
    ar: 'طباعة المطبوعات الورقية والبروشورات، وطباعة شهادات الحضور والشكر والتقدير',
    en: 'Printing paper publications, brochures, banners, and certificates',
  },
  'تغطية الفعالية بالتصوير الفوتوغرافي والفيديو، ونشر التغريدات والتغطيات الرسمية': {
    ar: 'تغطية الفعالية بالتصوير الفوتوغرافي والفيديو، ونشر التغريدات والتغطيات الرسمية',
    en: 'Photography & videography coverage, and posting official social media broadcasts',
  },
  'التغطيات الأمنية للفعاليات، تصاريح دخول الزوار والسيارات، والطلبات التي تحتاج خطابًا رسميًا': {
    ar: 'التغطيات الأمنية للفعاليات، تصاريح دخول الزوار والسيارات، والطلبات التي تحتاج خطابًا رسميًا',
    en: 'Event security coverage, visitor and vehicle entry permits, and official letters',
  },
  'توفير الضيافة ووجبات العشاء للفعاليات الخاصة أو لإدارة النشاط فقط (لا تُشارك مع الطلاب)': {
    ar: 'توفير الضيافة ووجبات العشاء للفعاليات الخاصة أو لإدارة النشاط فقط (لا تُشارك مع الطلاب)',
    en: 'Providing hospitality, beverages, and dinners for special events and student activities',
  },

  // Services
  'srv_bus_booking': {
    ar: 'حجز الباصات',
    en: 'Bus Booking',
  },
  'حجز الباصات': {
    ar: 'حجز الباصات',
    en: 'Bus Booking',
  },
  'srv_furniture_logistics': {
    ar: 'تجهيزات الإسكان والخدمات المكتبية',
    en: 'Housing & Office Furniture Logistics',
  },
  'تجهيزات الإسكان والخدمات المكتبية': {
    ar: 'تجهيزات الإسكان والخدمات المكتبية',
    en: 'Housing & Office Furniture Logistics',
  },
  'srv_electrical_lighting': {
    ar: 'توصيلات الكهرباء والإضاءة',
    en: 'Electrical & Lighting Setup',
  },
  'توصيلات الكهرباء والإضاءة': {
    ar: 'توصيلات الكهرباء والإضاءة',
    en: 'Electrical & Lighting Setup',
  },
  'srv_it_audiovisual': {
    ar: 'أنظمة IT والصوتيات والإنترنت',
    en: 'IT, Audiovisual & Internet Systems',
  },
  'أنظمة IT والصوتيات والإنترنت': {
    ar: 'أنظمة IT والصوتيات والإنترنت',
    en: 'IT, Audiovisual & Internet Systems',
  },
  'srv_buildings_booking': {
    ar: 'حجز المباني (إدارة الفعاليات)',
    en: 'Building Booking (Events Admin)',
  },
  'حجز المباني (إدارة الفعاليات)': {
    ar: 'حجز المباني (إدارة الفعاليات)',
    en: 'Building Booking (Events Admin)',
  },
  'srv_halls_booking': {
    ar: 'حجز القاعات والملاعب',
    en: 'Halls & Fields Booking',
  },
  'srv_announcements': {
    ar: 'إعلان الفعاليات (الإيميل و The Fives)',
    en: 'Event Announcements (Email & The Fives)',
  },
  'إعلان الفعاليات (الإيميل و The Fives)': {
    ar: 'إعلان الفعاليات (الإيميل و The Fives)',
    en: 'Event Announcements (Email & The Fives)',
  },
  'srv_printing_certs': {
    ar: 'المطابع والشهادات',
    en: 'Printing Press & Certificates',
  },
  'المطابع والشهادات': {
    ar: 'المطابع والشهادات',
    en: 'Printing Press & Certificates',
  },
  'srv_pr_media': {
    ar: 'التواصل مع العلاقات العامة والتغطية',
    en: 'PR & Media Coverage',
  },
  'التواصل مع العلاقات العامة والتغطية': {
    ar: 'التواصل مع العلاقات العامة والتغطية',
    en: 'PR & Media Coverage',
  },
  'srv_security_permits': {
    ar: 'قسم الأمن وتصاريح الدخول',
    en: 'Security & Entry Permits',
  },
  'قسم الأمن وتصاريح الدخول': {
    ar: 'قسم الأمن وتصاريح الدخول',
    en: 'Security & Entry Permits',
  },
  'srv_catering_vip': {
    ar: 'الخدمات الغذائية والضيافة',
    en: 'Catering & Hospitality Services',
  },

  // Service Descriptions
  'طلب حجز حافلات لنقل الطلاب أو المشاركين أو ضيوف النادي': {
    ar: 'طلب حجز حافلات لنقل الطلاب أو المشاركين أو ضيوف النادي',
    en: 'Request bus bookings for student transport, participants, or club guests',
  },
  'توفير الكراسي، الطاولات، السجاد، الستيج (المسرح)، البارتيشن، وحواجز التنظيم': {
    ar: 'توفير الكراسي، الطاولات، السجاد، الستيج (المسرح)، البارتيشن، وحواجز التنظيم',
    en: 'Providing chairs, tables, carpet, stage, partitions, and crowd barriers',
  },
  'تمديد التوصيلات الكهربائية، توفير قواطع وموزعات الطاقة، والإضاءات والأنوار الموجهة': {
    ar: 'تمديد التوصيلات الكهربائية، توفير قواطع وموزعات الطاقة، والإضاءات والأنوار الموجهة',
    en: 'Power extensions, distribution boards, spotlights, and venue illumination',
  },
  'توفير الأنظمة الصوتية والميكروفونات، الشاشات وأجهزة العرض، وتقوية شبكة الواي فاي': {
    ar: 'توفير الأنظمة الصوتية والميكروفونات، الشاشات وأجهزة العرض، وتقوية شبكة الواي فاي',
    en: 'Providing sound systems, microphones, screens, projectors, and Wi-Fi enhancement',
  },
  'حجز واستخدام المباني المخصصة للفعاليات: (مبنى 70، مبنى 54، مبنى 42، مبنى 10، مبنى 60)': {
    ar: 'حجز واستخدام المباني المخصصة للفعاليات: (مبنى 70، مبنى 54، مبنى 42، مبنى 10، مبنى 60)',
    en: 'Booking and utilizing event buildings: (Bldg 70, Bldg 54, Bldg 42, Bldg 10, Bldg 60)',
  },
  'حجز قاعات المسجل (تسجيل مباشر)، قاعات النشاط، وقاعات رؤساء الأقسام والملاعب الرياضية': {
    ar: 'حجز قاعات المسجل (تسجيل مباشر)، قاعات النشاط، وقاعات رؤساء الأقسام والملاعب الرياضية',
    en: 'Booking registrar halls, activity halls, department halls, and sports fields',
  },
  'نشر وإرسال إعلان الفعالية عبر البريد الإلكتروني الموحد أو تطبيق ومنصة The Fives': {
    ar: 'نشر وإرسال إعلان الفعالية عبر البريد الإلكتروني الموحد أو تطبيق ومنصة The Fives',
    en: 'Broadcasting announcements via student email or The Fives app',
  },
  'طباعة المطبوعات الورقية (بوسترات، بروشورات، رول اب) وطباعة شهادات الحضور والتقدير': {
    ar: 'طباعة المطبوعات الورقية (بوسترات، بروشورات، رول اب) وطباعة شهادات الحضور والتقدير',
    en: 'Printing paper materials (posters, brochures, roll-ups) and appreciation certificates',
  },
  'توفير مصور محترف، توثيق بالفيديو، والتنسيق لنشر التغريدات عبر الحسابات الرسمية للجامعة': {
    ar: 'توفير مصور محترف، توثيق بالفيديو، والتنسيق لنشر التغريدات عبر الحسابات الرسمية للجامعة',
    en: 'Professional photography, video documentation, and official social media posts',
  },
  'التغطيات الأمنية للفعاليات، استخراج تصاريح دخول الزوار والسيارات، والطلبات التي تحتاج خطابًا رسميًا': {
    ar: 'التغطيات الأمنية للفعاليات، استخراج تصاريح دخول الزوار والسيارات، والطلبات التي تحتاج خطابًا رسميًا',
    en: 'Event security coverage, visitor and car access permits, and official security letters',
  },
  'توفير خدمات الضيافة، وجبات البوفيه، المشروبات، المأكولات الخفيفة وتجهيزات الضيافة للفعاليات والأنشطة': {
    ar: 'توفير خدمات الضيافة، وجبات البوفيه، المشروبات، المأكولات الخفيفة وتجهيزات الضيافة للفعاليات والأنشطة',
    en: 'Providing VIP hospitality, buffet dinners, beverages, snacks, and catering setups',
  },

  // Field Labels (Keys & Titles)
  'bus_count': { ar: 'عدد الحافلات المطلوبة', en: 'Number of Buses Required' },
  'عدد الحافلات المطلوبة': { ar: 'عدد الحافلات المطلوبة', en: 'Number of Buses Required' },
  'pickup_location': { ar: 'نقطة الانطلاق', en: 'Pickup Location' },
  'نقطة الانطلاق': { ar: 'نقطة الانطلاق', en: 'Pickup Location' },
  'destination': { ar: 'الوجهة / مسار الرحلة', en: 'Destination / Route' },
  'الوجهة / مسار الرحلة': { ar: 'الوجهة / مسار الرحلة', en: 'Destination / Route' },
  'passenger_count': { ar: 'العدد التقديري للركاب', en: 'Estimated Passengers Count' },
  'العدد التقديري للركاب': { ar: 'العدد التقديري للركاب', en: 'Estimated Passengers Count' },
  'pickup_time': { ar: 'وقت التحرك المفضل', en: 'Preferred Departure Time' },
  'وقت التحرك المفضل': { ar: 'وقت التحرك المفضل', en: 'Preferred Departure Time' },
  'وقت التحرك': { ar: 'وقت التحرك', en: 'Departure Time' },
  'return_time': { ar: 'وقت العودة التقريبي', en: 'Approximate Return Time' },
  'وقت العودة التقريبي': { ar: 'وقت العودة التقريبي', en: 'Approximate Return Time' },
  'chairs_count': { ar: 'عدد الكراسي', en: 'Number of Chairs' },
  'عدد الكراسي': { ar: 'عدد الكراسي', en: 'Number of Chairs' },
  'tables_count': { ar: 'عدد الطاولات', en: 'Number of Tables' },
  'عدد الطاولات': { ar: 'عدد الطاولات', en: 'Number of Tables' },
  'need_stage': { ar: 'تجهيز مسرح / ستيج للفعالية', en: 'Stage / Podium Setup' },
  'تجهيز مسرح / ستيج للفعالية': { ar: 'تجهيز مسرح / ستيج للفعالية', en: 'Stage / Podium Setup' },
  'تجهيز مسرح / ستيج': { ar: 'تجهيز مسرح / ستيج', en: 'Stage / Podium Setup' },
  'need_carpet': { ar: 'توفير السجاد والممرات الحمراء', en: 'Carpet & Red Aisle Runners' },
  'توفير السجاد والممرات الحمراء': { ar: 'توفير السجاد والممرات الحمراء', en: 'Carpet & Red Aisle Runners' },
  'السجاد والممرات الحمراء': { ar: 'السجاد والممرات الحمراء', en: 'Carpet & Red Aisle Runners' },
  'partitions_count': { ar: 'عدد قواطع البارتيشن', en: 'Partitions Count' },
  'عدد قواطع البارتيشن': { ar: 'عدد قواطع البارتيشن', en: 'Partitions Count' },
  'قواطع البارتيشن': { ar: 'قواطع البارتيشن', en: 'Partitions Count' },
  'crowd_barriers': { ar: 'حواجز فعاليات التنظيم (Crowd Barriers)', en: 'Crowd Control Barriers' },
  'حواجز فعاليات التنظيم (Crowd Barriers)': { ar: 'حواجز فعاليات التنظيم (Crowd Barriers)', en: 'Crowd Control Barriers' },
  'حواجز تنظيم الحشود': { ar: 'حواجز تنظيم الحشود', en: 'Crowd Control Barriers' },
  'placement_notes': { ar: 'ملاحظات وتوزيع الأثاث بالموقع', en: 'Furniture Placement Notes' },
  'ملاحظات وتوزيع الأثاث بالموقع': { ar: 'ملاحظات وتوزيع الأثاث بالموقع', en: 'Furniture Placement Notes' },
  'ملاحظات وتوزيع الأثاث': { ar: 'ملاحظات وتوزيع الأثاث', en: 'Furniture Placement Notes' },
  'power_points': { ar: 'عدد نقاط وتوصيلات الكهرباء المطلوبة', en: 'Power Outlets Count' },
  'power_outlets': { ar: 'عدد نقاط وتوصيلات الكهرباء', en: 'Power Outlets Count' },
  'عدد نقاط وتوصيلات الكهرباء المطلوبة': { ar: 'عدد نقاط وتوصيلات الكهرباء المطلوبة', en: 'Power Outlets Count' },
  'عدد نقاط وتوصيلات الكهرباء': { ar: 'عدد نقاط وتوصيلات الكهرباء', en: 'Power Outlets Count' },
  'lighting_type': { ar: 'نوع الإضاءة المطلوبة', en: 'Lighting Type' },
  'نوع الإضاءة المطلوبة': { ar: 'نوع الإضاءة المطلوبة', en: 'Lighting Type' },
  'need_lighting': { ar: 'تجهيز الإضاءات والكشافات', en: 'Lighting & Spotlights Setup' },
  'تجهيز الإضاءات والكشافات': { ar: 'تجهيز الإضاءات والكشافات', en: 'Lighting & Spotlights Setup' },
  'high_load_devices': { ar: 'هل توجد أجهزة ذات استهلاك طاقة عالي؟', en: 'Any High-Load Electrical Devices?' },
  'هل توجد أجهزة ذات استهلاك طاقة عالي؟': { ar: 'هل توجد أجهزة ذات استهلاك طاقة عالي؟', en: 'Any High-Load Electrical Devices?' },
  'electrical_notes': { ar: 'تفاصيل الموقع والمسافات', en: 'Location Details & Distances' },
  'تفاصيل الموقع والمسافات': { ar: 'تفاصيل الموقع والمسافات', en: 'Location Details & Distances' },
  'sound_system': { ar: 'الأنظمة الصوتية المطلوبة', en: 'Sound System Required' },
  'الأنظمة الصوتية المطلوبة': { ar: 'الأنظمة الصوتية المطلوبة', en: 'Sound System Required' },
  'الأنظمة الصوتية والميكروفونات': { ar: 'الأنظمة الصوتية والميكروفونات', en: 'Sound System & Microphones' },
  'screens_projectors': { ar: 'الشاشات وأجهزة العرض', en: 'Screens & Projectors' },
  'الشاشات وأجهزة العرض': { ar: 'الشاشات وأجهزة العرض', en: 'Screens & Projectors' },
  'شاشات العرض والبروجكتر': { ar: 'شاشات العرض والبروجكتر', en: 'Screens & Projectors' },
  'wifi_support': { ar: 'توفير شبكة واي فاي مخصصة للفعالية (Guest Wi-Fi)', en: 'Dedicated Event Wi-Fi (Guest Wi-Fi)' },
  'توفير شبكة واي فاي مخصصة للفعالية (Guest Wi-Fi)': { ar: 'توفير شبكة واي فاي مخصصة للفعالية (Guest Wi-Fi)', en: 'Dedicated Event Wi-Fi (Guest Wi-Fi)' },
  'شبكة الإنترنت والواي فاي': { ar: 'شبكة الإنترنت والواي فاي', en: 'Internet & Wi-Fi Network' },
  'technical_assistant': { ar: 'هل يلزم تواجد فني تقني أثناء الفعالية؟', en: 'On-site Technical Assistant Required?' },
  'هل يلزم تواجد فني تقني أثناء الفعالية؟': { ar: 'هل يلزم تواجد فني تقني أثناء الفعالية؟', en: 'On-site Technical Assistant Required?' },
  'طلب فني صوتيات وتقنية ميداني': { ar: 'طلب فني صوتيات وتقنية ميداني', en: 'On-site Audiovisual Technician' },
  'building_number': { ar: 'المبنى المطلوب', en: 'Requested Building' },
  'المبنى المطلوب': { ar: 'المبنى المطلوب', en: 'Requested Building' },
  'facility_area': { ar: 'المرفق داخل المبنى', en: 'Facility Area Inside Building' },
  'المرفق داخل المبنى': { ar: 'المرفق داخل المبنى', en: 'Facility Area Inside Building' },
  'المنطقة أو البهو': { ar: 'المنطقة أو البهو', en: 'Area or Atrium' },
  'setup_date': { ar: 'تاريخ ووقت بدء التجهيز الميداني', en: 'Setup Start Date & Time' },
  'تاريخ ووقت بدء التجهيز الميداني': { ar: 'تاريخ ووقت بدء التجهيز الميداني', en: 'Setup Start Date & Time' },
  'توقيت التجهيز': { ar: 'توقيت التجهيز', en: 'Setup Timing' },
  'hall_category': { ar: 'نوع القاعة / المرفق', en: 'Hall / Facility Category' },
  'hall_type': { ar: 'نوع وموقع القاعة المطلوبة', en: 'Required Hall Type & Location' },
  'نوع القاعة / المرفق': { ar: 'نوع القاعة / المرفق', en: 'Hall / Facility Category' },
  'نوع وموقع القاعة المطلوبة': { ar: 'نوع وموقع القاعة المطلوبة', en: 'Required Hall Type & Location' },
  'hall_spec': { ar: 'اسم أو رقم القاعة / الملعب المطلوب', en: 'Hall / Field Name or Number' },
  'اسم أو رقم القاعة / الملعب المطلوب': { ar: 'اسم أو رقم القاعة / الملعب المطلوب', en: 'Hall / Field Name or Number' },
  'seating_capacity': { ar: 'السعة المطلوبة للمقاعد', en: 'Required Seating Capacity' },
  'السعة المطلوبة للمقاعد': { ar: 'السعة المطلوبة للمقاعد', en: 'Required Seating Capacity' },
  'attendees_capacity': { ar: 'السعة المطلوبة للقاعة', en: 'Required Hall Capacity' },
  'السعة المطلوبة للقاعة': { ar: 'السعة المطلوبة للقاعة', en: 'Required Hall Capacity' },
  'dept_head_approval': { ar: 'هل تم التنسيق مع رئيس القسم (إن لزم)؟', en: 'Coordinated with Department Chair?' },
  'هل تم التنسيق مع رئيس القسم (إن لزم)؟': { ar: 'هل تم التنسيق مع رئيس القسم (إن لزم)؟', en: 'Coordinated with Department Chair?' },
  'channel': { ar: 'قناة الإعلان المستهدفة', en: 'Broadcast Channel' },
  'قناة الإعلان المستهدفة': { ar: 'قناة الإعلان المستهدفة', en: 'Broadcast Channel' },
  'قنوات نشر الإعلان': { ar: 'قنوات نشر الإعلان', en: 'Announcement Broadcast Channels' },
  'target_audience': { ar: 'الفئة المستهدفة', en: 'Target Audience' },
  'الفئة المستهدفة': { ar: 'الفئة المستهدفة', en: 'Target Audience' },
  'الفئة المستهدفة للإعلان': { ar: 'الفئة المستهدفة للإعلان', en: 'Announcement Target Audience' },
  'announcement_title': { ar: 'عنوان الإعلان البارز', en: 'Announcement Headline' },
  'عنوان الإعلان البارز': { ar: 'عنوان الإعلان البارز', en: 'Announcement Headline' },
  'عنوان الإعلان المقترح': { ar: 'عنوان الإعلان المقترح', en: 'Proposed Headline' },
  'announcement_body': { ar: 'نص وتفاصيل الإعلان', en: 'Announcement Body Text' },
  'نص وتفاصيل الإعلان': { ar: 'نص وتفاصيل الإعلان', en: 'Announcement Body Text' },
  'نص مسودة الإعلان': { ar: 'نص مسودة الإعلان', en: 'Draft Announcement Body' },
  'registration_link': { ar: 'رابط التسجيل أو الباركود (إن وجد)', en: 'Registration Link / QR Code' },
  'رابط التسجيل أو الباركود (إن وجد)': { ar: 'رابط التسجيل أو الباركود (إن وجد)', en: 'Registration Link / QR Code' },
  'رابط التسجيل / النموذج': { ar: 'رابط التسجيل / النموذج', en: 'Registration Link / Form' },
  'broadcast_date': { ar: 'التاريخ المفضل لنشر الإعلان', en: 'Preferred Broadcast Date' },
  'التاريخ المفضل لنشر الإعلان': { ar: 'التاريخ المفضل لنشر الإعلان', en: 'Preferred Broadcast Date' },
  'print_types': { ar: 'نوع المطبوعات', en: 'Print Types' },
  'نوع المطبوعات': { ar: 'نوع المطبوعات', en: 'Print Types' },
  'نوع المطبوعات المطلوبة': { ar: 'نوع المطبوعات المطلوبة', en: 'Print Types Required' },
  'certificates_count': { ar: 'عدد الشهادات المطلوب طباعتها', en: 'Certificates Count' },
  'عدد الشهادات المطلوب طباعتها': { ar: 'عدد الشهادات المطلوب طباعتها', en: 'Certificates Count' },
  'paper_prints_count': { ar: 'عدد المطبوعات الورقية / البوسترات', en: 'Paper Prints / Posters Count' },
  'عدد المطبوعات الورقية / البوسترات': { ar: 'عدد المطبوعات الورقية / البوسترات', en: 'Paper Prints / Posters Count' },
  'paper_size': { ar: 'مقاس الورق ونوعيته', en: 'Paper Size & Type' },
  'مقاس الورق ونوعيته': { ar: 'مقاس الورق ونوعيته', en: 'Paper Size & Type' },
  'delivery_deadline': { ar: 'أقصى موعد لاستلام المطبوعات', en: 'Delivery Deadline' },
  'أقصى موعد لاستلام المطبوعات': { ar: 'أقصى موعد لاستلام المطبوعات', en: 'Delivery Deadline' },
  'موعد استلام المطبوعات': { ar: 'موعد استلام المطبوعات', en: 'Delivery Deadline' },
  'media_services': { ar: 'الخدمات الإعلامية المطلوبة', en: 'Media Services Required' },
  'الخدمات الإعلامية المطلوبة': { ar: 'الخدمات الإعلامية المطلوبة', en: 'Media Services Required' },
  'coverage_duration': { ar: 'مدة التغطية المطلوبة', en: 'Coverage Duration' },
  'مدة التغطية المطلوبة': { ar: 'مدة التغطية المطلوبة', en: 'Coverage Duration' },
  'مدة التغطية الإعلامية': { ar: 'مدة التغطية الإعلامية', en: 'Media Coverage Duration' },
  'tweet_draft': { ar: 'مسودة التغريدة أو الهاشتاق المقترح', en: 'Draft Tweet / Suggested Hashtag' },
  'مسودة التغريدة أو الهاشتاق المقترح': { ar: 'مسودة التغريدة أو الهاشتاق المقترح', en: 'Draft Tweet / Suggested Hashtag' },
  'مسودة التغريدة أو الهاشتاق': { ar: 'مسودة التغريدة أو الهاشتاق', en: 'Draft Tweet / Hashtag' },
  'security_type': { ar: 'الخدمة الأمنية المطلوبة', en: 'Security Service Type' },
  'الخدمة الأمنية المطلوبة': { ar: 'الخدمة الأمنية المطلوبة', en: 'Security Service Type' },
  'visitor_count': { ar: 'عدد الزوار أو السيارات المتوقعة من خارج الجامعة', en: 'Expected Visitors / Cars Count' },
  'عدد الزوار أو السيارات المتوقعة من خارج الجامعة': { ar: 'عدد الزوار أو السيارات المتوقعة من خارج الجامعة', en: 'Expected Visitors / Cars Count' },
  'عدد الزوار أو السيارات': { ar: 'عدد الزوار أو السيارات', en: 'Visitors or Cars Count' },
  'visitor_details': { ar: 'بيانات الضيوف (الاسم، الهوية، رقم اللوحة إن وجد)', en: 'Guest Details (Name, ID, Plate #)' },
  'بيانات الضيوف (الاسم، الهوية، رقم اللوحة إن وجد)': { ar: 'بيانات الضيوف (الاسم، الهوية، رقم اللوحة إن وجد)', en: 'Guest Details (Name, ID, Plate #)' },
  'بيانات الضيوف السابقة': { ar: 'بيانات الضيوف السابقة', en: 'Previous Guest Details' },
  'special_letter_details': { ar: 'تفاصيل الخطاب الرسمي (إن كان الطلب يحتاج خطاباً خاصاً)', en: 'Official Security Letter Details' },
  'تفاصيل الخطاب الرسمي (إن كان الطلب يحتاج خطاباً خاصاً)': { ar: 'تفاصيل الخطاب الرسمي (إن كان الطلب يحتاج خطاباً خاصاً)', en: 'Official Security Letter Details' },
  'تفاصيل الخطاب الرسمي للأمن': { ar: 'تفاصيل الخطاب الرسمي للأمن', en: 'Official Security Letter Details' },
  'catering_type': { ar: 'نوع الضيافة المطلوبة', en: 'Catering Type' },
  'نوع الضيافة المطلوبة': { ar: 'نوع الضيافة المطلوبة', en: 'Catering Type' },
  'guest_count': { ar: 'عدد المستفيدين من الضيافة', en: 'Catering Headcount' },
  'عدد المستفيدين من الضيافة': { ar: 'عدد المستفيدين من الضيافة', en: 'Catering Headcount' },
  'admin_approval_note': { ar: 'ملاحظات الضيافة وموقع التقديم', en: 'Catering Notes & Placement' },
  'ملاحظات الضيافة وموقع التقديم': { ar: 'ملاحظات الضيافة وموقع التقديم', en: 'Catering Notes & Placement' },
  'جهة الاعتماد للضيافة': { ar: 'جهة الاعتماد للضيافة', en: 'Catering Approval Entity' },
  'dietary_notes': { ar: 'ملاحظات خاصة بالتغذية والتوقيت', en: 'Dietary & Timing Notes' },
  'ملاحظات خاصة بالتغذية والتوقيت': { ar: 'ملاحظات خاصة بالتغذية والتوقيت', en: 'Dietary & Timing Notes' },
  'ملاحظات التغذية والتوقيت': { ar: 'ملاحظات التغذية والتوقيت', en: 'Dietary & Timing Notes' },

  // Select Option Values
  'نعم - مسرح كامل': { ar: 'نعم - مسرح كامل', en: 'Yes - Full Stage' },
  'نعم - منصة إلقاء صغيرة': { ar: 'نعم - منصة إلقاء صغيرة', en: 'Yes - Small Podium' },
  'لا يلزم': { ar: 'لا يلزم', en: 'Not Required' },
  'سجاد كامل للموقع': { ar: 'سجاد كامل للموقع', en: 'Full Venue Carpet' },
  'ممر شرفي فقط': { ar: 'ممر شرفي فقط', en: 'Honor Aisle Runner Only' },
  'إضاءة مسرح مركزة (Spotlights)': { ar: 'إضاءة مسرح مركزة (Spotlights)', en: 'Focused Stage Spotlights' },
  'إضاءة عامة إضافية': { ar: 'إضاءة عامة إضافية', en: 'Additional General Lighting' },
  'إضاءات ملونة ديكورية (RGB)': { ar: 'إضاءات ملونة ديكورية (RGB)', en: 'Decorative RGB Lighting' },
  'توصيلات كهربائية عادية فقط': { ar: 'توصيلات كهربائية عادية فقط', en: 'Standard Power Outlets Only' },
  'سماعات قاعة كاملة + 2 مايك لاسلكي': { ar: 'سماعات قاعة كاملة + 2 مايك لاسلكي', en: 'Full Hall PA System + 2 Wireless Mics' },
  'نظام صوتي خارجي للمعارض': { ar: 'نظام صوتي خارجي للمعارض', en: 'Outdoor Sound System for Expos' },
  'مايك طاولة لمنصة الإلقاء فقط': { ar: 'مايك طاولة لمنصة الإلقاء فقط', en: 'Table Podium Mic Only' },
  'شاشة عرض LED كبيرة': { ar: 'شاشة عرض LED كبيرة', en: 'Large LED Screen Display' },
  'بروجكتر وشاشة عرض متنقلة': { ar: 'بروجكتر وشاشة عرض متنقلة', en: 'Projector & Mobile Screen' },
  'شاشات تلفزيون عمودية للمنصات (Totems)': { ar: 'شاشات تلفزيون عمودية للمنصات (Totems)', en: 'Vertical TV Totem Displays' },
  'نعم - مطلوب شبكة إنترنت مخصصة برمز دخول': { ar: 'نعم - مطلوب شبكة إنترنت مخصصة برمز دخول', en: 'Yes - Dedicated Wi-Fi with Access Code' },
  'الشبكة الجامعية الحالية كافية': { ar: 'الشبكة الجامعية الحالية كافية', en: 'Current Campus Wi-Fi is Sufficient' },
  'مبنى 70 (المركز الثقافي / المعارض)': { ar: 'مبنى 70 (المركز الثقافي / المعارض)', en: 'Bldg 70 (Cultural Center / Exhibition Hall)' },
  'مبنى 54 (البهو الرئيسي والأنشطة)': { ar: 'مبنى 54 (البهو الرئيسي والأنشطة)', en: 'Bldg 54 (Main Atrium & Activities)' },
  'مبنى 42 (المجمع الطلابي)': { ar: 'مبنى 42 (المجمع الطلابي)', en: 'Bldg 42 (Student Center / Mall)' },
  'مبنى 10 (إدارة النشاط)': { ar: 'مبنى 10 (إدارة النشاط)', en: 'Bldg 10 (Student Activities)' },
  'مبنى 60 (مركز المؤتمرات)': { ar: 'مبنى 60 (مركز المؤتمرات)', en: 'Bldg 60 (Conference Center)' },
  'قاعات المسجل (تسجيل مباشر من رئيس النادي)': { ar: 'قاعات المسجل (تسجيل مباشر من رئيس النادي)', en: 'Registrar Halls (Direct President Booking)' },
  'قاعات إدارة النشاط الطلابي': { ar: 'قاعات إدارة النشاط الطلابي', en: 'Student Activities Halls' },
  'قاعات تُحجز عن طريق رئيس القسم': { ar: 'قاعات تُحجز عن طريق رئيس القسم', en: 'Halls Booked via Department Chair' },
  'الملاعب الرياضية والصالات المغلقة': { ar: 'الملاعب الرياضية والصالات المغلقة', en: 'Sports Fields & Indoor Courts' },
  'عن طريق الإيميل الجامعي الموحد فقط': { ar: 'عن طريق الإيميل الجامعي الموحد فقط', en: 'University Unified Email Only' },
  'عن طريق منصة The Fives فقط': { ar: 'عن طريق منصة The Fives فقط', en: 'The Fives Platform Only' },
  'كلاهما (الإيميل الجامعي + The Fives)': { ar: 'كلاهما (الإيميل الجامعي + The Fives)', en: 'Both (University Email + The Fives)' },
  'جميع طلاب الجامعة': { ar: 'جميع طلاب الجامعة', en: 'All University Students' },
  'طلاب كلية معينة': { ar: 'طلاب كلية معينة', en: 'Specific College Students' },
  'أعضاء النادي فقط': { ar: 'أعضاء النادي فقط', en: 'Club Members Only' },
  'أعضاء هيئة التدريس والطلاب': { ar: 'أعضاء هيئة التدريس والطلاب', en: 'Faculty & Students' },
  'طباعة شهادات فقط': { ar: 'طباعة شهادات فقط', en: 'Certificates Only' },
  'مطبوعات ورقية وبروشورات فقط': { ar: 'مطبوعات ورقية وبروشورات فقط', en: 'Paper Prints & Brochures Only' },
  'طباعة بوسترات ورول اب': { ar: 'طباعة بوسترات ورول اب', en: 'Posters & Roll-up Stands' },
  'حزمة مطبوعات متكاملة + شهادات': { ar: 'حزمة مطبوعات متكاملة + شهادات', en: 'Full Printing Package + Certificates' },
  'A4 مقوى فاخر (للشهادات)': { ar: 'A4 مقوى فاخر (للشهادات)', en: 'A4 Premium Cardstock (Certificates)' },
  'A3 ملون عالي الدقة (بوسترات)': { ar: 'A3 ملون عالي الدقة (بوسترات)', en: 'A3 HD Color (Posters)' },
  'A5 بروشورات مطوية': { ar: 'A5 بروشورات مطوية', en: 'A5 Folded Brochures' },
  'رول اب متري ستاند': { ar: 'رول اب متري ستاند', en: 'Roll-up Stand Banner' },
  'تصوير فوتوغرافي + تغريدات وتغطية X': { ar: 'تصوير فوتوغرافي + تغريدات وتغطية X', en: 'Photography + X (Twitter) Broadcasts' },
  'تصوير فوتوغرافي وتوثيق فيديو متكامل': { ar: 'تصوير فوتوغرافي وتوثيق فيديو متكامل', en: 'Full Photography & Video Documentation' },
  'نشر تغريدات وتغطية رقمية فقط': { ar: 'نشر تغريدات وتغطية رقمية فقط', en: 'Social Media Coverage Only' },
  'تصوير فوتوغرافي فقط': { ar: 'تصوير فوتوغرافي فقط', en: 'Photography Only' },
  'تصاريح دخول ضيوف وسيارات عبر بوابات الجامعة': { ar: 'تصاريح دخول ضيوف وسيارات عبر بوابات الجامعة', en: 'Guest & Vehicle Gate Entry Permits' },
  'تغطية أمنية ميدانية وتنظيم بوابات القاعة': { ar: 'تغطية أمنية ميدانية وتنظيم بوابات القاعة', en: 'On-site Security Coverage & Venue Organization' },
  'طلبات خاصة تحتاج خطابًا رسميًا للأمن': { ar: 'طلبات خاصة تحتاج خطابًا رسميًا للأمن', en: 'Special Requests Requiring Security Letter' },
  'حزمة أمنية كاملة (تصاريح + تغطية ميدانية)': { ar: 'حزمة أمنية كاملة (تصاريح + تغطية ميدانية)', en: 'Full Security Package (Permits + Field Coverage)' },
  'ضيافة قهوة وشاي وتمور VIP': { ar: 'ضيافة قهوة وشاي وتمور VIP', en: 'VIP Coffee, Tea & Dates Hospitality' },
  'وجبات عشاء بوفيه رسمي': { ar: 'وجبات عشاء بوفيه رسمي', en: 'Official Buffet Dinner' },
  'وجبات خفيفة وساندوتشات مغلفة': { ar: 'وجبات خفيفة وساندوتشات مغلفة', en: 'Wrapped Sandwiches & Light Snacks' },
  'باقة ضيافة متكاملة لكبار الشخصيات': { ar: 'باقة ضيافة متكاملة لكبار الشخصيات', en: 'Comprehensive VIP Hospitality Package' },
  'مشروبات ومياه ومأكولات خفيفة': { ar: 'مشروبات ومياه ومأكولات خفيفة', en: 'Beverages, Water & Light Snacks' },

  // Event Types
  'hackathon': { ar: 'هاكاثون ومنافسة برمجية', en: 'Hackathon & Coding Competition' },
  'workshop': { ar: 'ورشة عمل تدريبية', en: 'Training Workshop' },
  'exhibition': { ar: 'معرض مفتوح', en: 'Open Exhibition' },
  'lecture': { ar: 'محاضرة وندوة علمية', en: 'Lecture & Seminar' },
  'sports': { ar: 'بطولة رياضية', en: 'Sports Tournament' },
  'trip': { ar: 'رحلة ميدانية وزيارة', en: 'Field Trip & Visit' },
  'other': { ar: 'فعالية أخرى', en: 'Other Activity' },
  'هاكاثون ومنافسة برمجية': { ar: 'هاكاثون ومنافسة برمجية', en: 'Hackathon & Coding Competition' },
  'ورشة عمل تدريبية': { ar: 'ورشة عمل تدريبية', en: 'Training Workshop' },
  'معرض مفتوح': { ar: 'معرض مفتوح', en: 'Open Exhibition' },
  'محاضرة وندوة علمية': { ar: 'محاضرة وندوة علمية', en: 'Lecture & Seminar' },
  'بطولة رياضية': { ar: 'بطولة رياضية', en: 'Sports Tournament' },
  'رحلة ميدانية وزيارة': { ar: 'رحلة ميدانية وزيارة', en: 'Field Trip & Visit' },
  'فعالية أخرى': { ar: 'فعالية أخرى', en: 'Other Activity' },

  // Units
  'حافلة': { ar: 'حافلة', en: 'Bus' },
  'كرسي': { ar: 'كرسي', en: 'Chair' },
  'طاولة': { ar: 'طاولة', en: 'Table' },
  'قاطع': { ar: 'قاطع', en: 'Partition' },
  'حاجز': { ar: 'حاجز', en: 'Barrier' },
  'نقطة': { ar: 'نقطة', en: 'Point' },
  'مقعد': { ar: 'مقعد', en: 'Seat' },
  'شهادة': { ar: 'شهادة', en: 'Certificate' },
  'نسخة': { ar: 'نسخة', en: 'Copy' },
  'زائر / سيارة': { ar: 'زائر / سيارة', en: 'Visitor / Car' },
  'شخص': { ar: 'شخص', en: 'Person' },
  'مشارك': { ar: 'مشارك', en: 'Participant' },
  'ريال': { ar: 'ريال', en: 'SAR' },

  // Status & Priority Short labels
  'تم الإنجاز': { ar: 'تم الإنجاز', en: 'Completed' },
  'قيد التجهيز': { ar: 'قيد التجهيز', en: 'In Progress' },
  'قيد التنفيذ': { ar: 'قيد التنفيذ', en: 'In Progress' },
  'جديدة': { ar: 'جديدة', en: 'Pending' },
  'مرفوضة': { ar: 'مرفوضة', en: 'Rejected' },
  'عادي': { ar: 'عادي', en: 'Normal' },
  'مرتفع': { ar: 'مرتفع', en: 'High' },
  'عاجل': { ar: 'عاجل', en: 'Urgent' },
  'عاجل جداً': { ar: 'عاجل جداً', en: 'Urgent' },
  'نعم': { ar: 'نعم', en: 'Yes' },
  'لا': { ar: 'لا', en: 'No' },

  // Security Guest List Manager
  'guest.name': { ar: 'اسم الضيف / الزائر', en: 'Guest Full Name' },
  'guest.id': { ar: 'الهوية / الإقامة', en: 'National ID / Iqama' },
  'guest.plate': { ar: 'رقم اللوحة (إنجليزي)', en: 'Plate Number (EN)' },
  'guest.car_type': { ar: 'نوع السيارة', en: 'Car Make' },
  'guest.car_model': { ar: 'الموديل', en: 'Model Year' },
  'guest.car_color': { ar: 'اللون', en: 'Color' },
  'guest.owner_name': { ar: 'اسم المالك', en: 'Owner Name' },
  'guest.companions': { ar: 'المرافقين', en: 'Companions' },
  'guest.add_guest': { ar: 'إضافة ضيف جديد لقائمة التصاريح', en: 'Add New Guest to Permits List' },
  'guest.table_title': { ar: 'قائمة الضيوف والسيارات المصرح لها', en: 'Authorized Guests & Vehicles List' },
};

// ==========================================
// TRANSLATION HELPER FUNCTIONS
// ==========================================

export function translateDynamic(text: any, language: Language): string {
  if (text === null || text === undefined) return '';
  if (typeof text !== 'string') return String(text);
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Direct match
  const entry = DYNAMIC_DATA_DICTIONARY[trimmed] || TRANSLATIONS[trimmed];
  if (entry && entry[language]) {
    return entry[language];
  }

  // Check lowercase
  const lowerEntry = DYNAMIC_DATA_DICTIONARY[trimmed.toLowerCase()];
  if (lowerEntry && lowerEntry[language]) {
    return lowerEntry[language];
  }

  return text;
}

export function translateServiceData(
  serviceId: string, 
  language: Language, 
  originalName?: string, 
  originalDesc?: string
): { name: string; description: string } {
  const nameEntry = DYNAMIC_DATA_DICTIONARY[serviceId] || (originalName ? DYNAMIC_DATA_DICTIONARY[originalName] : undefined);
  const name = nameEntry ? nameEntry[language] : (originalName || serviceId);

  const descEntry = originalDesc ? DYNAMIC_DATA_DICTIONARY[originalDesc] : undefined;
  const description = descEntry ? descEntry[language] : (originalDesc || '');

  return { name, description };
}

export function translateDepartmentData(
  deptId: string, 
  language: Language, 
  originalName?: string, 
  originalDesc?: string
): { name: string; description: string } {
  const nameEntry = DYNAMIC_DATA_DICTIONARY[deptId] || (originalName ? DYNAMIC_DATA_DICTIONARY[originalName] : undefined);
  const name = nameEntry ? nameEntry[language] : (originalName || deptId);

  const descEntry = originalDesc ? DYNAMIC_DATA_DICTIONARY[originalDesc] : undefined;
  const description = descEntry ? descEntry[language] : (originalDesc || '');

  return { name, description };
}

export function translateFieldLabel(fieldIdOrLabel: string, language: Language, fallback?: string): string {
  const entry = DYNAMIC_DATA_DICTIONARY[fieldIdOrLabel] || (fallback ? DYNAMIC_DATA_DICTIONARY[fallback] : undefined);
  if (entry && entry[language]) {
    return entry[language];
  }
  return fallback || fieldIdOrLabel;
}

export function translateOptionValue(option: string, language: Language): string {
  return translateDynamic(option, language);
}

export function translateUnit(unit: string | undefined, language: Language): string {
  if (!unit) return '';
  return translateDynamic(unit, language);
}

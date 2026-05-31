import React, { useState, useEffect } from 'react';
import { RoomType } from './types.js';
import Sidebar from './components/Sidebar';
import BookingForm from './components/BookingForm';
import AdminDashboard from './components/AdminDashboard';
import CodeExplorer from './components/CodeExplorer';
import { Sparkles, Terminal, ShieldAlert, GraduationCap, School } from 'lucide-react';

// Seeding Rooms data explicitly matching rules:
// Kelas: Rp5.000 / sesi, Seminar: Rp50.000 / sesi
const initialRooms = [
  {
    id: 'room-1',
    code: 'A10.01.02',
    name: 'Ruang Kuliah PBO 102',
    floor: 1,
    type: RoomType.RUANG_KELAS,
    pricePerSession: 5000,
    capacity: 40,
    facilities: ['Whiteboard', 'Dual AC', 'Projector HD', 'WiFi 100Mbps'],
    description: 'Ruang kelas multimedia terpadu di Lt. 1 Gedung A10 UNESA, dioptimalkan untuk perkuliahan pemrograman instruksional.'
  },
  {
    id: 'room-2',
    code: 'A10.02.01',
    name: 'Lab Rekayasa Perangkat Lunak',
    floor: 2,
    type: RoomType.RUANG_KELAS,
    pricePerSession: 5000,
    capacity: 32,
    facilities: ['32x i7 Workstations', 'Gigabit Switched LAN', 'Air Conditioner', 'UPS Backup'],
    description: 'Laboratory rekayasa perangkat lunak eksklusif untuk praktikum data struktur & PBO tingkat lanjut.'
  },
  {
    id: 'room-3',
    code: 'A10.02.04',
    name: 'Ruang Diskusi Kreatif Dosen/Mhs',
    floor: 2,
    type: RoomType.RUANG_KELAS,
    pricePerSession: 5000,
    capacity: 20,
    facilities: ['Smart TV 65"', 'Movable Glass Boards', 'High-Speed Wi-Fi'],
    description: 'Ruangan modular interaktif untuk asistensi tugas kelompok kuliah, bimbingan dosen, & praktikum mini.'
  },
  {
    id: 'room-4',
    code: 'A10.03.01',
    name: 'Aula Pertemuan Utama Gedung A10',
    floor: 3,
    type: RoomType.RUANG_SEMINAR,
    pricePerSession: 50000,
    capacity: 120,
    facilities: ['Active Sound System', '4x Wireless Mics', 'Stage & Podium', 'Central AC', 'VIP Chairs'],
    description: 'Auditorium utama di Lantai 3 Gedung A10 untuk penyelenggaraan stadium general, seminar nasional, dan wisuda jurusan.'
  },
  {
    id: 'room-5',
    code: 'A10.03.02',
    name: 'Convention Ballroom Mini',
    floor: 3,
    type: RoomType.RUANG_SEMINAR,
    pricePerSession: 50000,
    capacity: 80,
    facilities: ['Studio Lighting', 'Theater-style Seats', 'Mixer Audio', 'Dimmable Lights'],
    description: 'Ruangan prestisius dengan peredam suara penuh, ideal untuk presentasi sidang disertasi dospem & workshop profesional.'
  }
];

// Initial bookings matching Java seed data in BookingService.java
const initialBookings = [
  {
    id: 'booking-seed-1',
    bookingCode: 'BKG-A1001',
    room: initialRooms[0], // PBO Class
    customerName: 'Wayan Setiawan',
    customerNim: '23051214012',
    sessionCount: 2,
    bookingDate: new Date().toISOString().split('T')[0],
    sessionTime: '07:30 - 09:10',
    totalPrice: 10000, // 2 x 5000
    status: 'APPROVED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'booking-seed-2',
    bookingCode: 'BKG-A1002',
    room: initialRooms[3], // Aula Seminar
    customerName: 'Dr. Supriyadi',
    customerNim: '197805122004121001',
    sessionCount: 1,
    bookingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    sessionTime: '09:15 - 10:55',
    totalPrice: 50000, // 1 x 500
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('CUSTOMER');
  const [rooms] = useState(initialRooms);
  const [bookings, setBookings] = useState(initialBookings);
  const [toasts, setToasts] = useState([]);

  // Function to add a toast notification
  const addToast = (type, title, message) => {
    const newToast = {
      id: Math.random().toString(),
      type,
      title,
      message
    };
    setToasts((prev) => [newToast, ...prev]);
  };

  // Auto remove toasts after 3.5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(0, prev.length - 1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Handle Simulated ArrayList Booking Storage with Java Custom Exceptions
  const handleAddBooking = (rawBooking) => {
    const targetRoom = rooms.find((r) => r.code === rawBooking.roomCode);
    if (!targetRoom) {
      return { success: false, errorType: 'InvalidInputException', errorMessage: 'Gedung A10 Error: Informasi ruangan tidak ditemukan di sistem database.' };
    }

    // Exception Rule 1: RoomNotAvailableException (overlapping schedule in APPROVED/PENDING bookings)
    const hasCollision = bookings.some((existing) => {
      const activeStatus = existing.status === 'APPROVED' || existing.status === 'PENDING';
      const sameRoom = existing.room.code === rawBooking.roomCode;
      const sameDate = existing.bookingDate === rawBooking.bookingDate;
      const sameSession = existing.sessionTime === rawBooking.sessionTime;
      return activeStatus && sameRoom && sameDate && sameSession;
    });

    if (hasCollision) {
      addToast(
        'error',
        'Jadwal Bentrok!',
        `Ruangan ${rawBooking.roomCode} sudah dipesan pada tanggal ${rawBooking.bookingDate} pukul ${rawBooking.sessionTime}`
      );
      return {
        success: false,
        errorType: 'RoomNotAvailableException',
        errorMessage: `Aturan Bisnis Gedung A10 UNESA: Ruangan ${rawBooking.roomCode} tidak tersedia karena sudah dibooking pada tanggal ${rawBooking.bookingDate} di sesi ${rawBooking.sessionTime}!`
      };
    }

    // Creating actual booking representation in Simulated ArrayList Collection
    const customCode = `BKG-A10${String(bookings.length + 1).padStart(2, '0')}`;
    const newRecord = {
      id: `booking-${Math.random()}`,
      bookingCode: customCode,
      room: targetRoom,
      customerName: rawBooking.customerName,
      customerNim: rawBooking.customerNim,
      sessionCount: rawBooking.sessionCount,
      bookingDate: rawBooking.bookingDate,
      sessionTime: rawBooking.sessionTime,
      totalPrice: targetRoom.pricePerSession * rawBooking.sessionCount,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setBookings((prev) => [...prev, newRecord]);
    addToast(
      'success',
      'Booking Terkirim!',
      `Reservasi ${customCode} berhasil dikirim ke antrean. Silakan hubungi admin untuk ACC.`
    );
    return { success: true, booking: newRecord };
  };

  // Update status (Approve/Reject) on Admin actions
  const handleUpdateStatus = (bookingId, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  return (
    <div className="bg-[#F9F9FB] min-h-screen text-slate-800 flex relative overflow-hidden font-sans">
      
      {/* Dynamic Animated Floating Toasts */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className="bg-white border-l-4 border-emerald-500 shadow-xl rounded-2xl p-4 flex items-start gap-4 pointer-events-auto w-80 border transition-all duration-300 transform translate-y-0 scale-100 ease-out animate-bounce-short"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' ? (
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs">✓</div>
              ) : toast.type === 'error' ? (
                <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-xs">✗</div>
              ) : (
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">i</div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm leading-tight">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {toast.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Primary Dashboard Frame */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-[#F9F9FB]">
        
        {/* Universal Top Branding Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="text-xl font-bold text-[#003366]">Dashboard Gedung A10</h2>
            <p className="text-sm text-slate-400">Selamat Datang di Sistem Manajemen Ruangan Terpadu</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status Server</p>
              <p className="text-xs text-emerald-500 flex items-center gap-1.5 justify-end mt-0.5 font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Java Spring Boot Active
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic Views Switcher */}
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
          
          {currentTab === 'dashboard' && (
            <BookingForm
              rooms={rooms}
              bookings={bookings}
              addBooking={handleAddBooking}
              addToast={addToast}
              updateBookingStatus={handleUpdateStatus}
            />
          )}

          {currentTab === 'admin-panel' && (
            userRole === 'ADMIN' ? (
              <AdminDashboard
                bookings={bookings}
                updateBookingStatus={handleUpdateStatus}
                addToast={addToast}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-rose-100 p-8 shadow-sm text-center py-16 space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900">Hak Akses Terbatas (RBAC)</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto leading-relaxed">
                    Sistem melarang pengguna biasa memanipulasi dashboard admin. Ganti hak akses Anda ke <strong>Admin</strong> pada sidebar untuk mengelola status booking.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUserRole('ADMIN');
                    setCurrentTab('admin-panel');
                    addToast('success', 'Role Diubah', 'Hak akses beralih untuk mensimulasikan Admin Spring Boot.');
                  }}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                  Ubah Hak Akses ke Admin
                </button>
              </div>
            )
          )}

          {currentTab === 'code-explorer' && <CodeExplorer />}
        </div>
      </main>
    </div>
  );
}

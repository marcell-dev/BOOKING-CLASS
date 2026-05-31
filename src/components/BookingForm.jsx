import React, { useState, useEffect } from 'react';
import { Calendar, Clock, UserIcon, Landmark, HelpCircle, GraduationCap, Laptop, CheckCircle, FlameKindling, Info, Sparkles, QrCode, Printer, X, CreditCard } from 'lucide-react';

export default function BookingForm({ rooms, bookings, addBooking, addToast, updateBookingStatus }) {
  // Input Form States
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id);
  const [customerName, setCustomerName] = useState('');
  const [customerNim, setCustomerNim] = useState('');
  const [sessionCount, setSessionCount] = useState(1);
  const [bookingDate, setBookingDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [sessionTime, setSessionTime] = useState('07:30 - 09:10');

  // UI Interactive Validation
  const [validationError, setValidationError] = useState(null);
  
  // Interactive QRIS & Struk Printer States
  const [activeQrisBooking, setActiveQrisBooking] = useState(null);
  const [activeReceiptBooking, setActiveReceiptBooking] = useState(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [searchNimHistory, setSearchNimHistory] = useState('');
  
  // Exception Handler Display States
  const [exceptionTrace, setExceptionTrace] = useState({
    thrown: false,
    type: '',
    message: '',
    timestamp: ''
  });

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  // Dynamic cost calculation based on selected room pricing guidelines
  const billingTotal = selectedRoom ? selectedRoom.pricePerSession * sessionCount : 0;

  // React Input Constraints Real-Time Validator
  useEffect(() => {
    if (sessionCount <= 0) {
      setValidationError('Jumlah Sesi harus berupa bilangan bulat positif (min. 1)');
    } else {
      setValidationError(null);
    }
  }, [sessionCount]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset last exceptions
    setExceptionTrace({ thrown: false, type: '', message: '', timestamp: '' });

    // Validate inputs
    if (sessionCount <= 0) {
      const errorMsg = 'Error Validasi: Jumlah Sesi (quantity/quantity) tidak boleh kosong atau negatif!';
      setExceptionTrace({
        thrown: true,
        type: 'InvalidInputException',
        message: errorMsg,
        timestamp: new Date().toLocaleTimeString()
      });
      addToast('error', 'PBO Validation Fail!', errorMsg);
      return;
    }

    if (!customerName.trim() || !customerNim.trim()) {
      const errorMsg = 'Error Validasi: Nama Pemohon dan NIM/NIP wajib diisikan lengkap!';
      setExceptionTrace({
        thrown: true,
        type: 'InvalidInputException',
        message: errorMsg,
        timestamp: new Date().toLocaleTimeString()
      });
      addToast('error', 'PBO Validation Fail!', errorMsg);
      return;
    }

    // Attempt adding using stateful core
    const result = addBooking({
      roomCode: selectedRoom.code,
      roomName: selectedRoom.name,
      roomType: selectedRoom.type,
      customerName,
      customerNim,
      sessionCount,
      bookingDate,
      sessionTime
    });

    if (!result.success) {
      // Simulate real Java JVM Exception throwing
      setExceptionTrace({
        thrown: true,
        type: result.errorType || 'UnknownException',
        message: result.errorMessage || 'Terjadi kesalahan tidak terduga.',
        timestamp: new Date().toLocaleTimeString()
      });
    } else {
      // Success! Clear inputs
      setCustomerName('');
      setCustomerNim('');
      setSessionCount(1);
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Simulate QRIS automatic verification
  const handleSimulateQrisPayment = (booking) => {
    setIsVerifyingPayment(true);
    addToast('info', 'Menunggu Verifikasi', 'Menghubungi Merchant Gateway Bank Indonesia...');
    setTimeout(() => {
      updateBookingStatus(booking.id, 'APPROVED');
      addToast('success', 'Pembayaran Terverifikasi!', `ID Reservasi ${booking.bookingCode} berhasil dilunasi via QRIS & di-ACC otomatis oleh sirkuit kasir UNESA.`);
      setIsVerifyingPayment(false);
      setActiveQrisBooking(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Design Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center font-bold text-lg shrink-0">
            A10
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Properti</h4>
            <p className="text-lg font-extrabold text-[#003366] mt-0.5">Gedung A10 UNESA</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sesi Terdaftar</h4>
            <p className="text-lg font-extrabold text-slate-800 mt-0.5">{bookings ? bookings.length : 0} Permohonan</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FlameKindling className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sesi Kelas</h4>
            <p className="text-lg font-extrabold text-slate-800 mt-0.5">Mulai Rp5.000 / Sesi</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Reservasi */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-[#003366]/5 text-[#003366] rounded-lg">
                <Calendar className="w-4.5 h-4.5" />
              </span>
              Ajukan Reservasi Sesi Ruangan
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gedung A10 menyediakan Ruang Kelas untuk Civitas (Rp5.000/sesi) dan Ruang Seminar untuk Umum/Kegiatan Besar (Rp50.000/sesi).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Ruangan Selector Group */}
            <div>
              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Ruangan Gedung A10</label>
              <select
                id="select-room"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-xs text-slate-700 font-semibold transition-all"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.code}) - {room.floor === 3 ? 'Seminar (Rp50.000)' : 'Kelas (Rp5.000)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Identitas Pemohon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap Pemohon</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    id="input-name"
                    placeholder="Wayan Setiawan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-xs text-slate-700 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">NIM / NIP Identitas</label>
                <input
                  type="text"
                  id="input-nim"
                  placeholder="NIM: 23051214012 atau NIP Dosen"
                  value={customerNim}
                  onChange={(e) => setCustomerNim(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-xs text-slate-700 font-medium transition-all"
                />
              </div>
            </div>

            {/* Sesi Detail */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal Sesi</label>
                <input
                  type="date"
                  id="input-date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-xs text-slate-700 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Durasi Waktu Sesi</label>
                <select
                  id="select-session-time"
                  value={sessionTime}
                  onChange={(e) => setSessionTime(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-xs text-slate-700 font-semibold transition-all"
                >
                  <option value="07:30 - 09:10">Sesi 1 (07:30 - 09:10)</option>
                  <option value="09:15 - 10:55">Sesi 2 (09:15 - 10:55)</option>
                  <option value="11:00 - 12:40">Sesi 3 (11:00 - 12:40)</option>
                  <option value="13:30 - 15:10">Sesi 4 (13:30 - 15:10)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-2">Jumlah Sesi (Quantity)</label>
                <input
                  type="number"
                  id="input-session-count"
                  value={sessionCount}
                  onChange={(e) => setSessionCount(parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl outline-none text-xs text-slate-700 font-bold transition-all ${
                    validationError ? 'border-red-400 bg-red-50/50 focus:ring-red-400' : 'border-slate-200 focus:border-[#003366] focus:ring-1 focus:ring-[#003366]'
                  }`}
                />
              </div>
            </div>

            {/* Validation Display Warning */}
            {validationError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[11px] leading-relaxed font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>
                {validationError}
              </div>
            )}

            {/* Estimator Billing Display */}
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                  Kalkulasi Biaya Terpadu (PBO State)
                </span>
                <p className="text-[11px] text-slate-500 mt-1 tracking-wide font-medium">
                  {sessionCount} Sesi {selectedRoom.name} x {formatRupiah(selectedRoom.pricePerSession)} / sesi. No Tax.
                </p>
              </div>
              <div className="md:text-right w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-0 border-blue-100">
                <span className="text-[10px] text-slate-400 block font-light leading-none">Total Pembayaran</span>
                <span className="text-2xl font-black text-[#003366] block mt-1 tracking-tight">
                  {formatRupiah(billingTotal)}
                </span>
              </div>
            </div>

            {/* Submit Trigger */}
            <button
              type="submit"
              disabled={!!validationError}
              className={`w-full py-4 text-white font-bold rounded-2xl shadow-lg transition-all text-xs tracking-wider uppercase cursor-pointer ${
                validationError ? 'bg-slate-300 shadow-none cursor-not-allowed' : 'bg-[#003366] hover:bg-slate-850 active:scale-98'
              }`}
            >
              Kirim Pengajuan Reservasi Ruangan (ArrayList)
            </button>
          </form>
        </div>

        {/* Right Column: Mini Info on Selected Room */}
        <div className="lg:col-span-5 space-y-6">
          {/* Detail Ruangan Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

            <div>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                Gedung A10 UNESA • Spesifikasi Ruangan
              </span>
              <h3 className="text-xl font-black mt-3 text-white tracking-tight leading-snug">{selectedRoom.name}</h3>
              <span className="text-[11px] font-mono font-bold text-[#00E5FF] mt-1.5 block leading-none">KODE: {selectedRoom.code} | LANTAI: {selectedRoom.floor}</span>
            </div>

            <div className="h-px bg-slate-800"></div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <p className="leading-relaxed font-light">{selectedRoom.description}</p>
              
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9.5px] text-slate-500 uppercase font-black tracking-wider block">Kapasitas Maksimal</span>
                  <p className="font-extrabold text-white text-[13px] mt-0.5">{selectedRoom.capacity} Civitas</p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[9.5px] text-slate-500 uppercase font-black tracking-wider block">Spesialis Tarif</span>
                  <p className="font-extrabold text-[#00E5FF] text-[13px] mt-0.5">{formatRupiah(selectedRoom.pricePerSession)} <span className="text-[9px] text-slate-400 font-normal">/Sesi</span></p>
                </div>
              </div>

              <div>
                <span className="text-[9.5px] text-slate-500 uppercase font-black tracking-wider block mb-2">Fasilitas Pendukung</span>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {selectedRoom.facilities.map((fac, idx) => (
                    <span key={idx} className="bg-slate-850 text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-800">
                      • {fac}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* JVM Custom Runtime Exceptions Logger Simulation */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
              Console Log Java Custom Exceptions Observer
            </h4>
            <p className="text-[10.5px] text-slate-400 leading-relaxed font-normal">
              Mensimulasikan penangkapan error logika PBO di server Spring Boot dari trigger file <code>CustomException.java</code>.
            </p>

            {exceptionTrace.thrown ? (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2 text-rose-950 font-mono text-[10.5px] leading-relaxed relative overflow-hidden animate-shake">
                <div className="absolute top-0 right-0 p-1 bg-rose-500 text-white font-black text-[8px] uppercase tracking-wider rounded-bl-lg">
                  THROWN
                </div>
                <p className="text-rose-700 font-extrabold uppercase">FATAL {exceptionTrace.type}</p>
                <p className="font-bold text-[11px] leading-snug">{exceptionTrace.message}</p>
                <div className="h-px bg-rose-100 my-2"></div>
                <div className="text-[9.5px] text-rose-500 font-sans space-y-0.5 font-medium">
                  <p>Timestamp: {exceptionTrace.timestamp}</p>
                  <p>Status Kode: 500 Internal Server PBO Exception</p>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center border border-dashed border-slate-200 rounded-2xl py-6 text-slate-300 space-y-1">
                <Laptop className="w-8 h-8 mx-auto text-slate-200" />
                <p className="text-[10.5px] font-semibold text-slate-400">Tidak ada Exception terekam</p>
                <p className="text-[9px] text-slate-400">System is stable: JVM Thread (11) is idling smoothly.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: Live Booking Approval Status Tracking */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-[#003366]/5 text-[#003366] rounded-lg">
                <Landmark className="w-4.5 h-4.5" />
              </span>
              Sistem Pelacakan Status & Pembayaran Mandiri
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gunakan pencarian NIM/Nama untuk memeriksa status persetujuan dari Admin, menyelesaikan biaya sesi via QRIS, dan mengunduh bukti struk lunas.
            </p>
          </div>
          
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari NIM Mahasiswa / NIP Dosen..."
              value={searchNimHistory}
              onChange={(e) => setSearchNimHistory(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none text-xs text-slate-700 font-semibold"
            />
          </div>
        </div>

        {/* Live List Board */}
        {bookings.filter(b => {
          if (!searchNimHistory.trim()) return true;
          const term = searchNimHistory.toLowerCase();
          return b.customerNim.toLowerCase().includes(term) || b.customerName.toLowerCase().includes(term) || b.bookingCode.toLowerCase().includes(term);
        }).length === 0 ? (
          <div className="py-10 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">Tidak ada pengajuan reservasi ditemukan</p>
            <p className="text-[10px] text-slate-400">Pastikan Anda telah mengirimkan form booking di atas / masukkan NIM dengan tepat.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]/normal">
                  <th className="pb-3 pl-3">Kode Booking</th>
                  <th className="pb-3">Ruangan</th>
                  <th className="pb-3">Pemohon (NIM / NIP)</th>
                  <th className="pb-3 text-center">Tanggal & Sesi</th>
                  <th className="pb-3 text-right">Biaya Total</th>
                  <th className="pb-3 text-center">Persetujuan Admin</th>
                  <th className="pb-3 pr-3 text-center">Aksi / Dokumen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.filter(b => {
                  if (!searchNimHistory.trim()) return true;
                  const term = searchNimHistory.toLowerCase();
                  return b.customerNim.toLowerCase().includes(term) || b.customerName.toLowerCase().includes(term) || b.bookingCode.toLowerCase().includes(term);
                }).map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 pl-3 font-mono font-bold text-slate-900 group-hover:text-blue-600">
                      {booking.bookingCode}
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{booking.room.name}</p>
                        <p className="text-[10.5px] text-slate-400 font-medium">Lantai {booking.room.floor} • {booking.room.code}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="font-bold text-slate-800 text-xs">{booking.customerName}</p>
                        <p className="font-mono text-[10px] text-slate-400">{booking.customerNim}</p>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <p className="font-semibold text-slate-700">{booking.bookingDate}</p>
                      <span className="inline-block mt-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded leading-tight">
                        {booking.sessionTime}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-slate-900 pr-5">
                      {formatRupiah(booking.totalPrice)}
                      <p className="text-[9px] text-slate-400 font-normal mt-0.5">{booking.sessionCount} Sesi</p>
                    </td>
                    <td className="py-4 text-center">
                      {booking.status === 'APPROVED' ? (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          LUNAS & DI-ACC
                        </div>
                      ) : booking.status === 'REJECTED' ? (
                        <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/50 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                          DITOLAK ADMIN
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/50 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider animate-pulse">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          MENUNGGU ACC
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-center pr-3">
                      {booking.status === 'PENDING' ? (
                        <button
                          onClick={() => {
                            setActiveQrisBooking(booking);
                          }}
                          className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 font-bold text-[10.5px] text-slate-950 px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          Bayar QRIS Demo
                        </button>
                      ) : booking.status === 'APPROVED' ? (
                        <button
                          onClick={() => {
                            setActiveReceiptBooking(booking);
                          }}
                          className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-[#003366] border border-blue-200 font-bold text-[10.5px] px-3 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Cetak Struk
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-medium block">Tidak dapat diproses</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: QRIS Demo Gateway Payment */}
      {activeQrisBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden p-6 shadow-2xl relative border border-slate-100 text-center flex flex-col space-y-4">
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveQrisBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors pointer-events-auto"
            >
              <X className="w-5 h-5" />
            </button>

            {/* QRIS Header branding */}
            <div className="flex flex-col items-center">
              <span className="text-rose-600 font-black tracking-tighter text-xl italic leading-none">QRIS</span>
              <span className="text-[7.5px] text-slate-400 font-bold uppercase tracking-widest mt-1">QR Code Indonesian Standard</span>
              <div className="h-[2px] w-12 bg-rose-500/50 mt-1"></div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NAMA MERCHANDISE</p>
              <p className="text-xs font-extrabold text-[#003366] truncate mt-0.5">KOPERASI TERPADU GEDUNG A10 UNESA</p>
              
              <div className="h-px bg-slate-200 my-2"></div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">TOTAL BILLING</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{formatRupiah(activeQrisBooking.totalPrice)}</p>
              <p className="text-[9.5px] text-emerald-600 font-semibold tracking-wide uppercase mt-1">PROGRES: TRANS-ID {activeQrisBooking.bookingCode}</p>
            </div>

            {/* Simulated Live SVG QR Code */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 max-w-[200px] mx-auto shadow-inner relative flex justify-center items-center">
              <svg className="w-44 h-44" viewBox="0 0 100 100">
                {/* QR Code Anchor Squares in corner */}
                <rect x="5" y="5" width="22" height="22" fill="#0A0F1D" stroke="#fff" strokeWidth="1.5" />
                <rect x="9" y="9" width="14" height="14" fill="#fff" />
                <rect x="12" y="12" width="8" height="8" fill="#0A0F1D" />

                <rect x="73" y="5" width="22" height="22" fill="#0A0F1D" stroke="#fff" strokeWidth="1.5" />
                <rect x="77" y="9" width="14" height="14" fill="#fff" />
                <rect x="80" y="12" width="8" height="8" fill="#0A0F1D" />

                <rect x="5" y="73" width="22" height="22" fill="#0A0F1D" stroke="#fff" strokeWidth="1.5" />
                <rect x="9" y="77" width="14" height="14" fill="#fff" />
                <rect x="12" y="80" width="8" height="8" fill="#0A0F1D" />

                {/* Simulated center logo point */}
                <rect x="42" y="42" width="16" height="16" fill="#003366" rx="2" />
                <text x="50" y="52" fill="#00E5FF" fontSize="7" fontWeight="bold" textAnchor="middle">GPN</text>

                {/* Random QR code pixels block lines */}
                <rect x="35" y="10" width="10" height="5" fill="#0A0F1D" />
                <rect x="52" y="15" width="5" height="12" fill="#0A0F1D" />
                <rect x="10" y="38" width="15" height="4" fill="#0A0F1D" />
                <rect x="42" y="30" width="16" height="6" fill="#0A0F1D" />
                <rect x="78" y="35" width="10" height="5" fill="#0A0F1D" />
                <rect x="72" y="52" width="15" height="8" fill="#0A0F1D" />
                <rect x="35" y="75" width="15" height="12" fill="#0A0F1D" />
                <rect x="78" y="78" width="14" height="14" fill="#0A0F1D" />
                <rect x="8" y="50" width="12" height="10" fill="#0A0F1D" />
                <rect x="58" y="5" width="5" height="15" fill="#0A0F1D" />
                <rect x="62" y="65" width="8" height="10" fill="#0A0F1D" />
                <rect x="40" y="62" width="6" height="4" fill="#0A0F1D" />
              </svg>
            </div>

            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              Scan barcode di atas / klik tombol simulasi di bawah ini untuk mengonfirmasi pelunasan secara instan.
            </p>

            <button
              onClick={() => handleSimulateQrisPayment(activeQrisBooking)}
              disabled={isVerifyingPayment}
              className={`w-full py-3.5 text-white font-bold rounded-2xl shadow-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                isVerifyingPayment ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98'
              }`}
            >
              {isVerifyingPayment ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Memverifikasi Transaksi...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Simulasikan Pembayaran Sukses
                </>
              )}
            </button>
            
            <p className="text-[9px] text-[#003366] font-mono select-none">Spring Boot Realtime Webhook Listener</p>
          </div>
        </div>
      )}

      {/* MODAL 2: Cashier Receipt Print Overlay */}
      {activeReceiptBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in print-preview-backdrop">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative border border-slate-100 flex flex-col space-y-6">
            
            {/* Modal header control elements (hidden on print) */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 print:hidden">
              <div className="flex items-center gap-1 text-[#003366] font-bold">
                <Printer className="w-4 relative -top-0.5" />
                <span className="text-xs font-bold uppercase tracking-wider">Preview Bukti Cetak Struk</span>
              </div>
              <button 
                onClick={() => setActiveReceiptBooking(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Area Voucher Container */}
            <div id="receipt-printable-content" className="bg-white border-2 border-dashed border-slate-300 p-5 font-mono text-[11px] text-slate-800 leading-relaxed shadow-sm rounded-xl">
              
              <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-300">
                <p className="font-bold text-sm text-[13px] tracking-wide text-slate-900">UNIVERSITAS NEGERI SURABAYA</p>
                <p className="font-bold text-xs">REKAPITULASI PROPERTI GEDUNG A10</p>
                <p className="text-[10px] text-slate-500 font-medium">Lidah Wetan, Kec. Lakarsantri, Surabaya, Jawa Timur 60213</p>
              </div>

              <div className="py-4 space-y-1.5 border-b border-slate-200">
                <div className="flex justify-between">
                  <span>NO STRUK  :</span>
                  <span className="font-bold text-slate-900">{activeReceiptBooking.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span>TANGGAL   :</span>
                  <span>{new Date(activeReceiptBooking.createdAt).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUSTOMER  :</span>
                  <span className="font-bold uppercase truncate max-w-[180px] text-right">{activeReceiptBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>IDENTITAS :</span>
                  <span>{activeReceiptBooking.customerNim}</span>
                </div>
                <div className="flex justify-between">
                  <span>KASTA     :</span>
                  <span>Civitas Academica UNESA</span>
                </div>
              </div>

              {/* Booking Item Billing Table */}
              <div className="py-4 space-y-3 border-b border-dashed border-slate-300">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>DETAIL TARGET NYATA :</span>
                  <span>QTY</span>
                </div>
                
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-800">{activeReceiptBooking.room.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Sesi: {activeReceiptBooking.sessionTime} • {activeReceiptBooking.bookingDate}</p>
                  
                  <div className="flex justify-between text-[10px] text-slate-600 mt-2">
                    <span>{formatRupiah(activeReceiptBooking.room.pricePerSession)} x {activeReceiptBooking.sessionCount} Sesi</span>
                    <span className="font-bold">{formatRupiah(activeReceiptBooking.totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="py-4 space-y-1.5">
                <div className="flex justify-between text-xs text-[12px] font-bold text-slate-900">
                  <span>TOTAL PEMBAYARAN:</span>
                  <span>{formatRupiah(activeReceiptBooking.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-[10.5px]">
                  <span>PAJAK PPN (0%):</span>
                  <span className="font-semibold text-emerald-600">FREE FOR CIVITAS unesa</span>
                </div>
                <div className="flex justify-between text-[10.5px]">
                  <span>METODE BAYAR  :</span>
                  <span className="font-bold text-emerald-600">QRIS MANDIRI - LUNAS</span>
                </div>
              </div>

              <div className="text-center pt-5 border-t border-dashed border-slate-300 space-y-1 text-slate-500 text-[10px]">
                <p className="font-bold text-slate-700">DIVERIFIKASI SISTEM MVC SPRING CORE v2026</p>
                <p>Simpan dokumen virtual ini sebagai bukti lunas</p>
                <p className="text-[8.5px] font-bold pointer-events-none select-none tracking-widest mt-2 uppercase text-[#003366]">--- LUNAS GEDUNG A10 UNESA ---</p>
              </div>
            </div>

            {/* Action buttons (hidden on print) */}
            <div className="grid grid-cols-2 gap-3 pb-2 print:hidden">
              <button
                onClick={() => {
                  // Direct clean iframe-friendly simulated printing
                  const printContents = document.getElementById('receipt-printable-content')?.innerHTML;
                  if (printContents) {
                    window.print();
                    addToast('success', 'Perintah Cetak Dikirim', 'Membuka dialog cetak sistem operasi / save PDF.');
                  }
                }}
                className="py-3 bg-[#003366] hover:bg-slate-850 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Cetak Struk (PDF)
              </button>
              
              <button
                onClick={() => setActiveReceiptBooking(null)}
                className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-2xl text-xs active:scale-95 transition-all cursor-pointer"
              >
                Selesai / Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { RoomType } from '../types';
import { Shield, Sparkles, TrendingUp, HandCoins, Users, CalendarDays, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard({ bookings, updateBookingStatus, addToast }) {
  
  // Calculate analytics
  const approvedBookings = bookings.filter((b) => b.status === 'APPROVED');
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  
  const totalRevenue = approvedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalSessions = approvedBookings.reduce((sum, b) => sum + b.sessionCount, 0);

  // Formatting helpers
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handleApprove = (booking) => {
    updateBookingStatus(booking.id, 'APPROVED');
    addToast('success', 'Booking Disetujui!', `Reservasi ${booking.bookingCode} untuk ${booking.room.name} resmi disetujui.`);
  };

  const handleReject = (booking) => {
    updateBookingStatus(booking.id, 'REJECTED');
    addToast('info', 'Booking Ditolak', `Reservasi ${booking.bookingCode} telah ditolak.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold tracking-wider text-[#003366] bg-blue-50 border border-blue-200/40 px-3 py-1 rounded-full uppercase">
            ADMINISTRATOR MANAGEMENT PORTAL
          </span>
          <h1 className="text-2xl font-bold text-slate-800 mt-2.5 tracking-tight">
            Dashboard Kelola & Rekapitulasi Gedung A10
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Menyetujui permohonan sesi kelas, memantau utilisasi, dan melakukan rekapitulasi audit keuangan secara otomatis.
          </p>
        </div>
      </div>

      {/* Analytics Card Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <HandCoins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Pendapatan Terbayar
            </span>
            <span className="text-xl font-black text-slate-900">
              {formatRupiah(totalRevenue)}
            </span>
            <span className="text-[10px] text-emerald-500 block font-semibold mt-0.5">
              Dari status APPROVED
            </span>
          </div>
        </div>

        {/* Approved Sessions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003366] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Jumlah Sesi Terisi
            </span>
            <span className="text-xl font-black text-slate-900">
              {totalSessions} Sesi
            </span>
            <span className="text-[10px] text-blue-500 block font-semibold mt-0.5">
              Utilisasi Sesi Kelas Gedung A10
            </span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Menunggu Persetujuan
            </span>
            <span className="text-xl font-black text-slate-900">
              {pendingBookings.length} Antrean
            </span>
            <span className="text-[10px] text-amber-500 block font-semibold mt-0.5">
              Perlu respon cepat
            </span>
          </div>
        </div>

        {/* Total Bookings Submission */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Total Seluruh Reservasi
            </span>
            <span className="text-xl font-black text-slate-900">
              {bookings.length} Formulir
            </span>
            <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">
              In-Memory ArrayList
            </span>
          </div>
        </div>
      </div>

      {/* Grid: SVG chart and queue list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Queue and List */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="pb-4 mb-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              📂 Daftar Formulir Reservasi (ArrayList Collection)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              ArrayList&lt;Booking&gt;
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              Belum ada antrean permohonan reservasi.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] bg-slate-50">
                    <th className="py-3 px-4">KODE</th>
                    <th className="py-3 px-4">PEMOHON</th>
                    <th className="py-3 px-4">RUANGAN</th>
                    <th className="py-3 px-4">SESI / HARGA</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-600">
                        {booking.bookingCode}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-950">{booking.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{booking.customerNim}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{booking.room.name}</div>
                        <div className="text-[10px] text-indigo-600 font-bold mt-0.5">{booking.room.code}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{booking.sessionCount} Sesi</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{formatRupiah(booking.totalPrice)}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold ${
                            booking.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : booking.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {booking.status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              id={`btn-approve-${booking.bookingCode}`}
                              onClick={() => handleApprove(booking)}
                              className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-1.5 rounded transition-all cursor-pointer flex items-center justify-center"
                              title="Setujui Pengajuan"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              id={`btn-reject-${booking.bookingCode}`}
                              onClick={() => handleReject(booking)}
                              className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white p-1.5 rounded transition-all cursor-pointer flex items-center justify-center"
                              title="Tolak Pengajuan"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium text-[10px]">Tindakan Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Income Chart visual representation with SVG */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="pb-4 mb-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">📊 Laporan Grafik Pendapatan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Berdasarkan tarif kelas & seminar disetujui</p>
          </div>

          {/* Simple gorgeous custom SVG bar chart representation */}
          <div className="space-y-6">
            <div className="h-44 bg-slate-50 rounded-xl p-4 flex flex-col justify-between border border-slate-100">
              <div className="flex justify-between items-baseline text-slate-400 text-[10px] font-bold">
                <span>Grafik Peruntukan Ruang (Approved)</span>
                <span className="text-[#003366]">{formatRupiah(totalRevenue)}</span>
              </div>
              
              <div className="flex items-end justify-around h-24 gap-2 pt-2">
                {/* Bar 1: Ruang Kelas */}
                {(() => {
                  const kelasRevenue = approvedBookings
                    .filter(b => b.room.type === RoomType.RUANG_KELAS)
                    .reduce((sum, b) => sum + b.totalPrice, 0);
                  const maxVal = totalRevenue || 1;
                  const pct = Math.max(10, Math.min(100, (kelasRevenue / maxVal) * 100));
                  return (
                    <div className="flex flex-col items-center flex-1">
                      <div className="text-[8px] font-mono font-bold text-slate-700">{formatRupiah(kelasRevenue)}</div>
                      <div 
                        style={{ height: `${pct}%` }} 
                        className="bg-blue-400 hover:bg-blue-500 rounded-t w-full transition-all duration-500 mt-1 max-h-[80px]"
                      ></div>
                      <span className="text-[9px] text-slate-400 mt-2 font-semibold">Kelas (Rp5k)</span>
                    </div>
                  );
                })()}

                {/* Bar 2: Ruang Seminar */}
                {(() => {
                  const seminarRevenue = approvedBookings
                    .filter(b => b.room.type === RoomType.RUANG_SEMINAR)
                    .reduce((sum, b) => sum + b.totalPrice, 0);
                  const maxVal = totalRevenue || 1;
                  const pct = Math.max(10, Math.min(100, (seminarRevenue / maxVal) * 100));
                  return (
                    <div className="flex flex-col items-center flex-1">
                      <div className="text-[8px] font-mono font-bold text-slate-700">{formatRupiah(seminarRevenue)}</div>
                      <div 
                        style={{ height: `${pct}%` }} 
                        className="bg-[#003366] hover:bg-slate-800 rounded-t w-full transition-all duration-500 mt-1 max-h-[80px]"
                      ></div>
                      <span className="text-[9px] text-slate-400 mt-2 font-semibold">Seminar (Rp50k)</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Quick Stats table */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-blue-400 block"></span>
                  Ruang Kelas Terpakai
                </span>
                <span className="font-mono font-bold">
                  {approvedBookings.filter((b) => b.room.type === RoomType.RUANG_KELAS).length} unit
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-600">
                <span className="font-semibold flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#003366] block"></span>
                  Ruang Seminar Terpakai
                </span>
                <span className="font-mono font-bold">
                  {approvedBookings.filter((b) => b.room.type === RoomType.RUANG_SEMINAR).length} unit
                </span>
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] leading-relaxed text-indigo-950">
                ⚠️ <strong>Ketentuan Admin:</strong> Hanya reservasi berstatus <strong>APPROVED</strong> yang nilainya dihitung ke dalam grafik laporan pendapatan dan rekapitulasi sesi terisi gedung A10 UNESA.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

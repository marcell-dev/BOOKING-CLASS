# Tugas Akhir Praktikum PBO - Dashboard Reservasi Ruangan A10

## Deskripsi

Ini adalah project akhir untuk mata kuliah Pemrograman Berorientasi Objek (PBO). Aplikasi ini adalah simulasi sistem booking ruang kelas dan seminar khusus untuk Gedung A10 UNESA.

Aplikasi ini menggunakan React + Vite untuk frontend-nya, tapi di dalamnya mengimplementasikan logika PBO yang mensimulasikan backend Java, seperti:

- Penggunaan Collection (ArrayList) untuk data ruangan dan riwayat booking.
- Konsep Exception Handling (misal kalau ruangan udah di-booking di jam yang sama bakal muncul notif error/bentrok).
- State management sederhana.

Ada juga fitur simulasi pembayaran pakai QRIS dan cetak struk PDF untuk melengkapi alur aplikasinya.

## Cara Menjalankan Project di Laptop

Kalau mau nyoba jalanin project ini di lokal, ikutin langkah ini ya:

1. Clone repo ini dulu:
   ```bash
   git clone <link-repo-ini>
   cd dashboard-pbo
  
2. Install module-nya (pastikan udah ada Node.js):
   ```bash
   npm install
  
3. Jalanin server lokal Vite:
   ```bash
   npm run dev
  
4. Tinggal buka link `http://localhost:5173` di browser.


## Disusun Oleh:

1. Heaven Arvian Marcello Devin 032
2. Doni Hendra Pramudita 218
3. Muhammad Ali Ibrahim khalilullah 107
4. Ahmad Aditya Ardiansyah 203

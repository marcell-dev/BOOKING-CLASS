export const javaFiles = [
  {
    name: "RoomType.java",
    path: "src/main/java/id/ac/unesa/booking/model/RoomType.java",
    language: "java",
    description: "Enum java tipe ruangan dengan tarif sesi eksklusif Gedung A10 UNESA.",
    content: `package id.ac.unesa.booking.model;

/**
 * Enum untuk membedakan tipe ruangan beserta tarif dasarnya per sesi.
 * Sesuai aturan bisnis Gedung A10 UNESA.
 */
public enum RoomType {
    RUANG_KELAS(5000, "Ruang Kelas (Kapasitas ~40 mhs)"),
    RUANG_SEMINAR(50000, "Ruang Seminar (Auditorium / Aula)");

    private final double pricePerSession;
    private final String displayName;

    RoomType(double pricePerSession, String displayName) {
        this.pricePerSession = pricePerSession;
        this.displayName = displayName;
    }

    public double getPricePerSession() {
        return pricePerSession;
    }

    public String getDisplayName() {
        return displayName;
    }
}`
  },
  {
    name: "User.java (Abstraction)",
    path: "src/main/java/id/ac/unesa/booking/model/User.java",
    language: "java",
    description: "Abstract class untuk merepresentasikan pengguna sistem dengan encapsulasi (PBO).",
    content: `package id.ac.unesa.booking.model;

/**
 * Abstraksi Class Pengguna (User) - Pilar Inheritance & Abstraction.
 * Tidak bisa diinstansiasi secara langsung (abstract).
 */
public abstract class User {
    private String id;
    private String name;
    private String email;
    private String role; // "ADMIN" atau "CUSTOMER"

    // Constructor utama yang akan dipanggil oleh Sub-class
    public User(String id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Abstract method yang wajib diimplementasikan oleh subclass
    public abstract String getIdentityNumber();

    // Getter & Setter (Encapsulation)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}`
  },
  {
    name: "Customer.java (Inheritance)",
    path: "src/main/java/id/ac/unesa/booking/model/Customer.java",
    language: "java",
    description: "Subclass dari User representasi Dosen/Mahasiswa dengan konstruktor super().",
    content: `package id.ac.unesa.booking.model;

/**
 * Class Customer merepresentasikan Mahasiswa/Dosen (Pilar Inheritance).
 * Memanggil super constructor dari abstract class User.
 */
public class Customer extends User {
    private String nim; // Nomor Induk Mahasiswa / NIP Dosen

    // Memanfaatkan keyword super() untuk instansiasi class induk
    public Customer(String id, String name, String email, String nim) {
        super(id, name, email, "CUSTOMER");
        this.nim = nim;
    }

    @Override
    public String getIdentityNumber() {
        return this.nim; // Implementasi method abstract dari User
    }

    // Getter dan Setter spesifik Customer
    public String getNim() { return nim; }
    public void setNim(String nim) { this.nim = nim; }
}`
  },
  {
    name: "Admin.java (Inheritance)",
    path: "src/main/java/id/ac/unesa/booking/model/Admin.java",
    language: "java",
    description: "Subclass dari User representasi staf Admin Gedung A10 UNESA dengan konstruktor super().",
    content: `package id.ac.unesa.booking.model;

/**
 * Class Admin merepresentasikan Staf Pengelola Gedung A10 (Pilar Inheritance).
 */
public class Admin extends User {
    private String nip; // Nomor Induk Pegawai

    public Admin(String id, String name, String email, String nip) {
        super(id, name, email, "ADMIN");
        this.nip = nip;
    }

    @Override
    public String getIdentityNumber() {
        return this.nip; // Implementasi method abstract
    }

    public String getNip() { return nip; }
    public void setNip(String nip) { this.nip = nip; }
}`
  },
  {
    name: "NotificationService.java",
    path: "src/main/java/id/ac/unesa/booking/service/NotificationService.java",
    language: "java",
    description: "Interface pilar Polymorphism untuk memicu notifikasi Toast ke UI web.",
    content: `package id.ac.unesa.booking.service;

/**
 * Interface Layanan Notifikasi (Pilar Polymorphism & Interface).
 * Memungkinkan implementasi multi-platform (Toast, Webhook, Email, dll).
 */
public interface NotificationService {
    void sendNotification(String message, String type);
}`
  },
  {
    name: "ToastNotificationServiceImpl.java",
    path: "src/main/java/id/ac/unesa/booking/service/ToastNotificationServiceImpl.java",
    language: "java",
    description: "Implementasi konkret dari NotificationService untuk melayani notifikasi UI Web.",
    content: `package id.ac.unesa.booking.service;

import org.springframework.stereotype.Service;
import java.util.logging.Logger;

/**
 * Implementasi konkret NotificationService yang nantinya akan di-bridge 
 * ke front-end melalui Event Toast Notification melayang.
 */
@Service
public class ToastNotificationServiceImpl implements NotificationService {
    private static final Logger LOGGER = Logger.getLogger(ToastNotificationServiceImpl.class.getName());

    @Override
    public void sendNotification(String message, String type) {
        // Log notifikasi di sisi server (Spring Boot console)
        LOGGER.info(String.format("[TOAST NOTIFICATION - %s]: %s", type.toUpperCase(), message));
        
        // Dalam skenario Spring Boot utuh, ini bisa dipublish lewat WebSocket
        // atau disimpan sebagai FlashAttributes redirect ThymeLeaf.
    }
}`
  },
  {
    name: "Booking.java",
    path: "src/main/java/id/ac/unesa/booking/model/Booking.java",
    language: "java",
    description: "Model representasi reservasi gedung A10 dengan kalkulasi harga dinamis.",
    content: `package id.ac.unesa.booking.model;

import java.time.LocalDate;

public class Booking {
    private String id;
    private String bookingCode;
    private String roomCode;
    private String roomName;
    private RoomType roomType;
    private String customerName;
    private String customerNim;
    private int sessionCount; // Quantity sesi
    private LocalDate bookingDate;
    private String sessionTime; // Misal: "07:30 - 09:10"
    private double totalPrice;
    private String status; // PENDING, APPROVED, REJECTED

    public Booking() {}

    public Booking(String id, String bookingCode, String roomCode, String roomName, 
                   RoomType roomType, String customerName, String customerNim, 
                   int sessionCount, LocalDate bookingDate, String sessionTime) {
        this.id = id;
        this.bookingCode = bookingCode;
        this.roomCode = roomCode;
        this.roomName = roomName;
        this.roomType = roomType;
        this.customerName = customerName;
        this.customerNim = customerNim;
        this.sessionCount = sessionCount;
        this.bookingDate = bookingDate;
        this.sessionTime = sessionTime;
        this.status = "PENDING";
        
        // Melakukan kalkulasi total biaya otomatis (RoomType tarif * sessionCount)
        calculateTotalPrice();
    }

    public void calculateTotalPrice() {
        if (roomType != null) {
            this.totalPrice = roomType.getPricePerSession() * this.sessionCount;
        }
    }

    // Getter dan Setter
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; this.calculateTotalPrice(); }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerNim() { return customerNim; }
    public void setCustomerNim(String customerNim) { this.customerNim = customerNim; }

    public int getSessionCount() { return sessionCount; }
    public void setSessionCount(int sessionCount) { this.sessionCount = sessionCount; this.calculateTotalPrice(); }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getSessionTime() { return sessionTime; }
    public void setSessionTime(String sessionTime) { this.sessionTime = sessionTime; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}`
  },
  {
    name: "Exceptions.java",
    path: "src/main/java/id/ac/unesa/booking/exception/CustomException.java",
    language: "java",
    description: "Exception handling kustom: RoomNotAvailableException & InvalidInputException.",
    content: `package id.ac.unesa.booking.exception;

/**
 * Custom Runtime Exception untuk menangani error ketersediaan ruangan
 * jika terjadi tabrakan jadwal di hari dan sesi waktu yang sama.
 */
class RoomNotAvailableException extends RuntimeException {
    public RoomNotAvailableException(String message) {
        super(message);
    }
}

/**
 * Custom Runtime Exception untuk menangani error jika kuantitas minus,
 * kosong, atau input user tidak valid.
 */
class InvalidInputException extends RuntimeException {
    public InvalidInputException(String message) {
        super(message);
    }
}`
  },
  {
    name: "BookingService.java (JCF Collection)",
    path: "src/main/java/id/ac/unesa/booking/service/BookingService.java",
    language: "java",
    description: "Layanan utama manipulasi data booking menggunakan Java List Collection (ArrayList).",
    content: `package id.ac.unesa.booking.service;

import id.ac.unesa.booking.model.Booking;
import id.ac.unesa.booking.model.RoomType;
import id.ac.unesa.booking.exception.RoomNotAvailableException;
import id.ac.unesa.booking.exception.InvalidInputException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service Handler PBO dangan Java Collection ArrayList untuk menyimpan data secara in-memory.
 */
@Service
public class BookingService {

    // Java Collection Framework: ArrayList untuk menyimpan data booking
    private final List<Booking> bookingList = new ArrayList<>();
    
    @Autowired
    private NotificationService notificationService;

    public BookingService() {
        // Seeding beberapa data awal untuk testing dashboard
        seedInitialData();
    }

    private void seedInitialData() {
        bookingList.add(new Booking(
            UUID.randomUUID().toString(), "BKG-A1001", "A10.01.02", "Ruang Kuliah PBO 101",
            RoomType.RUANG_KELAS, "Wayan Setiawan", "23051214012", 2,
            LocalDate.now(), "07:30 - 09:10"
        ));
        bookingList.get(0).setStatus("APPROVED");

        bookingList.add(new Booking(
            UUID.randomUUID().toString(), "BKG-A1002", "A10.03.01", "Aula Pertemuan Utama",
            RoomType.RUANG_SEMINAR, "Dr. Supriyadi", "197805122004121001", 1,
            LocalDate.now().plusDays(1), "09:30 - 11:10"
        ));
    }

    // Mendapatkan semua daftar Booking (ArrayList)
    public List<Booking> getAllBookings() {
        return new ArrayList<>(bookingList);
    }

    // Membuat booking baru dengan serangkaian validasi (Exception Handling)
    public synchronized Booking createBooking(Booking rawBooking) {
        // 1. Validasi Input (Quantity Sesi / Session Count)
        if (rawBooking.getSessionCount() <= 0) {
            notificationService.sendNotification("Gagal: Jumlah sesi harus bernilai positif!", "error");
            throw new InvalidInputException("Error Validasi: Jumlah Sesi (quantity) tidak boleh kosong atau negatif!");
        }

        if (rawBooking.getCustomerName() == null || rawBooking.getCustomerName().trim().isEmpty()) {
            throw new InvalidInputException("Error Validasi: Nama pemohon tidak boleh kosong!");
        }

        if (rawBooking.getCustomerNim() == null || rawBooking.getCustomerNim().trim().isEmpty()) {
            throw new InvalidInputException("Error Validasi: NIM/NIP wajib diisi!");
        }

        // 2. Validasi Tabrakan Jadwal (RoomNotAvailableException)
        for (Booking existing : bookingList) {
            if ("APPROVED".equals(existing.getStatus()) || "PENDING".equals(existing.getStatus())) {
                if (existing.getRoomCode().equalsIgnoreCase(rawBooking.getRoomCode()) &&
                    existing.getBookingDate().equals(rawBooking.getBookingDate()) &&
                    existing.getSessionTime().equalsIgnoreCase(rawBooking.getSessionTime())) {
                    
                    notificationService.sendNotification("Gagal: Ruangan sudah dibooking pada sesi tersebut!", "error");
                    throw new RoomNotAvailableException("Ruangan " + rawBooking.getRoomCode() + 
                        " tidak tersedia karena sudah dibooking pada tanggal " + 
                        rawBooking.getBookingDate() + " di sesi " + rawBooking.getSessionTime());
                }
            }
        }

        // Generate ID dan Kode Booking unik
        rawBooking.setId(UUID.randomUUID().toString());
        rawBooking.setBookingCode("BKG-A10" + String.format("%03d", (bookingList.size() + 1)));
        rawBooking.calculateTotalPrice();
        rawBooking.setStatus("PENDING");

        // Simpan ke Java Collection ArrayList
        bookingList.add(rawBooking);
        
        // Polimorfisme pemanggilan notifikasi UI toast
        notificationService.sendNotification("Sukses! Pengajuan Booking ruangan " + rawBooking.getRoomName() + " berhasil dibuat.", "success");

        return rawBooking;
    }

    // Mengubah status booking (Disetujui/Ditolak) oleh Admin
    public void updateStatus(String bookingId, String status) {
        for (Booking booking : bookingList) {
            if (booking.getId().equals(bookingId)) {
                booking.setStatus(status);
                String pesan = "Booking " + booking.getBookingCode() + " telah " + 
                    ("APPROVED".equals(status) ? "DISETUJUI" : "DITOLAK") + " oleh Admin.";
                notificationService.sendNotification(pesan, "APPROVED".equals(status) ? "success" : "info");
                return;
            }
        }
    }

    // Menghitung total rekapitulasi pendapatan gedung A10
    public double calculateTotalRevenue() {
        return bookingList.stream()
            .filter(b -> "APPROVED".equals(b.getStatus()))
            .mapToDouble(Booking::getTotalPrice)
            .sum();
    }
}`
  },
  {
    name: "BookingController.java",
    path: "src/main/java/id/ac/unesa/booking/controller/BookingController.java",
    language: "java",
    description: "Spring Boot Web MVC Controller untuk melayani request REST api / Thymeleaf templates.",
    content: `package id.ac.unesa.booking.controller;

import id.ac.unesa.booking.model.Booking;
import id.ac.unesa.booking.service.BookingService;
import id.ac.unesa.booking.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;

@Controller
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Menampilkan halaman utama form booking beserta ketersediaan ruangan
    @GetMapping("/form")
    public String showBookingForm(Model model) {
        model.addAttribute("booking", new Booking());
        model.addAttribute("bookings", bookingService.getAllBookings());
        return "booking-form";
    }

    // Memproses submit form booking - Menerapkan Exception Handling tingkat Controller
    @PostMapping("/submit")
    public String submitBooking(@ModelAttribute("booking") Booking booking, 
                                RedirectAttributes redirectAttributes) {
        try {
            // Memanggil Service PBO yang melempar exception jika ada aturan bisnis yang dilanggar
            bookingService.createBooking(booking);
            
            // Menyimpan pesan sukses ke flash attribute (Thymeleaf Toast)
            redirectAttributes.addFlashAttribute("toastMessage", "Booking Berhasil Diajukan!");
            redirectAttributes.addFlashAttribute("toastType", "success");
            
            return "redirect:/booking/form";

        } catch (InvalidInputException e) {
            // Catch blok penanganan error input (Validator custom runtime exception)
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            redirectAttributes.addFlashAttribute("toastMessage", "Input Tidak Valid!");
            redirectAttributes.addFlashAttribute("toastType", "error");
            
            // Mengembalikan input yang salah agar tidak terhapus total
            redirectAttributes.addFlashAttribute("invalidBooking", booking);
            return "redirect:/booking/form";

        } catch (RoomNotAvailableException e) {
            // Catch blok penanganan error jadwal bertabrakan
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            redirectAttributes.addFlashAttribute("toastMessage", "Ruangan Tidak Tersedia!");
            redirectAttributes.addFlashAttribute("toastType", "error");
            
            redirectAttributes.addFlashAttribute("invalidBooking", booking);
            return "redirect:/booking/form";
            
        } catch (Exception e) {
            // Catch backup all unknown exception
            redirectAttributes.addFlashAttribute("errorMessage", "Terjadi kesalahan server internal: " + e.getMessage());
            redirectAttributes.addFlashAttribute("toastMessage", "Gagal Sistem!");
            redirectAttributes.addFlashAttribute("toastType", "error");
            return "redirect:/booking/form";
        }
    }

    // Endpoint API untuk admin menyetujui transaksi
    @PostMapping("/approve/{id}")
    @ResponseBody
    public String approveBooking(@PathVariable String id) {
        bookingService.updateStatus(id, "APPROVED");
        return "SUCCESS";
    }

    // Endpoint API untuk admin menolak transaksi
    @PostMapping("/reject/{id}")
    @ResponseBody
    public String rejectBooking(@PathVariable String id) {
        bookingService.updateStatus(id, "REJECTED");
        return "SUCCESS";
    }
}`
  },
  {
    name: "booking-form.html (Thymeleaf UI)",
    path: "src/main/resources/templates/booking-form.html",
    language: "html",
    description: "Thymeleaf template dengan integrasi Tailwind CSS CDN, real-time calculations, dan notifikasi Toast melayang.",
    content: `<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Room Booking Gedung A10 UNESA</title>
    <!-- Tailwind CSS modern CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        unesaNavy: '#003366',
                        unesaGold: '#FFCC00',
                        slateBg: '#F9F9FB'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slateBg min-h-screen text-slate-800 font-sans flex font-sans">
    
    <!-- Toast Notification Melayang di Pojok Kanan Atas -->
    <div id="toastNotification" 
         class="fixed top-5 right-5 z-50 transform translate-y-[-20px] opacity-0 transition-all duration-300 pointer-events-none">
        <div class="bg-white border-l-4 shadow-xl rounded-lg p-4 flex items-center space-x-3 w-80">
            <div id="toastIcon" class="text-xl"></div>
            <div>
                <h4 id="toastTitle" class="font-bold text-sm text-slate-900"></h4>
                <p id="toastBody" class="text-xs text-slate-600"></p>
            </div>
        </div>
    </div>

    <!-- MAIN SIDEBAR -->
    <aside class="w-64 bg-unesaNavy text-white sticky top-0 h-screen flex flex-col justify-between p-6">
        <div>
            <!-- Header Brand -->
            <div class="flex items-center space-x-3 pb-6 border-b border-indigo-900 mb-8">
                <span class="text-2xl font-black text-unesaGold select-none">UNESA</span>
                <span class="text-sm font-light border-l pl-3 border-indigo-700 leading-tight">Gedung A10<br/>Room Booking</span>
            </div>
            
            <!-- Sidebar Nav Links -->
            <nav class="space-y-2">
                <a href="#" class="flex items-center space-x-3 py-3 px-4 rounded-lg bg-indigo-950 font-medium border-l-4 border-unesaGold transition-all">
                    <span>🗓️ Booking Ruangan</span>
                </a>
                <a href="#" class="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
                    <span>⚙️ Kelola Reservasi (Admin)</span>
                </a>
            </nav>
        </div>
        
        <!-- Sidebar Footer -->
        <div class="text-xs text-slate-400 border-t border-indigo-900 pt-4">
            <span class="block">Senior Developer JVM v17</span>
            <span class="font-mono text-[10px]">A10_UNESA_PBO_WEB_DASHBOARD</span>
        </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 p-8 overflow-y-auto">
        <!-- Dashboard Header -->
        <header class="flex justify-between items-center mb-10 pb-4 border-b border-slate-200">
            <div>
                <span class="text-xs text-blue-800 font-bold uppercase tracking-wider">GEDUNG A10 UNESA</span>
                <h1 class="text-3xl font-black text-slate-900 tracking-tight">Formulir Reservasi Sesi Kelas</h1>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-xs bg-indigo-100 text-unesaNavy font-bold px-3 py-1.5 rounded-full">🎓 Mahasiswa / Dosen</span>
            </div>
        </header>

        <!-- Bento Grid / Layout Card -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- Left Grid: Form Booking -->
            <section class="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div class="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                    <h2 class="text-lg font-bold text-slate-900 flex items-center space-x-2">
                        <span>📝 Selesaikan Informasi Pemohon</span>
                    </h2>
                    <span class="text-xs text-slate-400">*Wajib diisi</span>
                </div>

                <form id="bookingForm" th:action="@{/booking/submit}" th:object="\${booking}" method="POST" class="space-y-6">
                    
                    <!-- Pilihan Tipe & Ruangan -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Tipe Ruangan</label>
                            <select id="roomTypeSelect" name="roomType" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-unesaNavy focus:ring-1 focus:ring-unesaNavy transition-all outline-none">
                                <option value="RUANG_KELAS" data-price="5000">Ruang Kelas (Rp5.000 / Sesi)</option>
                                <option value="RUANG_SEMINAR" data-price="50000">Ruang Seminar (Rp50.000 / Sesi)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Kode / Nama Ruangan</label>
                            <select name="roomCode" id="roomCode" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-unesaNavy focus:ring-1 focus:ring-unesaNavy transition-all outline-none">
                                <option value="A10.01.02">R. Kelas A10.01.02 - Lt.1</option>
                                <option value="A10.02.01">R. Kelas A10.02.01 - Lt.2</option>
                                <option value="A10.03.01">R. Seminar Utama Lt.3</option>
                            </select>
                        </div>
                    </div>

                    <!-- Personal Information -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Nama Lengkap</label>
                            <input type="text" name="customerName" placeholder="Masukkan nama" required
                                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-unesaNavy focus:ring-1 focus:ring-unesaNavy transition-all outline-none"/>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">NIM / NIP Identitas</label>
                            <input type="text" name="customerNim" placeholder="Nomor Induk Mahasiswa / Pegawai" required
                                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-unesaNavy focus:ring-1 focus:ring-unesaNavy transition-all outline-none"/>
                        </div>
                    </div>

                    <!-- Date & Session Time -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Tanggal Booking</label>
                            <input type="date" name="bookingDate" required id="bookingDate"
                                   class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-unesaNavy focus:ring-1 focus:ring-unesaNavy transition-all outline-none"/>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Sesi Jam</label>
                            <select name="sessionTime" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-unesaNavy focus:ring-1 focus:ring-unesaNavy transition-all outline-none">
                                <option value="07:30 - 09:10">Hari Sesi 1 (07:30 - 09:10)</option>
                                <option value="09:15 - 10:55">Hari Sesi 2 (09:15 - 10:55)</option>
                                <option value="11:00 - 12:40">Hari Sesi 3 (11:00 - 12:40)</option>
                                <option value="13:30 - 15:10">Hari Sesi 4 (13:30 - 15:10)</option>
                            </select>
                        </div>
                        <div>
                            <!-- Real-Time Input Calculation / Event Listener -->
                            <div class="relative">
                                <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Jumlah Sesi</label>
                                <input type="number" id="sessionCountInput" name="sessionCount" placeholder="Sesi" value="1"
                                       class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 transition-all outline-none duration-200" />
                                <p id="validateErrorMsg" class="text-[10px] text-red-500 font-medium absolute top-full left-0 mt-1 hidden"></p>
                            </div>
                        </div>
                    </div>

                    <!-- Real-Time Calculation Display -->
                    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex justify-between items-center mt-8">
                        <div>
                            <span class="text-xs text-indigo-700 font-bold uppercase tracking-wide">Kalkulasi Tarif Real-Time</span>
                            <div class="text-[11px] text-slate-500 mt-0.5">
                                <span id="numSesiBreadcrumb">1</span> Sesi x <span id="baseTarifBreadcrumb">Rp5.000</span> (Gedung A10)
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-slate-400 block font-light">Estimasi Pembayaran</span>
                            <span id="realTimeTotalDisplay" class="text-2xl font-black text-unesaNavy">Rp5.000</span>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" id="submitBtn"
                            class="w-full py-4 bg-unesaNavy hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center">
                        Ajukan Permohonan Booking Kelas
                    </button>
                </form>
            </section>

            <!-- Right Grid: Gedung A10 Info & Price Cards -->
            <section class="lg:col-span-5 space-y-6">
                
                <!-- Harga Card -->
                <div class="bg-gradient-to-br from-indigo-950 to-unesaNavy shadow-xl rounded-2xl p-6 text-white relative overflow-hidden">
                    <!-- Decor background circles -->
                    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-900 rounded-full opacity-20"></div>
                    <div class="absolute -right-20 -top-20 w-48 h-48 bg-unesaGold rounded-full opacity-10"></div>
                    
                    <h3 class="text-unesaGold text-xs font-black uppercase tracking-wider mb-4">Gedung A10 Tarifikasi Resmi</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center border-b border-indigo-900 pb-3">
                            <div>
                                <span class="font-bold text-sm block">Ruang Kelas Kuliah</span>
                                <span class="text-xs text-slate-300">Papan tulis, Projector, AC split</span>
                            </div>
                            <span class="text-lg font-black text-slate-100">Rp5.000<span class="text-[10px] font-normal text-slate-400">/sesi</span></span>
                        </div>
                        <div class="flex justify-between items-center">
                            <div>
                                <span class="font-bold text-sm block">Ruang Seminar/Aula</span>
                                <span class="text-xs text-slate-300">Sound system, Mic, Max 100 pax</span>
                            </div>
                            <span class="text-lg font-black text-unesaGold">Rp50.000<span class="text-[10px] font-normal text-slate-400">/sesi</span></span>
                        </div>
                    </div>
                </div>

                <!-- Petunjuk PBO Info -->
                <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Materi Kuliah PBO Terpaut</h4>
                    <ul class="text-xs space-y-2 text-slate-600 font-normal">
                        <li class="flex items-start space-x-2">
                            <span class="text-green-500 font-bold">✓</span>
                            <span><strong>Polimorfisme:</strong> Class <code>ToastNotificationServiceImpl</code> melayani push toast melayang.</span>
                        </li>
                        <li class="flex items-start space-x-2">
                            <span class="text-green-500 font-bold">✓</span>
                            <span><strong>Inheritance:</strong> <code>Customer</code> mewarisi class abstract <code>User</code> menggunakan constructor super().</span>
                        </li>
                        <li class="flex items-start space-x-2">
                            <span class="text-green-500 font-bold">✓</span>
                            <span><strong>Exception:</strong> System melempar custom runtime Exception tanpa merusak UI.</span>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    </main>

    <!-- UI/UX CLIENT-SIDE JAVASCRIPT REAL-TIME CALCULATION & ERROR BORDER VALIDATION -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const sessionInput = document.getElementById('sessionCountInput');
            const roomTypeSelect = document.getElementById('roomTypeSelect');
            const totalDisplay = document.getElementById('realTimeTotalDisplay');
            const numSesiBreadcrumb = document.getElementById('numSesiBreadcrumb');
            const baseTarifBreadcrumb = document.getElementById('baseTarifBreadcrumb');
            const validateErrorMsg = document.getElementById('validateErrorMsg');
            const submitBtn = document.getElementById('submitBtn');

            // Format angka Rupiah
            const formatRupiah = (number) => {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                }).format(number);
            };

            const calculateRealtimeCost = () => {
                const qtyValue = parseInt(sessionInput.value);
                const selectedOption = roomTypeSelect.options[roomTypeSelect.selectedIndex];
                const basePrice = parseInt(selectedOption.getAttribute('data-price') || 0);

                // Trigger validasi custom di UI (showValidateErrors)
                if (isNaN(qtyValue) || qtyValue <= 0) {
                    sessionInput.classList.remove('focus:border-unesaNavy', 'border-slate-200');
                    sessionInput.classList.add('border-red-500', 'focus:ring-red-500', 'bg-red-50');
                    validateErrorMsg.textContent = 'Minimum 1 sesi (quantity harus positif)';
                    validateErrorMsg.classList.remove('hidden');
                    submitBtn.classList.add('opacity-50', 'pointer-events-none');
                    totalDisplay.textContent = '-';
                } else {
                    // Pulihkan state jika valid
                    sessionInput.classList.remove('border-red-500', 'focus:ring-red-500', 'bg-red-50');
                    sessionInput.classList.add('border-slate-200', 'focus:border-unesaNavy');
                    validateErrorMsg.classList.add('hidden');
                    submitBtn.classList.remove('opacity-50', 'pointer-events-none');

                    // Lakukan penghitungan total
                    const totalCost = basePrice * qtyValue;
                    totalDisplay.textContent = formatRupiah(totalCost);
                    numSesiBreadcrumb.textContent = qtyValue;
                    baseTarifBreadcrumb.textContent = formatRupiah(basePrice);
                }
            };

            // Pasang event listener
            sessionInput.addEventListener('input', calculateRealtimeCost);
            roomTypeSelect.addEventListener('change', calculateRealtimeCost);

            // Set Tanggal default ke hari ini
            document.getElementById('bookingDate').valueAsDate = new Date();

            // Set default calculation awal
            calculateRealtimeCost();

            // Skenario Simulasi Munculkan Toast (Bisa dipicu th:if redirect atribut Spring Boot)
            // Contoh trigger triggerToast("success", "Booking Berhasil", "Menunggu persetujuan admin")
            window.triggerToast = (type, title, message) => {
                const toast = document.getElementById('toastNotification');
                const toastTitle = document.getElementById('toastTitle');
                const toastBody = document.getElementById('toastBody');
                const toastIcon = document.getElementById('toastIcon');

                toastTitle.textContent = title;
                toastBody.textContent = message;

                if (type === 'success') {
                    toast.firstElementChild.className = "bg-white border-l-4 border-green-500 shadow-xl rounded-lg p-4 flex items-center space-x-3 w-80";
                    toastIcon.textContent = "✅";
                } else if (type === 'error') {
                    toast.firstElementChild.className = "bg-white border-l-4 border-red-500 shadow-xl rounded-lg p-4 flex items-center space-x-3 w-80";
                    toastIcon.textContent = "❌";
                } else {
                    toast.firstElementChild.className = "bg-white border-l-4 border-blue-500 shadow-xl rounded-lg p-4 flex items-center space-x-3 w-80";
                    toastIcon.textContent = "ℹ️";
                }

                // Show Animasi Fade in
                toast.classList.remove('translate-y-[-20px]', 'opacity-0');
                toast.classList.add('translate-y-0', 'opacity-100');

                // Hilang setelah 3 detik
                setTimeout(() => {
                    toast.classList.remove('translate-y-0', 'opacity-100');
                    toast.classList.add('translate-y-[-20px]', 'opacity-0');
                }, 3000);
            };
        });
    </script>
</body>
</html>`
  }
];

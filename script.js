"use strict";

// Data pendaftaran hanya disimpan dalam memori.
// Tidak dikirim ke server dan hilang saat halaman dimuat ulang.

// ========================================
// 1. GALERI KEGIATAN
// ========================================

const activities = [
  [
    "01",
    "DASAR PEMROGRAMAN",
    "Pelatihan Dasar Python",
    "Kenali variabel, logika, dan perulangan melalui latihan Python yang mudah diikuti.",
    "Untuk pemula",
    "photo-1515879218367-8466d910aaa4",
    "Layar laptop menampilkan kode pemrograman"
  ],
  [
    "02",
    "PENGEMBANGAN WEB",
    "Workshop JavaScript",
    "Hidupkan halaman web dengan interaksi, manipulasi elemen, dan proyek JavaScript sederhana.",
    "Praktik interaktif",
    "photo-1498050108023-c5249f4df085",
    "Laptop untuk praktik pengembangan website"
  ],
  [
    "03",
    "PEMROGRAMAN BERORIENTASI OBJEK",
    "Kelas Java",
    "Pelajari konsep class dan object untuk menyusun program yang terstruktur dan mudah dikembangkan.",
    "Konsep & praktik",
    "photo-1517694712202-14dd9538aa97",
    "Laptop di meja belajar pemrograman"
  ],
  [
    "04",
    "PENGEMBANGAN BACKEND",
    "Pelatihan PHP",
    "Kenali cara kerja server, pengolahan form, dan dasar pembuatan website dinamis menggunakan PHP.",
    "Latihan berbasis proyek",
    "photo-1461749280684-dccba630e2f6",
    "Monitor menampilkan kode untuk pengembangan aplikasi"
  ],
  [
    "05",
    "LOGIKA & ALGORITMA",
    "Dasar Pemrograman C++",
    "Asah cara berpikir logis melalui tipe data, percabangan, fungsi, dan pemecahan masalah.",
    "Fondasi pemrograman",
    "photo-1518770660439-4636190af475",
    "Komponen elektronik sebagai ilustrasi teknologi komputasi"
  ],
  [
    "06",
    "KOLABORASI TIM",
    "Kolaborasi Proyek Coding",
    "Satukan ide, bagi peran, dan bangun proyek bersama untuk melatih kerja sama serta problem solving.",
    "Belajar bersama",
    "photo-1522071820081-009f0129c71c",
    "Peserta bekerja sama dengan laptop dalam kegiatan kelompok"
  ]
];

const cards = document.querySelector("#cards");

activities.forEach((activity) => {
  const [
    number,
    tag,
    title,
    description,
    type,
    photo,
    alt
  ] = activity;

  const article = document.createElement("article");
  article.className = "card";

  // HTML ini hanya berisi konten galeri statis.
  // Data dari form pengguna tidak dimasukkan melalui innerHTML.
  article.innerHTML = `
    <div class="card-photo">
      <img
        src="https://images.unsplash.com/${photo}?auto=format&fit=crop&w=720&q=80"
        alt="${alt}"
        loading="lazy"
      >
      <span class="card-number">
        ${number} / KEGIATAN
      </span>
    </div>

    <div class="card-body">
      <span class="card-tag">${tag}</span>
      <h3>${title}</h3>
      <p>${description}</p>

      <div class="card-bottom">
        <span>${type}</span>
        <a
          href="#pendaftaran"
          aria-label="Daftar ${title}"
        >
          Daftar ↗
        </a>
      </div>
    </div>
  `;

  cards.append(article);
});

// ========================================
// 2. NAVIGASI GALLERY DAN PENDAFTARAN
// ========================================

function navigate() {
  const isRegistration =
    window.location.hash === "#pendaftaran";

  document.querySelector("#gallery").hidden =
    isRegistration;

  document.querySelector("#pendaftaran").hidden =
    !isRegistration;

  const activePage = isRegistration
    ? "pendaftaran"
    : "gallery";

  document.querySelectorAll("[data-page]").forEach((link) => {
    const isActive = link.dataset.page === activePage;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (window.location.hash === "#kegiatan") {
    document.querySelector("#kegiatan").scrollIntoView();
  } else {
    window.scrollTo({
      top: 0,
      behavior: "instant"
    });
  }
}

window.addEventListener("hashchange", navigate);
navigate();

// ========================================
// 3. ELEMEN FORM DAN DATA SEMENTARA
// ========================================

const form = document.querySelector("#registration-form");
const dialog = document.querySelector("#confirm-dialog");
const panel = document.querySelector("#form-panel");
const result = document.querySelector("#result");

let savedData = null;
let pendingData = null;

const fields = [
  "nik",
  "nama",
  "gender",
  "hp",
  "alamat",
  "bahasa"
];

// ========================================
// 4. VALIDASI FORM
// ========================================

function clearError(name) {
  document.querySelector(`#${name}-error`).textContent = "";

  form.querySelectorAll(`[name="${name}"]`).forEach((element) => {
    element.removeAttribute("aria-invalid");
  });
}

function validate() {
  fields.forEach(clearError);

  const data = Object.fromEntries(new FormData(form));
  const errors = {};

  // NIK harus tepat 16 digit angka.
  if (!/^[0-9]{16}$/.test(data.nik)) {
    errors.nik = "NIK wajib berisi tepat 16 digit angka.";
  }

  if (!data.nama.trim()) {
    errors.nama = "Nama lengkap wajib diisi.";
  }

  if (!data.gender) {
    errors.gender = "Silakan pilih jenis kelamin.";
  }

  // Nomor HP boleh diawali 0 atau +62.
  const phonePattern = /^(?:0[0-9]{8,14}|\+62[0-9]{8,13})$/;

  if (!phonePattern.test(data.hp)) {
    errors.hp =
      "Masukkan 9–15 digit angka diawali 0, atau nomor dengan awalan +62 tanpa spasi.";
  }

  if (!data.alamat.trim()) {
    errors.alamat = "Alamat wajib diisi.";
  }

  if (!data.bahasa) {
    errors.bahasa =
      "Silakan pilih bahasa pemrograman yang diminati.";
  }

  // Tampilkan pesan kesalahan di bawah setiap isian.
  for (const [name, message] of Object.entries(errors)) {
    document.querySelector(`#${name}-error`).textContent =
      message;

    form.querySelectorAll(`[name="${name}"]`).forEach((element) => {
      element.setAttribute("aria-invalid", "true");
    });
  }

  // Arahkan fokus ke isian pertama yang salah.
  const errorNames = Object.keys(errors);

  if (errorNames.length > 0) {
    form.querySelector(`[name="${errorNames[0]}"]`).focus();
    return null;
  }

  return data;
}

// Hapus pesan kesalahan ketika isian diperbaiki.
form.addEventListener("input", (event) => {
  if (fields.includes(event.target.name)) {
    clearError(event.target.name);
  }
});

form.addEventListener("change", (event) => {
  if (fields.includes(event.target.name)) {
    clearError(event.target.name);
  }
});

// ========================================
// 5. TOMBOL SIMPAN DAN MODAL KONFIRMASI
// ========================================

form.addEventListener("submit", (event) => {
  event.preventDefault();

  pendingData = validate();

  if (pendingData) {
    // Teks konfirmasi terdapat pada elemen dialog di index.html:
    // "Apakah Anda sudah yakin untuk menyimpan?"
    dialog.showModal();
  }
});

// Tombol Tidak menutup modal tanpa menghapus isian.
document.querySelector("#no").addEventListener("click", () => {
  dialog.close();
});

// Data yang menunggu konfirmasi dibersihkan setelah modal ditutup.
dialog.addEventListener("close", () => {
  pendingData = null;
});

// ========================================
// 6. TOMBOL YA DAN HASIL PENDAFTARAN
// ========================================

document.querySelector("#yes").addEventListener("click", () => {
  if (!pendingData) {
    return;
  }

  savedData = { ...pendingData };

  const labels = {
    nik: "NIK",
    nama: "Nama lengkap",
    gender: "Jenis kelamin",
    hp: "No. HP",
    alamat: "Alamat",
    bahasa: "Bahasa pemrograman yang diminati"
  };

  const list = document.querySelector("#result-data");
  list.replaceChildren();

  for (const name of fields) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const value = document.createElement("dd");

    term.textContent = labels[name];

    // Gunakan textContent agar isian ditampilkan sebagai teks,
    // bukan dijalankan sebagai HTML.
    value.textContent = savedData[name];

    row.append(term, value);
    list.append(row);
  }

  dialog.close();

  panel.hidden = true;
  result.hidden = false;

  document.querySelector("#result-title").focus();
});

// ========================================
// 7. TOMBOL EDIT DATA
// ========================================

document.querySelector("#edit").addEventListener("click", () => {
  result.hidden = true;
  panel.hidden = false;

  // Isian sebelumnya tetap ada dalam form.
  form.elements.nik.focus();
});

// ========================================
// 8. TOMBOL RESET
// ========================================

form.addEventListener("reset", () => {
  savedData = null;
  pendingData = null;

  fields.forEach(clearError);

  document.querySelector("#result-data").replaceChildren();

  result.hidden = true;
  panel.hidden = false;

  if (dialog.open) {
    dialog.close();
  }
});

// Tombol Reset pada tampilan hasil pendaftaran.
document.querySelector("#reset-result").addEventListener(
  "click",
  () => {
    form.reset();
    form.elements.nik.focus();
  }
);
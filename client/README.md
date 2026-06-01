# Client README

Frontend aplikasi SATUSEHAT Interoperability.

## Teknologi utama
- Next.js 16.2.6
- React 19.2.4
- Tailwind CSS 4

## Tujuan
Folder `client/` berisi antarmuka pengguna web yang akan berkomunikasi dengan backend `server/`.

Catatan: untuk instruksi `clone` dan setup cepat (server + client), lihat `../README.md`.

## Setup dan Jalan
1. Buka terminal di folder `client`:
   ```bash
   cd client
   ```
2. Install dependensi:
   ```bash
   npm install
   # atau
   pnpm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   # atau
   pnpm dev
   ```
4. Buka `http://localhost:3000` di browser.

> Pastikan backend sudah berjalan terlebih dahulu di `http://localhost:5000`.

## Status saat ini
- Frontend masih menggunakan halaman starter default Next.js di `src/app/page.js`.
- Belum ada integrasi API backend secara penuh; pengembangan UI dan panggilan API dapat dilanjutkan di folder `src/`.

## Struktur file penting
- `src/app/page.js` — halaman utama saat ini
- `next.config.mjs` — konfigurasi Next.js
- `postcss.config.mjs` — konfigurasi Tailwind CSS
- `package.json` — script dan dependensi

## Catatan untuk kontributor
- Update UI di `src/app/*`.
- Jika perlu memanggil backend, gunakan alamat lengkap `http://localhost:5000/api/v1/...`.
- Baca `../README.md` untuk konteks proyek secara keseluruhan.

## Panduan Commit Frontend
Gunakan format commit ini untuk perubahan client:
```text
<type>@client: <deskripsi singkat>
```

`type` yang direkomendasikan:
- `feat` — fitur baru
- `fix` — perbaikan bug
- `docs` — dokumentasi
- `refactor` — refactor kode tanpa fitur baru
- `chore` — maintenance/dependensi/CI
- `test` — tambahan atau perbaikan tes
- `perf` — peningkatan performa

Contoh:
- `feat@client: tambah halaman pendaftaran pasien`
- `fix@client: perbaiki tampilan responsif navbar`
- `docs@client: update README client dan instruksi setup`

Jika perubahan juga menyentuh backend, gunakan `@client @server` atau pisahkan menjadi dua commit: satu untuk frontend, satu untuk backend.

Pesan commit harus detail namun ringkas: jelaskan apa yang berubah dan kenapa.
 

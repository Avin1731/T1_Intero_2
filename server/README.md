# Server README

Backend middleware untuk SATUSEHAT Interoperability.

## Teknologi utama
- Node.js
- Express
- Axios
- dotenv
- swagger-jsdoc / swagger-ui-express

## Tujuan
Folder `server/` berisi layanan API yang menghubungkan frontend dengan SATUSEHAT melalui FHIR dan OAuth2.

Catatan: untuk instruksi `clone` dan setup cepat (server + client), lihat `../README.md`.

## Setup
1. Buka terminal di folder `server`:
   ```bash
   cd server
   ```
2. Install dependensi:
   ```bash
   npm install
   # atau
   pnpm install
   ```
3. Buat file environment:
   ```bash
   cp .env.example .env
   ```
4. Isi `.env` dengan kredensial SATUSEHAT:
   ```env
   PORT=5000
   NODE_ENV=development
   SATUSEHAT_BASE_URL=https://api-satusehat-stg.dto.kemkes.go.id
   SATUSEHAT_ORG_ID=YOUR_ORGANIZATION_ID
   SATUSEHAT_CLIENT_ID=YOUR_CLIENT_ID
   SATUSEHAT_CLIENT_SECRET=YOUR_CLIENT_SECRET
   ```

## Jalankan server
```bash
npm run dev
# atau
pnpm dev
```

Server akan berjalan di `http://localhost:5000`.

## Dokumentasi API
- Swagger UI: `http://localhost:5000/api/docs`
- Raw OpenAPI JSON: `http://localhost:5000/api/docs.json`

## Endpoint utama
- `GET /api/v1/health` — health check server
- `POST /api/v1/register` — orkestrasi pendaftaran pasien
- `GET /api/v1/satusehat/token` — ambil access token OAuth2
- `GET /api/v1/satusehat/patient/:nik` — cari pasien berdasarkan NIK
- `GET /api/v1/satusehat/practitioner/:nik` — cari dokter berdasarkan NIK
- `POST /api/v1/satusehat/location` — buat atau reuse resource Location
- `POST /api/v1/satusehat/encounter` — buat resource Encounter
- `GET /api/v1/satusehat/debug/practitioner-nik/:nik` — debug format NIK Practitioner
- `GET /api/v1/satusehat/debug/practitioner` — debug search Practitioner by name/birthdate/gender

## Catatan penting
- Pastikan `.env` sudah berisi `SATUSEHAT_CLIENT_ID` dan `SATUSEHAT_CLIENT_SECRET`.
- Token OAuth2 di-cache otomatis oleh server.
- Jika `POST /api/v1/satusehat/encounter` digunakan, body harus berisi `patientIhsNumber`, `practitionerIhsNumber`, dan `locationId`.

## Untuk kontributor backend
- Lihat kode utama di `src/`
- `src/routes/` mengatur route
- `src/controllers/` mengatur logika per endpoint
- `src/services/` mengatur panggilan ke SATUSEHAT dan business logic
- `src/utils/` mengatur helper response dan error handling

## Panduan Commit Backend
Gunakan format commit ini untuk perubahan server:
```text
<type>@server: <deskripsi singkat>
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
- `fix@server: perbaiki error handling SATUSEHAT token`
- `feat@server: tambah endpoint lookup dokter berdasarkan NIK`
- `docs@server: update README server dan endpoint docs`

Jika update juga melibatkan frontend, gunakan `@client @server` atau buat dua commit yang terpisah.

Tuliskan deskripsi commit yang jelas: apa yang diubah, mengapa, dan jika perlu bagaimana cara mengetesnya.
 

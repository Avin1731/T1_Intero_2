# AGENTS.md — Server Coding Conventions & Architecture

## Arsitektur

```
server/
├── src/
│   ├── config/         # Konfigurasi environment dan konstanta global
│   ├── controllers/    # Handler HTTP: parsing request, memanggil service, kirim respons
│   ├── middleware/     # Express middleware (error handler, auth guard, dsb.)
│   ├── models/         # Skema database (belum digunakan di MVP)
│   ├── routes/         # Definisi route Express, menghubungkan ke controller
│   ├── services/       # Business logic dan panggilan API eksternal
│   └── utils/          # Helper murni tanpa side-effect (response formatter, dsb.)
├── .env                # Variabel environment (JANGAN di-commit ke git)
├── server.js           # Entry point: load dotenv, mulai HTTP server
└── AGENTS.md           # Dokumen ini
```

## Alur Request

```
Request → Route → Controller → Service(s) → Response
                                   ↓
                           API Eksternal / DB
```

- **Route**: hanya mendaftarkan path dan metode HTTP, tidak ada logika.
- **Controller**: validasi input dasar, panggil service, format respons via `utils/response`.
- **Service**: semua logika bisnis dan pemanggilan API eksternal. Tidak boleh mengakses `req`/`res`.
- **Utils**: fungsi helper murni, tidak ada dependensi ke Express.

## Konvensi Penulisan Kode

- Gunakan `require` (CommonJS), bukan `import/export`.
- Semua fungsi async wajib menggunakan `async/await`, bukan callback.
- Error di service dilempar dengan `throw` dan ditangkap di controller atau `errorHandler`.
- Gunakan `const` untuk semua deklarasi; gunakan `let` hanya jika perlu reassign.
- Nama file: `camelCase.js` (misal: `patientService.js`).
- Nama fungsi: `camelCase` (misal: `getPatientByNik`).
- Nama konstanta modul-level: `UPPER_SNAKE_CASE`.

## Format Respons API

Seluruh respons menggunakan helper `utils/response.js`:

```json
// Sukses
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [ ... ] }
```

## Penanganan Error

- Service melempar error dengan properti `statusCode` jika relevan:
  ```js
  const err = new Error('Patient not found');
  err.statusCode = 404;
  throw err;
  ```
- `errorHandler.js` menangkap semua error tak tertangani dan mengembalikan respons terformat.
- Kode HTTP standar yang digunakan:
  - `200` OK
  - `201` Created
  - `400` Bad Request
  - `401` Unauthorized (token expired / invalid)
  - `404` Not Found
  - `500` Internal Server Error

## Integrasi SATUSEHAT

- **Base URL Sandbox**: `https://api-satusehat-stg.dto.kemkes.go.id`
- **Auth**: OAuth2 client_credentials → endpoint `/oauth2/v1/accesstoken`
- **FHIR API**: `/fhir-r4/v1/{ResourceType}`
- Token di-cache di memori (`satusehatAuthService.js`) dan di-refresh otomatis saat kadaluarsa.
- Semua interaksi SATUSEHAT dienkapsulasi di dalam `src/services/`.

## Variabel Environment Wajib

| Variabel                  | Keterangan                              |
|---------------------------|-----------------------------------------|
| `PORT`                    | Port server (default: 5000)             |
| `NODE_ENV`                | Environment (development/production)    |
| `SATUSEHAT_BASE_URL`      | Base URL API SATUSEHAT                  |
| `SATUSEHAT_ORG_ID`        | ID Organisasi Fasyankes                 |
| `SATUSEHAT_CLIENT_ID`     | Client ID dari platform SATUSEHAT       |
| `SATUSEHAT_CLIENT_SECRET` | Client Secret dari platform SATUSEHAT   |

## Aturan Git

- Jalankan `git add .` dan `git commit` setelah setiap penambahan modul atau fitur baru.
- Pesan commit menggunakan format: `feat: <deskripsi singkat>` atau `fix: <deskripsi singkat>`.
- File `.env` tidak boleh di-commit (sudah ada di `.gitignore`).

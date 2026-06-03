# Dokumentasi API — SATUSEHAT Patient Registration Server

> **Base URL:** `http://localhost:5000/api/v1`
> **Swagger UI:** `http://localhost:5000/api/docs`
> **Stack:** Node.js · Express · MongoDB (Mongoose) · SATUSEHAT FHIR R4 Sandbox

---

## Daftar Isi

1. [Arsitektur Sistem](#1-arsitektur-sistem)
2. [Alur yang Direkomendasikan](#2-alur-yang-direkomendasikan)
3. [Format Respons Standar](#3-format-respons-standar)
4. [Referensi Endpoint](#4-referensi-endpoint)
   - [Health Check](#41-health-check)
   - [Autentikasi](#42-autentikasi-debug)
   - [Pasien](#43-pasien)
   - [Dokter (Practitioner)](#44-dokter-practitioner)
   - [Lokasi (Location)](#45-lokasi-location)
   - [Encounter](#46-encounter)
   - [Registrasi Penuh](#47-registrasi-penuh--main-endpoint)
   - [Riwayat Encounter (Database Lokal)](#48-riwayat-encounter-database-lokal)
5. [Penyimpanan Data (Dual-Write)](#5-penyimpanan-data-dual-write)
6. [Penanganan Error](#6-penanganan-error)
7. [Konfigurasi Environment](#7-konfigurasi-environment)
8. [Menjalankan Server](#8-menjalankan-server)

---

## 1. Arsitektur Sistem

```
Client / Frontend
       │
       ▼
┌──────────────────────────────────┐
│        Express Server            │
│  routes/ → controllers/ →        │
│  services/ → utils/              │
└────────────┬─────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
 SATUSEHAT      MongoDB Lokal
 FHIR R4 API    (riwayat & query)
 (Sandbox)
```

### Prinsip Alur Request

```
Request → Route → Controller → Service(s) → Response
                                   │
                          ┌────────┴────────┐
                          ▼                 ▼
                    SATUSEHAT API      MongoDB (write)
```

- **Route** — hanya mendaftarkan path dan method HTTP.
- **Controller** — validasi input, panggil service, kirim respons.
- **Service** — seluruh logika bisnis dan panggilan API eksternal.
- **MongoDB** — hanya ditulis setelah SATUSEHAT berhasil (dual-write).

---

## 2. Alur yang Direkomendasikan

### ⭐ Opsi A — Satu Request (Paling Mudah)

Gunakan endpoint `POST /api/v1/register`. Backend akan mengeksekusi semua 4 langkah secara otomatis.

```
POST /api/v1/register
  Body: { patientNik, practitionerNik, locationName }
        │
        ├─[1] Otentikasi OAuth2 ke SATUSEHAT (otomatis, di-cache)
        ├─[2] GET IHS Number Pasien berdasarkan NIK
        ├─[3] GET IHS Number Dokter berdasarkan NIK
        ├─[4] POST Location → dapat locationId
        ├─[5] POST Encounter → dapat encounterId ✅
        └─[6] Simpan ke MongoDB lokal (dual-write)
```

**Cocok untuk:** frontend form pendaftaran sederhana, demo, atau pengujian cepat.

---

### Opsi B — Langkah per Langkah (Lebih Fleksibel)

Panggil setiap endpoint secara berurutan untuk kontrol lebih granular, misalnya untuk menampilkan progress step-by-step di UI.

```
Langkah 1   GET  /api/v1/satusehat/patient/:nik
                 → Simpan: ihsNumber, name

Langkah 2   GET  /api/v1/satusehat/practitioner/:nik
                 → Simpan: ihsNumber, name

Langkah 3   POST /api/v1/satusehat/location
                 Body: { locationName }
                 → Simpan: locationId

Langkah 4   POST /api/v1/satusehat/encounter
                 Body: { patientIhsNumber, patientName,
                         practitionerIhsNumber, practitionerName,
                         locationId, locationName }
                 → Dapat: encounterId ✅
```

> **Catatan:** Opsi B **tidak** menyimpan ke MongoDB lokal. Hanya Opsi A (`POST /register`) yang melakukan dual-write.

---

### NIK Dummy untuk Testing (Sandbox)

| Resource      | NIK Dummy            | Keterangan |
|---------------|----------------------|------------|
| Pasien        | `1000000000000001`   | Data dummy SATUSEHAT Sandbox |
| Dokter        | `1000000000000002`   | Data dummy SATUSEHAT Sandbox |
| ID Organisasi | `10000004` (statis)  | Di-set via `SATUSEHAT_ORG_ID` |

---

## 3. Format Respons Standar

Seluruh endpoint menggunakan format JSON yang konsisten.

### Sukses

```json
{
  "success": true,
  "message": "Deskripsi singkat hasil",
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "message": "Deskripsi error",
  "errors": [ ... ]
}
```

---

## 4. Referensi Endpoint

### 4.1 Health Check

Memverifikasi server berjalan normal.

```
GET /api/v1/health
```

**Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": { "status": "ok" }
}
```

---

### 4.2 Autentikasi (Debug)

Mengambil access token OAuth2 dari SATUSEHAT. Token dikelola otomatis oleh server (di-cache, di-refresh saat expired). **Endpoint ini hanya untuk keperluan debugging** — tidak perlu dipanggil dari aplikasi.

```
GET /api/v1/satusehat/token
```

**Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Token berhasil diambil",
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4.3 Pasien

Mencari data pasien di SATUSEHAT berdasarkan NIK. Mengembalikan IHS Number yang diperlukan untuk membuat Encounter.

```
GET /api/v1/satusehat/patient/:nik
```

| Parameter | Tipe     | Keterangan         |
|-----------|----------|--------------------|
| `:nik`    | `string` | NIK pasien (16 digit) |

**Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Data pasien ditemukan",
  "data": {
    "ihsNumber": "100000030003",
    "name": "Budi Santoso"
  }
}
```

**Error:**
| Status | Kondisi |
|--------|---------|
| `404`  | NIK tidak terdaftar di SATUSEHAT |
| `401`  | Token SATUSEHAT kadaluarsa |

---

### 4.4 Dokter (Practitioner)

Mencari data dokter di SATUSEHAT berdasarkan NIK.

```
GET /api/v1/satusehat/practitioner/:nik
```

| Parameter | Tipe     | Keterangan          |
|-----------|----------|---------------------|
| `:nik`    | `string` | NIK dokter (16 digit) |

**Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Data dokter ditemukan",
  "data": {
    "ihsNumber": "N10000001",
    "name": "dr. Siti Rahayu"
  }
}
```

---

### 4.5 Lokasi (Location)

Membuat resource Location di SATUSEHAT FHIR R4. Jika Location dengan nama yang sama sudah ada untuk organisasi ini, backend otomatis **menggunakan ID yang sudah ada** (get-or-create, tidak duplikat).

```
POST /api/v1/satusehat/location
Content-Type: application/json
```

**Request Body:**
```json
{
  "locationName": "Ruang Poli Umum"
}
```

| Field          | Tipe     | Wajib | Default              |
|----------------|----------|-------|----------------------|
| `locationName` | `string` | Tidak | `"Ruang Poli Umum"` |

**Respons `201 Created`:**
```json
{
  "success": true,
  "message": "Location berhasil dibuat",
  "data": {
    "locationId": "a9f3c2d1-5e4b-4a7f-b123-8c0e1d2f3a4b",
    "locationName": "Ruang Poli Umum"
  }
}
```

---

### 4.6 Encounter

Mendaftarkan kunjungan pasien ke SATUSEHAT FHIR R4 dengan:
- **Status:** `arrived` (pasien baru tiba)
- **Kelas:** `AMB` (Ambulatory / Rawat Jalan)
- **Timestamp:** waktu saat request dikirim (ISO 8601 UTC+0)

```
POST /api/v1/satusehat/encounter
Content-Type: application/json
```

**Request Body:**
```json
{
  "patientIhsNumber": "100000030003",
  "patientName": "Budi Santoso",
  "practitionerIhsNumber": "N10000001",
  "practitionerName": "dr. Siti Rahayu",
  "locationId": "a9f3c2d1-5e4b-4a7f-b123-8c0e1d2f3a4b",
  "locationName": "Ruang Poli Umum"
}
```

| Field                   | Tipe     | Wajib  |
|-------------------------|----------|--------|
| `patientIhsNumber`      | `string` | **Ya** |
| `patientName`           | `string` | Tidak  |
| `practitionerIhsNumber` | `string` | **Ya** |
| `practitionerName`      | `string` | Tidak  |
| `locationId`            | `string` | **Ya** |
| `locationName`          | `string` | Tidak  |

**Respons `201 Created`:**
```json
{
  "success": true,
  "message": "Encounter berhasil dibuat",
  "data": {
    "encounterId": "7f3a1c2d-4e5b-6f7a-8b9c-0d1e2f3a4b5c",
    "status": "arrived"
  }
}
```

> `encounterId` adalah bukti pendaftaran ke SATUSEHAT berhasil.

---

### 4.7 Registrasi Penuh — Main Endpoint

⭐ **Endpoint utama.** Mengeksekusi seluruh alur 4 langkah (Auth → Patient → Practitioner → Location → Encounter) dalam satu request, lalu menyimpan hasilnya ke MongoDB lokal.

```
POST /api/v1/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "patientNik": "1000000000000001",
  "practitionerNik": "1000000000000002",
  "locationName": "Ruang Poli Umum"
}
```

| Field             | Tipe     | Wajib | Default               |
|-------------------|----------|-------|-----------------------|
| `patientNik`      | `string` | Tidak | `"1000000000000001"` |
| `practitionerNik` | `string` | Tidak | `"1000000000000002"` |
| `locationName`    | `string` | Tidak | `"Ruang Poli Umum"`  |

**Respons `201 Created`:**
```json
{
  "success": true,
  "message": "Pendaftaran pasien berhasil",
  "data": {
    "patient": {
      "nik": "1000000000000001",
      "ihsNumber": "100000030003",
      "name": "Budi Santoso"
    },
    "practitioner": {
      "nik": "1000000000000002",
      "ihsNumber": "N10000001",
      "name": "dr. Siti Rahayu"
    },
    "location": {
      "id": "a9f3c2d1-5e4b-4a7f-b123-8c0e1d2f3a4b",
      "name": "Ruang Poli Umum"
    },
    "encounter": {
      "id": "7f3a1c2d-4e5b-6f7a-8b9c-0d1e2f3a4b5c",
      "status": "arrived",
      "timestamp": "2026-06-03T14:30:00.000Z"
    }
  }
}
```

---

### 4.8 Riwayat Encounter (Database Lokal)

Endpoint ini membaca data dari **MongoDB lokal** — bukan dari SATUSEHAT. Data tersedia setelah `POST /api/v1/register` berhasil.

#### List Riwayat

```
GET /api/v1/encounters
```

**Query Parameters (opsional):**

| Parameter    | Tipe     | Default | Keterangan                              |
|--------------|----------|---------|-----------------------------------------|
| `patientNik` | `string` | —       | Filter berdasarkan NIK pasien tertentu  |
| `page`       | `number` | `1`     | Halaman (pagination)                    |
| `limit`      | `number` | `10`    | Jumlah data per halaman (maks. 100)     |

**Contoh Request:**
```
GET /api/v1/encounters?patientNik=1000000000000001&page=1&limit=5
```

**Respons `200 OK`:**
```json
{
  "success": true,
  "message": "Riwayat encounter berhasil diambil",
  "data": {
    "encounters": [
      {
        "_id": "665e1a2b3c4d5e6f7a8b9c0d",
        "patientNik": "1000000000000001",
        "patientIhsNumber": "100000030003",
        "patientName": "Budi Santoso",
        "practitionerNik": "1000000000000002",
        "practitionerIhsNumber": "N10000001",
        "practitionerName": "dr. Siti Rahayu",
        "locationId": "a9f3c2d1-5e4b-4a7f-b123-8c0e1d2f3a4b",
        "locationName": "Ruang Poli Umum",
        "encounterId": "7f3a1c2d-4e5b-6f7a-8b9c-0d1e2f3a4b5c",
        "encounterStatus": "arrived",
        "registeredAt": "2026-06-03T14:30:00.000Z",
        "createdAt": "2026-06-03T14:30:01.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 5,
      "totalPages": 1
    }
  }
}
```

#### Detail Encounter

```
GET /api/v1/encounters/:encounterId
```

| Parameter      | Keterangan                              |
|----------------|-----------------------------------------|
| `:encounterId` | `encounterId` yang diterima dari SATUSEHAT |

**Respons `200 OK`:** mengembalikan satu objek encounter (format sama dengan item di list di atas).

**Error `404`:** jika `encounterId` tidak ditemukan di database lokal.

---

## 5. Penyimpanan Data (Dual-Write)

### Bagaimana Data Tersimpan

```
POST /api/v1/register
        │
        ├─► SATUSEHAT FHIR R4  ──► encounterId diterima ✅
        │
        └─► MongoDB Lokal ──────► EncounterRecord tersimpan 💾
```

**Aturan dual-write:**
- Data **hanya disimpan ke MongoDB** jika SATUSEHAT berhasil mengembalikan `encounterId`.
- Jika SATUSEHAT gagal → tidak ada yang disimpan (konsistensi terjaga).
- Jika MongoDB gagal setelah SATUSEHAT berhasil → **response tetap sukses**, tetapi server akan log warning `[DB] Gagal menyimpan...`. SATUSEHAT tetap menjadi sumber kebenaran.

### Schema MongoDB (`EncounterRecord`)

| Field                   | Tipe     | Keterangan                          |
|-------------------------|----------|-------------------------------------|
| `patientNik`            | String   | NIK pasien                          |
| `patientIhsNumber`      | String   | IHS Number pasien (dari SATUSEHAT)  |
| `patientName`           | String   | Nama pasien                         |
| `practitionerNik`       | String   | NIK dokter                          |
| `practitionerIhsNumber` | String   | IHS Number dokter (dari SATUSEHAT)  |
| `practitionerName`      | String   | Nama dokter                         |
| `locationId`            | String   | Location ID (dari SATUSEHAT)        |
| `locationName`          | String   | Nama lokasi/ruangan                 |
| `encounterId`           | String   | Encounter ID (dari SATUSEHAT), unique |
| `encounterStatus`       | String   | Status kunjungan (default: `arrived`) |
| `registeredAt`          | Date     | Waktu pendaftaran dieksekusi        |
| `createdAt`             | Date     | Waktu record dibuat (auto)          |
| `updatedAt`             | Date     | Waktu record diupdate (auto)        |

---

## 6. Penanganan Error

### Kode HTTP

| Status | Kondisi                                       | Penanganan yang Disarankan              |
|--------|-----------------------------------------------|-----------------------------------------|
| `200`  | Request berhasil                              | Tampilkan data                          |
| `201`  | Resource berhasil dibuat                      | Tampilkan data + notifikasi sukses      |
| `400`  | Field wajib tidak diisi                       | Tampilkan pesan validasi di form        |
| `401`  | Token SATUSEHAT tidak valid / kadaluarsa      | Coba lagi (server akan refresh token)   |
| `404`  | NIK tidak ditemukan / resource tidak ada      | Tampilkan "data tidak ditemukan"        |
| `500`  | Error internal server / SATUSEHAT error       | Tampilkan "coba lagi nanti"             |

### Format Error dari SATUSEHAT

Jika SATUSEHAT mengembalikan error (misalnya `422 Unprocessable Entity`), server akan mengekstrak pesan dari FHIR `OperationOutcome` dan meneruskannya:

```json
{
  "success": false,
  "message": "SATUSEHAT Encounter error (422): [detail dari SATUSEHAT]"
}
```

---

## 7. Konfigurasi Environment

Salin `.env.example` menjadi `.env` dan isi nilai yang diperlukan:

```bash
cp .env.example .env
```

| Variabel                  | Keterangan                                  | Contoh Nilai |
|---------------------------|---------------------------------------------|--------------|
| `PORT`                    | Port server                                 | `5000` |
| `NODE_ENV`                | Mode environment                            | `development` |
| `MONGO_URI`               | URI koneksi MongoDB lokal                   | `mongodb://localhost:27017/satusehat` |
| `SATUSEHAT_BASE_URL`      | Base URL API SATUSEHAT                      | `https://api-satusehat-stg.dto.kemkes.go.id` |
| `SATUSEHAT_ORG_ID`        | ID Organisasi Fasyankes                     | `10000004` |
| `SATUSEHAT_CLIENT_ID`     | Client ID dari portal developer SATUSEHAT   | (dari portal) |
| `SATUSEHAT_CLIENT_SECRET` | Client Secret dari portal developer         | (dari portal) |

---

## 8. Menjalankan Server

### Prasyarat

1. **Node.js** v18+ — [nodejs.org](https://nodejs.org)
2. **MongoDB Community Server** (untuk database lokal)
   - Download: [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Setelah install, jalankan service MongoDB:
     ```powershell
     # Windows — jalankan sebagai Administrator
     net start MongoDB
     ```
   - Verifikasi berjalan:
     ```powershell
     mongosh --eval "db.adminCommand('ping')"
     # Output: { ok: 1 }
     ```

### Install Dependensi

```bash
npm install
```

### Jalankan Server

```bash
# Development (auto-restart dengan nodemon)
npm run dev

# Production
npm start
```

### Verifikasi Server Berjalan

```bash
curl http://localhost:5000/api/v1/health
# Respons: { "success": true, "message": "Server is healthy", ... }
```

### Output Console yang Diharapkan

```
[DB] MongoDB terhubung: mongodb://localhost:27017/satusehat
Server is running on port 5000 in development mode.
```

---

## Catatan Tambahan

- **Swagger UI** tersedia di `http://localhost:5000/api/docs` — dokumentasi interaktif, bisa langsung test endpoint dari browser.
- **OpenAPI Spec (JSON)** tersedia di `http://localhost:5000/api/docs.json`.
- **CORS** sudah dikonfigurasi untuk menerima request dari semua origin selama development.
- **Token SATUSEHAT** di-cache di memori server dan otomatis di-refresh sebelum kadaluarsa (90% dari `expires_in`).
- Environment saat ini menggunakan **SATUSEHAT Sandbox** — data tidak masuk ke sistem produksi.

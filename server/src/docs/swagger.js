const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SATUSEHAT Patient Registration API',
      version: '1.0.0',
      description:
        'API backend untuk simulasi pendaftaran pasien rawat jalan menggunakan standar **SATUSEHAT FHIR R4**.\n\n' +
        '### Alur Sistem\n' +
        '1. **Auth** — Ambil Access Token OAuth2 dari SATUSEHAT\n' +
        '2. **Master Data** — Cari IHS Number Pasien & Dokter berdasarkan NIK\n' +
        '3. **Location** — Buat resource Location (ruang periksa)\n' +
        '4. **Encounter** — Daftarkan kunjungan pasien (status: `arrived`, kelas: `AMB`)\n\n' +
        'Gunakan endpoint `POST /register` untuk menjalankan keempat langkah sekaligus.',
      contact: {
        name: 'Tim Intero Group 1',
        email: 'ahsani.fadhli@gmail.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
    ],
    tags: [
      { name: 'Health', description: 'Status server' },
      { name: 'Registration', description: 'Orkestrasi pendaftaran pasien (alur penuh)' },
      { name: 'SATUSEHAT - Auth', description: 'OAuth2 access token' },
      { name: 'SATUSEHAT - Master Data', description: 'Pencarian data referensi (Pasien & Dokter)' },
      { name: 'SATUSEHAT - FHIR Resources', description: 'Pembuatan resource FHIR (Location & Encounter)' },
    ],
    components: {
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operasi berhasil' },
            data: { type: 'object', nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Terjadi kesalahan' },
          },
        },
        HealthData: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'UP' },
            timestamp: { type: 'string', format: 'date-time', example: '2025-10-08T05:00:00.000Z' },
          },
        },
        TokenData: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        PatientData: {
          type: 'object',
          properties: {
            ihsNumber: { type: 'string', example: 'P02478375538' },
            name: { type: 'string', example: 'Budi Santoso' },
          },
        },
        PractitionerData: {
          type: 'object',
          properties: {
            ihsNumber: { type: 'string', example: 'N10000001' },
            name: { type: 'string', example: 'dr. Siti Rahayu' },
          },
        },
        LocationData: {
          type: 'object',
          properties: {
            locationId: { type: 'string', example: 'a2b3c4d5-e6f7-8901-abcd-ef1234567890' },
            locationName: { type: 'string', example: 'Ruang Poli Umum' },
          },
        },
        EncounterData: {
          type: 'object',
          properties: {
            encounterId: { type: 'string', example: 'f0222960-2633-435b-9776-753ba48cef78' },
            status: { type: 'string', example: 'arrived' },
          },
        },
        RegistrationResult: {
          type: 'object',
          properties: {
            patient: {
              type: 'object',
              properties: {
                nik: { type: 'string', example: '1000000000000001' },
                ihsNumber: { type: 'string', example: 'P02478375538' },
                name: { type: 'string', example: 'Budi Santoso' },
              },
            },
            practitioner: {
              type: 'object',
              properties: {
                nik: { type: 'string', example: '1000000000000002' },
                ihsNumber: { type: 'string', example: 'N10000001' },
                name: { type: 'string', example: 'dr. Siti Rahayu' },
              },
            },
            location: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'a2b3c4d5-e6f7-8901-abcd-ef1234567890' },
                name: { type: 'string', example: 'Ruang Poli Umum' },
              },
            },
            encounter: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'b3c4d5e6-f7a8-9012-bcde-f12345678901' },
                status: { type: 'string', example: 'arrived' },
                timestamp: { type: 'string', format: 'date-time', example: '2025-10-08T05:00:00.000Z' },
              },
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            patientNik: {
              type: 'string',
              description: 'NIK pasien. Default: NIK dummy `1000000000000001`',
              example: '1000000000000001',
            },
            practitionerNik: {
              type: 'string',
              description: 'NIK dokter. Default: NIK dummy `1000000000000002`',
              example: '1000000000000002',
            },
            locationName: {
              type: 'string',
              description: 'Nama ruangan. Default: `Ruang Poli Umum`',
              example: 'Ruang Poli Umum',
            },
          },
        },
        LocationRequest: {
          type: 'object',
          properties: {
            locationName: {
              type: 'string',
              description: 'Nama lokasi/ruangan yang akan dibuat',
              example: 'Ruang Poli Umum',
            },
          },
        },
        EncounterRequest: {
          type: 'object',
          required: ['patientIhsNumber', 'practitionerIhsNumber', 'locationId'],
          properties: {
            patientIhsNumber: {
              type: 'string',
              description: 'IHS Number pasien dari hasil pencarian NIK',
              example: 'P02280547535',
            },
            patientName: {
              type: 'string',
              example: 'Budi Santoso',
            },
            practitionerIhsNumber: {
              type: 'string',
              description: 'IHS Number dokter dari hasil pencarian NIK',
              example: '100009880728',
            },
            practitionerName: {
              type: 'string',
              example: 'dr. Siti Rahayu',
            },
            locationId: {
              type: 'string',
              description: 'ID Location dari endpoint POST /satusehat/location atau GET-or-CREATE',
              example: 'ba7bd67f-93db-4ced-a5d6-7e79fdc7a6dd',
            },
            locationName: {
              type: 'string',
              example: 'Ruang Poli Umum',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token SATUSEHAT tidak valid atau kadaluarsa',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Token SATUSEHAT tidak valid atau telah kadaluarsa' },
            },
          },
        },
        NotFoundError: {
          description: 'Data tidak ditemukan',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Pasien dengan NIK 1234567890 tidak ditemukan' },
            },
          },
        },
        InternalError: {
          description: 'Kesalahan internal server',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { success: false, message: 'Internal Server Error' },
            },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Cek status server',
          description: 'Mengembalikan status operasional server beserta timestamp.',
          operationId: 'getHealth',
          responses: {
            200: {
              description: 'Server berjalan normal',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/HealthData' } },
                      },
                    ],
                  },
                  example: {
                    success: true,
                    message: 'Server is healthy',
                    data: { status: 'UP', timestamp: '2025-10-08T05:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
      '/register': {
        post: {
          tags: ['Registration'],
          summary: 'Pendaftaran pasien rawat jalan (alur penuh)',
          description:
            'Menjalankan keempat langkah SATUSEHAT secara berurutan dalam satu request:\n\n' +
            '1. Ambil access token\n' +
            '2. Cari IHS Number pasien & dokter secara paralel\n' +
            '3. Buat resource Location\n' +
            '4. Buat resource Encounter dengan status `arrived` dan kelas `AMB`\n\n' +
            'Jika `patientNik`, `practitionerNik`, atau `locationName` tidak diisi, sistem menggunakan nilai dummy default.',
          operationId: 'registerPatient',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterRequest' },
                examples: {
                  default_dummy: {
                    summary: 'Gunakan data dummy (body kosong)',
                    value: {},
                  },
                  custom_nik: {
                    summary: 'Dengan NIK kustom',
                    value: {
                      patientNik: '1000000000000001',
                      practitionerNik: '1000000000000002',
                      locationName: 'Ruang Poli Umum',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Pendaftaran berhasil — Encounter dibuat',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/RegistrationResult' } },
                      },
                    ],
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            404: { $ref: '#/components/responses/NotFoundError' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/satusehat/token': {
        get: {
          tags: ['SATUSEHAT - Auth'],
          summary: 'Ambil access token OAuth2',
          description:
            'Mengambil access token dari server SATUSEHAT menggunakan `client_credentials` grant.\n\n' +
            'Token di-cache di memori dan otomatis di-refresh saat mendekati kadaluarsa (90% dari `expires_in`).\n\n' +
            '> Endpoint ini untuk keperluan debugging. Pada alur produksi, token dikelola otomatis oleh service.',
          operationId: 'getToken',
          responses: {
            200: {
              description: 'Token berhasil diambil',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/TokenData' } },
                      },
                    ],
                  },
                },
              },
            },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/satusehat/patient/{nik}': {
        get: {
          tags: ['SATUSEHAT - Master Data'],
          summary: 'Cari pasien berdasarkan NIK',
          description:
            'Melakukan pencarian ke FHIR endpoint `Patient` menggunakan identifier NIK.\n\n' +
            'Mengembalikan IHS Number dan nama pasien jika ditemukan.\n\n' +
            '**NIK dummy untuk sandbox:** `1000000000000001`',
          operationId: 'getPatientByNik',
          parameters: [
            {
              name: 'nik',
              in: 'path',
              required: true,
              description: 'Nomor Induk Kependudukan (16 digit)',
              schema: { type: 'string', example: '1000000000000001' },
            },
          ],
          responses: {
            200: {
              description: 'Data pasien ditemukan',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/PatientData' } },
                      },
                    ],
                  },
                  example: {
                    success: true,
                    message: 'Data pasien ditemukan',
                    data: { ihsNumber: 'P02478375538', name: 'Budi Santoso' },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            404: { $ref: '#/components/responses/NotFoundError' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/satusehat/practitioner/{nik}': {
        get: {
          tags: ['SATUSEHAT - Master Data'],
          summary: 'Cari dokter berdasarkan NIK',
          description:
            'Melakukan pencarian ke FHIR endpoint `Practitioner` menggunakan identifier NIK.\n\n' +
            'Mengembalikan IHS Number dan nama dokter jika ditemukan.\n\n' +
            '**NIK dummy untuk sandbox:** `1000000000000002`',
          operationId: 'getPractitionerByNik',
          parameters: [
            {
              name: 'nik',
              in: 'path',
              required: true,
              description: 'Nomor Induk Kependudukan dokter (16 digit)',
              schema: { type: 'string', example: '1000000000000002' },
            },
          ],
          responses: {
            200: {
              description: 'Data dokter ditemukan',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/PractitionerData' } },
                      },
                    ],
                  },
                  example: {
                    success: true,
                    message: 'Data dokter ditemukan',
                    data: { ihsNumber: 'N10000001', name: 'dr. Siti Rahayu' },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            404: { $ref: '#/components/responses/NotFoundError' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/satusehat/location': {
        post: {
          tags: ['SATUSEHAT - FHIR Resources'],
          summary: 'Buat resource Location',
          description:
            'Mengirimkan POST ke FHIR endpoint `Location` untuk mendaftarkan ruang periksa.\n\n' +
            'Resource yang dibuat mengikuti skema FHIR R4:\n' +
            '- `physicalType`: `ro` (Room)\n' +
            '- `managingOrganization`: referensi ke `Organization/{SATUSEHAT_ORG_ID}`\n\n' +
            'Simpan `locationId` dari response untuk digunakan pada pembuatan Encounter.',
          operationId: 'createLocation',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LocationRequest' },
                example: { locationName: 'Ruang Poli Umum' },
              },
            },
          },
          responses: {
            201: {
              description: 'Location berhasil dibuat',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/LocationData' } },
                      },
                    ],
                  },
                  example: {
                    success: true,
                    message: 'Location berhasil dibuat',
                    data: {
                      locationId: 'a2b3c4d5-e6f7-8901-abcd-ef1234567890',
                      locationName: 'Ruang Poli Umum',
                    },
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
      '/satusehat/encounter': {
        post: {
          tags: ['SATUSEHAT - FHIR Resources'],
          summary: 'Buat resource Encounter',
          description:
            'Mendaftarkan kunjungan pasien ke FHIR endpoint `Encounter`.\n\n' +
            '**Nilai yang ditetapkan otomatis:**\n' +
            '- `status`: `arrived`\n' +
            '- `class`: `AMB` (Ambulatory / Rawat Jalan)\n' +
            '- `period.start`: timestamp ISO 8601 UTC+0 saat request\n' +
            '- `identifier`: UUID unik per request (system: `http://sys-ids.kemkes.go.id/encounter/{orgId}`)\n' +
            '- `statusHistory`: diisi otomatis sesuai status saat ini\n\n' +
            '`patientIhsNumber`, `practitionerIhsNumber`, dan `locationId` **wajib diisi**.\n\n' +
            '> Gunakan endpoint `POST /register` jika ingin menjalankan seluruh alur sekaligus.',
          operationId: 'createEncounter',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EncounterRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Encounter berhasil dibuat',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: { data: { $ref: '#/components/schemas/EncounterData' } },
                      },
                    ],
                  },
                  example: {
                    success: true,
                    message: 'Encounter berhasil dibuat',
                    data: {
                      encounterId: 'b3c4d5e6-f7a8-9012-bcde-f12345678901',
                      status: 'arrived',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Field wajib tidak diisi',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                  example: {
                    success: false,
                    message: 'patientIhsNumber, practitionerIhsNumber, dan locationId wajib diisi',
                  },
                },
              },
            },
            401: { $ref: '#/components/responses/UnauthorizedError' },
            500: { $ref: '#/components/responses/InternalError' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

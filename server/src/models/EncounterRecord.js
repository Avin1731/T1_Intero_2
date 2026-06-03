const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Model Sequelize (SQLite) untuk menyimpan riwayat pendaftaran pasien.
 * Tabel dibuat otomatis saat server start via sequelize.sync().
 * Data hanya disimpan setelah SATUSEHAT berhasil mengembalikan encounterId.
 */
const EncounterRecord = sequelize.define(
  'EncounterRecord',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // ── Data Pasien ──────────────────────────────────────────────────
    patientNik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientIhsNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // ── Data Dokter ──────────────────────────────────────────────────
    practitionerNik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    practitionerIhsNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    practitionerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // ── Data Lokasi ──────────────────────────────────────────────────
    locationId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    locationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // ── Data Encounter dari SATUSEHAT ────────────────────────────────
    encounterId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Satu encounterId hanya boleh tersimpan sekali
    },
    encounterStatus: {
      type: DataTypes.STRING,
      defaultValue: 'arrived',
    },

    // Waktu saat pendaftaran dieksekusi
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'encounter_records',
    timestamps: true, // tambah createdAt dan updatedAt otomatis
  }
);

module.exports = EncounterRecord;

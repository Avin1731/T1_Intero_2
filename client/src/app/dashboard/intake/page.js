"use client";

import { useState } from 'react';
import AuthGuard from '../../../components/AuthGuard';
import Sidebar from '../../../components/Sidebar';
import Button from '../../../components/Button';
import Popup from '../../../components/Popup';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';
import { api } from '../../../lib/api';

import PatientLookupCard from '../../../components/registration/PatientLookupCard';
import PractitionerLookupCard from '../../../components/registration/PractitionerLookupCard';
import LocationFormCard from '../../../components/registration/LocationFormCard';
import RegistrationResultCard from '../../../components/registration/RegistrationResultCard';

const INITIAL_FORM = {
  patientNik: '',
  practitionerNik: '',
  locationName: 'Ruang Poli Umum',
};

const isValidNik = (value) => /^\d{16}$/.test(value);

const getFriendlyErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  if (error.payload?.message) return error.payload.message;
  return error.message || fallback;
};

function IntakeContent() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const [form, setForm] = useState(INITIAL_FORM);
  const [patientPreview, setPatientPreview] = useState(null);
  const [practitionerPreview, setPractitionerPreview] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingPractitioner, setLoadingPractitioner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [popup, setPopup] = useState(null);
  const [result, setResult] = useState(null);

  const handleLogout = async () => {
    await logout();
  };

  const clearMessage = () => setMessage(null);

  const updateForm = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setMessage(null);
  };

  const lookupPatient = async () => {
    const nik = form.patientNik.trim();

    if (!isValidNik(nik)) {
      setMessage('NIK pasien harus 16 digit angka.');
      setPatientPreview(null);
      return;
    }

    setLoadingPatient(true);
    setMessage(null);

    try {
      const response = await api.get(`/v1/satusehat/patient/${encodeURIComponent(nik)}`);
      setPatientPreview(response.data);
    } catch (error) {
      setPatientPreview(null);
      setMessage(getFriendlyErrorMessage(error, 'Gagal mengambil data pasien.'));
    } finally {
      setLoadingPatient(false);
    }
  };

  const lookupPractitioner = async () => {
    const nik = form.practitionerNik.trim();

    if (!isValidNik(nik)) {
      setMessage('NIK practitioner harus 16 digit angka.');
      setPractitionerPreview(null);
      return;
    }

    setLoadingPractitioner(true);
    setMessage(null);

    try {
      const response = await api.get(`/v1/satusehat/practitioner/${encodeURIComponent(nik)}`);
      setPractitionerPreview(response.data);
    } catch (error) {
      setPractitionerPreview(null);
      setMessage(getFriendlyErrorMessage(error, 'Gagal mengambil data practitioner.'));
    } finally {
      setLoadingPractitioner(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    const patientNik = form.patientNik.trim();
    const practitionerNik = form.practitionerNik.trim();
    const locationName = form.locationName.trim();

    if (!isValidNik(patientNik)) {
      setMessage('NIK pasien harus 16 digit angka.');
      return;
    }

    if (!isValidNik(practitionerNik)) {
      setMessage('NIK practitioner harus 16 digit angka.');
      return;
    }

    if (!locationName) {
      setMessage('Nama lokasi tidak boleh kosong.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/v1/register', {
        patientNik,
        practitionerNik,
        locationName,
      });

      setResult(response.data);
      setPopup({
        type: 'success',
        title: 'Registrasi berhasil',
        message: 'Encounter berhasil dibuat. Data ringkasan registrasi sudah tampil di bawah.',
        confirmLabel: 'Tutup',
      });
    } catch (error) {
      setPopup({
        type: 'error',
        title: 'Registrasi gagal',
        message: getFriendlyErrorMessage(error, 'Terjadi kesalahan saat registrasi pasien.'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setPatientPreview(null);
    setPractitionerPreview(null);
    setMessage(null);
    setResult(null);
    setPopup(null);
  };

  const closePopup = () => setPopup(null);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar userName={user?.username || 'admin'} onLogout={handleLogout} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 border-b border-accent/30 bg-background px-6 py-4 lg:px-10">

          <p className="text-[10px] font-medium uppercase tracking-[0.25em]" style={{ color: colors.accent }}>
            Patient Intake
          </p>
          <h1 className="mt-1 text-xl font-semibold sm:text-2xl lg:text-3xl" style={{ color: colors.primary }}>
            Registrasi Pasien Terpadu
          </h1>
        </header>

        <main className="flex-1 px-6 py-5 lg:px-10 lg:py-6">
          <div className="grid gap-5 lg:grid-cols-2 lg:items-start lg:content-start lg:justify-items-stretch">
            <div className="flex flex-col gap-5">
              <PatientLookupCard
                patientNik={form.patientNik}
                onChangePatientNik={updateForm('patientNik')}
                onLookupPatient={lookupPatient}
                loadingPatient={loadingPatient}
                submitting={submitting}
                message={message}
                clearMessage={clearMessage}
                patientPreview={patientPreview}
              />

              <PractitionerLookupCard
                practitionerNik={form.practitionerNik}
                onChangePractitionerNik={updateForm('practitionerNik')}
                onLookupPractitioner={lookupPractitioner}
                loadingPractitioner={loadingPractitioner}
                submitting={submitting}
                message={message}
                clearMessage={clearMessage}
                practitionerPreview={practitionerPreview}
              />

              {message && (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm leading-6"
                  style={{
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    color: colors.foreground,
                  }}
                >
                  {message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border p-5 shadow-sm"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: `${colors.accent}55`,
                }}
              >
                <LocationFormCard
                  locationName={form.locationName}
                  onChangeLocationName={updateForm('locationName')}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button type="submit" className="flex-1 py-2.5 text-sm" disabled={submitting}>
                    {submitting ? 'Memproses...' : 'Buat Registrasi'}
                  </Button>
                  <Button type="button" variant="ghost" className="py-2.5 text-sm" onClick={resetForm} disabled={submitting}>
                    Reset
                  </Button>
                </div>
              </form>

              <RegistrationResultCard result={result} />
            </div>
          </div>
        </main>
      </div>

      {popup && (
        <Popup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          confirmLabel={popup.confirmLabel}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

export default function IntakePage() {
  return (
    <AuthGuard>
      <IntakeContent />
    </AuthGuard>
  );
}
"use client";

import Input from '../Input';
import Button from '../Button';
import { useTheme } from '../../context/ThemeContext';

function DetailCard({ title, data, emptyText, colors }) {
  return (
    <section
      className="rounded-2xl border p-5 shadow-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: `${colors.accent}55`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: colors.accent }}>
        {title}
      </p>

      {data ? (
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: colors.accent }}>
              IHS Number
            </p>
            <p className="mt-1 break-all text-sm font-semibold" style={{ color: colors.primary }}>
              {data.ihsNumber}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: colors.accent }}>
              Nama
            </p>
            <p className="mt-1 text-sm leading-6" style={{ color: colors.foreground }}>
              {data.name}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6" style={{ color: colors.foreground }}>
          {emptyText}
        </p>
      )}
    </section>
  );
}

export default function PatientLookupCard({
  patientNik,
  onChangePatientNik,
  onLookupPatient,
  loadingPatient,
  submitting,
  message,
  clearMessage,
  patientPreview,
}) {
  const { colors } = useTheme();
  const nikError = message?.toLowerCase().includes('nik pasien') ? message : null;

  return (
    <section className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Input
            label="NIK Pasien"
            value={patientNik}
            onChange={(e) => {
              if (clearMessage) clearMessage();
              onChangePatientNik(e);
            }}
            placeholder="16 digit NIK"
            inputMode="numeric"
            autoComplete="off"
            error={nikError || undefined}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onLookupPatient}
          disabled={loadingPatient || submitting}
          className="shrink-0"
        >
          {loadingPatient ? 'Mengecek...' : 'Lookup Pasien'}
        </Button>
      </div>

      <DetailCard
        title="Preview Pasien"
        data={patientPreview}
        emptyText="Belum ada preview pasien. Tekan tombol Lookup Pasien untuk memverifikasi NIK."
        colors={colors}
      />
    </section>
  );
}
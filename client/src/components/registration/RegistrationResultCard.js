"use client";

import { useTheme } from '../../context/ThemeContext';

function SummaryField({ label, value }) {
  const { colors } = useTheme();

  return (
    <div className="rounded-2xl border px-4 py-3" style={{ borderColor: `${colors.accent}44` }}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: colors.accent }}>
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-semibold leading-6" style={{ color: colors.primary }}>
        {value}
      </p>
    </div>
  );
}

export default function RegistrationResultCard({ result }) {
  const { colors } = useTheme();

  return (
    <section
      className="rounded-2xl border p-5 shadow-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: `${colors.accent}55`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: colors.accent }}>
        Ringkasan Registrasi
      </p>

      {result ? (
        <div className="mt-4 space-y-3">
          <SummaryField label="Patient" value={`${result.patient.name} (${result.patient.ihsNumber})`} />
          <SummaryField
            label="Practitioner"
            value={`${result.practitioner.name} (${result.practitioner.ihsNumber})`}
          />
          <SummaryField label="Location" value={`${result.location.name} (${result.location.id})`} />
          <SummaryField label="Encounter" value={`${result.encounter.id} — ${result.encounter.status}`} />
          <p className="mt-2 text-xs opacity-80" style={{ color: colors.foreground }}>
            Registrasi terakhir berhasil dibuat pada {new Date(result.encounter.timestamp).toLocaleString('id-ID')}.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-6" style={{ color: colors.foreground }}>
          Hasil registrasi akan muncul di sini setelah submit berhasil.
        </p>
      )}
    </section>
  );
}
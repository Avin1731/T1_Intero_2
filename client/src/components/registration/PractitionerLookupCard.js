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

export default function PractitionerLookupCard({
  practitionerNik,
  onChangePractitionerNik,
  onLookupPractitioner,
  loadingPractitioner,
  submitting,
  message,
  clearMessage,
  practitionerPreview,
}) {
  const { colors } = useTheme();
  const nikError = message?.toLowerCase().includes('nik practitioner') ? message : null;

  return (
    <section className="space-y-4">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Input
            label="NIK Practitioner"
            value={practitionerNik}
            onChange={(e) => {
              if (clearMessage) clearMessage();
              onChangePractitionerNik(e);
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
          onClick={onLookupPractitioner}
          disabled={loadingPractitioner || submitting}
          className="shrink-0"
        >
          {loadingPractitioner ? 'Mengecek...' : 'Lookup Practitioner'}
        </Button>
      </div>

      <DetailCard
        title="Preview Practitioner"
        data={practitionerPreview}
        emptyText="Belum ada preview practitioner. Tekan tombol Lookup Practitioner untuk memverifikasi NIK."
        colors={colors}
      />
    </section>
  );
}
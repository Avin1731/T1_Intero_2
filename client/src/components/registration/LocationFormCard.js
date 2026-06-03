"use client";

import Input from '../Input';
import { useTheme } from '../../context/ThemeContext';

export default function LocationFormCard({ locationName, onChangeLocationName }) {
  const { colors } = useTheme();

  return (
    <section className="space-y-4">
      <Input
        label="Nama Lokasi"
        value={locationName}
        onChange={onChangeLocationName}
        placeholder="Ruang Poli Umum"
        autoComplete="off"
      />

      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: `${colors.accent}33`,
          backgroundColor: 'rgba(255,255,255,0.02)',
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>
          Langkah akhir
        </p>
        <p className="mt-1 text-xs leading-5" style={{ color: colors.foreground }}>
          Setelah data valid, kirim form ini untuk membuat registrasi pasien terpadu.
        </p>
      </div>
    </section>
  );
}
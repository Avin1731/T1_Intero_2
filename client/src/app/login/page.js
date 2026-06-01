"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import Input from '../../components/Input';
import LoginNavbar from '../../components/LoginNavbar';
import Popup from '../../components/Popup';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

export default function LoginPage() {
  const router = useRouter();
  const { loading, login } = useAuth();
  const { colors } = useTheme();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [popup, setPopup] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(username, password);
      setPopup({
        type: 'success',
        title: 'Login berhasil',
        message: 'Selamat datang di Klinik Percobaan. Anda akan diarahkan ke dashboard.',
      });
      setTimeout(() => router.push('/dashboard'), 1200);
    } catch (err) {
      setPopup({
        type: 'error',
        title: 'Login gagal',
        message:
          err?.message ||
          'Periksa kembali username dan password, lalu coba lagi. Jika masih gagal, periksa koneksi backend.',
      });
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: colors.background, color: colors.foreground }}
    >
      <LoginNavbar />

      <div className="flex flex-1 flex-col justify-center px-6 py-10">
        <main
          className="mx-auto flex w-full max-w-2xl flex-col gap-10 rounded-[32px] border p-8 shadow-2xl backdrop-blur-xl"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.accent,
            borderWidth: '2px',
          }}
        >
          <div className="space-y-2 text-center">
            <p
              className="text-sm uppercase tracking-[0.3em]"
              style={{ color: colors.primary }}
            >
              Login Klinik Percobaan
            </p>
            <h1 className="text-4xl font-semibold" style={{ color: colors.primary }}>
              Masuk sebagai Admin
            </h1>
            <p className="text-sm leading-6" style={{ color: colors.foreground }}>
              Halaman ini sementara memeriksa koneksi ke backend SATUSEHAT melalui endpoint yang ada. Masukkan username <strong>admin</strong> dan password <strong>admin123</strong> untuk pengalaman login sementara.
            </p>
          </div>

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <Input
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="admin"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="*****"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Memeriksa...' : 'Masuk'}
            </Button>
          </form>
        </main>
      </div>

      {popup ? (
        <Popup
          type={popup.type}
          title={popup.title}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      ) : null}
    </div>
  );
}

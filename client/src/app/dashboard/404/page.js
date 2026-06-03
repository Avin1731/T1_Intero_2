"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthGuard from '../../../components/AuthGuard';
import Sidebar from '../../../components/Sidebar';
import Button from '../../../components/Button';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../context/ThemeContext';

function NotFoundContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar tetap mendampingi agar navigasi admin tidak terputus */}
      <Sidebar userName={user?.username || 'admin'} onLogout={handleLogout} />

      <div className="flex min-w-0 flex-1 flex-col justify-center items-center px-6 lg:px-10">
        <section
          className="w-full max-w-md text-center rounded-3xl border p-8 lg:p-10 shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: `${colors.accent}55`,
          }}
        >
          {/* Status Code */}
          <p 
            className="text-6xl font-bold tracking-wider sm:text-7xl" 
            style={{ color: colors.primary }}
          >
            404
          </p>

          <h1 
            className="mt-4 text-xl font-semibold sm:text-2xl" 
            style={{ color: colors.foreground }}
          >
            Halaman Tidak Ditemukan
          </h1>

          <p 
            className="mt-3 text-sm leading-6" 
            style={{ color: colors.accent }}
          >
            Maaf, fitur atau halaman yang Anda cari belum dibuat atau sedang dalam tahap pengembangan interoperabilitas.
          </p>

          {/* Tombol Aksi Navigasi */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/dashboard" passHref className="w-full sm:w-auto">
              <Button type="button" className="w-full">
                Ke Dashboard
              </Button>
            </Link>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Kembali
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <AuthGuard>
      <NotFoundContent />
    </AuthGuard>
  );
}
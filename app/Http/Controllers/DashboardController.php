<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\User;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');

        // Catat kunjungan hanya saat pertama kali (session baru)
        if (!session()->has('visit_recorded')) {
            Visit::create([
                'user_id' => Auth::id(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);

            session(['visit_recorded' => true]);
        }

        if (Auth::user()->isAdmin()) {
            return $this->adminDashboard($today);
        }

        return $this->guruDashboard($today);
    }

    private function adminDashboard($today)
    {
        // Statistik presensi
        $totalGuru = User::where('role', 'guru')->count();

        $sudahPresensi = Presensi::where('tanggal', $today)
            ->whereNull('jenis_izin')
            ->count();

        $izinSakit = Presensi::where('tanggal', $today)
            ->whereNotNull('jenis_izin')
            ->count();

        $belumPresensi = max(0, $totalGuru - $sudahPresensi - $izinSakit);

        // Statistik baru
        $totalUser = User::count();

        $userAktif = \DB::table('sessions')
            ->whereNotNull('user_id')
            ->where('last_activity', '>=', now()->subHours(24)->timestamp)
            ->distinct('user_id')
            ->count('user_id');

        $kunjunganHariIni = Visit::whereDate('created_at', $today)->count();
        $totalKunjungan = Visit::count();

        // Guru yang belum absen hari ini
        $belumAbsenList = User::where('role', 'guru')
            ->whereDoesntHave('presensi', function ($q) use ($today) {
                $q->where('tanggal', $today);
            })
            ->get(['id', 'name', 'jabatan']);

        // Kehadiran 7 hari terakhir
        $kehadiranMingguan = [];
        for ($i = 6; $i >= 0; $i--) {
            $tanggal = Carbon::now()->subDays($i)->format('Y-m-d');
            $jumlah = Presensi::where('tanggal', $tanggal)
                ->whereNull('jenis_izin')
                ->count();
            $kehadiranMingguan[] = [
                'tanggal' => Carbon::parse($tanggal)->format('d/m'),
                'jumlah' => $jumlah,
            ];
        }

        // Aktivitas terbaru
        $aktivitasTerbaru = collect();

        // Presensi datang hari ini
        $presensiDatang = Presensi::where('tanggal', $today)
            ->whereNotNull('jam_datang')
            ->with('user')
            ->get()
            ->map(function ($p) {
                return [
                    'waktu' => $p->jam_datang?->format('H:i') ?? '-',
                    'nama' => $p->user->name ?? '-',
                    'aktivitas' => 'Absen Datang',
                    'warna' => '#22C55E',
                ];
            });
        $aktivitasTerbaru = $aktivitasTerbaru->concat($presensiDatang);

        // Presensi pulang hari ini
        $presensiPulang = Presensi::where('tanggal', $today)
            ->whereNotNull('jam_pulang')
            ->with('user')
            ->get()
            ->map(function ($p) {
                return [
                    'waktu' => $p->jam_pulang?->format('H:i') ?? '-',
                    'nama' => $p->user->name ?? '-',
                    'aktivitas' => 'Absen Pulang',
                    'warna' => '#2563EB',
                ];
            });
        $aktivitasTerbaru = $aktivitasTerbaru->concat($presensiPulang);

        // Izin hari ini
        $izinHariIni = Presensi::where('tanggal', $today)
            ->whereNotNull('jenis_izin')
            ->with('user')
            ->get()
            ->map(function ($p) {
                return [
                    'waktu' => $p->created_at?->format('H:i') ?? '-',
                    'nama' => $p->user->name ?? '-',
                    'aktivitas' => ucfirst($p->jenis_izin),
                    'warna' => '#F59E0B',
                ];
            });
        $aktivitasTerbaru = $aktivitasTerbaru->concat($izinHariIni);

        // Login terbaru
        $loginTerbaru = Visit::whereDate('created_at', $today)
            ->with('user')
            ->get()
            ->map(function ($v) {
                return [
                    'waktu' => $v->created_at?->format('H:i') ?? '-',
                    'nama' => $v->user->name ?? 'Tamu',
                    'aktivitas' => 'Login',
                    'warna' => '#9CA3AF',
                ];
            });
        $aktivitasTerbaru = $aktivitasTerbaru->concat($loginTerbaru);

        // Urutkan berdasarkan waktu & ambil 10 terakhir
        $aktivitasTerbaru = $aktivitasTerbaru
            ->sortByDesc('waktu')
            ->take(10)
            ->values();

        return Inertia::render('Dashboard', [
            'isAdmin' => true,
            'stats' => [
                'totalGuru' => $totalGuru,
                'sudahPresensi' => $sudahPresensi,
                'belumPresensi' => $belumPresensi,
                'izinSakit' => $izinSakit,
                'totalUser' => $totalUser,
                'userAktif' => $userAktif,
                'kunjunganHariIni' => $kunjunganHariIni,
                'totalKunjungan' => $totalKunjungan,
                'persentaseHadir' => $totalGuru > 0 ? round(($sudahPresensi / $totalGuru) * 100) : 0,
                'persentaseBelum' => $totalGuru > 0 ? round(($belumPresensi / $totalGuru) * 100) : 0,
            ],
            'belumAbsenList' => $belumAbsenList,
            'kehadiranMingguan' => $kehadiranMingguan,
            'aktivitasTerbaru' => $aktivitasTerbaru,
        ]);
    }

    private function guruDashboard($today)
    {
        $bulan = now()->format('m');
        $tahun = now()->format('Y');

        $presensiBulan = Presensi::where('user_id', Auth::id())
            ->whereNull('jenis_izin')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->get();

        $statistikBulan = [
            'hadir' => $presensiBulan->whereNull('keterangan')->count(),
            'izin' => Presensi::where('user_id', Auth::id())
                ->where('jenis_izin', 'izin')
                ->whereMonth('tanggal', $bulan)
                ->whereYear('tanggal', $tahun)
                ->count(),
            'sakit' => Presensi::where('user_id', Auth::id())
                ->where('jenis_izin', 'sakit')
                ->whereMonth('tanggal', $bulan)
                ->whereYear('tanggal', $tahun)
                ->count(),
        ];

        $presensiToday = Presensi::where('user_id', Auth::id())
            ->where('tanggal', $today)
            ->whereNull('jenis_izin')
            ->first();

        $izinHariIni = Presensi::where('user_id', Auth::id())
            ->where('tanggal', $today)
            ->whereNotNull('jenis_izin')
            ->first();

        $riwayatPresensi = Presensi::where('user_id', Auth::id())
            ->whereNull('jenis_izin')
            ->orderBy('tanggal', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($p) {
                return [
                    'tanggal' => $p->tanggal->format('d/m/Y'),
                    'jam_datang' => $p->jam_datang?->format('H:i') ?? '-',
                    'jam_pulang' => $p->jam_pulang?->format('H:i') ?? '-',
                    'status' => $p->jam_datang && $p->jam_pulang ? 'Lengkap' : ($p->jam_datang ? 'Datang' : 'Belum'),
                ];
            });

        return Inertia::render('Dashboard', [
            'isAdmin' => false,
            'presensiBulan' => $presensiBulan,
            'statistikBulan' => $statistikBulan,
            'presensiToday' => $presensiToday,
            'izinHariIni' => $izinHariIni,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'riwayatPresensi' => $riwayatPresensi,
        ]);
    }
}

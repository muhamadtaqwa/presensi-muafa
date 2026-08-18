<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');

        if (Auth::user()->isAdmin()) {
            return $this->adminDashboard($today);
        }

        return $this->guruDashboard($today);
    }

    private function adminDashboard($today)
    {
        $totalGuru = User::where('role', 'guru')->count();
        $sudahPresensi = Presensi::where('tanggal', $today)->count();
        $belumPresensi = $totalGuru - $sudahPresensi;

        $izinSakit = Presensi::where('tanggal', $today)
            ->whereNotNull('keterangan')
            ->count();

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
            $jumlah = Presensi::where('tanggal', $tanggal)->count();
            $kehadiranMingguan[] = [
                'tanggal' => Carbon::parse($tanggal)->format('d/m'),
                'jumlah' => $jumlah,
            ];
        }

        return Inertia::render('Dashboard', [
            'isAdmin' => true,
            'stats' => [
                'totalGuru' => $totalGuru,
                'sudahPresensi' => $sudahPresensi,
                'belumPresensi' => $belumPresensi,
                'izinSakit' => $izinSakit,
                'persentaseHadir' => $totalGuru > 0 ? round(($sudahPresensi / $totalGuru) * 100) : 0,
                'persentaseBelum' => $totalGuru > 0 ? round(($belumPresensi / $totalGuru) * 100) : 0,
            ],
            'belumAbsenList' => $belumAbsenList,
            'kehadiranMingguan' => $kehadiranMingguan,
        ]);
    }

    private function guruDashboard($today)
    {
        $bulan = now()->format('m');
        $tahun = now()->format('Y');

        $presensiBulan = Presensi::where('user_id', Auth::id())
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->get();

        $statistikBulan = [
            'hadir' => $presensiBulan->whereNull('keterangan')->count(),
            'izin' => $presensiBulan->where('keterangan', 'like', '%izin%')->count(),
            'sakit' => $presensiBulan->where('keterangan', 'like', '%sakit%')->count(),
        ];

        $presensiToday = Presensi::where('user_id', Auth::id())
            ->where('tanggal', $today)
            ->first();

        // Riwayat 5 presensi terakhir
        $riwayatPresensi = Presensi::where('user_id', Auth::id())
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
            'bulan' => $bulan,
            'tahun' => $tahun,
            'riwayatPresensi' => $riwayatPresensi,
        ]);
    }
}

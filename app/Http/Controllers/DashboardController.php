<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');

        if (Auth::user()->isAdmin()) {
            $totalGuru = User::where('role', 'guru')->count();
            $sudahPresensi = Presensi::where('tanggal', $today)->count();
            $belumPresensi = $totalGuru - $sudahPresensi;

            $izinSakit = Presensi::where('tanggal', $today)
                ->whereNotNull('keterangan')
                ->count();

            $listGuru = User::where('role', 'guru')
                ->with(['presensi' => function ($q) use ($today) {
                    $q->where('tanggal', $today);
                }])
                ->get()
                ->map(function ($guru) {
                    $presensi = $guru->presensi->first();
                    return [
                        'id' => $guru->id,
                        'name' => $guru->name,
                        'jabatan' => $guru->jabatan,
                        'status' => $presensi ? 'hadir' : 'belum',
                        'jam_datang' => $presensi?->jam_datang?->format('H:i') ?? null,
                        'keterangan' => $presensi?->keterangan ?? null,
                    ];
                });

            return Inertia::render('Dashboard', [
                'stats' => [
                    'totalGuru' => $totalGuru,
                    'sudahPresensi' => $sudahPresensi,
                    'belumPresensi' => $belumPresensi,
                    'izinSakit' => $izinSakit,
                ],
                'listGuru' => $listGuru,
            ]);
        }

        // Untuk guru (nanti)
        return Inertia::render('Dashboard', [
            'stats' => [
                'totalGuru' => 0,
                'sudahPresensi' => 0,
                'belumPresensi' => 0,
                'izinSakit' => 0,
            ],
            'listGuru' => [],
        ]);
    }
}

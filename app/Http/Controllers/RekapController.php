<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RekapController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $tab = $request->query('tab', 'harian');
        $tanggal = $request->query('tanggal', now()->format('Y-m-d'));

        if ($user->isAdmin()) {
            return $this->adminRekap($request, $tab, $tanggal);
        }

        return $this->guruRekap($request);
    }

    private function adminRekap(Request $request, $tab, $tanggal)
    {
        $guruList = User::where('role', 'guru')->get(['id', 'name', 'jabatan']);

        if ($tab === 'harian') {
            $data = Presensi::where('tanggal', $tanggal)
                ->get()
                ->map(function ($p) {
                    return [
                        'user_id' => $p->user_id,
                        'nama' => $p->user->name,
                        'jabatan' => $p->user->jabatan,
                        'jam_datang' => $p->jam_datang?->format('H:i') ?? '-',
                        'jam_pulang' => $p->jam_pulang?->format('H:i') ?? '-',
                        'foto_datang' => $p->foto_datang ? '/storage/' . $p->foto_datang : null,
                        'foto_pulang' => $p->foto_pulang ? '/storage/' . $p->foto_pulang : null,
                        'jenis_izin' => $p->jenis_izin,
                        'keterangan' => $p->keterangan,
                    ];
                });

            // Tambah guru yang tidak presensi
            $existingUserIds = $data->pluck('user_id')->toArray();
            $guruBelumAbsen = $guruList->whereNotIn('id', $existingUserIds)->map(function ($g) {
                return [
                    'user_id' => $g->id,
                    'nama' => $g->name,
                    'jabatan' => $g->jabatan,
                    'jam_datang' => '-',
                    'jam_pulang' => '-',
                    'foto_datang' => null,
                    'foto_pulang' => null,
                    'jenis_izin' => null,
                    'keterangan' => null,
                ];
            });

            $data = $data->concat($guruBelumAbsen)->values();
        } else {
            // Mingguan atau Bulanan
            $startDate = $tab === 'mingguan'
                ? now()->subDays(6)->format('Y-m-d')
                : now()->startOfMonth()->format('Y-m-d');
            $endDate = $tab === 'mingguan'
                ? now()->format('Y-m-d')
                : now()->endOfMonth()->format('Y-m-d');

            $allPresensi = Presensi::whereBetween('tanggal', [$startDate, $endDate])
                ->get();

            $data = $guruList->map(function ($g) use ($allPresensi) {
                $presensiGuru = $allPresensi->where('user_id', $g->id);

                $lengkap = $presensiGuru->whereNotNull('jam_datang')->whereNotNull('jam_pulang')->count();
                $datangSaja = $presensiGuru->whereNotNull('jam_datang')->whereNull('jam_pulang')->count();
                $pulangSaja = $presensiGuru->whereNull('jam_datang')->whereNotNull('jam_pulang')->count();

                return [
                    'user_id' => $g->id,
                    'nama' => $g->name,
                    'jabatan' => $g->jabatan,
                    'lengkap' => $lengkap,
                    'datang_saja' => $datangSaja,
                    'pulang_saja' => $pulangSaja,
                ];
            });
        }

        return Inertia::render('Rekap', [
            'isAdmin' => true,
            'tab' => $tab,
            'tanggal' => $tanggal,
            'rekapData' => $data,
            'guruList' => $guruList,
        ]);
    }

    private function guruRekap(Request $request)
    {
        $bulan = $request->query('bulan', now()->format('m'));
        $tahun = $request->query('tahun', now()->format('Y'));

        $presensi = Presensi::where('user_id', Auth::id())
            ->whereNull('jenis_izin')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->get();

        return Inertia::render('Rekap', [
            'isAdmin' => false,
            'presensi' => $presensi,
            'filter' => [
                'user_id' => Auth::id(),
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
        ]);
    }
}

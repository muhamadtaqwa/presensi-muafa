<?php

namespace App\Http\Controllers;

use App\Exports\PresensiExport;
use App\Models\Presensi;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class RekapController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            // Admin: bisa lihat semua
            $guruList = User::where('role', 'guru')->get(['id', 'name', 'nip', 'jabatan']);
            $userId = $request->query('user_id');
            $bulan = $request->query('bulan', now()->format('m'));
            $tahun = $request->query('tahun', now()->format('Y'));

            $presensi = [];
            if ($userId) {
                $presensi = Presensi::where('user_id', $userId)
                    ->whereMonth('tanggal', $bulan)
                    ->whereYear('tanggal', $tahun)
                    ->get();
            }

            return Inertia::render('Rekap', [
                'isAdmin' => true,
                'guruList' => $guruList,
                'presensi' => $presensi,
                'filter' => [
                    'user_id' => $userId,
                    'bulan' => $bulan,
                    'tahun' => $tahun,
                ],
            ]);
        }

        // Guru: hanya lihat milik sendiri
        $bulan = $request->query('bulan', now()->format('m'));
        $tahun = $request->query('tahun', now()->format('Y'));

        $presensi = Presensi::where('user_id', $user->id)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->get();

        return Inertia::render('Rekap', [
            'isAdmin' => false,
            'guruList' => [],
            'presensi' => $presensi,
            'filter' => [
                'user_id' => $user->id,
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $user = Auth::user();
        $userId = $user->isAdmin() ? $request->query('user_id') : $user->id;
        $bulan = $request->query('bulan', now()->format('m'));
        $tahun = $request->query('tahun', now()->format('Y'));

        return Excel::download(
            new PresensiExport($userId, $bulan, $tahun),
            "rekap-presensi-{$bulan}-{$tahun}.xlsx"
        );
    }

    public function exportPdf(Request $request)
    {
        $user = Auth::user();
        $userId = $user->isAdmin() ? $request->query('user_id') : $user->id;
        $bulan = $request->query('bulan', now()->format('m'));
        $tahun = $request->query('tahun', now()->format('Y'));

        $query = Presensi::with('user')
            ->where('user_id', $userId)
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        $presensi = $query->get();

        $pdf = Pdf::loadView('exports.presensi-pdf', [
            'presensi' => $presensi,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);

        return $pdf->download("rekap-presensi-{$bulan}-{$tahun}.pdf");
    }
}

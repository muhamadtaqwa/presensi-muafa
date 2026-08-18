<?php

namespace App\Http\Controllers;

use App\Exports\PresensiExport;
use App\Models\Presensi;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class RekapController extends Controller
{
    public function index(Request $request)
    {
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
            'guruList' => $guruList,
            'presensi' => $presensi,
            'filter' => [
                'user_id' => $userId,
                'bulan' => $bulan,
                'tahun' => $tahun,
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $userId = $request->query('user_id');
        $bulan = $request->query('bulan', now()->format('m'));
        $tahun = $request->query('tahun', now()->format('Y'));

        return Excel::download(
            new PresensiExport($userId, $bulan, $tahun),
            "rekap-presensi-{$bulan}-{$tahun}.xlsx"
        );
    }

    public function exportPdf(Request $request)
    {
        $userId = $request->query('user_id');
        $bulan = $request->query('bulan', now()->format('m'));
        $tahun = $request->query('tahun', now()->format('Y'));

        $query = Presensi::with('user')
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun);

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $presensi = $query->get();

        $pdf = Pdf::loadView('exports.presensi-pdf', [
            'presensi' => $presensi,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);

        return $pdf->download("rekap-presensi-{$bulan}-{$tahun}.pdf");
    }
}

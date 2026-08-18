<?php

namespace App\Http\Controllers;

use App\Exports\PresensiExport;
use App\Models\Presensi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class PresensiController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');
        $presensi = Presensi::where('user_id', Auth::id())
            ->where('tanggal', $today)
            ->first();

        return Inertia::render('Presensi', [
            'presensi' => $presensi,
            'today' => $today,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'status' => 'required|in:normal,manual,foto_gagal',

            // Datang (wajib kalau ada foto_datang)
            'foto_datang' => 'nullable|image|max:5120',
            'jam_datang' => 'nullable|required_with:foto_datang',
            'lat_datang' => 'nullable|required_with:foto_datang|numeric',
            'long_datang' => 'nullable|required_with:foto_datang|numeric',

            // Pulang (wajib kalau ada foto_pulang)
            'foto_pulang' => 'nullable|image|max:5120',
            'jam_pulang' => 'nullable|required_with:foto_pulang',
            'lat_pulang' => 'nullable|required_with:foto_pulang|numeric',
            'long_pulang' => 'nullable|required_with:foto_pulang|numeric',

            'keterangan' => 'nullable|string',
        ]);

        $data = $request->all();
        $data['user_id'] = Auth::id();

        // Upload foto datang
        if ($request->hasFile('foto_datang')) {
            $data['foto_datang'] = $request->file('foto_datang')->store('presensi/datang', 'public');
        }

        // Upload foto pulang
        if ($request->hasFile('foto_pulang')) {
            $data['foto_pulang'] = $request->file('foto_pulang')->store('presensi/pulang', 'public');
        }

        $presensi = Presensi::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'tanggal' => $request->tanggal,
            ],
            $data
        );

        return redirect()->route('presensi')->with('success', 'Presensi berhasil disimpan.');
    }

    public function exportExcel()
    {
        $bulan = request('bulan', now()->format('m'));
        $tahun = request('tahun', now()->format('Y'));

        return Excel::download(
            new PresensiExport(Auth::id(), $bulan, $tahun),
            "rekap-presensi-saya-{$bulan}-{$tahun}.xlsx"
        );
    }

    public function exportPdf()
    {
        $bulan = request('bulan', now()->format('m'));
        $tahun = request('tahun', now()->format('Y'));

        $presensi = Presensi::where('user_id', Auth::id())
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->get();

        $pdf = Pdf::loadView('exports.presensi-pdf', [
            'presensi' => $presensi,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);

        return $pdf->download("rekap-presensi-saya-{$bulan}-{$tahun}.pdf");
    }
}

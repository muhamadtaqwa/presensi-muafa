<?php

namespace App\Http\Controllers;

use App\Exports\PresensiExport;
use App\Models\Presensi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class PresensiController extends Controller
{
    public function index()
    {
        $today = now()->format('Y-m-d');

        // Cek presensi hari ini
        $presensi = Presensi::where('user_id', Auth::id())
            ->where('tanggal', $today)
            ->whereNull('jenis_izin')
            ->first();

        if ($presensi) {
            $presensi->tanggal_format = $presensi->tanggal->locale('id')->isoFormat('D MMMM YYYY');
            $presensi->hari = $presensi->tanggal->locale('id')->isoFormat('dddd');
            $presensi->jam_datang = $presensi->jam_datang?->format('H:i:s');
            $presensi->jam_pulang = $presensi->jam_pulang?->format('H:i:s');
        }

        // Cek izin hari ini
        $izinHariIni = Presensi::where('user_id', Auth::id())
            ->where('tanggal', $today)
            ->whereNotNull('jenis_izin')
            ->first();

        if ($izinHariIni) {
            $izinHariIni->tanggal_format = $izinHariIni->tanggal->locale('id')->isoFormat('D MMMM YYYY');
            $izinHariIni->hari = $izinHariIni->tanggal->locale('id')->isoFormat('dddd');
        }

        $riwayat = Presensi::where('user_id', Auth::id())
            ->whereNull('jenis_izin')
            ->orderBy('tanggal', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($p) {
                return [
                    'tanggal' => $p->tanggal->locale('id')->isoFormat('D MMMM YYYY'),
                    'hari' => $p->tanggal->locale('id')->isoFormat('dddd'),
                    'jam_datang' => $p->jam_datang?->format('H:i') ?? '-',
                    'jam_pulang' => $p->jam_pulang?->format('H:i') ?? '-',
                    'status' => $p->jam_datang && $p->jam_pulang ? 'Lengkap' : ($p->jam_datang ? 'Datang' : 'Belum'),
                ];
            });

        return Inertia::render('Presensi', [
            'presensi' => $presensi,
            'izinHariIni' => $izinHariIni,
            'today' => $today,
            'riwayat' => $riwayat,
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

        // Cek apakah sudah izin di tanggal tersebut
        $izin = Presensi::where('user_id', Auth::id())
            ->where('tanggal', $request->tanggal)
            ->whereNotNull('jenis_izin')
            ->first();

        if ($izin) {
            return back()->withErrors(['message' => 'Anda sudah izin hari ini, tidak bisa absen.']);
        }

        $data = $request->all();
        $data['user_id'] = Auth::id();
        $data['jenis_izin'] = null;

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

    public function destroy($id)
    {
        $presensi = Presensi::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Hapus foto dari storage
        if ($presensi->foto_datang) {
            Storage::disk('public')->delete($presensi->foto_datang);
        }
        if ($presensi->foto_pulang) {
            Storage::disk('public')->delete($presensi->foto_pulang);
        }

        $presensi->delete();

        return back()->with('success', 'Absen berhasil dibatalkan.');
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
            ->whereNull('jenis_izin')
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
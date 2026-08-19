<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IzinController extends Controller
{
    public function index()
    {
        $riwayatIzin = Presensi::where('user_id', Auth::id())
            ->whereNotNull('jenis_izin')
            ->orderBy('tanggal', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'tanggal' => $p->tanggal->locale('id')->isoFormat('D MMMM YYYY'),
                    'hari' => $p->tanggal->locale('id')->isoFormat('dddd'),
                    'jenis' => ucfirst($p->jenis_izin),
                    'keterangan' => $p->keterangan ?? '-',
                ];
            });

        return Inertia::render('Izin', [
            'riwayatIzin' => $riwayatIzin,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'jenis_izin' => 'required|in:izin,sakit,dinas',
            'keterangan' => 'required|string|min:5',
        ]);

        Presensi::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'tanggal' => $request->tanggal,
            ],
            [
                'jenis_izin' => $request->jenis_izin,
                'keterangan' => $request->keterangan,
                'status' => 'manual',
            ]
        );

        return redirect()->route('izin')->with('success', 'Izin berhasil diajukan.');
    }

    public function destroy($id)
    {
        $izin = Presensi::where('id', $id)
            ->where('user_id', Auth::id())
            ->whereNotNull('jenis_izin')
            ->firstOrFail();

        $izin->delete();

        return back()->with('success', 'Izin berhasil dibatalkan.');
    }
}

<?php

namespace App\Http\Controllers;

use App\Exports\GuruExport;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class GuruController extends Controller
{
    public function index()
    {
        $guru = User::where('role', 'guru')
            ->orderBy('name')
            ->get(['id', 'username', 'name', 'nip', 'jabatan']);

        return Inertia::render('DataGuru', [
            'guru' => $guru,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:50|unique:users,username',
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'nip' => 'nullable|string|max:50|unique:users,nip',
            'jabatan' => 'nullable|string|max:100',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = 'guru';

        User::create($validated);

        return back()->with('success', 'Guru berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'username' => 'required|string|max:50|unique:users,username,' . $id,
            'name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:50|unique:users,nip,' . $id,
            'jabatan' => 'nullable|string|max:100',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return back()->with('success', 'Data guru berhasil diupdate.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('success', 'Guru berhasil dihapus.');
    }

    public function exportExcel()
    {
        return Excel::download(new GuruExport, 'data-guru.xlsx');
    }

    public function exportPdf()
    {
        $guru = User::where('role', 'guru')->orderBy('name')->get();

        $pdf = Pdf::loadView('exports.guru-pdf', [
            'guru' => $guru,
        ]);

        return $pdf->download('data-guru.pdf');
    }
}

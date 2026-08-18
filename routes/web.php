<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\RekapController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

// Redirect root ke login
Route::get('/', function () {
    return redirect()->route('login');
});

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected routes
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Presensi
    Route::get('/presensi', [PresensiController::class, 'index'])->name('presensi');
    Route::post('/presensi', [PresensiController::class, 'store'])->name('presensi.store');

    // Rekap Presensi
    Route::get('/rekap', [RekapController::class, 'index'])->name('rekap');
    Route::get('/rekap/export-excel', [RekapController::class, 'exportExcel'])->name('rekap.export-excel');
    Route::get('/rekap/export-pdf', [RekapController::class, 'exportPdf'])->name('rekap.export-pdf');

    // Setting (ganti password)
    Route::get('/setting', [SettingController::class, 'index'])->name('setting');
    Route::post('/setting/password', [SettingController::class, 'updatePassword'])->name('setting.password');

    // Data Guru (admin only)
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/data-guru', [GuruController::class, 'index'])->name('data-guru.index');
        Route::post('/data-guru', [GuruController::class, 'store'])->name('data-guru.store');
        Route::put('/data-guru/{id}', [GuruController::class, 'update'])->name('data-guru.update');
        Route::delete('/data-guru/{id}', [GuruController::class, 'destroy'])->name('data-guru.destroy');
        Route::get('/data-guru/export-excel', [GuruController::class, 'exportExcel'])->name('data-guru.export-excel');
        Route::get('/data-guru/export-pdf', [GuruController::class, 'exportPdf'])->name('data-guru.export-pdf');
    });
});

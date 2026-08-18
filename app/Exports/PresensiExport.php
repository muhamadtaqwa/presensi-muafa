<?php

namespace App\Exports;

use App\Models\Presensi;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PresensiExport implements FromCollection, WithHeadings, WithMapping
{
    protected $userId;
    protected $bulan;
    protected $tahun;

    public function __construct($userId = null, $bulan = null, $tahun = null)
    {
        $this->userId = $userId;
        $this->bulan = $bulan ?? now()->format('m');
        $this->tahun = $tahun ?? now()->format('Y');
    }

    public function collection()
    {
        $query = Presensi::with('user')
            ->whereMonth('tanggal', $this->bulan)
            ->whereYear('tanggal', $this->tahun);

        if ($this->userId) {
            $query->where('user_id', $this->userId);
        }

        return $query->orderBy('tanggal')->get();
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Nama',
            'NIP',
            'Jam Datang',
            'Lat Datang',
            'Long Datang',
            'Jam Pulang',
            'Lat Pulang',
            'Long Pulang',
            'Keterangan',
            'Status',
        ];
    }

    public function map($presensi): array
    {
        return [
            $presensi->tanggal->format('d/m/Y'),
            $presensi->user->name ?? '-',
            $presensi->user->nip ?? '-',
            $presensi->jam_datang?->format('H:i:s') ?? '-',
            $presensi->lat_datang ?? '-',
            $presensi->long_datang ?? '-',
            $presensi->jam_pulang?->format('H:i:s') ?? '-',
            $presensi->lat_pulang ?? '-',
            $presensi->long_pulang ?? '-',
            $presensi->keterangan ?? '-',
            $presensi->status ?? 'normal',
        ];
    }
}

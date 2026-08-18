<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class GuruExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return User::where('role', 'guru')->orderBy('name')->get();
    }

    public function headings(): array
    {
        return [
            'NIP',
            'Nama',
            'Username',
            'Jabatan',
        ];
    }

    public function map($guru): array
    {
        return [
            $guru->nip ?? '-',
            $guru->name,
            $guru->username,
            $guru->jabatan ?? '-',
        ];
    }
}

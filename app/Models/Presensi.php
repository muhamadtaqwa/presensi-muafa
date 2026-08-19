<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presensi extends Model
{
    use HasFactory;

    protected $table = 'absensi';

    protected $fillable = [
        'user_id',
        'tanggal',
        'foto_datang',
        'jam_datang',
        'lat_datang',
        'long_datang',
        'foto_pulang',
        'jam_pulang',
        'lat_pulang',
        'long_pulang',
        'keterangan',
        'jenis_izin',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
            'jam_datang' => 'datetime',
            'jam_pulang' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

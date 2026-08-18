<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('tanggal');
            $table->string('foto_datang')->nullable();
            $table->time('jam_datang')->nullable();
            $table->decimal('lat_datang', 10, 8)->nullable();
            $table->decimal('long_datang', 11, 8)->nullable();
            $table->string('foto_pulang')->nullable();
            $table->time('jam_pulang')->nullable();
            $table->decimal('lat_pulang', 10, 8)->nullable();
            $table->decimal('long_pulang', 11, 8)->nullable();
            $table->text('keterangan')->nullable();
            $table->enum('status', ['normal', 'manual', 'foto_gagal'])->default('normal');
            $table->timestamps();

            $table->unique(['user_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi');
    }
};

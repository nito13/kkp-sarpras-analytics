<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('gedung_bangunan')) {
            Schema::create('gedung_bangunan', function (Blueprint $table) {
                $table->string('id', 64)->primary();
                $table->string('satdik_id', 64);
                $table->string('kampus', 100)->default('Kampus Utama');
                $table->string('jenis_gedung', 500)->default('Gedung Perkuliahan / Kelas');
                $table->integer('jumlah')->default(1);
                $table->text('nama_gedung');
                $table->integer('jumlah_lantai')->default(0);
                $table->decimal('luas_m2', 14, 2)->default(0);
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->index('satdik_id', 'idx_gedung_satdik');
            });
        }

        if (!Schema::hasTable('kapal_latih')) {
            Schema::create('kapal_latih', function (Blueprint $table) {
                $table->string('id', 64)->primary();
                $table->string('satdik_id', 64);
                $table->string('nama_kapal', 200);
                $table->integer('tahun_perolehan')->default(2020);
                $table->decimal('tonage_gt', 12, 2)->default(0);
                $table->decimal('panjang_kapal', 12, 2)->default(0);
                $table->string('jenis_kapal', 150)->default('Kapal Latih Perikanan');
                $table->decimal('kapasitas_bbm', 14, 2)->default(0);
                $table->integer('jumlah_abk')->default(0);
                $table->string('alat_tangkap', 255)->default('-');
                $table->string('id_transmitter', 120)->default('-');
                $table->string('status_bmn', 150)->default('Terdaftar BMN (Aktif Operasional)');
                $table->text('keterangan')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->index('satdik_id', 'idx_kapal_satdik');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('kapal_latih');
        Schema::dropIfExists('gedung_bangunan');
    }
};

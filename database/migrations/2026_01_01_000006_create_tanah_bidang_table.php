<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('tanah_bidang')) {
            Schema::create('tanah_bidang', function (Blueprint $table) {
                $table->string('id', 64)->primary();
                $table->string('satdik_id', 50);
                $table->string('nama_bidang', 255);
                $table->string('kode_bmn', 100)->default('2.01.01.01.001.0001');
                $table->integer('nup')->default(1);
                $table->decimal('luas_m2', 14, 2)->default(0);
                $table->decimal('luas_ha', 10, 4)->default(0);
                $table->string('status_sertifikat', 150)->default('Sertifikat Hak Pakai (SHP)');
                $table->string('no_sertifikat', 200)->default('-');
                $table->string('tanggal_sertifikat', 50)->default('-');
                $table->string('atas_nama', 255)->default('Pemerintah RI c.q. Kementerian Kelautan dan Perikanan');
                $table->string('peruntukan', 150)->default('Kampus & Fasilitas Akademik');
                $table->string('status_pemanfaatan', 150)->default('Digunakan Sendiri (Operasional)');
                $table->text('alamat')->nullable();
                $table->string('kota', 100)->default('');
                $table->string('provinsi', 100)->default('');
                $table->integer('tahun_perolehan')->default(2020);
                $table->string('asal_perolehan', 100)->default('APBN');
                $table->text('keterangan')->nullable();
                $table->text('foto_satelit')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->index('satdik_id', 'idx_tanah_satdik');
                $table->index('status_sertifikat', 'idx_tanah_sertifikat');
                $table->index('peruntukan', 'idx_tanah_peruntukan');
                $table->foreign('satdik_id', 'fk_tanah_bidang_satdik')
                    ->references('id')->on('satdik')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('tanah_bidang');
    }
};

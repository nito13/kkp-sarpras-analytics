<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('asrama_rekap')) {
            Schema::create('asrama_rekap', function (Blueprint $table) {
                $table->string('satdik_id', 50)->primary();
                $table->string('nama_excel', 255)->nullable();
                $table->integer('jumlah_asrama')->default(0);
                $table->integer('jumlah_kamar')->default(0);
                $table->decimal('luas_m2', 10, 2)->default(0);
                $table->decimal('kapasitas', 10, 2)->default(0);
                $table->decimal('kapasitas_aktif', 10, 2)->default(0);
                $table->decimal('luas_adjustment', 10, 2)->nullable();
                $table->decimal('kapasitas_adjustment', 10, 2)->nullable();
                $table->integer('jumlah_tidak_dipakai')->default(0);
                $table->integer('jumlah_perlu_renovasi')->default(0);
                $table->text('keterangan')->nullable();
                $table->text('drive_url')->nullable();
                $table->string('sumber', 255)->nullable();
                $table->date('tanggal_data')->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->foreign('satdik_id', 'fk_asrama_rekap_satdik')
                    ->references('id')->on('satdik')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        if (!Schema::hasTable('asrama_gedung')) {
            Schema::create('asrama_gedung', function (Blueprint $table) {
                $table->string('id', 50)->primary();
                $table->string('satdik_id', 50);
                $table->string('kampus', 150)->nullable();
                $table->string('nama', 255);
                $table->string('peruntukan', 50)->nullable();
                $table->integer('jumlah_kamar')->default(0);
                $table->decimal('luas_m2', 10, 2)->default(0);
                $table->decimal('kapasitas', 10, 2)->default(0);
                $table->string('status', 50)->default('Digunakan');
                $table->text('keterangan')->nullable();
                $table->text('rincian_json')->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->index('satdik_id', 'idx_asrama_satdik');
                $table->foreign('satdik_id', 'fk_asrama_gedung_satdik')
                    ->references('id')->on('satdik')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('asrama_gedung');
        Schema::dropIfExists('asrama_rekap');
    }
};

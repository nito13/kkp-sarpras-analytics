<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('tambak_rekap')) {
            Schema::create('tambak_rekap', function (Blueprint $table) {
                $table->string('satdik_id', 50)->primary();
                $table->string('nama_satdik', 100);
                $table->string('kode_satdik', 20)->default('');
                $table->string('jenjang', 50)->default('Politeknik');
                $table->integer('jumlah_unit')->default(0);
                $table->integer('jumlah_tambak')->default(0);
                $table->integer('jumlah_kolam')->default(0);
                $table->integer('jumlah_tandon')->default(0);
                $table->decimal('luas_total_m2', 12, 2)->default(0);
                $table->decimal('luas_tambak_m2', 12, 2)->default(0);
                $table->decimal('luas_kolam_m2', 12, 2)->default(0);
                $table->integer('kondisi_baik')->default(0);
                $table->integer('kondisi_rusak_ringan')->default(0);
                $table->integer('kondisi_rusak_berat')->default(0);
                $table->integer('unit_aktif')->default(0);
                $table->integer('unit_belum_dimanfaatkan')->default(0);
                $table->integer('total_kincir')->default(0);
                $table->string('daya_listrik', 255)->nullable();
                $table->string('lokasi_utama', 255)->nullable();
                $table->text('map_url')->nullable();
                $table->text('keterangan')->nullable();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->foreign('satdik_id', 'fk_tambak_rekap_satdik')
                    ->references('id')->on('satdik')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        if (!Schema::hasTable('tambak_unit')) {
            Schema::create('tambak_unit', function (Blueprint $table) {
                $table->string('id', 50)->primary();
                $table->string('satdik_id', 50);
                $table->integer('no_urut')->default(1);
                $table->string('nama', 200);
                $table->string('jenis', 50)->default('Tambak');
                $table->string('kampus_lokasi', 200)->nullable();
                $table->decimal('luas_m2', 12, 2)->default(0);
                $table->string('luas_label', 80)->nullable();
                $table->string('kondisi', 50)->default('Baik');
                $table->string('fungsi', 255)->nullable();
                $table->string('status_operasional', 80)->default('Aktif Budidaya');
                $table->string('pelataran', 120)->nullable();
                $table->string('pelataran_kategori', 80)->nullable();
                $table->string('listrik', 255)->nullable();
                $table->string('kincir', 255)->nullable();
                $table->integer('jumlah_kincir')->default(0);
                $table->string('lokasi_label', 255)->nullable();
                $table->text('map_url')->nullable();
                $table->text('keterangan')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->index('satdik_id', 'idx_tambak_unit_satdik');
                $table->index('jenis', 'idx_tambak_unit_jenis');
                $table->index('kondisi', 'idx_tambak_unit_kondisi');
                $table->foreign('satdik_id', 'fk_tambak_unit_satdik')
                    ->references('id')->on('satdik')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('tambak_unit');
        Schema::dropIfExists('tambak_rekap');
    }
};

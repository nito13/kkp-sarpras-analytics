<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('satdik')) {
            Schema::create('satdik', function (Blueprint $table) {
                $table->string('id', 50)->primary();
                $table->string('name', 255);
                $table->string('short_name', 100)->nullable();
                $table->string('jenjang', 50)->nullable();
                $table->string('type', 50)->nullable();
                $table->string('provinsi', 100)->nullable();
                $table->string('kota', 100)->nullable();
                $table->string('region', 50)->nullable();
                $table->decimal('lat', 10, 6)->nullable();
                $table->decimal('lng', 10, 6)->nullable();
                $table->integer('map_x')->nullable();
                $table->integer('map_y')->nullable();
                $table->integer('taruna_count')->default(0);
                $table->integer('dosen_count')->default(0);
                $table->decimal('luas_lahan_ha', 8, 2)->default(0);
                $table->decimal('luas_bangunan_m2', 10, 2)->default(0);
                $table->string('akreditasi', 50)->nullable();
                $table->integer('established_year')->nullable();
                $table->text('kampus_cabang_json')->nullable();
                $table->string('rector', 255)->nullable();
                $table->text('prodi_json')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('satdik');
    }
};

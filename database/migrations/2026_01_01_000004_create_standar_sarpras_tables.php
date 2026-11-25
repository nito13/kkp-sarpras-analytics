<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('standar_bidang')) {
            Schema::create('standar_bidang', function (Blueprint $table) {
                $table->string('id', 50)->primary();
                $table->string('code', 10);
                $table->string('sheet_name', 150);
                $table->string('nama', 255);
                $table->string('category_id', 100)->nullable();
                $table->text('prodi_json')->nullable();
                $table->text('satdik_ids_json')->nullable();
                $table->integer('prasarana_count')->default(0);
                $table->integer('sarana_count')->default(0);
                $table->integer('total_items')->default(0);
                $table->longText('group_notes_json')->nullable();
                $table->string('sumber', 255)->nullable();
                $table->date('tanggal_data')->nullable();
                $table->integer('sort_order')->default(0);
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
            });
        }

        if (!Schema::hasTable('standar_rekap')) {
            Schema::create('standar_rekap', function (Blueprint $table) {
                $table->string('id', 80)->primary();
                $table->string('bidang_id', 50);
                $table->string('satdik_id', 50);
                $table->integer('prasarana_total')->default(0);
                $table->integer('prasarana_terpenuhi')->default(0);
                $table->integer('prasarana_sebagian')->default(0);
                $table->integer('prasarana_kosong')->default(0);
                $table->integer('sarana_total')->default(0);
                $table->integer('sarana_terpenuhi')->default(0);
                $table->integer('sarana_sebagian')->default(0);
                $table->integer('sarana_kosong')->default(0);
                $table->integer('total_items')->default(0);
                $table->integer('total_terpenuhi')->default(0);
                $table->integer('total_sebagian')->default(0);
                $table->integer('total_kosong')->default(0);
                $table->decimal('persen_prasarana', 5, 1)->default(0);
                $table->decimal('persen_sarana', 5, 1)->default(0);
                $table->decimal('persen_total', 5, 1)->default(0);
                $table->decimal('std_vol_sum', 12, 2)->default(0);
                $table->decimal('real_vol_sum', 12, 2)->default(0);
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->index('bidang_id', 'idx_std_rekap_bidang');
                $table->index('satdik_id', 'idx_std_rekap_satdik');
                $table->foreign('bidang_id', 'fk_std_rekap_bidang')
                    ->references('id')->on('standar_bidang')
                    ->cascadeOnDelete()->cascadeOnUpdate();
                $table->foreign('satdik_id', 'fk_std_rekap_satdik')
                    ->references('id')->on('satdik')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }

        if (!Schema::hasTable('standar_item')) {
            Schema::create('standar_item', function (Blueprint $table) {
                $table->string('id', 50)->primary();
                $table->string('bidang_id', 50);
                $table->char('sec', 1);
                $table->string('sub_sec', 10)->nullable();
                $table->string('grp_code', 30)->nullable();
                $table->string('grp_name', 255);
                $table->string('sub_grp', 255)->nullable();
                $table->string('item_no', 20)->nullable();
                $table->text('nama');
                $table->decimal('std_vol', 10, 2)->default(1);
                $table->string('satuan', 50)->default('Unit');
                $table->text('realisasi_json');
                $table->string('kondisi', 50)->nullable();
                $table->text('keterangan')->nullable();
                $table->integer('sort_order')->default(0);

                $table->index(['bidang_id', 'sec', 'sort_order'], 'idx_std_item_bidang_sec');
                $table->foreign('bidang_id', 'fk_std_item_bidang')
                    ->references('id')->on('standar_bidang')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('standar_item');
        Schema::dropIfExists('standar_rekap');
        Schema::dropIfExists('standar_bidang');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('assets')) {
            Schema::create('assets', function (Blueprint $table) {
                $table->string('id', 50)->primary();
                $table->string('name', 255);
                $table->string('satdik_id', 50);
                $table->string('satdik_name', 255);
                $table->string('prodi', 150)->nullable();
                $table->string('category', 100);
                $table->string('condition', 50);
                $table->integer('condition_score')->default(80);
                $table->integer('acquisition_year')->nullable();
                $table->integer('utilization_rate')->default(0);
                $table->text('capacity_desc')->nullable();
                $table->text('specs')->nullable();
                $table->date('cert_expiry_date')->nullable();
                $table->date('last_maintenance_date')->nullable();
                $table->date('next_maintenance_date')->nullable();
                $table->string('maintenance_urgency', 50)->default('Normal');
                $table->text('issues_summary')->nullable();
                $table->timestamp('created_at')->useCurrent();
                $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

                $table->index('satdik_id', 'idx_satdik');
                $table->index('category', 'idx_category');
                $table->index('condition', 'idx_condition');
                $table->foreign('satdik_id', 'fk_asset_satdik')
                    ->references('id')->on('satdik')
                    ->cascadeOnDelete()->cascadeOnUpdate();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};

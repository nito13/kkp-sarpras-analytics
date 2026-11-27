<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('system_settings')) {
            Schema::create('system_settings', function (Blueprint $table) {
                $table->string('setting_key', 100)->primary();
                $table->text('setting_value')->nullable();
                $table->string('updated_by', 150)->nullable();
                $table->dateTime('updated_at')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};

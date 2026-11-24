<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->string('id', 50)->primary();
                $table->string('name', 255);
                $table->string('nip', 50)->default('');
                $table->string('email', 150)->unique();
                $table->string('password', 255);
                $table->string('role', 50)->default('operator_kampus');
                $table->string('role_label', 100)->nullable();
                $table->string('jabatan', 255)->nullable();
                $table->string('unit_kerja', 255)->nullable();
                $table->string('accessible_satdik', 50)->default('ALL');
                $table->string('satdik_name', 255)->nullable();
                $table->text('permissions_json')->nullable();
                $table->text('avatar_url')->nullable();
                $table->timestamp('created_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

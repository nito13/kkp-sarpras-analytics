<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->string('id', 64)->primary();
                $table->string('action_type', 32)->default('INPUT');
                $table->string('operation', 32)->default('CREATE');
                $table->string('module', 64)->default('umum');
                $table->string('table_name', 64)->default('-');
                $table->string('record_id', 100)->default('-');
                $table->string('record_name', 255)->default('-');
                $table->string('satdik_id', 64)->default('ALL');
                $table->string('satdik_name', 255)->default('-');
                $table->string('actor_id', 64)->default('USR-ADMIN');
                $table->string('actor_name', 255)->default('Administrator Sistem');
                $table->string('actor_email', 150)->default('administrator@kkp.go.id');
                $table->string('actor_role', 100)->default('administrator');
                $table->text('summary')->nullable();
                $table->longText('payload_json')->nullable();
                $table->string('ip_address', 64)->default('127.0.0.1');
                $table->timestamp('created_at')->useCurrent();

                $table->index('action_type', 'idx_audit_action');
                $table->index('module', 'idx_audit_module');
                $table->index('satdik_id', 'idx_audit_satdik');
                $table->index('created_at', 'idx_audit_created');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};

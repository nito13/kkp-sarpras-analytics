<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('standar_item') && Schema::hasColumn('standar_item', 'kondisi')) {
            DB::statement('ALTER TABLE `standar_item` MODIFY COLUMN `kondisi` VARCHAR(50) NULL');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('standar_item') && Schema::hasColumn('standar_item', 'kondisi')) {
            DB::statement('ALTER TABLE `standar_item` MODIFY COLUMN `kondisi` VARCHAR(10) NULL');
        }
    }
};

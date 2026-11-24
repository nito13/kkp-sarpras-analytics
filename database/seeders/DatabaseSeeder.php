<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SatdikSeeder::class,
            UserSeeder::class,
            AsramaSeeder::class,
            StandarSarprasSeeder::class,
            TambakSeeder::class,
            AuditLogSeeder::class,
        ]);
    }
}

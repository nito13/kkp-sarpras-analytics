<?php

namespace Tests\Feature;

use Tests\TestCase;

class SarprasApiTest extends TestCase
{
    public function test_spa_home_page_renders_blade_shell(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('window.__LOGO_KKP', false);
        $response->assertSee('assets/app.js', false);
        $response->assertSee('assets/vendor/core-bundle.min.js', false);
    }

    public function test_monitoring_health_and_diagnostic_endpoints(): void
    {
        $health = $this->getJson('/api/health');
        $health->assertStatus(200)
            ->assertJson([
                'status' => 'connected',
                'success' => true,
            ])
            ->assertJsonStructure(['framework', 'database', 'counts' => ['satdik', 'users', 'asramaGedung', 'standarItems']]);

        // Legacy alias
        $this->getJson('/Monitoring/health.php')
            ->assertStatus(200)
            ->assertJson(['status' => 'connected', 'success' => true]);

        $diag = $this->getJson('/api/diagnostic');
        $diag->assertStatus(200)
            ->assertJsonPath('database.status', 'connected');
    }

    public function test_satdik_endpoint_returns_campuses(): void
    {
        $res = $this->getJson('/api/satdik');
        $res->assertStatus(200)
            ->assertJson(['status' => 'success']);
        $this->assertGreaterThanOrEqual(18, $res->json('total'));
        $this->assertCount($res->json('total'), $res->json('data'));

        // Legacy alias
        $legacy = $this->getJson('/APIs/satdik.php');
        $legacy->assertStatus(200)
            ->assertJson(['status' => 'success', 'total' => $res->json('total')]);
    }

    public function test_auth_login_and_admin_user_management(): void
    {
        // Login with administrator credentials
        $login = $this->postJson('/APIs/auth.php', [
            'identifier' => 'administrator@kkp.go.id',
            'password' => 'administrator',
        ]);

        $login->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Login berhasil',
            ])
            ->assertJsonPath('user.id', 'USR-ADMIN')
            ->assertCookie('kkp_sarpras_active');

        // Unauthorized GET users
        $this->getJson('/api/users')->assertStatus(403);

        // Authorized GET users via admin headers
        $headers = [
            'X-Actor-Role' => 'administrator',
            'X-Actor-Id' => 'USR-ADMIN',
        ];
        $list = $this->withHeaders($headers)->getJson('/api/users');
        $list->assertStatus(200)->assertJson(['status' => 'success']);

        // Create, update, delete test user
        $testEmail = 'test.laravel.' . time() . '@kkp.go.id';
        $created = $this->withHeaders($headers)->postJson('/api/users', [
            'name' => 'Penguji Migrasi Laravel',
            'email' => $testEmail,
            'password' => 'rahasia123',
            'role' => 'operator_kampus',
            'accessibleSatdik' => 'poltek-aup',
        ]);
        $created->assertStatus(201)->assertJsonPath('user.email', $testEmail);
        $userId = $created->json('user.id');

        try {
            $updated = $this->withHeaders($headers)->putJson('/api/users/' . $userId, [
                'name' => 'Penguji Migrasi Updated',
            ]);
            $updated->assertStatus(200)->assertJsonPath('user.name', 'Penguji Migrasi Updated');
        } finally {
            $this->withHeaders($headers)->deleteJson('/api/users/' . $userId)->assertStatus(200);
        }
    }

    public function test_asrama_crud_and_rekap_recalculation(): void
    {
        $get = $this->getJson('/api/asrama');
        $get->assertStatus(200)
            ->assertJson(['status' => 'success'])
            ->assertJsonStructure(['meta', 'summary', 'buildings']);

        $create = $this->postJson('/api/asrama', [
            'satdikId' => 'poltek-aup',
            'nama' => 'Asrama Uji Laravel',
            'kampus' => 'Kampus Jakarta',
            'peruntukan' => 'Putra',
            'jumlahKamar' => 10,
            'luasM2' => 160,
            'kapasitas' => 40,
            'status' => 'Digunakan',
        ]);
        $create->assertStatus(201)->assertJsonPath('data.nama', 'Asrama Uji Laravel');
        $id = $create->json('data.id');

        try {
            $this->putJson('/APIs/asrama.php?id=' . $id, [
                'nama' => 'Asrama Uji Laravel Updated',
                'jumlahKamar' => 12,
            ])->assertStatus(200)->assertJsonPath('data.jumlahKamar', 12);
        } finally {
            $this->deleteJson('/APIs/asrama.php?id=' . $id)->assertStatus(200);
        }
    }

    public function test_gedung_kapal_tanah_tambak_and_standar_endpoints(): void
    {
        // Gedung CRUD
        $g = $this->postJson('/api/gedung', [
            'satdikId' => 'poltek-aup',
            'namaGedung' => 'Gedung Uji Laravel',
            'jumlahLantai' => 3,
            'luasM2' => 500,
        ]);
        $g->assertStatus(201);
        $gId = $g->json('data.id');
        try {
            $this->getJson('/api/gedung?satdik_id=poltek-aup')->assertStatus(200)->assertJson(['status' => 'success']);
            $this->putJson('/api/gedung/' . $gId, ['luasM2' => 550])->assertStatus(200)->assertJsonPath('data.luasM2', 550);
        } finally {
            $this->deleteJson('/api/gedung/' . $gId)->assertStatus(200);
        }

        // Kapal CRUD
        $k = $this->postJson('/api/kapal', [
            'satdikId' => 'poltek-kp-bitung',
            'namaKapal' => 'KM Uji Laravel',
            'tonageGt' => 75,
        ]);
        $k->assertStatus(201);
        $kId = $k->json('data.id');
        try {
            $this->getJson('/APIs/kapal.php')->assertStatus(200);
            $this->putJson('/api/kapal/' . $kId, ['tonageGt' => 80])->assertStatus(200)->assertJsonPath('data.tonageGt', 80);
        } finally {
            $this->deleteJson('/api/kapal/' . $kId)->assertStatus(200);
        }

        // Tanah CRUD
        $t = $this->postJson('/api/tanah', [
            'satdikId' => 'poltek-aup',
            'namaBidang' => 'Bidang Tanah Uji Laravel',
            'luasM2' => 10000,
        ]);
        $t->assertStatus(201)->assertJsonPath('data.luasHa', 1);
        $tId = $t->json('data.id');
        try {
            $this->getJson('/APIs/tanah.php')->assertStatus(200);
            $this->putJson('/api/tanah/' . $tId, ['luasM2' => 20000])->assertStatus(200)->assertJsonPath('data.luasHa', 2);
        } finally {
            $this->deleteJson('/api/tanah/' . $tId)->assertStatus(200);
        }

        // Tambak GET + CRUD
        $this->getJson('/api/tambak-kolam')->assertStatus(200)->assertJson(['status' => 'success']);
        $tb = $this->postJson('/api/tambak-kolam', [
            'satdikId' => 'poltek-aup',
            'nama' => 'Tambak Uji Laravel',
            'jenis' => 'Tambak',
            'luasM2' => 2500,
        ]);
        $tb->assertStatus(201);
        $tbId = $tb->json('data.unit.id');
        try {
            $this->putJson('/api/tambak-kolam', [
                'id' => $tbId,
                'luasM2' => 3000,
            ])->assertStatus(200);
        } finally {
            $this->deleteJson('/api/tambak-kolam?id=' . $tbId)->assertStatus(200);
        }

        // Standar Sarpras summary
        $this->getJson('/api/standar-sarpras?mode=summary')
            ->assertStatus(200)
            ->assertJson(['status' => 'success'])
            ->assertJsonStructure(['meta', 'bidang', 'rekap']);
    }

    public function test_audit_logs_bulk_import_assets_and_doc_gateway(): void
    {
        // Audit logs
        $this->getJson('/api/audit-logs')->assertStatus(200)->assertJsonStructure(['status', 'stats', 'data']);

        // Bulk import GET status
        $this->getJson('/api/bulk-import')->assertStatus(200)->assertJson(['ready' => true]);

        // Deprecated assets endpoint
        $this->getJson('/APIs/assets.php')->assertStatus(200)->assertJson(['total' => 0]);
        $this->postJson('/APIs/assets.php', [])->assertStatus(410);

        // Document gateway: unauthenticated -> 403
        $this->get('/APIs/doc.php?ref=poltek-aup')->assertStatus(403);

        // Document gateway: authenticated via cookie -> 302 redirect
        $this->withUnencryptedCookie('kkp_sarpras_client', '1')
            ->get('/APIs/doc.php?ref=poltek-aup')
            ->assertStatus(302);
    }
}

<?php
// backend/api/auth.php
// REST API Otentikasi Pengguna SIM-SARPRAS KKP

require_once __DIR__ . '/../config/database.php';

$pdo = getDbConnection(true);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function formatUserOutput($row) {
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'nip' => $row['nip'],
        'email' => $row['email'],
        'role' => $row['role'],
        'roleLabel' => $row['role_label'] ?? '',
        'jabatan' => $row['jabatan'] ?? '',
        'unitKerja' => $row['unit_kerja'] ?? '',
        'accessibleSatdik' => $row['accessible_satdik'] ?? 'ALL',
        'satdikName' => $row['satdik_name'] ?? '',
        'permissions' => !empty($row['permissions_json']) ? json_decode($row['permissions_json'], true) : [],
        'avatarUrl' => $row['avatar_url'] ?? '',
    ];
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);

    $identifier = trim($input['identifier'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($identifier) || empty($password)) {
        jsonResponse([
            'status' => 'error',
            'message' => 'Email/NIP dan password wajib diisi'
        ], 400);
    }

    $cleanId = strtolower($identifier);
    $cleanNip = str_replace(' ', '', $identifier);

    $stmt = $pdo->prepare("
        SELECT * FROM users 
        WHERE LOWER(email) = :email 
           OR REPLACE(nip, ' ', '') = :nip
        LIMIT 1
    ");
    $stmt->execute([':email' => $cleanId, ':nip' => $cleanNip]);
    $user = $stmt->fetch();

    if (!$user || $user['password'] !== $password) {
        jsonResponse([
            'status' => 'error',
            'message' => 'Email / NIP atau password salah'
        ], 401);
    }

    jsonResponse([
        'status' => 'success',
        'message' => 'Login berhasil',
        'user' => formatUserOutput($user)
    ]);
} else if ($method === 'GET') {
    // Kembalikan daftar akun demo (tanpa password)
    $stmt = $pdo->query("SELECT * FROM users ORDER BY id ASC");
    $users = $stmt->fetchAll();
    $list = array_map('formatUserOutput', $users);

    jsonResponse([
        'status' => 'success',
        'users' => $list
    ]);
} else {
    jsonResponse(['status' => 'error', 'message' => 'Metode HTTP tidak didukung'], 405);
}

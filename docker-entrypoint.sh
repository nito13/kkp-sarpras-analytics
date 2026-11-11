#!/bin/bash
set -e

# SIM-SARPRAS KKP — Docker Entrypoint
echo "=========================================================="
echo "⚓ Memulai SIM-SARPRAS KKP (Container Web)"
echo "=========================================================="

if [ -n "$DB_HOST" ]; then
    echo "[Entrypoint] Menghubungi database MySQL di $DB_HOST:${DB_PORT:-3306}..."
    until php -r "
        \$host = getenv('DB_HOST') ?: '127.0.0.1';
        \$port = getenv('DB_PORT') ?: '3306';
        \$user = getenv('DB_USER') ?: 'root';
        \$pass = getenv('DB_PASS') ?: '';
        try {
            new PDO('mysql:host=' . \$host . ';port=' . \$port, \$user, \$pass, [
                PDO::ATTR_TIMEOUT => 2,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]);
            exit(0);
        } catch (Throwable \$e) {
            exit(1);
        }
    " 2>/dev/null; do
        echo "[Entrypoint] MySQL belum siap, menunggu 2 detik..."
        sleep 2
    done
    echo "[Entrypoint] Database MySQL terhubung dan siap!"

    if [ "$AUTO_SEED" = "true" ]; then
        echo "[Entrypoint] Menjalankan inisialisasi & seeder database otomatis..."
        php Database/seed.php || echo "[Entrypoint] Catatan: Skrip seeder selesai."
    fi
fi

echo "=========================================================="
echo "🚀 SIM-SARPRAS KKP siap menerima permintaan pada port 80"
echo "=========================================================="

# Jalankan Apache dalam foreground
exec apache2-foreground

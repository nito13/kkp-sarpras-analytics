#!/bin/bash
set -e

echo "=========================================================="
echo "⚓ Memulai SIM-SARPRAS KKP (Laravel 10 Container)"
echo "=========================================================="

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache || true

if [ -n "$DB_HOST" ]; then
    echo "[Entrypoint] Menghubungi database MySQL di $DB_HOST:${DB_PORT:-3306}..."
    until php -r "
        \$host = getenv('DB_HOST') ?: '127.0.0.1';
        \$port = getenv('DB_PORT') ?: '3306';
        \$user = getenv('DB_USERNAME') ?: 'root';
        \$pass = getenv('DB_PASSWORD') ?: '';
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

    echo "[Entrypoint] Menjalankan Laravel Migrations..."
    php artisan migrate --force || true

    if [ "$AUTO_SEED" = "true" ]; then
        echo "[Entrypoint] Menjalankan Laravel Database Seeders..."
        php artisan db:seed --force || true
    fi
fi

echo "=========================================================="
echo "🚀 SIM-SARPRAS KKP (Laravel 10) siap pada port 80"
echo "=========================================================="

exec apache2-foreground

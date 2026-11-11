# Base image PHP 8.2 dengan Apache
FROM php:8.2-apache

# Instal ekstensi PDO MySQL yang diperlukan oleh backend SIM-SARPRAS KKP
RUN docker-php-ext-install pdo pdo_mysql

# Aktifkan modul Apache rewrite dan headers untuk mendukung routing .htaccess
RUN a2enmod rewrite headers mime dir

# Berikan izin AllowOverride All agar file .htaccess di root dan subdirektori dieksekusi Apache
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Set ServerName untuk mencegah peringatan Apache saat start
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Direktori kerja web root
WORKDIR /var/www/html

# Salin seluruh file proyek ke container
COPY . /var/www/html/

# Pastikan kepemilikan file diberikan ke user Apache (www-data)
RUN chown -R www-data:www-data /var/www/html

# Salin skrip entrypoint, ubah newline ke Unix LF (antisipasi Windows CRLF), dan beri hak eksekusi
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port web
EXPOSE 80

# Jalankan entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

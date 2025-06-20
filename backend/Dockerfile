# Use a base image with PHP and FPM for serving PHP applications
FROM php:8.2-fpm-alpine

# Set working directory inside the container
WORKDIR /var/www/html

# Install system dependencies, PHP extensions, and Composer
RUN apk add --no-cache \
    curl \
    git \
    nginx \
    libpq \
    libpq-dev \
    sqlite-libs \
    sqlite-dev \
    libzip-dev \
    icu-dev \
    postgresql-dev \
    && docker-php-ext-install \
    pdo_mysql \
    pdo_pgsql \
    zip \
    bcmath \
    intl \
    opcache \
    # Add other extensions if needed for your Lumen app (e.g., gd, exif, sockets)
    # gd \
    # exif \
    # sockets \
    && docker-php-ext-enable opcache # Enable opcache for performance

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy your Lumen application files into the container
COPY . .

# --- START FINAL FIX FOR COMPOSER AUTOLOADER AND MISSING CLASSES ---
# Remove vendor directory and composer.lock to ensure a clean install/update
# This forces Composer to regenerate the autoloader and download all dependencies from scratch.
RUN rm -rf vendor composer.lock && \
    composer update --no-dev --optimize-autoloader
# --- END FINAL FIX FOR COMPOSER AUTOLOADER AND MISSING CLASSES ---

# Create the directories if they don't exist before changing permissions
RUN mkdir -p /var/www/html/storage/framework/cache \
    mkdir -p /var/www/html/storage/framework/sessions \
    mkdir -p /var/www/html/storage/framework/views \
    mkdir -p /var/www/html/storage/logs \
    mkdir -p /var/www/html/bootstrap/cache # Ensure this directory exists

# Adjust permissions for storage and bootstrap/cache directories
# These directories need to be writable by the web server user (www-data)
RUN chown -R www-data:www-data /var/www/html/storage \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]

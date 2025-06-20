FROM php:8.2-fpm-alpine

WORKDIR /var/www/html

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
   
    && docker-php-ext-enable opcache # Enable opcache for performance

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy your Lumen application files into the container
COPY . .

RUN rm -rf vendor composer.lock && \
    composer update --no-dev --optimize-autoloader


RUN mkdir -p /var/www/html/storage/framework/cache \
    mkdir -p /var/www/html/storage/framework/sessions \
    mkdir -p /var/www/html/storage/framework/views \
    mkdir -p /var/www/html/storage/logs \
    mkdir -p /var/www/html/bootstrap/cache # Ensure this directory exists


RUN chown -R www-data:www-data /var/www/html/storage \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]

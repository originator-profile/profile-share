FROM wordpress:6.3.2-php8.2 as builder

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
  && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
  && php -r "unlink('composer-setup.php');"

RUN apt-get update \
  && apt-get install -y --no-install-recommends zip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html/wp-content/plugins/wordpress-profile-plugin
COPY . .
RUN composer install --no-dev \
  && zip -r /wordpress-profile-plugin.zip .

FROM scratch as artifact
COPY --from=builder /wordpress-profile-plugin.zip .

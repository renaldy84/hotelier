#!/bin/sh
APP_PLATFORM_DIR=/home/duf/projects/gethotel/src/hotelier_app/platforms/android/assets/www
echo $APP_PLATFORM_DIR

cp -f *.html $APP_PLATFORM_DIR
cp -rf css $APP_PLATFORM_DIR
find js/ ! -name config.js -exec cp -t $APP_PLATFORM_DIR/js/ {} +

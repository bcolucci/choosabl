#!/bin/sh

rm -rf public/locales
i18next-scanner --config src/i18next-scanner.config.js 'src/**/*.js'
node src/scripts/setLocalesDefaults.js

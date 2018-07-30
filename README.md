
# Choosabl

![logo](https://github.com/bcolucci/choosabl/blob/master/client/public/logo254.png?raw=true)

# Links referential

| Lien             | URL                                      |
|------------------|------------------------------------------|
| **PROD**         | https://choosabl-1e2ea.firebaseapp.com   |
| **TEST**         | https://choosabl-test.firebaseapp.com    |
|------------------|------------------------------------------|
| Firebase console | https://console.firebase.google.com      |
| Material UI      | https://material-ui.com/demos/buttons/   |
| Icons            | https://www.google.com/design/icons/     |
| I18n             | https://github.com/i18next/react-i18next |
| Social colors    | https://www.materialui.co/socialcolors   |
| Flags            | https://github.com/wiredmax/react-flags  |

# Setup for development

## Select a "good" node version to work with

    sudo npm i -g n \
      && sudo n 6.11.5

## Retrieve the code and install deps

    git clone https://github.com/bcolucci/choosabl.git
    cd choosabl \
      && cd api && npm install \
      && cd ../client && npm install

## Install Visual Code deps

    CTRL + P + "ext install aeschli.vscode-css-formatter"
    CTRL + P + "ext install numso.prettier-standard-vscode"

## Run on local

    # starts the server side
    cd api \
      && npm run package:functions \
      && sudo npm run serve

    # starts the client
    cd client && npm start

## Build

    npm run build

## Deploy

    npm run deploy

# Switch environment

    # prod (default)
    npm run switch:prod

    # test
    npm run switch:test

# Documentation

* API: https://github.com/bcolucci/choosabl/blob/master/api
* Client: https://github.com/bcolucci/choosabl/blob/master/client

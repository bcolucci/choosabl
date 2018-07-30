
# Choosabl

# Setup for development

**Current version is available here: https://choosabl-1e2ea.firebaseapp.com**

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

## API documentation

https://github.com/bcolucci/choosabl/blob/master/api

## Client documentation

https://github.com/bcolucci/choosabl/blob/master/client

# Some links for the development

| Lien             | URL                                    |
|------------------|----------------------------------------|
| Firebase console | https://console.firebase.google.com    |
| Material UI      | https://material-ui.com/demos/buttons/ |
| Icons            | https://www.google.com/design/icons/   |
| Social colors    | https://www.materialui.co/socialcolors |


# Choosabl

![logo](https://github.com/bcolucci/choosabl/blob/master/client/public/logo254.png?raw=true)

# Links referential

| Lien                                                                                                  |
|-------------------------------------------------------------------------------------------------------|
| [**PROD**](https://choosabl-1e2ea.firebaseapp.com)
| [**TEST**](https://choosabl-test.firebaseapp.com) 
| [Console](https://console.firebase.google.com) 
| [Material UI](https://material-ui.com/demos/app-bar) 
| [Material Pickers](https://material-ui-pickers.firebaseapp.com) 
| [Icons](https://www.google.com/design/icons/) 
| [I18n](https://react.i18next.com/)     
| [Social colors](https://www.materialui.co/socialcolors)
| [Flags](https://github.com/wiredmax/react-flags)
| [Large images](https://commons.wikimedia.org/w/index.php?title=Category:Large_images#mw-category-media)
| [Vision Console](https://beta-dot-custom-vision.appspot.com)

---

Open usefull links for development:

    google-chrome \
      https://console.firebase.google.com \
      https://material-ui.com/demos/app-bar/ \
      https://www.google.com/design/icons/ \
      http://localhost:3000/


# Setup for development

## Select a "good" node version to work with

    sudo npm i -g n \
      && sudo n 8.11.1

## Retrieve the code and install deps

    git clone https://github.com/bcolucci/choosabl.git
    cd choosabl \
      && cd functions && npm install \
      && cd ../client && npm install

## Install gsutil

    curl https://sdk.cloud.google.com | bash
    [...]
    cd [choosabl-path]
    gcloud init

## Set CORS

    # local/test
    gcloud config set project choosabl-test \
      && gsutil cors set cors/test.json gs://choosabl-test.appspot.com

    # prod
    gcloud config set project choosabl-1e2ea \
      && gsutil cors set cors/prod.json gs://choosabl-1e2ea.appspot.com    

## Install Visual Code deps

    CTRL + P + "ext install aeschli.vscode-css-formatter"
    CTRL + P + "ext install numso.prettier-standard-vscode"

## Run on local

    # starts the server side
    cd functions && sudo npm run serve

    # starts the client
    cd client && npm start

## Build

    cd api && npm run build

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

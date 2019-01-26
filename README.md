
# Choosabl

# URLs

* Dev:
  * http://localhost:3000 (local)
  * https://choosabl-test-71670.firebaseapp.com (hosting)
* Prod:
  * https://choosabl-4a2ec.firebaseapp.com
  * https://choosabl.com

# Links referential

| Lien                                                                                                  |
|-------------------------------------------------------------------------------------------------------|
| [Console](https://console.firebase.google.com) 
| [Material UI](https://material-ui.com/demos/app-bar) 
| [Material Pickers](https://material-ui-pickers.firebaseapp.com) 
| [Icons](https://www.google.com/design/icons/) 
| [I18n](https://react.i18next.com/)     
| [Social colors](https://www.materialui.co/socialcolors)
| [Flags](https://github.com/wiredmax/react-flags)
| [Large images](https://commons.wikimedia.org/w/index.php?title=Category:Large_images#mw-category-media)
| [Vision Console](https://beta-dot-custom-vision.appspot.com)
| [Charts](http://www.chartjs.org/docs/latest/) - [Components](https://github.com/jerairrest/react-chartjs-2)

---

[Usefull](https://firebase.google.com/docs/functions/beta-v1-diff)

---

# Accounts

* Facebook, LinkedIn: contact@choosabl.com / 2018@choosabl
* Google: mac.choosabl@gmail.com / 2018@choosabl

---

Open usefull links for development:

    google-chrome \
      https://console.firebase.google.com \
      https://material-ui.com/demos/app-bar/ \
      https://www.google.com/design/icons/ \
      http://localhost:3000/


# Setup for development

## Select a "good" node version to work with

    sudo npm i -g nvm \
      && nvm install v8.11.1

## Retrieve the code and install deps

    git clone https://github.com/bcolucci/choosabl.git
    cd choosabl \
      && npm install \
      && cd functions && npm install \
      && cd ../client && npm install

## Install gsutil

    curl https://sdk.cloud.google.com | bash
    [...]
    cd [choosabl-path]
    gcloud init

## Setup Firebase CLI

    sudo npm i -g firebase firebase-tools @google-cloud/functions-emulator

    # and login
    firebase login

## Switch to dev env

    npm run switch:test

## (optional) Active NVM version autoload

Add this to your profile file (e.g. bashrc, bash_profile):

    #
    # Run 'nvm use' automatically every time there's
    # a .nvmrc file in the directory. Also, revert to default
    # version when entering a directory without .nvmrc
    #
    enter_directory() {
    if [[ $PWD == $PREV_PWD ]]; then
        return
    fi

    PREV_PWD=$PWD
    if [[ -f ".nvmrc" ]]; then
        nvm use
        NVM_DIRTY=true
    elif [[ $NVM_DIRTY = true ]]; then
        nvm use default
        NVM_DIRTY=false
    fi
    }

## (optional) Hide some folders

Add this to your Visual Code User Settings, in **file.exclude**.

For example:

```json
{
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/bower_components": true,
    "**/node_modules": true,
    "**/package-lock.json": true,
    "**/.firebase": true
  }
}
```

## Set CORS

    # local/test
    npm run setcors:test

    # prod
    npm run setcors:prod   

## Install Visual Code deps

    CTRL + P + "ext install aeschli.vscode-css-formatter"
    CTRL + P + "ext install numso.prettier-standard-vscode"

## Run on local

    npm start

## Build client

    cd client && npm run build

## Format code

    npm run format

## Deploy

    npm run deploy

# Switch environment

    # prod (default)
    npm run switch:prod

    # test
    npm run switch:test

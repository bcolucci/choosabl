
# Choosabl

# Setup for development

## Select a "good" node version to work with

    sudo npm i -g n \
      && sudo n 6.11.5

## Retrieve the code and install deps

    git clone https://github.com/bcolucci/choosabl.git
    cd choosabl \
      && cd api && npm install \
      && cd ../client && npm install

## Install Prettier on Visual Code

CTRL + P + "ext install numso.prettier-standard-vscode"

## Run on local

    # starts the server side
    cd api \
      && npm run package:functions \
      && sudo npm run serve

    # starts the client
    cd client && npm start

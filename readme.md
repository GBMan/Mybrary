# Install
## Install packages
`npm init`

## Install dependencies
`npm i express ejs express-ejs-layouts`
express: Server
ejs: Template
express-ejs-layouts: Layout, a kind of Twig

## Install dev dependencies
`npm i --save-dev nodemon`
nodemon: Autorefresh for the server

Dans "package.json", modifier la propriété "scripts" en ajoutant :
    "start": "node server.js"       // Pour la prod
    "devStart": "nodemon server.js" // Pour le dev

## Install Mongoose
`npm i mongoose`
mongoose: to connect to the database

## Install dotenv
`npm i --save-dev dotenv`
dotenv: to available environment variable


# Run
## Pour utiliser sass
node-sass -w . -o .

## Pour utiliser Live Server
Clic droit sur index.html et choisir "Open with LiveServer"
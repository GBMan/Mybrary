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

In "package.json", modify the "scripts" properties by adding :
    "start": "node server.js"       // For prod
    "devStart": "nodemon server.js" // For dev

## Install Mongoose
`npm i mongoose`
mongoose: to connect to the database

## Install dotenv
`npm i --save-dev dotenv`
dotenv: to available environment variable

## Install dotenv
`npm i body-parser`
body-parser: to parse easily our data from ejs
Maybe useless...


# Run
## For sass
node-sass -w . -o .

## For Live Server
Right click on index.html and choose "Open with LiveServer"


# Save on git
// First time only
`git init`
`git add .`
`git commit -m "Blablabla"`
`git remote add origin https://github.com/GBMan/Mybrary.git`
`git push -u origin master`

Each time
`git add .`
`git commit -m "Blablabla"`
`git push -u origin master`


# Heroku
## Install cli
`https://devcenter.heroku.com/articles/heroku-cli`
Reload the computer

## Connection in the terminal
`heroku login`
Open a web page in a browser for connection

`heroku git:remote -a gb-mybrary`
`git push heroku master`
Push the last git project version git on Heroku.

## Create the environment variables on Heroku
Go to "Settings"
Click on "Config Vars"
In the "Key" field fill "DATABASE_URL"
In the "Value" field fill the MongoDB Atlas connection String (see below)

## Connection to MongoDB Atlas
Create an account - Once
Create a cluster
Click on "Connect"
Create a user
Choose "Connect your Application"
Copy the "Connection String"
Paste it in the "Value" field for environment variables in Heroku
! Replace <username> by the MongoDB user name
! Replace <password> by the MongoDB user password
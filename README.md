# URL Shortening API

## Overview
This is a url shortener API built with Nodejs with the express and SQLite packages. It allows you to shorten a long url into a custom alias. 

## Features
* Shorten urls
* Custom aliases
* SQLite database
* .env enviornment variables

## Requirements
* Node and NPM
* SQLite
* dotenv
* Express

## Installation
1. Clone repo 
```
git clone https://github.com/flynn-28/url-shortener.git
cd url-shortener
```

2. Install Packages
```
npm install
```

3. Configure Enviornment (optional)
```
nano .env
```
Example .env:
```
PORT=3000
DB=./database.db
```

4. Run the server
```
npm start
```

## API Endpoint

### 1. Shorten URL

#### Endpoint
``/shorten/:alias?longurl=<url>``

#### Options
* :alias - shortened alias for the long url
* <url> - long url you want to shorten

#### Example Request
``/shorten/msmc?longurl=https://msmc.lol``

#### Example Response
```json
{
  "shortUrl": "http://localhost:3000/msmc"
}
```

### 2. Redirect from Short URL

#### Endpoint
``/:alias``

#### Options
* :alias - shortened alias of your long url

#### Example Request
``/msmc``

#### Response
This endpoint redirects you to the long url that corresponds to the specified alias

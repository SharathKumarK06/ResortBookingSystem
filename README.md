# Resort Booking System

Resort booking system project developed during my college.

## Dependency

- MongoDB (Database)
- Node.js (JavaScript runtime)
- Express.js (Backend framework for RESTful API)

### Node.js libraries

- bcrypt (Cryptographic library for hashing the password, uses [blowfish](https://en.wikipedia.org/wiki/Blowfish_(cipher)) algorithm)
- ejs (Templating library)
- express-session (To manage user session)
- jsonwebtoken (Session identifier for user using
  [JWT](https://en.wikipedia.org/wiki/JSON_Web_Token))
- mongoose (To interact with mongodb database)
- multer (To handle file upload)
- passport (Authentication middleware)

## Dev Dependencis

- dotenv (For loading secret keys as environment variables)
- nodemon (Reload the server.js file when changed)

## Usage

```console
sudo systemctl start mongodb
npm install
node server.js
```

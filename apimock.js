const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');
const _ = require("underscore");
const jwt = require('jsonwebtoken');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const dummyDataDir = "./mockdata";
const version = "0.6";

const dummyToken = {
  "aud": "LegalEntity",
  "sub": "mockapi@inmarsat.com",
  "firstname": "Patch",
  "roles": [
    "LegalEntity-Test",
    "LegalEntity-General"
  ],
  "iss": "IdAM",
  "email": "mockapi@inmarsat.com",
  "lastname": "Mock",
  "exp": 1506094689,
  "scope": [],
  "client_id": "LegalEntityIM"
};
var dummyData = {};
var files = fs.readdirSync(dummyDataDir);

files.forEach(function (file) {
  const dat = fs.readFileSync(path.resolve(dummyDataDir, file));
  const adict = JSON.parse(dat);
  _.extend(dummyData, adict);
});
const router = jsonServer.router(dummyData);

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

// Use default router

server.use('/identity', router);

//curl -H "Content-Type: application/x-www-form-urlencoded" -d "redirect_uri=http://localhost:3000/fakeoauth"  http://localhost:3000/fakeoauth
server.post('/fakeoauth', (req, res) => {
  // sign asynchronously
  jwt.sign( dummyToken, "shhhh", function(err, token) {
    if(err)throw err;
    res.redirect(req.body.redirect_uri+'#access_token='+token+'&expires_in=7999');
  });
});

server.post('/faketoken.oauth2', (req, res) => {
  res.writeHead(200, {"Content-Type": "application/json"});
  fake_token = {access_token: "fake access token."};
  res.end(JSON.stringify(fake_token));
})

router.db._.id = "legalEntityCode";

server.listen(3000, () => {
  console.log('I am the api mock server (version:' + version +') running at localhost:3000!')
});


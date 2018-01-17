const fs = require('fs');

const content = fs.readFileSync('config.json');
const config = JSON.parse(content);
config.mock.oauthRedirectUrl = config.mock.oauthRedirectUrl.replace('8080', '8081');
fs.writeFileSync('mock-config.json', JSON.stringify(config, 'utf-8', 4));



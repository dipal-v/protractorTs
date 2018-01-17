import {sign} from 'jsonwebtoken';

const dummyToken = {
    aud: 'LegalEntity',
    sub: 'mockapi@inmarsat.com',
    firstname: 'Patch',
    roles: [
        'LegalEntity-Test',
        'LegalEntity-General'
    ],
    iss: 'IdAM',
    email: 'mockapi@inmarsat.com',
    lastname: 'Mock',
    exp: 1506094689,
    scope: [],
    client_id: 'LegalEntityIM'
};

export function getFakeJWT(callback) {
    sign( dummyToken, 'shhhh', (err, token) => {
        callback(err, token);
    });
}

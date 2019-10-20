var cookie = require('cookie');

module.exports = {

    clearAuthToken: (res, req) => {
        var authToken = req.signedCookies.authToken;
        res.clearCookie('authToken', { signed: true });
        return authToken ? cookie.parse(authToken).email : null;
    },

    readAuthToken: (cookies) => {
        var authToken = req.signedCookies.authToken;
        return authToken ? cookie.parse(authToken).email : null;
    }

}

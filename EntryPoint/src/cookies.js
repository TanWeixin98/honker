var cookie = require('cookie');

module.exports = {

    clearAuthToken: (req, res) => {
        var authToken = req.signedCookies.authToken;
        res.clearCookie('authToken', { signed: true });
        return authToken ? cookie.parse(authToken).username : null;
    },

    readAuthToken: (cookies) => {
        var authToken = cookies.authToken;
        return authToken ? cookie.parse(authToken).username : null;
    },

    createAuthToken: (username) => {
        return cookie.serialize('username', username);
    }

}

var Router = require('koa-router');
var router = new Router();

var jwt = require('jsonwebtoken');
var TOKEN = require('../config').TOKEN;
var uuid = require('node-uuid');

/**
 * 刷新令牌,以refreshToken获取新的accessToken
 */
router.post('/token', function *() {
    var refreshToken = this.request.body.refreshToken;
    try {
        var decoded = jwt.verify(refreshToken, TOKEN.REFRESH.KEY);
    } catch (err) {
        return this.throw(401, 'Incorrect refresh token');
    }
    var acecessToken = jwt.sign({
        seed: Math.random(),
        username: decoded.username,
        uuid: uuid.v1()
    }, TOKEN.ACCESS.KEY, {
        expiresInMinutes: TOKEN.ACCESS.EXPIRES
    });
    this.body = {
        accessToken: acecessToken,
        expiresInMinutes: TOKEN.ACCESS.EXPIRES
    }
});


module.exports = router.middleware();
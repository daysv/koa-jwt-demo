var Router = require('koa-router');
var router = new Router();
var auth = require('../modules/auth');

var jwt = require('jsonwebtoken');
var TOKEN = require('../config').TOKEN;
var uuid = require('node-uuid');

/**
 * 令牌权限验证
 */
router.get('/authentication', function *() {
    var username = (yield auth()).username;
    this.body = {
        status:'success',
        username :username
    }
});

/**
 * 用户登录
 */
router.post('/authentication', function *() {
    var username = this.request.body.username;
    var password = this.request.body.password;
    if (username == 1 && password == 1) {
        var acecessToken = jwt.sign({
            seed: Math.random(),
            username: username,
            uuid: uuid.v1()
        }, TOKEN.ACCESS.KEY, {
            expiresInMinutes: TOKEN.ACCESS.EXPIRES
        });
        var refreshToken = jwt.sign({
            seed: Math.random(),
            username: username,
            uuid: uuid.v1()
        }, TOKEN.REFRESH.KEY, {
            expiresInMinutes: TOKEN.REFRESH.EXPIRES
        });

        this.status = 200;
        this.body = {
            tokenType: 'Bearer',
            expiresInMinutes: TOKEN.ACCESS.EXPIRES,
            accessToken: acecessToken,
            refreshToken: refreshToken
        }
    } else {
        this.throw(401, 'Incorrect token');
    }
});


module.exports = router.middleware();
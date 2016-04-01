var cert = require('../config').TOKEN.ACCESS.KEY;
var jwt = require('jsonwebtoken');

/**
 * 权限认证
 * 需要请求表头附带 Authorization: Bearer <token> 信息进行权限认证
 */
module.exports = () => {
    return function*(next) {
        var header = this.header;
        if (header) {
            var parts = header.authorization.split(' ');
            if (parts.length == 2) {
                var scheme = parts[0];
                var credentials = parts[1];
                if (scheme.toUpperCase() === 'BEARER') {
                    var token = credentials;
                } else {
                    this.throw(401, "Bad Authorization header format. Format is 'Authorization: Bearer <token>'");
                }
            } else {
                this.throw(401, "Bad Authorization header format. Format is 'Authorization: Bearer <token>'");
            }
        } else {
            this.throw(401, 'No Authorization header found');
        }
        try {
            var decoded = jwt.verify(token, cert);
        } catch (err) {
            return this.throw(401, 'Incorrect token');
        }
        if (typeof next === 'object') {
            return yield next;
        } else {
            return yield decoded;
        }
    };
};


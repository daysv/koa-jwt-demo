var log4js = require('log4js');
var LOGGER = require('../config').LOGGER;

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/response.log'), 'response');

var log = log4js.getLogger('response');
log.setLevel(LOGGER.LEVEL);

module.exports = function *(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    var status = this.response.status;
    if(status <400){
        log.info('%s %s %s - %sms', this.method, this.response.status, this.url, ms);
    }else{
        log.warn('%s %s %s - %sms', this.method, this.response.status, this.url, ms);
    }
};
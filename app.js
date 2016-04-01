/**
 * Created by daysv on 2015/9/30.
 */

var app = require('koa')();
var log4js = require('log4js');
var CONFIG = require('./config');
var mount = require('koa-mount');
var bodyparser = require('koa-bodyparser');

app.name = CONFIG.NAME;

// 日志记录
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/info.log'));
global.log = log4js.getLogger();
log.setLevel(CONFIG.LOGGER.LEVEL);

// 记录件
app.use(require('./modules/logger'));

//错误处理
app.use(function *(next) {
    try {
        yield next;
    } catch (err) {
        if (401 == err.status) {
            this.status = err.status || 500;
            this.body = {msg: err.message};
            log.error(err.message)
        } else {
            this.status = err.status || 500;
            this.body = {msg: 'server error'};
            this.app.emit('error', err)
        }
    }
});


app.use(bodyparser({
    onerror: (err, ctx) => {
        ctx.throw('body parse error', 422);
    }
}));

// 路由
app.use(mount('/api', require('./routes/authentication')));
app.use(mount('/api', require('./routes/token')));


app.on('error', (err)=> {
    log.error(err);
});

process.on('uncaughtException', (err) => {
    log.fatal('Caught exception: ' + err);
});


app.listen(CONFIG.KOA.PORT, ()=> {
    log.info('Listen on ' + CONFIG.KOA.PORT);
    log.info('This platform is ' + process.arch + ' ' + process.platform + ' pid:' + process.pid + ', node version ' + process.version);
    log.info('Starting time: ' + process.uptime() + 's');
});

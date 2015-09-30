module.exports = {
    NAME: '',
    LOGGER: {
        LEVEL: '' // 日志记录等级
    },
    KOA: {
        PORT: 80
    },
    TOKEN:{
        ACCESS:{
            KEY:'test',
            EXPIRES: 24*60
        },
        REFRESH:{
            KEY:'test',
            EXPIRES: 24*60
        }
    }
};
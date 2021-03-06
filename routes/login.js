var express = require('express');
var pool = require('../util/pool').pool;
var md5 = require('../util/md5');
var router = express.Router();
var log = require('log4js').getLogger("登录");

// 'UPDATE users SET foo = ?, bar = ?, baz = ? WHERE id = ?', ['a', 'b', 'c', userId], functio

var sql_login = 'select count(*) as num from `bg_user` where `username` = ? and `password` = ?';
var sql_update_token = 'update `bg_user` set `token` = ? where `username` = ?';
router.post('/', (req, res, next) => {
    var username = req.body.username;
    var password = md5.get(req.body.password);
    pool.query(sql_login, [username, password], function(err, rows, fields) {
        if (err) {
            log.error(err);
        };
        var user_num = rows && rows[0].num;
        var tips = ['用户名或密码不正确', '登录成功'];
        var data = {
            status: user_num,
            msg: tips[user_num] || '账户异常'
        };

        if (user_num === 1) {
            data.token = md5.get(username+(new Date).getTime());
            res.cookie('token', data.token, { maxAge: 7*24*60*60*1000,path: '/'});
            pool.query(sql_update_token, [data.token,username],function(err,results){
                if (err) {
                    log.error(err);
                };
            });
        }
        res.json(err || data);
    });
});

module.exports = router;

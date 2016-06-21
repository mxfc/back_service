var express = require('express');
var router = express.Router();
var log = require('log4js').getLogger("推广模块");

var md5 = require('../util/md5');
var promoter = require('../module/promoter');

router.get('/query',(req,res,next) => {
    log.debug("查询");
    promoter.query(function(data){
        res.json(data);
    });
});

router.get('/insert',(req,res,next) => {
    promoter.insert(function(data){
        res.json(data);
    },{
        name: 'testname',
        phone: '18501225532',
        username: 'hahahha',
        password: md5.get('123456')
    });
});

module.exports = router;
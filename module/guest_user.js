var pool = require('../util/pool').pool;

var sql_insert = 'insert into bg_vip_user set ?';
var sql_remove = 'update bg_vip_user set status=0 where id =?';
var sql_modify = 'update bg_vip_user set ? where id =?';
var sql_query = 'select * from bg_vip_user where status=1';
var sql_queryOne = 'select id,alipay,can_withdraw,uid,name,type,fans_num,fee_date,fee_per,fee_other,pid,pname,DATE_FORMAT(createdAt,"%Y-%m-%d %H:%i:%s") as createdAt,DATE_FORMAT(updatedAt,"%Y-%m-%d %H:%i:%s") as updatedAt from bg_vip_user where status=1 and id = ?';
var sql_queryByUid = 'select * from bg_vip_user where status=1 and uid = ?';

// 增
function insert(fn,obj){
    pool.query(sql_queryByUid, obj.uid, function(err, rows, fields) {
        if(err){
            fn({status: 3,msg: "数据库添加失败。",data: err});
        }else if(rows.length !== 0){
             fn({status: 3,msg: "请勿重复增加。"});
        }else{
            pool.query(sql_insert, obj,function(err, result) {
                if(err){
                    fn({status: 3,msg: "数据库添加失败。",data: err});
                }else{
                    fn({status: 1,msg: "添加成功。",data: (result && result.insertId)});
                }
            });
        }
    });
}
// 删
function remove(fn,id){
    pool.query(sql_remove, id,function(err, result) {
        if(err){
            fn({status: 3,msg: "数据库删除失败。",data: err});
        }else{
            fn({status: 1,msg: "删除成功。",data: result});
        }
    });
}
// 改
function modify(fn,obj){
    var id = obj.id;
    delete obj.id;

    for(var item of Object.keys(obj)){
        obj[item]==='' && (obj[item] = null);
    }
    pool.query(sql_modify, [obj,id],function(err, result) {
        if(err){
            fn({status: 3,msg: "数据库修改失败。",data: err});
        }else{
            fn({status: 1,msg: "修改成功。",data: result});
        }
    });
}

var typeObj = {
    anchor:'主播',
    microblog:'微博',
    team:'推广团队',
    wechat:'微信',
    person:'个人',
    other:'其他'
};
var dateObj = {
    day: {
        info: '日',
        cls: 'success'
    },
    week: {
        info: '周',
        cls: 'primary'
    },
    month: {
        info: '月',
        cls: 'magenta'
    }
};
// 查全部
function query(fn,pid){
    function afterQueryFn(err, rows, fields) {
        if(err){
            fn({status: 3,msg: "数据库查询失败。",data: err});
        }else{
            fn({status: 1,msg: "查询成功。",data: renderRows(rows)});
        }
    }
    if(pid){
        pool.query(sql_query + " and pid = ?", pid, afterQueryFn);
    }else{
        pool.query(sql_query, afterQueryFn);
    }
}
// 查单个
function queryOne(fn,id){
    var send_data = {
        status: 1,
        msg: "查询成功",
    };
    pool.query(sql_queryOne, id, function(err, rows, fields) {
        if(err){
            send_data.status = 3;
            send_data.msg = "数据库查询失败。";
            send_data.err = err;
        }else if(rows.length !== 1){
            send_data.status = 2;
            send_data.msg = "数据异常。";
        }else{
            send_data.data = renderRows(rows);
        }
        fn && fn(send_data);
    });
}

function renderRows(rows){
    var data = [];
    if(rows && rows.length){
        data = rows.map(n => {
            // 转类别描述
            n._type = n.type;
            n.type = typeObj[n.type];

            //拼接费用描述
            var fee_date = n.fee_date.split('_');
            var _date_obj = dateObj[fee_date[0]];
            var pay_html = '(按<span class="accent_'+_date_obj.cls+'">'+_date_obj.info+'</span>)';
            if(+fee_date[1]){
                pay_html += '<br>每次<span class="accent_danger big">'+fee_date[1]+'</span>元';
            }
            if(+n.fee_per){
                pay_html += '<br>每个<span class="accent_danger big">'+n.fee_per+'</span>元';
            }
            if(n.fee_other){
                pay_html += '<br>' + n.fee_other;
            }
            n.pay = pay_html;

            // 拼接已付描述
            n._fans_num = n.fans_num;
            n.fans_num = n.fans_num || "无记录";

            return n;
        });
    }
    return data;
}
module.exports = {
    insert: insert,
    remove: remove,
    modify: modify,
    query: query,
    queryOne: queryOne
};
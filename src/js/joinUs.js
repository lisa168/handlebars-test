var Handlebars = require('handlebars-template-loader/runtime');
var index = require('../templates/joinUs.hbs');

var json = {
    msg1:'你好',
    msg2:'我是模块二',
    msg3:'我是模块三'
}
$('#content').html(index(json));

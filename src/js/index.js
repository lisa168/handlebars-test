var Handlebars = require('handlebars-template-loader/runtime');
var index = require('../templates/index.hbs');
var header = require('../templates/common/header.hbs');
var common = require('./utils/common.js');
var json = {
    msg1:'我是模块一',
    msg2:'我是模块二',
    msg3:'我是模块三'
}
$('.header').html(header);
$('#content').html(index(json));
common.headLink();
$('.module1').on('click',function (){
    alert(2222)
});



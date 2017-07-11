/**
 * 开发环境全局变量配置
 * 优化点：
 *  通过postcss自动添加css前缀
 *  添加了发布代码前js语法检测eslint
 */

var path = require('path');
var ip = require('ip');
var hostname = ip.address(); //'30.96.225.56' 或 'localhost';建议不设置localhost,阿里郎加速时，不能访问
var basePort = 3000;
module.exports = {
  //通用配置
  common: {
    publicPath: './',
    outpath: path.resolve(__dirname, '../public'), //项目输出目录
    htmlPath: path.resolve(__dirname, '../src/*.html'), //html文件路径
    jsPath: path.resolve(__dirname, '../src/js/*.js'), //多入口js目录
    cssDir: path.resolve(__dirname, '../src/css'), //css目录
    scssDir: path.resolve(__dirname, '../src/css/scss'), //css目录
    lessDir: path.resolve(__dirname, '../src/css/less') //css目录
  },
  //发布环境配置
  publish: {
    publicPath: './',
    outpath: path.resolve(__dirname, '../dist') //项目输出目录
  },
  //预发版本
  daily: {
    publicPath: './',
    outpath: path.resolve(__dirname, '../daily') //项目输出目录
  },
  //开发环境配置
  dev: {
    basePort: basePort,
    hostname: hostname,
    publicPath: 'http://' + hostname + ":" + basePort + '/',
    outpath: path.resolve(__dirname, '/'),
    proxyTable: {}
  },
  //哪些文件要提交公共js代码
  enableCommonChunks: false, //是否提取公共js
  commonChunks: ['product', 'order'] //要提取公共js的文件
};

/**
 * 开发环境构建工具
 * 支持端口检测
 */

const express = require('express');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const chalk = require('chalk');
const portfinder = require('portfinder');
const proxy = require('http-proxy-middleware');
const opn = require('opn');
var CONFIG = require('./config');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var webpackConfig = require('./webpack.config');
var app = express();

//本地代理配置
var proxyOptions = {
    target: 'http://localhost:8080/'
};


//本地可用端口检测
portfinder.basePort = CONFIG.dev.basePort;
portfinder.getPort(function (err, port) {
  webpackConfig = merge(webpackConfig, {
    output: {
      publicPath: 'http://' + CONFIG.dev.hostname + ':' + port + '/'
    }
  });

  for (var key in webpackConfig.entry) {
    webpackConfig.entry[key].unshift(hotMiddlewareScript);
  }
  var compiler = webpack(webpackConfig);

  app.use('/assets', express.static(path.resolve(__dirname, '../src/assets')));

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: CONFIG.dev.publicPath,
    stats: {
      colors: true
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log
  }));

  app.use('/web-serv', proxy(proxyOptions));


  //启用本地服务
  app.listen(port, CONFIG.dev.hostname, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(chalk.green('恭喜你，本地服务启动成功\n请在浏览器中输入：' + chalk.blue.underline.bold('http://' + CONFIG.dev.hostname + ':' + port + '/index.html') + ' 访问demo页！'));
    //自动打开浏览器
    opn('http://' + CONFIG.dev.hostname + ':' + port + '/index.html');
  });
});

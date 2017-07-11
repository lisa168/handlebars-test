/**
 * webpack生产环境配置
 * 优化点：
 *  自动切换环境变量配置
 *  通过postcss自动添加css前缀
 *  添加了发布代码前js语法检测eslint
 */

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlwebpackPlugin = require('html-webpack-plugin');
var glob = require("glob");
var merge = require('webpack-merge');
var autoprefixer = require('autoprefixer');
var CompressionPlugin = require("compression-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
//设置最大注册事件数
require('events').EventEmitter.prototype._maxListeners = 500;

var CONFIG = require('./config');
//环境变量（区分开发环境和测试环境）
var debug = ('development' === process.env.NODE_ENV) || ('tests' === process.env.NODE_ENV);
var loaders = [];
var plugins = [];
//cssloader处理
function handleCssLoaders(options) {
  options = options || {};
  // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!');

    if (true) {
      return ExtractTextPlugin.extract('style-loader', sourceLoader)
    } else {
      return ['style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    scss: generateLoaders(['css', 'sass'])
  }
}
//多入口获取
function getEntry(globPath) {
  var files = glob.sync(globPath);
  var entries = {},
    entry, dirname, basename, extname;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry); //获取目录名
    extname = path.extname(entry);//获取扩展名
    basename = path.basename(entry, extname); //文件名
    entries[basename] = [entry];
  }
  //提取公共vender
  //entries['vendor'] = ['zepto'];
  return entries;
}
var entries = getEntry(CONFIG.common.jsPath);
var chunks = Object.keys(entries);
var webpackconfig = {
  //打包入口
  entry: entries,
  //输出配置
  output: {
    publicPath: 'development' === process.env.NODE_ENV ? CONFIG.dev.publicPath : ('daily' === process.env.NODE_ENV ? CONFIG.daily.publicPath : CONFIG.publish.publicPath),
    path: 'development' === process.env.NODE_ENV ? CONFIG.dev.outpath : ('daily' === process.env.NODE_ENV ? CONFIG.daily.outpath : CONFIG.publish.outpath),
    filename: 'js/[name].js',
    libraryTarget:'umd' //控制js类型，amd,commonjs,commonjs2
  },
  devtool: 'development' === process.env.NODE_ENV ? 'eval' : '',
  resolve: {
    extensions: ['', '.js','.scss','.vue','.css'], //开启后缀名的自动补全,你现在可以使用 ``require('file')`` 来代替 ``require('file.js')`` 。
    alias: {
      zepto: require.resolve('../src/js/libs/zepto.js'),
      vue: require.resolve('../src/js/libs/vue.js'),
      'vue-resource': require.resolve('../src/js/libs/vue-resource.js'),
      'vue-router': require.resolve('../src/js/libs/vue-router.js'),
      'vuex': require.resolve('../src/js/libs/vuex.js'),
      config: require.resolve('../src/js/config/config.js')
    }
  },
  module: {
    preLoaders: [],
    //配置loaders
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|libs/,
        loader: 'babel',
        /*query: {
         presets: ['es2015'],
         plugins: ['transform-runtime']
         }*/
      },
      //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源,比如你配置，attrs=img:src img:data-original处理图片懒加载
      {
        test: /\.html$/,
        loader: 'html',
        query: {
          attrs: ['img:src', 'img:data-original'],
          minimize: false //是否压缩html,
          //interpolate: 'require'
        }
      },
      //handlebars
      {
        test: /\.hbs$/,
        loader: "handlebars-template"
      },
      //vuejs
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      //加载第三方库
      {
        test: require.resolve('zepto'),
        loader: 'exports?window.$!script'
      }
    ]
  },
  // .vue的配置。需要单独出来配置
  vue: {
    loaders: {
      js: 'babel'
    }
  },
  postcss: [autoprefixer({browsers: ['last 3 versions', '> 1%']})],
  plugins: [
    //这个可以使zepto变成全局变量
    new webpack.ProvidePlugin({
      $: 'zepto'
    }),
    // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
    new webpack.optimize.DedupePlugin()
  ]


};
if (CONFIG.enableCommonChunks) {
  webpackconfig.module.loaders.push(
    //优化通用代码:默认会把所有入口节点的公共代码提取出来,生成一个vendor.js
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/vendor.js', //输出文件名，忽略则以name为输出文件的名字
      minChunks: 2,
      chunks: CONFIG.commonChunks //['product','order']
    }));
}
if ('development' === process.env.NODE_ENV) { //开发环境
  //配置css处理器
  webpackconfig.module.loaders.push(
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'url?limit=4096&name=images/[name].[ext]' //这里不能用‘/images’
      ]
    },
    {
      test: /\.css$/,
      loaders: ["style", "css", "postcss"],
      include: [
        path.resolve(__dirname, '../src/css')
      ]
    },
    {
      test: /\.scss$/,
      loaders: ["style", "css?sourceMap", "postcss", "sass?sourceMap"],
      include: [
        path.resolve(__dirname, '../src/css')
      ]
    },
    {
      test: /\.less$/,
      loaders: ["style", "css?sourceMap", 'postcss', 'less?sourceMap'],
      include: [
        path.resolve(__dirname, '../src/css')
      ]
    }
  );
  webpackconfig.plugins.push(
    //暴露全局变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      },
      'debug': debug
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
  //添加vue loader配置项
  webpackconfig['vue']['loaders'] = merge(webpackconfig.vue.loaders, {
    css: 'style!css?sourceMap!postcss',
    less: 'style!css?sourceMap!postcss!less?sourceMap',
    scss: 'style!css?sourceMap!postcss!sass?sourceMap',
    sass: 'style!css?sourceMap!postcss!sass?sourceMap'
  })
} else if ('daily' === process.env.NODE_ENV) { //预发版本（供本地测试用）
  webpackconfig.module.loaders.push(
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'url?limit=4096&name=images/[name].[ext]', //这里不能用‘/images’内联小于8k的用base64图片，其他的直接使用URL
        'img?minimize'
      ]
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss", {
        publicPath: '../'
      }),
      include: [
        CONFIG.common.cssDir
      ]
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss!sass", {
        publicPath: '../'
      }),
      include: [
        CONFIG.common.cssDir
      ]
    },
    {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss!less", {
        publicPath: '../'
      }),
      include: [
        CONFIG.common.cssDir
      ]
    }
  );

  webpackconfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      'debug': debug
    }),
    //独立出css样式
    new ExtractTextPlugin("css/[name].css"),
    //js压缩
    // new webpack.optimize.UglifyJsPlugin({
    //     compress : {
    //         warnings : false
    //     }
    // }),
    //copy页面中使用绝对地址的图片
    new CopyWebpackPlugin([
      {
        from: './src/images/page',
        to: './images/page'
      }
    ])
  );

  webpackconfig.module.preLoaders.push({
    test: /\.js$/,
    loader: 'eslint',
    exclude: /node_modules/
  });
  webpackconfig['eslint'] = {
    "failOnWarning": false,
    "failOnError": true
  };
  // webpackconfig['imagemin'] = {
  //     gifsicle: { interlaced: false },
  //     jpegtran: {
  //         progressive: true,
  //         arithmetic: false
  //     },
  //     optipng: { optimizationLevel: 5 },
  //     pngquant: {
  //         floyd: 0.5,
  //         speed: 2
  //     },
  //     svgo: {
  //         plugins: [
  //             { removeTitle: true },
  //             { convertPathData: false }
  //         ]
  //     }
  // };
  //添加vue loader配置项
  webpackconfig['vue']['loaders'] = merge(webpackconfig.vue.loaders, {
    css: ExtractTextPlugin.extract('style', 'css!postcss', {
      publicPath: '../'
    }),
    less: ExtractTextPlugin.extract('style', 'css!postcss!less', {
      publicPath: '../'
    }),
    sass: ExtractTextPlugin.extract('style', 'css!postcss!sass', {
      publicPath: '../'
    }),
    scss: ExtractTextPlugin.extract('style', 'css!postcss!sass', {
      publicPath: '../'
    })
  });

} else {  //测试环境、生产环境
  webpackconfig.module.loaders.push(
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'url?limit=4096&name=images/[name].[ext]', //这里不能用‘/images’内联小于8k的用base64图片，其他的直接使用URL
        'img?minimize'
      ]
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss", {
        publicPath: '../'
      }),
      include: [
        CONFIG.common.cssDir
      ]
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss!sass", {
        publicPath: '../'
      }),
      include: [
        CONFIG.common.cssDir
      ]
    },
    {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract("style", "css!postcss!less", {
        publicPath: '../'
      }),
      include: [
        CONFIG.common.cssDir
      ]
    }
  );

  webpackconfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      'debug': debug
    }),
    //独立出css样式
    new ExtractTextPlugin("css/[name].css"),
    //js压缩
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    //copy页面中使用绝对地址的图片（这个插件会拷贝此目录下所有文件，要过渡掉.开头的文件及文件夹）
    new CopyWebpackPlugin([
      {
        context: './src/assets/',
        from: {
          glob: '**/*',
          dot: false //过滤到以.开头的文件（重要）
        },
        to: './assets'
      }
    ])
  );
  //gzip压缩
  if (CONFIG.publish.productionGzip) {
    webpackconfig.plugins.push(
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
    )
  }

  webpackconfig.module.preLoaders.push({
    test: /\.js$/,
    loader: 'eslint',
    exclude: /node_modules/
  });
  webpackconfig['eslint'] = {
    "failOnWarning": false,
    "failOnError": true
  };
  webpackconfig['imagemin'] = {
    gifsicle: {interlaced: false},
    jpegtran: {
      progressive: true,
      arithmetic: false
    },
    optipng: {optimizationLevel: 5},
    pngquant: {
      floyd: 0.5,
      speed: 2
    },
    svgo: {
      plugins: [
        {removeTitle: true},
        {convertPathData: false}
      ]
    }
  };
  //添加vue loader配置项
  webpackconfig['vue']['loaders'] = merge(webpackconfig.vue.loaders, {
    css: ExtractTextPlugin.extract('style', 'css!postcss', {
      publicPath: '../'
    }),
    less: ExtractTextPlugin.extract('style', 'css!postcss!less', {
      publicPath: '../'
    }),
    sass: ExtractTextPlugin.extract('style', 'css!postcss!sass', {
      publicPath: '../'
    }),
    scss: ExtractTextPlugin.extract('style', 'css!postcss!sass', {
      publicPath: '../'
    })
  });


}
//生成html
var pages = Object.keys(getEntry(CONFIG.common.htmlPath));
pages.forEach(function (pathname) {
  var conf = {
    filename: pathname + '.html', //生成的html存放路径，相对于path
    template: './src/' + pathname + '.html', //html模板路径
    inject: false,    //js插入的位置，true/'head'/'body'/false
    /*
     * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
     * 如在html标签属性上使用{{...}}表达式，所以很多情况下并不需要在此配置压缩项，
     * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
     * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
     */
    minify: { //压缩HTML文件
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: false //删除空白符与换行符
    }
  };
  if (pathname in webpackconfig.entry) {
    conf.inject = 'body';
    //根据配置文件来判断是否需要引入公用库
    if (CONFIG.commonChunks.indexOf(pathname) > -1) {
      conf.chunks = ['vendor', pathname];
    } else {
      conf.chunks = [pathname];
    }
    //conf.chunks = ['vendor', pathname];
    //conf.hash = true;
  }
  webpackconfig.plugins.push(new HtmlwebpackPlugin(conf));
});

module.exports = webpackconfig;

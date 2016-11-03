/*
  Webpack configuration file for CMS
  Latest modified: 2016-11-03 18:13
*/

var path = require('path');
var findRoot = require('find-root');
var HtmlWebpackPlugin = require('html-webpack-plugin'); 
var ExtractTextPlugin = require('extract-text-webpack-plugin');

/* The root path of this tool */
var Root = findRoot();

/* The path of development directory */
var srcRoot = path.join( Root, 'src' );

/* Since '__dirname' is the directory that the currently executing script resides in, */
/* that this directory name also is the name of the current project, */
/* assuming the current webpage is an isolate project. */
var projectRootName = path.basename(__dirname);

/* Fetch the global configuration object that you customized for the whole website */
var config = require( path.join(Root, 'config.json') );

/* Set paths for the distribution */
var distPath = path.join(Root, config.websiteRoot); 

/* Paths of static files are just under the website root */
var cssPath = path.join(Root, config.websiteRoot, config.styleRoot);
var jsPath = path.join(Root, config.websiteRoot, config.scriptRoot);
var imgPath = path.join(Root, config.websiteRoot, config.imagesRoot);

/* Path of directory in where global templates are, like header&footer */
var templatePath = path.join(srcRoot, 'templates');

/* Public templates, header & footer 
var publicHeader = require(path.join(templatePath, 'header.hbs'));
var publicFooter = require(path.join(templatePath, 'footer.hbs'));
var pubTemplates = [ publicHeader, publicFooter ];

/* Path of i18n json files for this project: */
var jsonPath = path.join(srcRoot, 'i18n', projectRootName);

/* All languages that this project supported: */
var langs = require( jsonPath + '/langs.json').langs;

/* Default properties for the final index page of this project */
var htmlDefaultOptions = {
  template: projectRootName + '.ejs',
  pagename: projectRootName,
  //extraFiles: pubTemplates,
  //extraFiles: require('./header.ejs'),
  inject: 'body'
};

/* Traversal of langs, creating plugins array */
var pluginsArray = [];
langs.map(function( lang, index ){
  var _mergedOptions = {};
  var _langJsonFile = lang + '.json';
  var _htmlOptions = require( path.join(jsonPath, _langJsonFile) );
  var _fileNameObj = {filename: path.join(distPath, lang, projectRootName, 'index.html')};
  var _langObj = {language: lang};
  Object.assign(_mergedOptions, htmlDefaultOptions, _fileNameObj, _langObj, _htmlOptions);
  var _htmlWebpackPlugin = new HtmlWebpackPlugin(_mergedOptions);
  pluginsArray.push( _htmlWebpackPlugin );
});

/* After traversal, add CSS */
// pluginsArray.push(new ExtractTextPlugin( projectRootName + '.css'));

/* Here comes the module to export! */
module.exports = {
  entry: './index.js',
  output: {
    filename: projectRootName + '.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.png$/, loader: 'file-loader' },
      { test: /\.ejs$/, loader: 'ejs-loader' }
      // { test: /\.html$/, loader: 'html-loader' }
      /* To make the variables in template files enable, here pattern must be '.handlebars' */
      // { test: /\.handlebars$/, loader: 'handlebars-loader' }
    ]
  },
  plugins: pluginsArray
};


'use strict';

var path = require('path');
var express = require('express');
var lodash = require('lodash');
var proxy = require('http-proxy-middleware');

var pathMappings = [
  {
    path: '/',
    dir: 'app'
  },
  {
    path: '/bower_components',
    dir: 'bower_components'
  },
  {
    path: '/g/public',
    url: 'https://app.tipodev.com/app'
  },
  {
    path: '/public',
    url: 'https://app.tipodev.com/app'
  },
  {
    path: '/api',
    //url: 'http://localhost:9001'
    //url: 'https://app.billionbases.com/dev'
    //url: 'https://dev.tipotapp.com/2000000001.1000000001.raj@tipotapp.com/2000000001'
    //url: 'https://dev.tipotapp.com/2000000001.1000000001.prasad.sid@deltagene.com/2000000002'
    url: 'https://dev.tipotapp.com'
  }
];

var proxyConfig = {
  forward: {}
};

var app = express();

lodash.each(pathMappings, function(mapping){
  if(mapping.dir){
    app.use(mapping.path, express.static(path.resolve(__dirname, mapping.dir)));
  }else if(mapping.url){
    app.use(mapping.path, proxy({target: mapping.url, changeOrigin: true}));
  }
});

module.exports = app;

#!/usr/bin/env node
var hogan = require('hogan.js')
  , fs    = require('fs')
  , cjson = require('cjson') 
  , prod  = process.argv[2] == 'production'
  , title = 'Alibaba Druid'
  , langDefault = "zh-CN"
  , langChoose = process.argv[3] || langDefault
  , count = 0

console.log("translate to language:" + langChoose)

red   = '\033[31m';
blue  = '\033[34m';
reset = '\033[0m';

var language = cjson.load(__dirname + '/languages/'+langChoose+'.json')
  , pages = fs.readdirSync(__dirname + '/templates/pages')
  , template = fs.readFileSync(__dirname + '/templates/layout.mustache', 'utf-8'),

context = {
     name: "Layout",
     title: title,
     _i: function (k) { 
       if (language[context.name][k]) {
        return language[context.name][k]  
       } else {
         console.log(blue + 'Missing translation in Layout for: ' + red + k + reset);
         count++
         return k
       } 
     }  
  }
template = hogan.compile(template,{sectionTags: [{o: '_i', c: 'i'}]})
var translated_keys = {}
  , keys = {}

pages.forEach(function(name){
  
  var nicename = name
    .replace(/\.mustache/, '')
    .replace(/\-.*/, '')
    .replace(/(.)/, function ($1) { return $1.toUpperCase() })
  var page = fs.readFileSync(__dirname  + '/templates/pages/' + name, 'utf-8')
    , page_context = {}
  page_context[name.replace(/\.mustache$/, '')] = 'active'
  page_context.production = prod
  page_context.title = nicename,
  page_context.name = nicename,
  page_context._i = function (k) { 
      if(language['Pages']) {
        if (language['Pages'][k]) {
          return language['Pages'][k]  
        } else {
          console.log(blue + 'Missing translation in page '+ nicename +' for: ' + red + k + reset)
          count++
          translated_keys['Pages'] = {}
          keys[k] = ""
          translated_keys['Pages'] = keys
          return k
        }
      } else {
        console.log(red + "missing key for "+ name +": " + k + reset);
      }
   } 
  if (page_context.title == 'Index') {
    page_context.title = title
  } else {
    page_context.title += ' · ' + title
  }
  page = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] })
  page = page.render(page_context)
  full_page = template.render(context, {
    body: page,
  })
  if(langChoose == langDefault) {
    fs.writeFileSync(__dirname + '/../' + name.replace(/mustache$/, 'html'), full_page, 'utf-8')
  } else {
    fs.writeFileSync(__dirname + '/../' + langChoose + '/' + name.replace(/mustache$/, 'html'), full_page, 'utf-8')
  }
})
fs.writeFileSync(__dirname + '/languages/template.json', JSON.stringify(translated_keys), 'utf-8')
console.log("The json from missing translation files:" + JSON.stringify(translated_keys))
console.log("There's  "+ count +" words for translate");

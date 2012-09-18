#!/usr/bin/env node
var hogan = require('hogan.js')
  , fs    = require('fs')
  , cjson = require('cjson') 
  , prod  = process.argv[2] == 'production'
  , title = 'Alibaba Druid'
  , lang_default = "zh-CN"
  , lang_choose = process.argv[3] || lang_default
  , count = 0

console.log("translate to language:" + lang_choose)

red   = '\033[31m';
blue  = '\033[34m';
reset = '\033[0m';

var language = cjson.load(__dirname + '/languages/'+lang_choose+'.json')
  , pages = fs.readdirSync(__dirname + '/templates/pages')
  , template = fs.readFileSync(__dirname + '/templates/layout.mustache', 'utf-8'),

layout_context = {
  name: "Layout",
  title: title,
  _i: function (k) {
    if (language[layout_context.name][k]) {
      return language[layout_context.name][k]
    } else {
      console.log(blue + 'Missing translation in Layout for: ' + red + k + reset);
      count++
      return k
    } 
  }  
}
template = hogan.compile(template, {sectionTags: [{o: '_i', c: 'i'}]})
var translated_keys = {}
  , keys = {}

pages.forEach(function(name){
  
  var nicename = name
    .replace(/\.mustache/, '')
//    .replace(/\-.*/, '')
    .replace(/(.)/, function ($1) { return $1.toUpperCase() })
  var page = fs.readFileSync(__dirname  + '/templates/pages/' + name, 'utf-8')
    , page_context = {}  
  page_context.name = nicename
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
  layout_context.production = prod
  layout_context[name.replace(/\.mustache$/, '')] = 'active'
  layout_context.title = nicename
  if (layout_context.title == 'Index') {
    layout_context.title = title
  } else {
    layout_context.title += ' · ' + title
  }
  page = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] })
  page = page.render(page_context)
  full_page = template.render(layout_context, {
    body: page,
  })
  // after render, make item to '' for next loop. just for header.
  layout_context[name.replace(/\.mustache$/, '')] = ''
  var rootpath = __dirname + '/../'
  if (lang_choose == lang_default) {
    fs.writeFileSync(rootpath + name.replace(/mustache$/, 'html'), full_page, 'utf-8')
  } else {
    var specpath = rootpath + lang_choose + '/'
    // make directory for spec language
    if (!fs.existsSync(specpath)) {
      fs.mkdirSync(specpath)
    }
    fs.writeFileSync(specpath + name.replace(/mustache$/, 'html'), full_page, 'utf-8')
  }
})
fs.writeFileSync(__dirname + '/languages/template.json', JSON.stringify(translated_keys), 'utf-8')
console.log("The json from missing translation files:" + JSON.stringify(translated_keys))
console.log("There's  "+ count +" words for translate");

// tools for development only
// SVG: https://github.com/ben-eb/metalsmith-svgo

var metalsmith = require('metalsmith')
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown')
var sass = require('metalsmith-sass')
var browserSync = require('metalsmith-browser-sync')
var ignore = require('metalsmith-ignore')
var htmlMinifier = require('metalsmith-html-minifier')
var layouts = require('metalsmith-layouts')
var uglify = require('metalsmith-uglify')
var autoprefixer = require('metalsmith-autoprefixer')
var sitemap = require('metalsmith-sitemap')
var robots = require('metalsmith-robots')
var config = require('./config')
var clear_collections = require("./clear-collections"); //  metalsmith-collection dublication bug workaround

var fs = require('fs');

metalsmith(__dirname)
  .metadata({
    sitename: config.site_title,
    siteurl: config.dev_siteurl,
    style_sheet: config.style_sheet,
    googleanalytics: config.google_analytics_key,
    facebook_appid: config.facebook_appid,
    siteurl_fb_img: config.prod_siteurl_fb_img
  })
  .source('src')
  .destination('build')
  .clean(true)
  .use(markdown())
  .use(clear_collections(["default"])) //metalsmith-collection dublication bug workaround
  .use(collections({  // Used for navigation purposes
    default: {
      pattern: 'default/*.md',
      refer: false, // skip adding the "next" and "previous" links to your articles
      // sortBy: 'title',
      // reverse: true
    }
  }))
  // .use( function(files, ms, done){
  //   // console.log('MS: ', ms.)
  //   // console.log('files: ', files)
  //   done()
  // })
  .use(layouts({
    engine: 'pug',
    directory: 'layouts',
  }))
  .use(sass({ // Options https://github.com/sass/node-sass
    outputDir: 'css',
    outputStyle: 'expanded', //Values: nested, expanded, compact, compressed
    includePaths: ['sass', 'sass/partials']
  }))
  .use(autoprefixer())
  .use(browserSync({
    server: 'build',
    browser: ['chrome'],
    // browser: ["chrome", "iexplore", "firefox"]
    files: ['src/**/*.scss', 'src/**/*.md', 'layouts/**/*.pug', 'src/**/*.js']
  }))
  // .use(uglify())
  // .use(htmlMinifier({
  //   minifierOptions: {
  //     removeComments: true,
  //     removeAttributeQuotes: false
  //   }
  // }))
  // .use(sitemap({ // https://www.npmjs.com/package/metalsmith-sitemap
  //   hostname: config.dev_siteurl,
  //   lastmod: Date()
  // }))
  // .use(robots({ // https://www.npmjs.com/package/metalsmith-robots
  //   useragent: '*',
  //   allow: '/',
  //   disallow: ['404.html'],
  //   sitemap: config.dev_siteurl + '/sitemap.xml'
  // }))
  // .use(ignore(['**/*']))
  .build(function (err) {
    if (err) throw err
  })

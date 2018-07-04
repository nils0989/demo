var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var router = express.Router();
var hbs = require('hbs');
var cons = require('consolidate');
var helpers = require('handlebars-helpers')(
  {handlebars: hbs}
);
var fs = require('fs');
let data;
app.use(cookieParser('wwww'));



app.set('view engine', 'hbs');
app.set('views', './views');
/**
 * 首页，显示欢迎信息，使用 handlebar 模板
 */
app.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome !!!', message: 'Please Log In',btn:'LogOn'});
});

/**
 * Logon
 */
var logon=fs.createReadStream("./mockData/logon.json",{
        flags: 'r',
        encoding: 'utf8',
        fd: null,
        mode: 0666,
        autoClose: true 
})



logon.on('error', function(err){
  console.log('error occured: %s', err.message);
});

logon.on('data', function(chunk){
  data=chunk;
});
/**
 * MarkDown
 */
router.get('/logon', function (req, res, next) {
  let dataObj=JSON.parse(data);
  console.log(data)
  if(req.query["name"] == dataObj['name'] && req.query["ps"] == dataObj['pwd']){
    res.render('logon', { title: 'Logon Success'});
  }else{
    res.render('error');
  }
});



// 没有挂载路径的中间件，通过该路由的每个请求都会执行该中间件
router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});


router.get('/user/:id', cookieParser('password123', {
  string: true
}));

// 将路由挂载至应用
app.use('/', router);


function errorHandler(err, req, res, next) {
  console.log('res.headersSent',res.headersSent)
  if (res.headersSent) {
    return next(err);
  }
  res.status(403);
  res.type({'Content-Type':'text/html'})
  res.render('error', { error: 403});
}

app.use(errorHandler);

var server = app.listen(3000, function (req,res) {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('Example app listening at http://%s:%s', host, port);
});

#!/usr/bin/env node

let port = process.argv[2];
let apiPrefixs = process.argv[3];
// let {exec} = require('child_process');
// let child  = exec('echo proxy-help '+name,(err,stdout,stderr)=>{
//     if(err) throw err;
//     console.info(stdout);
// });

// let ownPath = process.argv[4] || '/';
let proxyPath = process.argv[5] || '/';

// console.log(process.argv);

const Koa = require('koa');
const util = require('util');
const path = require('path');
const send = require('koa-send');
const parser = require('koa-body');
const Router = require('koa-router');
const router = module.exports = new Router();

const app = new Koa();

// 识别内嵌浏览器
app.use(async (ctx, next) => {
    // ctx.request.method === 'GET'
  console.log(apiPrefixs);
  console.log('url: ');
  console.log(ctx.request.url);
  if (ctx.request.url.startsWith(apiPrefixs)) {
      if(ctx.request.method === 'GET') {
        router.get(proxyPath + '12', async(ctx, next) => {
            let captcha = {};
            captcha = await service.getCaptcha(ctx).then(function(captcha) {
            return captcha;
            });
            ctx.body = ctx.render('templates/login.html', captcha);
        });
      } else if(ctx.request.method === 'POST') {
        router.get('/account/login', async(ctx, next) => {
            let captcha = {};
            captcha = await service.getCaptcha(ctx).then(function(captcha) {
            return captcha;
            });
            ctx.body = ctx.render('templates/login.html', captcha);
        });
      }
  }

  let agent = (ctx.headers['user-agent'] || '').toLowerCase();
  await next();
});

// 识别内嵌浏览器
app.use(async (ctx, next) => {
    router.get('/account/login', async(ctx, next) => {
        ctx.cookies.set('username','lisa',{
            domain:'/',
            path:'/',   //cookie写入的路径
            maxAge:1000*60*60*1,
            // expires:new Date('2018-07-06'),
            httpOnly:false,
            overwrite:false
        });
        ctx.body = {
            test: 12,
        };
    });
  await next();
});

// 指定静态文件路径
// app.use(async (ctx, next) => {
//   if (ctx.path.startsWith('/static/')) {
//     await send(ctx, ctx.path, {
//       root: 'app/',
//       maxage: 365 * 24 * 60 * 60,
//     });
//     return;
//   }
//   await next();
// });

// parse form
app.use(parser({
//   strict: false,
  jsonLimit: 1024 * 1024 * 2, // 2MB
  formLimit: 1024 * 1024 * 2, // 2MB
  textLimit: 1024 * 1024 * 2, // 2MB
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '../upload'),
  },
}));

// response
app.use(ctx => {
    ctx.cookies.set('username','lisa',{
        domain:'192.168.0.100',
        path:'/',   //cookie写入的路径
        maxAge:1000*60,
        // expires:new Date('2018-07-06'),
        httpOnly:false,
        overwrite:false
    });
  ctx.body = {
    w: 'test',
    y: 'done',
  };
});

// router.get('/account/login', async(ctx, next) => {
//     let captcha = {};
//     captcha = await service.getCaptcha(ctx).then(function(captcha) {
//       return captcha;
//     });
//     ctx.body = ctx.render('templates/login.html', captcha);
// });

app.listen(port, function () {
    console.info(`http://${getIPAdress()}:${port}`);
});


function getIPAdress() {
    let interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                // console.log(alias.address);

                return alias.address
            }
        }
    }
}

const http = require('http');
const Emitter = require('events');
const Stream = require('stream');
const context = require('./context');
const request = require('./request');
const response = require('./response');

class Koa extends Emitter{
    constructor(){
        super();
        this.middlewares = [];      //中间件集合
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
    }

    use(fn){
        this.middlewares.push(fn);      //将中间件存进中间件集合中
    }
    
    // 中间件执行机制
    compose(middlewares, ctx){
        function dispatch(index){
            if(index === middlewares.length) return Promise.resolve();
            let fn = middlewares[index];
            // 无论用户写的中间件是否为async函数，最后返回的都是一个promise
            return Promise.resolve(fn(ctx, () => dispatch(index + 1)));     //next实际是调用下一个中间件的函数
        }
        return dispatch(0);    //第一个中间件开始执行
    }

    // 生成ctx
    createContext(req, res){
        let ctx = this.context;             //ctx对象原型是context.js中暴露对象
        ctx.request = this.request;         //ctx.request对象原型是request.js中暴露对象
        ctx.response = this.response;       //ctx.response对象原型是response.js中暴露对象
        ctx.req = ctx.request.req = req;    //request对象中可用原生req
        ctx.res = ctx.response.res = res;   //response对象中可用原生res
        return ctx;
    }

    // http.createServer里的那个入口函数
    handleRequest(req, res){
        res.statusCode = 404;       //响应状态码默认404，如果ctx.body有值则会改变
        let ctx = this.createContext(req, res);
        let fn = this.compose(this.middlewares, ctx);

        // 响应
        fn.then(() => {     //等中间件执行完再响应
            if(typeof ctx.body === 'object'){   //如果ctx.body是个对象怎么响应输出
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify(ctx.body));
            }else if(ctx.body instanceof Stream){   //如果ctx.body是流怎么响应输出
                ctx.body.pipe(res);
            }else if(typeof ctx.body === 'string' || Buffer.isBuffer(ctx.body)){//如果ctx.body是字符串或buffer
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.end(ctx.body);
            }else{
                res.end('NOT FOUND');
            }
        }).catch(err => {       //错误处理，用于app.js中app.on('error', err => {})
            this.emit('error', err);
            res.statusCode = 500;
            res.end('server error');
        })
    }

    listen(...arg){
        const server = http.createServer(this.handleRequest.bind(this))
        server.listen(...arg);
    }
}

module.exports = Koa;
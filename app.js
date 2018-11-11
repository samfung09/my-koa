const Koa = require('./application');
const app = new Koa();

app.use((ctx, next) => {
    // res.end('hello world');
    // ctx.body = 'hello world sam'
    // console.log('ctx.request: ',ctx.request.url, ctx.request.path, ctx.request.query);
    // console.log('ctx: ', ctx.url, ctx.path, ctx.query);
    ctx.body = {name: 'Sam'};
    next();
    console.log('有回到了第一个中间件');
})

app.use(ctx => {
    console.log('来到了第二个中间件');
    ctx.body = 'lala';
})

app.listen(8888, () => {
    console.log('server listening on port 8888');
})
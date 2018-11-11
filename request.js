const url = require('url');

let request = {
    //用get访问器形式定义数据代理，url: this.req.url这种直接定义会报错，对象初始没有req.url
    get url(){ return this.req.url },
    get path(){ return url.parse(this.req.url).pathname },
    get query(){ return url.parse(this.req.url, true).query }
};

module.exports = request;
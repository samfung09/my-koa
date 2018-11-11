let context = {
    get url(){ return this.request.url },           //与request.js中url数据关联，只读
    get path(){ return this.request.path },         //与request.js中path数据关联，只读
    get query(){ return this.request.query },       //与request.js中query数据关联，只读
    get body(){ return this.response.body },        //与response.js中body数据关联，可读可写
    set body(value){ this.response.body = value }
};

module.exports = context;
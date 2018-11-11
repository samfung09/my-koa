let response = {
    get body(){ return this._body },
    set body(value){
        this.res.statusCode = 200;    //只要写了body，响应状态码就是200
        this._body = value;
    }
};

module.exports = response;
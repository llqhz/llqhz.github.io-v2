/*
* @description ll类库封装
* @Author: llqhz@qq.com
* @Last Modified time: 2018-07-24 10:56:26
* @responsity git@github.com:llqhz/llqhz.github.io.git
* @require JQuery layer
* @version 1.0.0 bata
*/
'use strict';

var ll = {
  data: {
    funlists: [],
  },
  /**
   * 封装ajax函数
   * @param  {object} opt ajax参数
   * @param  loading = [false,true,1,2] 使用layer loading加载框 默认 true
   * @param  handle => fun   处理ajax回调
   * @param  success/error => fun   处理ajax.code=0/1 的回调
   * @param  handle => fun   处理ajax回调
   */
  ajax: function(opt){
      if ( typeof opt.url == 'undefined' ) { console.log("ajax url not found ..."); return;  };
      if ( opt.loading !== false ) {
          var layerIndex = layer.load(opt.loading);
      };
      var req = { url: opt.url };
      req.method = opt.method || 'post';//请求类型
      req.dataType = opt.dataType || 'json';//接收数据类型
      if ( typeof opt.async != 'undefined' ) {
          req.async = opt.async;
      };
      if ( ll.isset(opt.data) ) {
         req.data = opt.data;
      };
      req.error = function(res){ layer.close(layerIndex);console.log("ajax error : ....."); console.log(res);};
      req.success = function(res){
            if ( opt.loading )
                layer.close(layerIndex);
            if ( typeof opt.handle=='function' ) {
                ll.exec(opt.handle,res);return;
            }
            if ( (parseInt(res.code)==1) && (typeof opt.success=='function')) {
                opt.success(res);
            } else {
                if ( (parseInt(res.code)==0) && (typeof opt.error=='function')) {
                  opt.error(res);
                }
            }
        }
      if ( ! (typeof opt.isFormData == 'undefined') ) {
          req.processData = false,
          req.contentType = false;
      };
      $.ajax(req);
  },
  // 获取表单内容FormData对象
  getFormData: function(selector){
    var fd = new FormData($(selector)[0]);
    return fd;
  },
  // 检测函数参数是否设置
  isset: function(obj){
      if ( typeof obj == 'undefined' ) {
          return false;
      } else {
          return true;
      }
  },
  // 加载页面
  reload: function(url){
    if ( typeof url == 'boolean' ) {
      window.location.reload(true);
    } else {
      window.location.href = url;
    }
  },
  /* 执行函数 */    // 如果是函数,则带参数执行, 并且支持返回值
  exec: function(fun,...args){  // 剩余参数
      if ( typeof fun == 'function' ) {
          var parms = '';
          for (var i = 0; i < args.length; i++) {
              parms += 'args['+i+'],';
          };
          parms = parms.substr(0,parms.length-1);  // 删除末尾多余的逗号
          var cmd = 'fun('+parms+');';
          return eval(cmd);   // 执行
      }
  },
  // 弹出object对象
  log: function(data){
    if ( typeof data == 'object' ) {
      alert(JSON.stringify(data,'',4));
    } else {
      alert(data);
    }
  }
};
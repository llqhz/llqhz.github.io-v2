/*
* @Description ll Web类库封装
* @Author: llqhz@qq.com
* @Created time: 2018-07-24 11:27:11
* @Last Modified time: 2018-07-25 18:16:16
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
    * @param  loading = [false,true,1,2] 使用layer loading加载框 默认 false
    * @param  handle => fun   处理ajax回调 tips: 用switch()处理res.code
    * @param  success/error => fun   处理ajax.code=0/1 的回调
    * @param  handle => fun   处理ajax回调
    */
    ajax: function(opt){
        if ( typeof opt.url == 'undefined' ) { console.log("ajax url not found ..."); return;  };
        if ( opt.loading ) {
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
        if ( typeof opt.isFormData != 'undefined' ) {
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
    },
    /**
     * 提交表单
     * @param  el: '#id'
     * @return other: {name:'inputname',val:'inputval or bolbfile',filename: }
     */
    submitForm:function(opt) {
        var fd = ll.getFormData(opt.el);
        if ( opt.other ) {
            $.each(other, function(index, val) {
                if ( val.filename ) {
                    fd.append(val.name,val.val,val.filename);
                } else {
                    fd.append(val.name,val.val);
                }
            });
        };
        opt.isFormData=true; opt.data=fd;
        ll.ajax(opt);
    },
    // 获取图片前端展示url
    getObjectURL: function (file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    },
    // 获取当前url地址
    getCurtUrl:function(){
        return window.location.href.replace(/#.*$/,'');
    },
    // 去除url参数 p: 参数
    trimArgus: function(p,url){
        var exp = 'var pt = /\\?'+p+'[=\\/]/',strrep = '';
        eval(exp);
        if ( pt.test(url) ) {
            strrep = '?';
        };
        var cmd = 'var patt = /[\/\?&]'+p+'[=|\/]([^$&\/]*)/';
        eval(cmd);
        url = url.replace(patt,strrep);
        return url.replace(/\?&/,'?');
    },
    /* 检测取值 */
    query:function(old,check){
        if ( typeof check != 'undefined' ) {
            old = check;    // 检测check的值 , 存在则取check的值
            return check;
        } else {
            return old;     // 不存在,取fun本身
        }
    },
    /**
     * {
     *     name:   { patt: '^.+', tips: '姓名不能为空' }
     *     mobile: { patt: '1[3-9]\\d+', tips: '姓名不能为空' }
     * }
     * @param  {[type]} rules  [description]
     * @param  {[type]} formId [description]
     * @return {[type]}        [description]
     */
    checkData: function(formId,rules){
        var defaultRules = {};
        if ( $.type(rules) === 'object' ) {
            $.extend(defaultRules,rules );
        }
        rules = defaultRules;
        var list = $(formId).serializeArray(),msg=true;
        $.each(list, function(index, li) {  // 循环取出表数据
            var key = li.name, val = li.value;
            if ( typeof rules[key] == 'object' ) {
                var patt = new RegExp(rules[key].patt);
                flag = patt.test(val);
                if ( !flag ) {
                    console.log(rules[key],'checked => faild');
                    msg =  rules[key].msg; return false;
                } else {
                    // console.log(rules[key],'checked => success');
                }
            };
        });
        return msg;
    },
    // 元素全屏
    fullScreen: function (el) {
      if ( el ) {
        var element = $(el)[0];
      } else {
        var element = $('html')[0];
      }
      if(element.requestFullScreen) {
        element.requestFullScreen();
       } else if(element.webkitRequestFullScreen ) {
         element.webkitRequestFullScreen();
        } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
       }
     }
};
// 设置ll命名空间
window.ll ? window.ll=ll: true;
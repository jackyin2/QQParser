/* global jQuery */
/* global $M */
/**
 * @name     app.js
 * @desc     公共部分js
 * @depend   jQuery
 * @Date     2016-6-25 11:14:51
 * @author   zqyou
 * 学历空间
 */

(function ($) {

    window._config = {
        host: '/',
        prefix: '/study/',
        com:'/common/'
    };

    window.urls = {
        common_loginOut: _config.com + "login/loginOut",

        menu_LoadMenuItemData: _config.com + 'menu/LoadMenuItemData',

        studio_Index: _config.prefix + 'Studio/index',
        studio_getCourseList: _config.prefix + 'Studio/getCourseList',
        stuInfo_getStuInfo: _config.prefix + 'stuInfo/getStuInfo',
        stuInfo_editStuInfo: _config.prefix + 'stuInfo/editStuInfo',
        stuInfo_editPassWord: _config.prefix + 'stuInfo/editPassWord',

        learning_GetLearnningCourseList: _config.prefix + 'learning/GetLearnningCourseList',

        myMessage_getList: _config.prefix + 'myMessage/getList',
        myMessage_view: _config.prefix + 'myMessage/view',
        myMessage_getUser: _config.prefix + 'myMessage/getUser',
        myMessage_sendMessage: _config.prefix + 'myMessage/sendMessage',
        myMessage_reply: _config.prefix + 'myMessage/reply',
        myMessage_delete: _config.prefix + 'myMessage/delete',

        messageBoard_getList: _config.prefix + 'messageBoard/getList',
        messageBoard_view: _config.prefix + 'messageBoard/view',
        messageBoard_add: _config.prefix + 'messageBoard/add',
        messageBoard_replyTo: _config.prefix + 'messageBoard/replyTo',
        messageBoard_delMsgBoard: _config.prefix + 'messageBoard/delMsgBoard',

        userload_userLoad: _config.com + 'userload/userLoad',
        userload_logOut: _config.com + 'userload/logOut',

        /*我的收藏*/
        mycollect_getMyCollectList: _config.prefix + "mycollect/getMyCollectList",
        mycollect_cancelCollect: _config.prefix + "mycollect/cancelCollect",
        /*保存学生图像*/
        stuInfo_saveAvatar: _config.prefix + "stuInfo/saveAvatar",
    };


    /**
     * 处理返回值
     * @return true/false
     */
    window.handleException = function (r) {

        if (!r) {
            alert('发生未知错误，请刷新页面后尝试！');
            return false;
        }

        switch (r.code) {
            case 500:
            case 401:
            case 402:
            case 501:
            case 502:
            case 403:
                alert(r.msg || '发生未知错误，请刷新页面后尝试！');
                return false;
        }

        return true;
    };

    /**
     * @name 获取地址栏中的参数
     * @return Object
     */
    window.getQuery = function (key) {
        var arr = [],
            obj = {},
            location = window.location.href,
            has = location.indexOf('?') > -1,
            isHash = location.indexOf('#');

        if (!has) return null;
        arr = location.substring(location.indexOf('?') + 1, isHash > -1 ? isHash : location.length).split('&');

        for (var i = 0, len = arr.length; i < len; i++) {
            var temp = arr[i].split('=');
            if (temp.length) obj[temp[0]] = temp[1].replace(/#/g, '');
        }

        if (key) {
            return obj[key];
        } else {
            return obj;
        }
    };

    /**
     * @name 获取地址栏中的Hash值
     * @return Object
     */
    window.getHash = function (key) {
        var arr = [],
            obj = {},
            hash = location.hash;

        if (!hash.length) return null;
        arr = hash.substring(1, hash.length).split('&');

        for (var i = 0, len = arr.length; i < len; i++) {
            var temp = arr[i].split('=');
            if (temp.length) obj[temp[0]] = temp[1];
        }

        if (key) {
            return obj[key];
        } else {
            return obj;
        }
    };


    window.getQueryString = function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    $.extend({
        //将querystring 转换为 json 对象
        parseParams: function (query) {
            var re = /([^&=]+)=?([^&]*)/g;
            var decodeRE = /\+/g;
            var decode = function (str) {
                return decodeURIComponent(str.replace(decodeRE, " "));
            };

            var params = {},
                e;
            while (e = re.exec(query)) {
                var k = decode(e[1]),
                    v = decode(e[2]);
                if (k.substring(k.length - 2) === '[]') {
                    k = k.substring(0, k.length - 2);
                    (params[k] || (params[k] = [])).push(v);
                } else params[k] = v;
            }
            return params;
        },
        htmlencode: function (text) {
            return $('<div />').text(text).html();
        },
        htmldecode: function (text) {
            return $('<div />').html(text).text();
        }
    });





})(jQuery);
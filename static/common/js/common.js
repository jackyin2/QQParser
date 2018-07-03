var _ = {
    conf: {
    }

};

String.prototype.ltrim = function (r) {
    return this.replace(/^\s*/gi, '').replace(new RegExp('^' + r), '');
};

String.prototype.rtrim = function (r) {
    return this.replace(/\s*$/gi, '').replace(new RegExp(r + '$'), '');
};

String.prototype.format = function () {
    var args = arguments, args1 = {};
    if (args.length == 0) return this;
    if (typeof args[0] == 'object') args1 = args[0];
    return this.replace(/\{([\w]+)\}/g, function ($1, $2) {
        return args1[$2] || args[$2] || $1;
    });
};
//ie8中的indexof无效
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}
String.prototype.QueryStringToJSON = function () {
    if (this.length == 0 || this.indexOf('=') == -1) {
        return {};
    }
    try {
        var json = {};

        var str = ("'" + this.replace(/([\?&])([^&=\s]*)=/g, "$1$2':'").replace(/&{2,}/g, "&").replace(/(^\?)|(&$)/g, "").replace(/&/g, "','") + "'").replace(/'.*?':'.*?'/g, function (r) {
            var obj = eval('({' + r + '})');
            for (var key in obj) {
                if (json[key]) {
                    json[key] = json[key] + ',' + obj[key];
                } else {
                    json[key] = obj[key];
                }
            }
        });

        return json;
    } catch (error) {
        return {};
    }
};

String.prototype.trimStart = function (trimStr) {
    if (!trimStr) { return this; }
    var temp = this;
    while (true) {
        if (temp.substr(0, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(trimStr.length);
    }
    return temp.toString();
};

String.prototype.trimEnd = function (trimStr) {
    if (!trimStr) { return this; }
    var temp = this;
    while (true) {
        if (temp.substr(temp.length - trimStr.length, trimStr.length) != trimStr) {
            break;
        }
        temp = temp.substr(0, temp.length - trimStr.length);
    }
    return temp.toString();
};

_.obj2query = function (obj) {
    var str = '';
    for (var key in obj) {
        str += '&' + key + '=' + obj[key];
    }
    return str.ltrim('&');
}
_.width = function () {
    var pageWidth = window.innerWidth ? window.innerWidth : document.body.clientWidth;
    if ($.browser.msie && $.browser.version < 8) {
        if (document.compatMode == 'CSS1Compat') {
            pageWidth = document.documentElement.clientWidth;
        } else {
            pageWidth = document.body.clientWidth;
        }
    }
    return pageWidth;
};

_.height = function () {
    var pageHeight;
    if (document.compatMode == 'CSS1Compat') {
        pageHeight = document.documentElement.clientHeight;
    } else {
        pageHeight = document.body.clientHeight;

    }
    return pageHeight;
};

_.resize = function () {
};

_pagination = function (pagination, el, pageType) {
    $('.pagination', el).pagination({
        items: pagination.totalCount,
        itemsOnPage: pagination.pageSize,
        currentPage: pagination.pageIndex,
        pageType: pageType,
        hrefTextPrefix: '?page=',
        cssStyle: 'light-theme',
        prevText: '上一页',
        nextText: '下一页',
        firstText: '首页',
        lastText: '末页'

    });
}

_.ajaxPagination = function () {
};

$(window).resize(function () {
    _.resize();
    return false;
});

jQuery.beforeCompareFormat = beforeCompareFormat = function (date) {
    var format = "yyyy-MM-dd";
    if (date == 0)
        date = new Date();
    else if (date.indexOf("/Date(") > -1) {
        var date = new Date(parseInt(date.replace("/Date(", "").replace(")/", "") - 8 * 60 * 60 * 1000, 10));
    }
    else
        date = new Date(date);

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
};

template.helper('dateFormat', function (date, format) {
    if (date == 0)
        date = new Date();
    else if (date.indexOf("/Date(") > -1) {
        var date = new Date(parseInt(date.replace("/Date(", "").replace(")/", "") - 8 * 60 * 60 * 1000, 10));
    }
    else
        date = new Date(date);

    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
});

template.helper('timeFormat', function (timeValue) {
    var result = "";
    if (!timeValue) {
        result = "---";
        return result;
    };
    var sTime = parseInt(timeValue);/*秒*/
    var mTime = 0;/*分*/
    var hTime = 0;/*时*/
    if (sTime > 60) {
        mTime = parseInt(sTime / 60);
        sTime = parseInt(sTime % 60);
        if (mTime > 60) {
            hTime = parseInt(mTime / 60);
            mTime = parseInt(mTime % 60);
        }
    }
    result = sTime + "秒";
    if (mTime > 0) {
        result = mTime + "分" + sTime + "秒";
    }
    if (hTime > 0) {
        result = hTime + "小时" + mTime + "分" + sTime + "秒";
    }
    return result;
});

template.helper('substringQest', function (str, start, end) {
    str = (str) ? $("<p>").append(str).text() : ""
    if (str.length > end)
        return str.substring(start, end) + "...";
    else
        return str;
});

template.helper('substring', function (str, start, end) {
    str = (str) ? $('<div />').text(str).html() : ""
    if (str.length > end)
        return str.substring(start, end) + "...";
    else
        return str;
});

template.helper("subString_html", function (str, start, end) {
    var s = $('<div />').html(str).text();
    if (s.length > end) {
        return s.substring(start, end) + "...";
    }
    else {
        return s;
    }
});

template.helper('htmlencode', function (text) {
    return $('<div />').text(text).html();
});

template.helper('htmldecode', function (text) {
    return $('<div />').html(text).text();
});

template.helper('parseJSON', function (text) {
    return jQuery.parseJSON(text);
});


template.helper('contains', function (str, substr) {
    return str.indexOf(substr);
});

template.helper('contains_s', function (str, substr) {
    return str.indexOf(substr) == -1 ? '' : 'selected';
});

template.helper('b2other', function (str) {

    var val = parseInt(str);

    var Units = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");

    var i = 0;
    while ((val / 1024).toFixed(2) > 1) {
        val /= 1024;
        i++;
    }
    return val.toFixed(2) + Units[i];
});

template.helper('empty', function (obj, key) {
    return obj ? eval('obj.' + key) : '';
});

template.helper('tofixed', function (str, num, percent) {
    return (str * percent).toFixed(num);
});

/*根据阿拉伯数字获取对呀的中文汉字*/
template.helper('num2hanzi', function (num) {
    var chinas = new Array("", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "百", "零");
    var nums = new Array(1000);
    for (var i = 1; i < 1000; i++) {
        var b = parseInt(i / 100);
        var s = parseInt(i / 10)

        var str = chinas[b] + chinas[b == 0 ? 0 : 11] + chinas[s % 10] +
                  chinas[s % 10 == 0 ? 12 : 10] + chinas[i % 10];
        str = str.trimStart('零').trimEnd('零');
        if (i >= 10 && i < 20) str = str.trimStart('一');

        nums[i - 1] = str;
    }
    return nums[num];

});

/*根据索引获取选项序号*/
template.helper('num2zimu', function (num) {
    var englishs = new Array("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-");
    return englishs[num];
});

template.helper('isvideo', function (str) {
    var temp = false;
    var lastindex = str.lastIndexOf('.') + 1;
    var type = str.substring(lastindex, str.length);
    switch (type) {
        case "mp4":
        case "flv":
        case "swf":
        case "asf":
        case "avi":
        case "mpg":
        case "wav":
        case "rm":
        case "rmvb":
        case "wmv":
            temp = true;
            break;
        default:
            break;
    }
    return temp;
});

template.helper('indent', function (count, value) {
    return Array(count).join(' ') + value;
});

template.helper('now', function () {
    var nowStr = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/-/g, '/');
    return nowStr; /*获取时间*/
});

template.helper('dateCompare', function (startDateStr, endDateStr, type) {
    startDateStr = beforeCompareFormat(startDateStr);
    endDateStr = beforeCompareFormat(endDateStr);
    var sDate = new Date(startDateStr);/*时间1*/
    var eDate = new Date(endDateStr);/*时间2*/
    var result;/*比较结果*/
    if (sDate.getTime() == eDate.getTime()) {
        result = 0;/*时间1==时间2*/
    }
    else if (sDate.getTime() < eDate.getTime()) {
        result = 1;/*时间1<时间2*/
    }
    else {
        result = 2;/*时间1>时间2*/
    }
    switch (type) {
        case "==":/*时间1==时间2？*/
            return result == 0 ? true : false;
        case "<":/*时间1<时间2？*/
            return result == 1 ? true : false;
        case ">":/*时间1>时间2？*/
            return result == 2 ? true : false;
        case "<=":/*时间1<=时间2？*/
            return result != 2 ? true : false;
        case ">=":/*时间1>=时间2*/
            return result != 1 ? true : false;
        default:
            return false;
    }

});

template.helper('isContainsString', function (bigString, smallString) {
    if (!bigString || bigString.length == 0)
        return false;
    var bigStringArr = bigString.split(',');
    for (var i = 0; i < bigStringArr.length; i++) {
        var innerString = bigStringArr[i];
        if ($.trim(innerString) == $.trim(smallString)) {
            return true;
        }
    }
    return false;
});

template.helper('checkSpace', function (questionAnswer, studentAnswer, sortOrder) {
    if (questionAnswer.length == 0 || studentAnswer.length == 0)
        return false;
    var answerList = questionAnswer.Split(',');
    var currentAnswer = answerList[order];
    currentAnswer = currentAnswer.Replace(" ", "").Replace("’", "'").Replace("‘", "'").Replace("＇", "'").Replace("\t", "").Replace("\n", "").Replace("；", ";").Replace("，", ",").ToUpper();
    studentAnswer = studentAnswer.Replace(" ", "").Replace("’", "'").Replace("‘", "'").Replace("＇", "'").Replace("\t", "").Replace("\n", "").Replace("；", ";").Replace("，", ",").ToUpper();
    if (currentAnswer == studentAnswer)
        return true;
    return false;
});

template.helper('getSplitAnswer', function (answerString, index) {
    var answerArr = answerString.split(',');
    return answerArr[index];
});

template.helper('getAnswerArr', function (answerString) {
    var answerArr;
    if (!answerString) {
        answerArr = [26, 26, 26, 26]
    } else {
        answerArr = answerString.split(',');
        for (var j = 0; j < answerArr.length; j++) {
            if (answerArr[j] == -1) {
                answerArr[j] = 26;
            }
        }
    }
    return answerArr;
});

jQuery.autoCut = function autoCut(text, cut_length, end) {
    if (text.length == 0 || cut_length > $.getLength(text)) return $.htmlencode(text);

    var result = '';
    var j = 0;

    var str_array = text.split('');

    for (var i = 0; i < str_array.length; i++) {
        var c = str_array[i];

        if (text.charCodeAt(i) >= 255) {
            j = j + 2;
        } else {
            j = j + 1;
        }

        result = result + c;

        if (j >= cut_length) {
            if (end) return $.htmlencode(result + end); else return $.htmlencode(result + '...');
        }
    }
};

jQuery.bindUeditor = function bindUeditor(identity, opts) {
    var ueditor_setting_defaults = {
        initialFrameHeight: 200,
        wordOverFlowMsg: '<span style="color:red;">你输入的字符个数已经超出最大允许值！！</span>',
        autoFloatEnabled: true,

        topOffset: 0,
        toolbars: [[
        'source', '|', 'undo', 'redo', 'pasteplain', 'forecolor', 'backcolor', 'fontfamily', 'fontsize', '|', "insertimage", 'link', 'spechars', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify',
        'bold', 'italic', 'underline', '|', 'inserttable', 'attachment'
        ]]
    };
    window.UEDITOR_HOME_URL = "/common/js/ueditor/";
    opts = $.extend(false, {}, ueditor_setting_defaults, opts);

    var editor = UE.getEditor(identity, opts);

    //var old_getActionUrl = editor.getActionUrl;

    editor.getActionUrl = function (action) {

        if (action == 'config') return urls.ueditor;
        return action;
    };
    return editor;
};

jQuery.getLength = function getLength(text) {
    var length = 0, c = '';
    for (var i = 0; i < text.length; i++) {
        c = text.charCodeAt(i);
        if (c >= 255) {
            length = length + 2;
        } else {
            length = length + 1;
        }
    }
    return length;
};


jQuery.htmlencode = function htmlencode(text) {
    return $('<div />').text(text).html();
};

jQuery.htmldecode = function htmldecode(text) {
    return $('<div />').html(text).text();
};

jQuery.dynamic_dialog = function dynamic_dialog(selector) {
    if ($('#' + selector).length == 0) {
        $('body').append($('<div id="' + selector + '" />'));
    }
    return $('#' + selector);
};

_.isEmptyObject = function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}


_.url = location.search.QueryStringToJSON();

_.hash = ('?' + location.hash.substring(1)).QueryStringToJSON();


_.ajax = function () {
    $('.loading').show();
    var args = arguments;
    if (typeof (args[0]) == 'string') {
        data = { url: args[0] };
        if (typeof (args[1]) == 'object') {
            data.data = args[1];
            if (typeof (args[2]) == 'function') {
                data.success = args[2];
            }
            if (typeof (args[3]) == 'function') {
                data.error = args[3];
            }
        } else if (typeof (args[1] == 'function')) {
            data.success = args[1];
            if (typeof (args[2]) == 'function') {
                data.error = args[2];
            }
        }
    }


    if (typeof (args[0]) == 'object') {
        data = args[0];
    }
    _.url = location.search.QueryStringToJSON();
    _.hash = ('?' + decodeURI(location.hash.substring(1))).QueryStringToJSON();

    return $.ajax({
        type: data.type || "post",
        url: data.url,
        cache: data.cache || true,
        timeout: data.timeout,
        data: !_.isEmptyObject(data.data) ? data.data : !_.isEmptyObject(_.hash) ? _.hash : !_.isEmptyObject(_.url) ? _.url : "",
        dataType: data.dataType || "json",
        beforeSend: data.beforeSend || function () { },
        success: data.success,
        complete: data.complete || function () {
            $('.loading').hide();
        },
        error: data.error || function (XMLHttpRequest, status, errorThrown) { if (status == 'timeout' || status == 'error') { alert(errorThrown); } }
    });
};


_.selected = function () {
    $('#queryform input,#queryform select').each(function (i, v) {
        $(v).val(decodeURI(eval('_.hash.' + $(v).attr('name')) || ''));
    });
}

_.css = function (url) { $("head").append('<link rel="stylesheet" href="{0}"'.format(url)); };

_.script = function (url, success) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = script.onreadystatechange = function () {
        // this.readyState
        // 这是FF的判断语句，因为ff下没有readyState这人值，IE的readyState肯定有值
        // this.readyState == 'loaded' || this.readyState == 'complete'
        // 这是IE的判断语句
        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
            success();
        }
    }
    head.appendChild(script);
};

_.include = function (data) {
    if (data.cssFiles) $.isArray(data.cssFiles) ? $.each(data.cssFiles, function (i, v) { _.css(v); }) : _.css(data.cssFiles);
    if (data.jsFiles) $.isArray(data.jsFiles) ? $.each(data.jsFiles, function (i, v) { _.script(v.url, v.cb); }) : _.script(data.jsFiles.url, data.jsFiles.cb);
};

_.checkAll = function (table) {
    /*全选或全不选*/
    $('.checkAll', table).click(function () {
        if ($(this).is(':checked')) {
            $('.check', table).attr('checked', true);
            $('.check', table).parents('tr').addClass('current');
        } else {
            $('.check', table).attr('checked', false);
            $('.check', table).parents('tr').removeClass('current');
        }
    });

    /*同步全选框*/
    $('.check', table).click(function () {
        var objs = $('.check', table);
        $('.checkAll', table).attr('checked', objs.length == objs.filter(':checked').length);
        if ($(this).is(':checked')) {
            $(this).parents('tr').addClass('current');
        } else {
            $(this).parents('tr').removeClass('current');
        };
    });

};

_.getSelectedRowIds = function (table) {
    var ids = [];
    $.each($("tbody tr td:first-child :checkbox[checked]", table), function (i, v) {
        ids.push(encodeURIComponent($(this).parents('tr:first').attr('id')));
    });
    return ids;
};

/*create by wl deal with checkbox data*/
_.dealData = function (selecteddata, data, type) {
    var idIndex;
    data += ",";
    if (type == "append") {
        idIndex = ("," + selecteddata).indexOf("," + data);
        if (idIndex < 0) {
            selecteddata += data;
        }
    } else {
        var idLen = data.length;
        idIndex = ("," + selecteddata).indexOf("," + data);
        if (idIndex >= 0) {
            var idSubPre = selecteddata.substring(0, idIndex);
            var idSubSuf = selecteddata.substring(idIndex + idLen);
            selecteddata = idSubPre + idSubSuf;
        }
    }
    return selecteddata;
}

// $(function () {
//     $.pnotify.defaults.styling = "jqueryui";
//     $.pnotify.defaults.history = false;
//     $.pnotify.defaults.animation = 'none';
//     $.pnotify.defaults.sticker = false;
//
//     /*预览共公方法，如果将所有的带有data-preview_url_ueditor直接预览*/
//     $(document).off('click.preview').on('click.preview', '[data-preview_url_ueditor]', function () {
//         var _this = $(this);
//         _.ajax(urls2.Ueditor_Preview_Url, { url: _this.data('preview_url_ueditor'), title: _this.data('title') }, function (r) {
//             if (!r || r.code < 0) {
//                 alert(r.msg || '发生未知错误');
//                 return false;
//             }
//             _.include({
//                 jsFiles: [{
//                     url: '/common/js/dfs/preview.js', cb: function () {
//                         var dlg = jQuery.dynamic_dialog('dlg_preview_resource');
//                         var html = '<a  href="' + r.downloadUrl + '" target="_blank" class="am-btn am-btn-success" style="float: right;">下载</a><div style="height:450px;    margin-top: 40px;" id="preview_container"></div>';
//                         dlg.html(html).dialog({
//                             title: "预览资源",
//                             width: 900,
//                             heigth: 450,
//                             draggable: true,
//                             modal: false,
//                             close: function () {
//                                 $("#preview_container").html("");
//                             }
//                         });
//                         $('#preview_container').DViewer({
//                             data: r.url,
//                             baseUrl: '/common/js/dfs/'
//                         });
//                     }
//                 }], cssFiles: []
//             });
//
//         }, 'json');
//         return false;
//     });
//
//     window.alert = function (msg, type) {
//         if (typeof (type) == 'undefined' || type == null || type == '') {
//             window.wxc.xcConfirm(msg, "info");
//         } else if (type == 'error') {
//             window.wxc.xcConfirm(msg, window.wxc.xcConfirm.typeEnum.error);
//         } else if (type == 'warning') {
//             window.wxc.xcConfirm(msg, window.wxc.xcConfirm.typeEnum.warning);
//         }
//     };
//
//     window.alertNoButton = function (msg, type) {
//         if (typeof (type) == 'undefined' || type == null || type == '') {
//             window.wxc.xcConfirm(msg, "info", "nobutton");
//         }
//     };
//
//     window.confirm = function (msg, onOkFunction) {
//         window.wxc.xcConfirm(msg, window.wxc.xcConfirm.typeEnum.confirm, {
//             onOk: function () {
//                 if (typeof (onOkFunction) == 'function') {
//                     onOkFunction();
//                 }
//             }
//         });
//     };
//
//     window.checkInputValueRequired = function (input) {
//         if (input.length <= 0) {
//             return true;
//         }
//         if ($.trim(input.val()) == '') {
//             input.addClass('am-field-error');
//             window.wxc.xcConfirm("字段不能为空！", window.wxc.xcConfirm.typeEnum.error);
//             return false;
//         } else {
//             input.removeClass('am-field-error');
//         }
//         return true;
//     };
//
//
//     //var ueditor_setting_defaults = {
//     //    initialFrameHeight: 200,
//     //    wordOverFlowMsg: '<span style="color:red;">你输入的字符个数已经超出最大允许值！！</span>',
//     //    autoFloatEnabled: true,
//     //    topOffset: 0,
//     //    toolbars: [[
//     //    'source', '|', 'undo', 'redo', 'fontfamily', 'choosefile', 'link', 'spechars',
//     //    'bold', 'italic', 'underline', '|', 'fontsize', '|', 'kityformula', '|', 'inserttable'
//     //    ]]
//     //};
//
//     $.extend({
//         autoCut: function (text, cut_length, end) {
//             if (text.length == 0 || cut_length > $.getLength(text)) return $.htmlencode(text);
//
//             var result = '';
//             var j = 0;
//
//             var str_array = text.split('');
//
//             for (var i = 0; i < str_array.length; i++) {
//                 var c = str_array[i];
//
//                 if (text.charCodeAt(i) >= 255) {
//                     j = j + 2;
//                 } else {
//                     j = j + 1;
//                 }
//
//                 result = result + c;
//
//                 if (j >= cut_length) {
//                     if (end) return $.htmlencode(result + end); else return $.htmlencode(result + '...');
//                 }
//             }
//         },
//         //bindUeditor: function (identity, opts) {
//         //    window.UEDITOR_HOME_URL = $("head").data("vp") + "common/js/vender/ueditor/";
//         //    opts = $.extend(false, {}, ueditor_setting_defaults, opts);
//         //    editor = UE.getEditor(identity, opts);
//
//         //    var old_getActionUrl = editor.getActionUrl;
//         //    editor.getActionUrl = function (action) {
//         //        if (action == 'config') return $("head").data("vp") + 'common/ueditor.aspx';
//         //        return action;
//         //    };
//         //    return editor;
//         //}
//         //,
//         getLength: function (text) {
//             var length = 0, c = '';
//
//             for (var i = 0; i < text.length; i++) {
//                 c = text.charCodeAt(i);
//                 if (c >= 255) {
//                     length = length + 2;
//                 } else {
//                     length = length + 1;
//                 }
//             }
//             return length;
//         },
//         htmlencode: function (text) {
//             return $('<div />').text(text).html();
//         },
//         htmldecode: function (text) {
//             return $('<div />').html(text).text();
//         },
//         dynamic_dialog: function (selector) {
//             if ($('#' + selector).length == 0) {
//                 $('body').append($('<div id="' + selector + '" />'));
//             }
//             return $('#' + selector);
//         }
//     });
//
// });

/*
 * 功能：美化alert和confirm
 * 使用说明:
 * window.wxc.Pop(popHtml, [type], [options])
 * popHtml:html字符串
 * type:window.wxc.xcConfirm.typeEnum集合中的元素
 * options:扩展对象
 * 用法:
 * 1. window.wxc.xcConfirm("我是弹窗<span>lalala</span>");
 * 2. window.wxc.xcConfirm("成功","success");
 * 3. window.wxc.xcConfirm("请输入","input",{onOk:function(){}})
 * 4. window.wxc.xcConfirm("自定义",{title:"自定义"})
 */
(function ($) {
    window.wxc = window.wxc || {};
    window.wxc.xcConfirm = function (popHtml, type, options) {
        var btnType = window.wxc.xcConfirm.btnEnum;
        var eventType = window.wxc.xcConfirm.eventEnum;
        var popType = {
            info: {
                title: "提示信息",
                icon: "0 0",//蓝色i
                btn: btnType.ok
            },
            success: {
                title: "成功",
                icon: "0 -48px",//绿色对勾
                btn: btnType.ok
            },
            error: {
                title: "错误",
                icon: "-48px -48px",//红色叉
                btn: btnType.ok
            },
            confirm: {
                title: "提示",
                icon: "-48px 0",//黄色问号
                btn: btnType.okcancel
            },
            warning: {
                title: "警告",
                icon: "0 -96px",//黄色叹号
                btn: btnType.okcancel
            },
            input: {
                title: "输入",
                icon: "",
                btn: btnType.ok
            },
            custom: {
                title: "",
                icon: "",
                btn: btnType.ok
            }
        };
        var itype = type ? type instanceof Object ? type : popType[type] || {} : {};//格式化输入的参数:弹窗类型
        var config = $.extend(true, {
            //属性
            title: "", //自定义的标题
            icon: "", //图标
            btn: btnType.ok, //按钮,默认单按钮
            //事件
            onOk: $.noop,//点击确定的按钮回调
            onCancel: $.noop,//点击取消的按钮回调
            onClose: $.noop//弹窗关闭的回调,返回触发事件
        }, itype, options);

        var $txt = $("<p>").html(popHtml);//弹窗文本dom
        var $tt = $("<span>").addClass("tt").text(config.title);//标题
        var icon = config.icon;
        var $icon = icon ? $("<div>").addClass("bigIcon").css("backgroundPosition", icon) : "";
        var btn = config.btn;//按钮组生成参数

        var popId = creatPopId();//弹窗索引

        var $box = $("<div>").addClass("xcConfirm");//弹窗插件容器
        var $layer = $("<div>").addClass("xc_layer");//遮罩层
        var $popBox = $("<div>").addClass("popBox");//弹窗盒子
        var $ttBox = $("<div>").addClass("ttBox");//弹窗顶部区域
        var $txtBox = $("<div>").addClass("txtBox");//弹窗内容主体区
        var $btnArea = $("<div>").addClass("btnArea");//按钮区域

        var $ok = $("<a>").addClass("sgBtn").addClass("ok").text("确定");//确定按钮
        var $cancel = $("<a>").addClass("sgBtn").addClass("cancel").text("取消");//取消按钮
        var $input = $("<input>").addClass("inputBox");//输入框
        var $clsBtn = $("<a>").addClass("clsBtn");//关闭按钮

        //建立按钮映射关系
        var btns = {
            ok: $ok,
            cancel: $cancel
        };

        init();

        function init() {
            //处理特殊类型input
            if (popType["input"] === itype) {
                $txt.append($input);
            }

            creatDom();
            bind();
        }

        function creatDom() {
            $popBox.append(
				$ttBox.append(
					$clsBtn
				).append(
					$tt
				)
			).append(
				$txtBox.append($icon).append($txt)
			).append(
				$btnArea.append(creatBtnGroup(btn))
			);
            $box.attr("id", popId).append($layer).append($popBox);
            $("body").append($box);
        }

        function bind() {
            //点击确认按钮
            $ok.click(doOk);

            //回车键触发确认按钮事件
            $(window).bind("keydown", function (e) {
                if (e.keyCode == 13) {
                    if ($("#" + popId).length == 1) {
                        doOk();
                    }
                }
            });

            //点击取消按钮
            $cancel.click(doCancel);

            //点击关闭按钮
            $clsBtn.click(doClose);
        }

        //确认按钮事件
        function doOk() {
            var $o = $(this);
            var v = $.trim($input.val());
            if ($input.is(":visible"))
                config.onOk(v);
            else
                config.onOk();
            $("#" + popId).remove();
            config.onClose(eventType.ok);
        }

        //取消按钮事件
        function doCancel() {
            var $o = $(this);
            config.onCancel();
            $("#" + popId).remove();
            config.onClose(eventType.cancel);
        }

        //关闭按钮事件
        function doClose() {
            $("#" + popId).remove();
            config.onClose(eventType.close);
            $(window).unbind("keydown");
        }

        //生成按钮组
        function creatBtnGroup(tp) {
            var $bgp = $("<div>").addClass("btnGroup");
            $.each(btns, function (i, n) {
                if (btnType[i] == (tp & btnType[i])) {
                    $bgp.append(n);
                }
            });
            return $bgp;
        }

        //重生popId,防止id重复
        function creatPopId() {
            var i = "pop_" + (new Date()).getTime() + parseInt(Math.random() * 100000);//弹窗索引
            if ($("#" + i).length > 0) {
                return creatPopId();
            } else {
                return i;
            }
        }
    };

    //按钮类型
    window.wxc.xcConfirm.btnEnum = {
        ok: parseInt("0001", 2), //确定按钮
        cancel: parseInt("0010", 2), //取消按钮
        okcancel: parseInt("0011", 2) //确定&&取消
    };

    //触发事件类型
    window.wxc.xcConfirm.eventEnum = {
        ok: 1,
        cancel: 2,
        close: 3
    };

    //弹窗类型
    window.wxc.xcConfirm.typeEnum = {
        info: "info",
        success: "success",
        error: "error",
        confirm: "confirm",
        warning: "warning",
        input: "input",
        custom: "custom"
    };

    if ($.fn.datetimepicker) {
        $.fn.datetimepicker.dates['zh-CN'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            today: "今天",
            suffix: [],
            meridiem: ["上午", "下午"],
            rtl: false // 从右向左书写的语言你可以使用 rtl: true 来设置
        };
        $.fn.datetimepicker.defaults['language'] = 'zh-CN';
    }
})(jQuery);
if (typeof upload === 'undefined') {
    upload = {};
}
upload = function (baseUrl, ele, onComplete, onError) {
    var _this = this;
    _this.docs = [];
    _this.form = '';
    _this.baseUrl = baseUrl;
    _this.onComplete = onComplete;
    _this.onError = onError;

    _this.ele = ele;
    _this.uploadContainer = _this.ele.find('#picker');
    _this.uploadBtn = $('.upload-button button:first', _this.ele);
    _this.formTemplate = '';

    //upload btn
    _this.uploadBtn.click(function () {
        if ($(this).hasClass('disabled')) return false;
        if (_this.uploader.getFiles().length > 0) {
            _this.upload();
        } else {
            $M().msg("请选择文件！").position('10%', '50%').time(3);
        }

    });

    //cancel btn
    $('.cancel', _this.ele).click(function () {
        window.location.reload();
    });

    _.include({
        jsFiles: [{
            url: '/common/js/uploader/webuploader.min.js', cb: function () {

                if (!WebUploader.Uploader.support()) {
                    //alert('浏览器版本太低！！我们推荐使用 Google Chrome 、FireFox、或者升级最新的 Adobe Flash Player！！');
                    $M().msg("浏览器版本太低！！我们推荐使用 Google Chrome 、FireFox、或者升级最新的 Adobe Flash Player！！").position('10%', '50%').time(3);
                    return false;
                }

                _this.init();

                _this.uploader.refresh();
            }
        }],
        cssFiles: ['/common/js/uploader/uploader.css']
    });
};

upload.prototype.init = function () {
    var _this = this;
    _this.queueContainer = $('#files_queued', _this.ele);

    _this.uploader = new WebUploader.Uploader({
        server: _this.uploadContainer.data('file_system_url'),
        swf: '/common/js/uploader/uploader.swf',
        pick: {
            id: _this.uploadContainer,
            innerHTML: '选择文件',
            multiple: true
        },
        auto: false,
        prepareNextFile: false,
        dnd: _this.ele,
        paste: $('body'),
        threads: 20,
        sendAsBinary: true,
        chunked: false,
        fileNumLimit: 20,//最多20个文件
        fileSizeLimit: 1024 * 1024 * 1024, //总文件大小最多1GB
        fileSingleSizeLimit: 1024 * 1024 * 300    // 最多 300M
    });

    var errors = { zero: [], exe: [], sizeLimit: [] };

    //filter the file ext
    _this.uploader.on('beforeFileQueued', function (file) {

        if (!file.ext || file.ext.toLowerCase() == 'exe' || file.ext.toLowerCase() == 'bat' || file.ext.toLowerCase() == 'dll') {
            errors.exe.push($.autoCut(file.name, 20));
            return false;
        }

        if (file.size == 0) {
            errors.zero.push($.autoCut(file.name, 20));
            return false;
        }

        if (file.size > 1024 * 1024 * 300) {
            errors.sizeLimit.push($.autoCut(file.name, 20));
            return false;
        }
    });

    _this.uploader.on('error', function (type) {
        switch (type) {
            case 'Q_EXCEED_NUM_LIMIT':
                $M().msg("为了保证上传的稳定性，一次最多可上传20个文件，建议您分批次上传！！").position('10%', '50%').time(3);
               // alert('为了保证上传的稳定性，一次最多可上传20个文件，建议您分批次上传！')
                break;
            case 'Q_EXCEED_SIZE_LIMIT':
                $M().msg("上传的总文件大小不能超过1GB！！").position('10%', '50%').time(3);
                //alert('上传的总文件大小不能超过1GB！')
                break;
        }
    });

    //将加入的文件展现在queue中
    _this.uploader.on('filesQueued', function (files) {

        //显示提示错误信息
        var msg = '';

        if (errors.zero.length > 0) {
            msg += '错误：<span style="font-bold:bold;color:blue;">' + errors.zero.join(',') + '</span>文件大小为0KB<br /><br />';
        }

        if (errors.exe.length > 0) {
            msg += '错误：<span style="font-bold:bold;color:blue;">' + errors.exe.join(',') + '</span>，不能上传exe，bat，dll或无扩展名的文件<br /><br />';
        }

        if (errors.sizeLimit.length > 0) {
            msg += '警告：<span style="font-bold:bold;color:blue;">' + errors.sizeLimit.join(',') + '</span>，上传文件大小不能超过100MB';
        }

        if (msg.length > 0) {
            //alert(msg);
            $M().msg(msg).position('10%', '50%').time(3);

            //清空错误信息
            errors = { zero: [], exe: [], sizeLimit: [] };
        }

        if (files.length == 0) return false;

        _this.refreshList(files);
    });

    //移除文件。
    _this.uploader.on('fileDequeued', function (file) {
        $('#file_' + file.id, _this.ele).remove();

        $('.am-form[data-id=' + file.id + ']', _this.ele).remove();
        if ($('.file_item', _this.queueContainer).length == 0) {
            return false;
        }

        _this.refreshList([]);
    });

    //append doc extension
    _this.uploader.on('uploadBeforeSend', function (block, data, headers) {
        data.extension = block.file.ext;
    });

    //进度条
    _this.uploader.on('uploadProgress', function (file, percent) {
        $('#file_' + file.id, _this.ele).find('.mark').width(percent * 100 + '%');
    });

    //upload errored
    _this.uploader.on('uploadError', function (file, reason) {

        if (window.console) {
            console.log('file:{{' + file.name + '}} >> Error :' + reason);
        }
        //显示加载动画

    });

    //upload successed
    _this.uploader.on('uploadSuccess', function (file, response) {
        if (response && response.url) {
            _this.docs.push({
                fileId: file.id,
                title: file.name,
                md5: response.md5,
                requestLength: file.size,
                url: response.url
            });
        } else {
            if (_this.onError && $.isFunction(_this.onError)) {
                _this.onError.apply(this, [{ code: -1, msg: response }]);
                return false;
            }
        }
        //移除加载动画

    });

    //upload finished
    _this.uploader.on('uploadFinished', function () {

        _this.saveMetaData();
    });
};

upload.prototype.refreshList = function (files) {
    var _this = this;

    //第一次加入文件，则清除 右边表单
    if ($('.file_item', _this.queueContainer).length == 0) {

        _this.ele.find('#upload-form').empty();
    }
    //更新原来存在的文件的索引
    $('.file_item', _this.queueContainer).each(function (i, v) {
        $(v).find('.order').text(i + 1 + '.');

        $('.am-form[data-id=' + $(v).data('id') + ']', _this.ele).find('.ico-number').text(i + 1);
    });

    //追加的文件
    if (files.length > 0) {
        _this.appendHtml(files);
    }

    if ($('.file_item', _this.queueContainer).length == 0) {
        window.location.hash = '#list'; //跳转到列表页面
    } else {
        _this.showUploadBtn(true);

        if ($('.file_item', _this.queueContainer).length == 1) {

            $('#tip_selected label', _this.ele).hide();
            return false;
        }

        $('#tip_selected label', _this.ele).show();
    }
};

upload.prototype.saveMetaData = function () {
    var _this = this;
    //var courseOpenID = $("#upload_container").data('courseopenid');
    if (_this.docs.length == 0) {
        return;
    }
    _.ajax(urls.doc_upLoadFile, { data: JSON.stringify(_this.docs), meta: JSON.stringify(_this.meta), declareId: _.hash.deId }, function (r) {
        if (!r) {
            if (_this.onError && $.isFunction(_this.onError)) {
                _this.onError.apply(this, [{ code: 0, msg: '未知错误' }]);
            }
            return false;
        }

        if (r.code == 1) {

            if (_this.onComplete && $.isFunction(_this.onComplete)) {

                _this.onComplete.apply(this, [{ code: r.code, needAudit: r.needAudit }]);
                _this.docs = [];
            }
        }
        else {
            //alert(r.msg);
            $M().msg(r.msg).position('10%', '50%').time(3);
            if (_this.onError && $.isFunction(_this.onError)) {
                _this.onError.apply(this, [{ code: 0, msg: r.msg || '未知错误' }]);
            }

        }
        window.onbeforeunload = null;
        //移除overlay
        $('.uploading.ui-widget-overlay').remove();

    }, 'json');
};

upload.prototype.appendHtml = function (files) {

    var _this = this,
        html = '',
        lastLi = $('li.clearfix:last', _this.ele),
        index = lastLi.length == 0 ? 0 : lastLi.index() + 1,
        form_html = '';

    //只获取一次表单
    //if (_this.formTemplate.length == 0) {
    //    $.ajax({
    //        url: _this.baseUrl + 'ajax-docs-uploadform',
    //        type: 'POST',
    //        async: false,
    //        dataType: 'json',
    //        success: function (data) {
    //            _this.formTemplate = data;
    //        }
    //    });
    //}

    _this.formTemplate = $('#upform_html').html();
    //_.ajax(urls.doc_getDocTypeInfo, function (r) {
    //    $("#selectInfo").html(template('selects', r));
    //    $(".js-example-basic-multiple").select2();
    //});


    $.each(files, function (i, v) {
        index++;

        html += '<li style="cursor: pointer;" id="file_' + v.id + '" class="file_item clearfix" title="' + v.name + '" data-id="' + v.id + '"><div class="mark"></div><div class="order">' + index + '.</div><div class="file-name">' + jQuery.htmlencode(v.name) + '</div><div class="ico-close am-icon-close"><a href="javascript: void(0);" title="删除"><i class="iconfont icon-xiaochahao"></i></a></div></li>';

        var form = _this.formTemplate.replace(/{{index}}/g, index);
        form = form.replace(/{{fileName}}/g, $.htmlencode(v.name));
        form = form.replace(/{{fileId}}/g, v.id);
        //截取后缀
        var a = v.name;
        var b = a.substring(a.lastIndexOf(".") + 1, a.length);
        var arr = new Array("epg", "mp4", "flv", "mkv", "rm", "rmvb", "asf", "mpg", "avi", "wmv", "mov", "mts", "3gp", "f4v", "swf", "dwg", "mp3", "aac", "flac", "ape", "wav", "wma", "amr");
        if (arr.indexOf(b)!=-1) {
            form = form.replace(/{{inputHtml}}/g, '<div class="code"><span>积分：</span><input type="text" class="jf" id="jf" name="jf" maxlength="3" /></div>');
        }
        else {
            form = form.replace(/{{inputHtml}}/g, ' ');
        }
        $('.upload-form', _this.ele).append(form);

    });

    html = $(html);

    html.click(function () {

        //scroll
        $('.file_item', _this.queueContainer).removeClass('current');

        $(this).addClass('current');

        var prevs = $('.fieldset-list[data-id=' + $(this).data('id') + ']').prevAll(),
            scroll = 0;

        $.each(prevs, function (i, v) {
            scroll += $(v).outerHeight();
        });

        $('.upload-form', _this.ele).scrollTop(scroll);
    });

    $('.ico-close', html).click(function () {
        var fileId = $(this).parent().data('id');
        _this.uploader.removeFile(fileId, true);
        var filelength = _this.uploader.getFiles().length;
        if (filelength == 1) {
            _this.uploader.reset();
            window.onbeforeunload = null;
        }
        return false;
    });

    _this.queueContainer.append(html);

};

upload.prototype.twinkle = function (ele) {

    ele.focus();
    ele.css('backgroundColor', 'rgb(255, 180, 180)');
    ele.animate({ 'backgroundColor': 'rgb(255, 255, 255)' }, 500, 'linear', function () {
        ele.css('backgroundColor', 'rgb(255, 180, 180)');
        ele.animate({ 'backgroundColor': 'rgb(255, 255, 255)' }, 500, 'linear', function () {
            ele.css({ 'backgroundColor': '' });
        });
    });
};

upload.prototype.upload = function () {
    var _this = this;

    _this.meta = [];
    for (var i = 0; i < $('.file_item', _this.queueContainer).length; i++) {
        var fileId = $($('.file_item', _this.queueContainer)[i]).data('id'),
            form = $('#upload-form').find('.' + fileId);
        var jf = $('.jf', form).val();
        if (jf == undefined)
        {
            jf = 0;
        }
        var error = "";
        if ($('.doc_title', form).val().length == 0) {
            $('.doc_title', form).focus();
            error = { form: $('.doc_title', form).parents('.form-group:first'), msg: '第' + (i +1)+ '个资源的资源名称未填写' };
        }
        if (Number(jf) < 0)
        {
            $('.jf', form).focus();
            error = { form: $('.jf', form).parents('.form-group:first'), msg: '第' + (i + 1) + '个资源的资源积分设置异常' };
        }
        if (error && error.msg) {
            $($('.file_item', _this.queueContainer)[i]).trigger('click');
            _this.twinkle(_this.ele);
            $M().msg(error.msg).position('10%', '50%').time(3);
            //alert(error.msg);
            return false;
        }
        var data = {
            fileId: fileId,
            docTitle: form.find('.doc_title').val(),
            column: form.find('.columns').val(),
            JF:jf,
            tags: ''
        };
        _this.meta.push(data);
    }

    $('.ico-close a').hide();

    _this.uploader.upload();

    window.onbeforeunload = function () {
        return "当前有文档正在上传，确定离开该页面？";
    };

    //overlay
    $('body').append('<div class="uploading ui-widget-overlay ui-front" style="z-index：999;filter:Alpha(Opacity=0);opacity:0;" />');
};

upload.prototype.showUploadBtn = function (flag) {
    var _this = this;

    if (flag) {
        $('.upload-button', _this.ele).show();
        $('#tip_selected', _this.ele).show();
    } else {
        $('.upload-button', _this.ele).hide();
    }
};
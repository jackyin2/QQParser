 uploadFile = function ( ele, acceptDocType, acceptDocTypeErrorMessage, onComplete, onError) {
    var _this = this;
    _this.docs = [];
    _this.onComplete = onComplete;
    _this.onError = onError;
    _this.ele = ele;
    //传入的acceptDocType必须以,分割文件类型,且全部小写
    _this.acceptDocType = acceptDocType
    _this.acceptDocTypeErrorMessage = acceptDocTypeErrorMessage;

    _.include({
        jsFiles: [{
            url: '/common/js/uploader/webuploader.min.js', cb: function () {
                if (!WebUploader.Uploader.support()) {
                    $M().msg('浏览器版本太低！！我们推荐使用 Google Chrome 、FireFox、或者升级最新的 Adobe Flash Player！！').position('10%', '50%').time(3);
                    return false;
                }
                _this.init();
            }
        }],
        cssFiles: ['/common/js/uploader/uploader.css']
    });
};

uploadFile.prototype.init = function () {
    var _this = this;
    _this.uploader = new WebUploader.Uploader({
        server: _this.ele.data('file_system_url'),
        swf: _this.baseUrl + '/commonjs/uploader/uploader.swf',
        pick: {
            id: _this.ele,
            multiple: true
        },
        auto: false,
        prepareNextFile: false,
        sendAsBinary: true,
        chunked: false,
        fileNumLimit: 1,//最多1个文件
        fileSingleSizeLimit: 1024 * 1024 * 1024    // 最多 1G
    });

    var errors = { zero: [], exe: [], sizeLimit: [], notEcceptType: [] };

    //filter the file ext
    _this.uploader.on('beforeFileQueued', function (file) {
        if (!file.ext || file.ext.toLowerCase() == 'exe' || file.ext.toLowerCase() == 'bat' || file.ext.toLowerCase() == 'dll') {
            errors.exe.push($.autoCut(file.name, 20));
            return false;
        }
        //验证文件类型是否是可以接受的文件类型
        if (_this.acceptDocType != null) {
            var typeArray = _this.acceptDocType.split(',');
            var tempBool = true;
            for (var i = 0; i < typeArray.length; i++) {
                if (file.ext.toLowerCase() == typeArray[i]) {
                    tempBool = false;
                    break;
                }
            }
            if (tempBool) {
                errors.notEcceptType.push($.autoCut(file.name, 20));
                return false;
            }
        }

        if (file.size == 0) {
            errors.zero.push($.autoCut(file.name, 20));
            return false;
        }

        if (file.size > 1024 * 1024 * 1024) {
            errors.sizeLimit.push($.autoCut(file.name, 20));
            return false;
        }
    });

    _this.uploader.on('error', function (type) {
        switch (type) {
            case 'Q_EXCEED_NUM_LIMIT':
                $M().msg('一次只能上次一个文件！').position('10%', '50%').time(3);
                break;
            case 'Q_EXCEED_SIZE_LIMIT':
                M().msg('上传的总文件大小不能超过1GB！').position('10%', '50%').time(3);
                break;
        }
    });

    //将加入的文件展现在queue中
    _this.uploader.on('filesQueued', function (files) {
        //显示提示错误信息
        var msg = '';
        if (errors.exe.length > 0) {
            msg += '<span style="font-bold:bold;color:blue;">' + errors.exe.join(',') + '</span>，不能上传exe，bat，dll或无扩展名的文件';
        }
        if (errors.notEcceptType.length > 0) {
            msg += '<span style="font-bold:bold;color:blue;">' + errors.notEcceptType.join(',') + '</span>，' + _this.acceptDocTypeErrorMessage + '';
        }
        if (errors.zero.length > 0) {
            msg += '<span style="font-bold:bold;color:blue;">' + errors.zero.join(',') + '</span>文件大小为0KB';
        }
        if (errors.sizeLimit.length > 0) {
            msg += '<span style="font-bold:bold;color:blue;">' + errors.sizeLimit.join(',') + '</span>，上传文件大小不能超过1GB';
        }
        if (msg.length > 0) {
            $M().msg(msg).position('10%', '50%').time(3);
            //清空错误信息
            errors = { zero: [], exe: [], sizeLimit: [], notEcceptType: [] };
        }

        if (files.length == 0) return false;
        var dlg = jQuery.dynamic_dialog('dlg_file_upload');
        var showStr = '<div class="am-progress"><div id="uploadProgress" class="am-progress-bar" style="width: 0%;background: rgb(119,183,35);"></div><div style="position: absolute;left: 0;right: 0;text-align: center;">' + files[0].name + '</div></div>';
        dlg.html(showStr).dialog({
            title: "正在上传",
            width: 560,
            heigth: 300,
            draggable: true,
            modal: true,
        });
        $('#dlg_file_upload').bind('dialogbeforeclose', function (event, ui) {
            _this.uploader.reset();
        });
        _this.upload();
    });

    //append doc extension
    _this.uploader.on('uploadBeforeSend', function (block, data, headers) {
        data.extension = block.file.ext;
    });

    //进度条
    _this.uploader.on('uploadProgress', function (file, percent) {
        $('#uploadProgress').width(percent * 100 + '%');
    });

    //upload errored
    _this.uploader.on('uploadError', function (file, reason) {
        if (window.console) {
            console.log('file:{{' + file.name + '}} >> Error :' + reason);
        }
        $M().msg(reason).position('10%', '50%').time(3);
    });

    //upload successed
    _this.uploader.on('uploadSuccess', function (file, response) {
        if (response && response.url) {
            _this.docs = [{
                fileId: file.id,
                title: file.name,
                md5: response.md5,
                requestLength: file.size,
                url: response.url
            }];
        } else {
            if (_this.onError && $.isFunction(_this.onError)) {
                _this.onError.apply(this, [{ code: -1, msg: response }]);
                return false;
            }
        }
    });

    //upload finished
    _this.uploader.on('uploadFinished', function () {
        window.onbeforeunload = null;
        _this.onComplete(JSON.stringify(_this.docs), _this.ele);
        $('#dlg_file_upload').dialog('close');
    });
};


uploadFile.prototype.upload = function () {
    var _this = this;
    window.onbeforeunload = function () {
        return "当前有文档正在上传，确定离开该页面？";
    };
    _this.uploader.upload();

};
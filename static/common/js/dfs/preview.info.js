/**
 * DFS 资源预览插件
 * Date: 2015年3月7日21:34:54
 * xLeonard
 *
 */
; (function ($) {

    $.extend({
        _hasFile: function (tag, url) {
            var contains = false;
            var type = (tag == "script") ? "src" : "href";

            $(tag + '[' + type + ']').each(function (i, v) {
                var attr = $(v).attr(type)
                if (attr == url || decodeURIComponent(attr).indexOf(url) != -1) {
                    contains = true;
                    return false;
                }
            });

            return contains;
        },
        _loadCss: function (href, cb) {
            if (!$._hasFile('link', href)) {
                var ele = document.createElement("link");
                ele.setAttribute('type', 'text/css');
                ele.setAttribute('rel', 'stylesheet');
                ele.setAttribute('href', href);

                document.getElementsByTagName('head')[0].appendChild(ele);

                ele.onload = function () {
                    if (cb && $.isFunction(cb)) {
                        cb.apply(this, []);
                    }
                };
            } else {
                if (cb && $.isFunction(cb)) {
                    cb.apply(this, []);
                }
            }
        },
        _loadJs: function (url, callback, data) {
            var scripts = [];

            var script = scripts[url] || (scripts[url] = {
                loaded: false,
                callbacks: []
            });

            if (script.loaded) {
                return callback.apply(this, [data]);
            }

            script.callbacks.push({
                fn: callback
            });

            if (script.callbacks.length == 1) {
                $.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'script',
                    cache: true,
                    success: function () {
                        script.loaded = true;
                        $.each(script.callbacks, function () {
                            this.fn.apply(this, [data]);
                        });
                        script.callbacks.length = 0;
                    },
                    error: function (xhr, status, errorMsg) {
                        if (window.console) {
                            console.log('lazyIncludeError:' + errorMsg + ',statusCode:' + status);
                            throw errorMsg;
                        } else {
                            alert('lazyIncludeError:' + errorMsg + ',statusCode:' + status);
                            throw errorMsg;
                        }
                    }
                });
            }
        },
        _log: function (msg) {

            if (window.console) {
                console.log(msg);
            } else {
                alert(msg);
            }
        },
        insertString: function (ori, position, _new) {

            position = position == -1 ? ori.length + 1 : position;

            return [ori.slice(0, position), _new, ori.slice(position)].join('');
        }
    });

    $.fn.DViewer = function (opts) {
        opts = $.extend(true, {}, $.fn.DViewer.defaults, opts);

        if (!opts.data) {
            if (opts.onError && $.isFunction(opts.onError)) {
                opts.onError.apply(this, { code: -100, msg: '预览数据不正确！！' });
            } else {
                $._log('预览数据不正确！！');
            }
        }

        /***
        *leixu
        *2015年3月7日23:08:10
        *@category  文件的类型
        *@ele   播放内容所放的位置
        *@extension  文件扩展名
        ***/
        var preview = function (ele) {

            //根据doctype 来选择预览的方式
            switch (opts.data.category) {
                case 'img':

                    if (opts.data.extension == 'gif') {

                        ele.html('<div class="gif_container" style="overflow:auto;"><img src="' + opts.data.urls.preview + '" style="display:block; margin:10px auto;"/><div>');

                    } else {

                        var url = opts.data.urls.preview;

                        $._loadCss(opts.baseUrl + 'viewer/imageView/jquery.iviewer.css');
                        $._loadJs(opts.baseUrl + 'viewer/imageView/jquery.iviewer.min.js', function () {
                            ele.iviewer({
                                src: opts.data.extension == 'dwg' ? $.insertString(url, url.indexOf('?'), '/thumbnail.png') : $.insertString(url, url.indexOf('?'), '/preview.jpg'),
                                onErrorLoad: function () {
                                    ele.html('<span class="picture_load_error">图片加载失败了,请尝试刷新页面</span>');
                                }
                            });
                        });
                    }

                    break;
                case 'video':
                    $._loadJs(opts.baseUrl + 'viewer/jwplayer/jwplayer.js', function () {

                        ele.append('<div id="video_container_"' + new Date().getTime() + ' class="video_container" ></div>');

                        var source = [];

                        if (opts.data.args['360p'] && opts.data.args['360p'] === 'true') {
                            source.push({ file: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), "/360p.mp4"), label: "流畅", default: true });
                        }

                        if (opts.data.args['480p'] && opts.data.args['480p'] === 'true') {
                            source.push({ file: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), "/480p.mp4"), label: "清晰" });
                        }

                        if (opts.data.args['720p'] && opts.data.args['720p'] === 'true') {
                            source.push({ file: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), "/720p.mp4"), label: "高清" });
                        }

                        if (opts.data.args['original'] && opts.data.args['original'] === 'true') {
                            source.push({ file: opts.data.urls.preview, label: "原画" });
                        }

                        //切换流畅度时候 可能token 会失效这取决于文件服务器token生效时常
                        var player = jwplayer(ele.find('.video_container').attr('id')).setup({
                            flashplayer: opts.baseUrl + 'viewer/jwplayer/jwplayer.flash.swf',
                            sources: source,
                            autostart: true,
                            provider: 'http',
                            startparam: 'start',
                            width: '100%',
                            height: '100%',
                            base: opts.baseUrl + 'viewer/jwplayer/',
                            skin: {
                                name: "stormtrooper"
                            }
                        });

                        opts.callback.video && opts.callback.video.apply(this, [player]);
                    });

                    break;
                case 'mp3':

                    $._loadJs(opts.baseUrl + 'viewer/jwplayer/jwplayer.js', function () {
                        ele.append('<div id="mp3_container_"' + new Date().getTime() + ' class="mp3_container" ></div>');

                        jwplayer(ele.find('.mp3_container').attr('id')).setup({
                            flashplayer: opts.baseUrl + 'viewer/jwplayer/jwplayer.flash.swf',
                            file: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), "/file.mp3"),
                            autostart: true,
                            width: '100%',
                            height: '100%',
                            base: opts.baseUrl + 'viewer/jwplayer/',
                            skin: {
                                name: "stormtrooper"
                            }
                        });

                    });

                    break;
                case 'swf':
                    $._loadJs(opts.baseUrl + 'viewer/swf/swfobject.js', function () {

                        var random = new Date().valueOf(),
                            params = {};

                        params.quality = "high";
                        params.allowscriptaccess = "sameDomain";
                        params.allowfullscreen = "true";
                        params.wmode = 'transparent';

                        ele.append('<div id="swfobj_div_' + random + '" style="height:100%"></div>')

                        swfobject.embedSWF(opts.data.urls.preview,
                                "swfobj_div_" + random,
                                "100%", "100%",
                                "8.0.0", "http://www.adobe.com/",
                                {}, params);
                    });

                    break;
                case 'office':

                    $._loadCss(opts.baseUrl + 'viewer/MPreview/css/MPreview.css', function () {

                        switch (opts.data.extension) {
                            case 'doc':
                            case 'docx':
                            case 'docm':
                            case 'dot':
                            case 'wps':
                            case 'rtf':
                            case 'txt':
                            case 'odt':
                            case 'pdf':
                            case 'xls':
                            case 'xlsx':
                            case 'et':
                            case 'ods':
                                $._loadJs(opts.baseUrl + 'viewer/MPreview/MPreview.min.js', function () {

                                    //office 有个问题，就是token 可能会失效
                                    var imgs = [];
                                    for (var i = 1; i <= opts.data.args.page_count; i++) {
                                        imgs.push($.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/' + i + '.preview.jpg'));
                                    }

                                    ele.MPreview({ data: imgs });
                                });
                                break;
                            case 'ppt':
                            case 'pptx':
                            case 'pps':
                            case 'odp':
                            case 'dps':
                                $._loadJs(opts.baseUrl + 'viewer/MPreview/MPreviewPPT.min.js', function () {

                                    //office 有个问题，就是token 可能会失效
                                    var imgs = [];
                                    for (var i = 1; i <= opts.data.args.page_count; i++) {
                                        imgs.push($.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/' + i + '.preview.jpg'));
                                    }

                                    ele.MPreviewPPT({ data: imgs });
                                });
                                break;
                        }
                    });

                    break;
                case 'threeScreen':

                    $._loadJs(opts.baseUrl + 'viewer/threeScreen/threeScreen.js', function () {
                        $._loadJs(opts.baseUrl + 'viewer/jwplayer/jwplayer.js', function () {

                            //跨域 getscript will not fired error function
                            var error = setTimeout(function () {
                                ele.html('<span class="error_display" >文件不存在 或者 正在转换，请稍后查看。</span>');
                            }, 2000);

                            $.ajax({
                                type: 'GET',
                                url: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/catalog.js'),
                                cache: false,
                                dataType: 'script',
                                success: function () {
                                    window.clearTimeout(error);

                                    //json_treeview_data is catalog.js 的对象
                                    ele.threeScreen({
                                        playerHtml: opts.baseUrl + 'viewer/threeScreen/html/play.html',
                                        playerCss: opts.baseUrl + 'viewer/threeScreen/css/threeScreen.css',
                                        flashplayer: opts.baseUrl + 'viewer/jwplayer/jwplayer.flash.swf',
                                        skin: {
                                            name: "stormtrooper"
                                        },
                                        baseUrl: opts.baseUrl,
                                        autoStart: true,
                                        teachersUrl: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/teacher.mp4'),
                                        screenUrl: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/screen.mp4'),
                                        directoryData: json_treeview_data,
                                        callback: opts.callback.zipx
                                    });
                                }
                            });
                        });
                    });

                    break;
                case 'shou_threeScreen':

                    $._loadJs(opts.baseUrl + 'viewer/shou_threeScreen/shou_threeScreen.js', function () {
                        $._loadJs(opts.baseUrl + 'viewer/jwplayer/jwplayer.js', function () {

                            //跨域 getscript will not fired error function
                            var error = setTimeout(function () {
                                ele.html('<span class="error_display" >文件不存在 或者 正在转换，请稍后查看。</span>');
                            }, 2000);

                            $.ajax({
                                type: 'GET',
                                url: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/catalog.js'),
                                cache: false,
                                dataType: 'script',
                                success: function () {

                                    window.clearTimeout(error);

                                    //json_treeview_data is catalog.js 的对象
                                    ele.threeScreen({
                                        playerHtml: opts.baseUrl + 'viewer/shou_threeScreen/html/play.html',
                                        playerCss: opts.baseUrl + 'viewer/shou_threeScreen/css/shou_threeScreen.css',
                                        flashplayer: opts.baseUrl + 'viewer/jwplayer/jwplayer.flash.swf',
                                        skin: {
                                            name: "stormtrooper"
                                        },
                                        baseUrl: opts.baseUrl,
                                        autoStart: true,
                                        teachersUrl: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/index.mp4'),
                                        screenUrl: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/index.mp4'),
                                        directoryData: json_treeview_data
                                    });
                                }
                            });
                        });
                    });

                    break;
                case 'csf':

                    $._loadJs(opts.baseUrl + 'viewer/csf/csf.js', function () {
                        $._loadJs(opts.baseUrl + 'viewer/jwplayer/jwplayer.js', function () {

                            //跨域 getscript will not fired error function
                            var error = setTimeout(function () {
                                ele.html('<span class="error_display" >文件不存在 或者 正在转换，请稍后查看。</span>');
                            }, 2000);

                            $.ajax({
                                type: 'GET',
                                url: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/catalog.js'),
                                cache: false,
                                dataType: 'script',
                                success: function () {
                                    window.clearTimeout(error);

                                    //json_treeview_data is catalog.js 的对象
                                    ele.csf({
                                        playerHtml: opts.baseUrl + 'viewer/csf/html/play.html',
                                        playerCss: opts.baseUrl + 'viewer/csf/css/csf.css',
                                        flashplayer: opts.baseUrl + 'viewer/jwplayer/jwplayer.flash.swf',
                                        skin: {
                                            name: "stormtrooper"
                                        },
                                        baseUrl: opts.baseUrl,
                                        autoStart: true,
                                        teachersUrl: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/teacher.mp4'),
                                        screenUrl: $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/screen.mp4'),
                                        directoryData: json_treeview_data,
                                        callback: opts.callback.csf
                                    });
                                }
                            });
                        });
                    });

                    ele.html('<span class="can_not_display" >抱歉，该文件类型暂时还不支持在线查看。</span>');
                    break;
                case 'ziph':

                    //ele 内 嵌入一个 iframe 来播放
                    ele.html('<iframe frameborder="0" style="width:100%;height:100%;" allowtransparency="true" src="' + $.insertString(opts.data.urls.preview, opts.data.urls.preview.indexOf('?'), '/index.html') + '" ></iframe>');

                    break;
                case 'epg':

                    $._loadJs(opts.baseUrl + 'viewer/epg/lessonPlay.js', function () {

                        ele.lessonPlay({
                            playerHtml: opts.baseUrl + 'viewer/epg/html/lessonPlay.html',
                            swfobject: opts.baseUrl + 'viewer/epg/play/swfobject.js',
                            IMKPlayer: opts.baseUrl + 'viewer/epg/play/IMKPlayer.swf',
                            lessonUrl: opts.lessonUrl,
                            anthenUrl: opts.anthenUrl,
                            url: opts.data.urls.statusUrl,
                            t: opts.data.urls.t,
                            m: opts.data.urls.m
                        });

                    });

                    break;
                case 'rar':
                    ele.html('<div class="gif_container" style="overflow:auto;text-align: center;"><a  href="' + opts.data.urls.download + '" style="display: block;padding: 80px 0;"><img src ="' + opts.baseUrl + 'viewer/rar/img/noPreview.png" style="    width: 120px;display: block; margin: 26px auto;"/>本文件不支持在线预览，请<img src="' + opts.baseUrl + 'viewer/rar/img/download.png "/><span style="font-size: 20px;">下载</span>后查看</a><div>');
                    break;

                default:
                    ele.html('<span class="can_not_display" >抱歉，该文件类型暂时还不支持在线查看。</span>');
                    break;
            }
        };

        var callback = function (opts, ele) {

            switch (opts.data.status) {
                case 1:
                    //文件已上传
                    if (opts.onError && $.isFunction(opts.onError)) {
                        opts.onError.apply(this, [{ code: 1, msg: '文件已上传，等待转换中' }]);
                    } else {
                        ele.html('<span style="dfs_error" >要查看的已上传，等待转换中。</span>');
                    }

                    break;
                case 2:

                    //转换成功
                    preview(ele);

                    if (opts.onSuccessed && $.isFunction(opts.onSuccessed)) {
                        opts.onSuccessed.apply(this, opts.data);
                    }

                    break;
                case -1:
                    //正在转换

                    if (opts.onError && $.isFunction(opts.onError)) {
                        opts.onError.apply(this, [{ code: -1, msg: '文件正在转换' }]);
                    } else {
                        ele.html('<span style="dfs_error" >文件正在转换中，请稍后查看……</span>');
                    }

                    break;
                case -2:
                    //转换失败

                    if (opts.onError && $.isFunction(opts.onError)) {
                        opts.onError.apply(this, [{ code: -2, msg: '文件转换失败' }]);
                    } else {
                        ele.html('<span style="dfs_error" >文件转换失败，只能下载后查看。</span>');
                    }

                    break;
                case -3:
                    //文件不支持转换

                    if (opts.onError && $.isFunction(opts.onError)) {
                        opts.onError.apply(this, [{ code: -3, msg: '文件不支持转换' }]);
                    } else {
                        ele.html('<span style="dfs_error" >文件不支持转换。</span>');
                    }

                    break;
                default:
                    //文件不存在

                    if (opts.onError && $.isFunction(opts.onError)) {
                        opts.onError.apply(this, [{ code: 0, msg: '文件不存在' }]);
                    } else {
                        ele.html('<span style="dfs_error" >要查看的文件不存在。</span>');
                    }

                    break;
            }
        };

        return $(this).each(function (i, v) {

            opts.data = JSON.parse(opts.data);

            //如果业务系统没有提供预览的参数，则需要从 dfs 中获取预览参数
            if (!opts.data.status && !opts.data.args) {
                console.log(opts.data);
                $.ajax({
                    type: 'get',
                    url: opts.data.urls.status,
                    dataType: 'jsonp',
                    jsonp: "jsonpcallback",
                    success: function (response, status, xhr) {
                        console.log(response)
                        console.log(status);
                        console.log(xhr);
                        opts.data.status = response.status;
                        opts.data.args = response.args;

                        callback(opts, $(v));     //拿到预览参数后调用预览

                        return false;
                    },
                    error: function (xhr, status) {
                        console.log(2);
                        if (opts.onError && $.isFunction(opts.onError)) {
                            opts.onError.apply(this, [{ code: 500, msg: status }]);
                        } else {
                            $._log(status);
                        }
                    }
                });

            } else {

                callback(opts, $(v));
            }
        });
    };

    $.fn.DViewer.defaults = {
        baseUrl: $('head').data('vp2'),
        data: '',
        onError: null,
        onSuccessed: null,
        callback: {
            video: null,
            csf: null,
            zipx: null
        }
    };

})(jQuery);
(function ($) {

    var info = {
        el: $("#docfrom"),
        get: function (data) {
            var h = this;
            if (data == null) {
                var data = {};
            }
            _.ajax(urls.doc_getDocList, data, function (r) {
                $("#table_html").html(template('pass', r));
                if (r && r.userType == 1) {
                    $('.admin_button').remove();
                }

                h.event();
                _pagination(r.pagination, h.el, "hash");
            }, "json");
            return false;
        },

        event: function () {
            var h = this;
            /*上传资源*/
            $("#upload", h.el).off('click').on('click', function () {
                _.ajax(urls.doc_upLoadView, { deId: _.hash.deId }, function (s) {
                    if (s && s.code == -1) {
                        $M().msg(s.msg).position('10%', '50%').time(3);
                        return false;
                    }

                    var elems = template('upload_html', s);
                    $M({
                        title: '本地上传',
                        content: elems,
                        width: '850px',
                        height: '550px',
                        top: '50px',
                        position: { my: "center", at: "top", of: window },
                        lock: true,
                    });
                    document.onkeydown = function (evt) {
                        if (evt.keyCode == 13) {
                            return false;
                        }
                    }
                    $('.ui-MDialog-autofocus').focus();

                    new upload("", $("#upload_container"), function (data) {
                        $M().msg("上传成功！").position('10%', '50%').time(5);
                        $(".cancel").click();
                        return false;
                    });
                });
            });
            /*预览*/
            $(".preview", h.el).off('click').on('click', function () {
                var Id = $(this).data("id");
                _.ajax(urls.doc_previewDocInfo, { Id: Id }, function (r) {
                    if (r.code != 1) {
                        $M().msg(r.msg).position('10%', '50%').time(3);
                        return false;
                    }
                    if (r.doc.BaseTypeId == "3") {
                        //dialog关闭的时候移除的jwplayer，remove
                        if (window.md && window.md.closeBoolean) {
                            var thePlayer = jwplayer($('.video_container').attr('id'));
                            if (thePlayer.version != undefined) {
                                thePlayer.remove();
                            }
                        }
                    }
                    _.include({
                        jsFiles: [{
                            url: '/common/js/dfs/preview.js', cb: function () {
                                var html = '<div style="position: relative;  height:500px;  overflow: hidden;" id="doc_box"></div>';
                                window.md = $M({
                                    title: '预览资源',
                                    content: html,
                                    width: '850px',
                                    height: '500px',
                                    top: '50px',
                                    position: { my: "center", at: "top", of: window },

                                    lock: true,
                                });
                                $('#doc_box').DViewer({
                                    data: r.url,
                                    baseUrl: '/common/js/dfs/',
                                });

                                document.onkeydown = function (evt) {
                                    if (evt.keyCode == 13) {
                                        return false;
                                    }
                                }
                                $('#doc_box').parents('.ui-MDialog-wrap .ui-MDialog-content').css('padding', '0');
                                $('.ui-MDialog-autofocus').focus();
                            }
                        }], cssFiles: []
                    });
                });

            });

            /*搜索*/
            $("#search", h.el).off('click').on('click', function () {
                var search = $("input[name=name]").val();
                _.hash.name = search;
                if ($('input[name=title]').val() != undefined) {
                    _.hash.title = $('input[name=title]').val();
                }
                _.hash.page = 1;
                location.hash = "#" + _.obj2query(_.hash);
                return false;
            });

            /*删除*/
            $(".delete", h.el).off('click').on('click', function () {
                var Id = new Array();
                var id = $(this).data("id");
                $M({
                    title: '确认提示',
                    content: '确定要删除资源信息？',
                    width: '300px',
                    lock: true,
                    ok: function () {
                        var _this = this;
                        if (id == undefined) {

                            if (docId.length == 0) {
                                this.close();
                                $M().msg("请至少选择一个资源！").position('10%', '50%').time(3);
                                return false;
                            }
                            for (var i = 0; i < docId.length; i++) {
                                Id.push(docId[i]);
                            }
                        } else {
                            Id.push(id);
                        }
                        _.ajax(urls.doc_deleteDocInfo, { Id: Id }, function (r) {
                            if (!r || r.code < 0) {
                                $M().msg("发生未知错误，请刷新后重试！").position('10%', '50%').time(3);
                                return false;
                            }
                            _this.close();
                            h.refresh();
                        }, "json");
                        return false;
                    },
                    cancel: function () {
                        this.close();
                        return false;
                    }
                });
                $('.ui-MDialog-autofocus').focus();
                return false;
            });

        },

        /* 刷新*/
        refresh: function () {
            $(window).hashchange();
            return false;
        },
        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ('?' + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
            h.get();
        }
    };

    info.init();

})(jQuery)
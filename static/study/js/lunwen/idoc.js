(function ($) {

    var info = {
        el: $(".main_content"),
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
                _.ajax(urls.doc_upLoadView, { Id: _.hash.Id }, function (s) {
                    if (s && s.code == -1) {
                        alert(s.msg);
                        return false;
                    }
                     var dlg = jQuery.dynamic_dialog("dlg_upload_resource");
                            dlg.html(template("upload_html", s)).dialog({
                                title: "本地上传",
                                width: 900,
                                height: 550,
                                position: { my: "center", at: "top", of: window },
                                draggable: true,
                                modal: true
                            });
                            new upload(urls.docs_upLoadFile, $("#upload_container"), function (data) {
                                alert("上传成功！");
                                dlg.dialog("close");
                                h.get();
                            });
                });
            });

            /*预览*/
            $(".preview", h.el).off('click').on('click', function () {
                var Id = $(this).data("id");
                _.ajax(urls.doc_previewDocInfo, { Id: Id }, function (r) {
                    if (r.code != 1) {
                        alert(r.msg || '发生未知错误');
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
                                var dlg = jQuery.dynamic_dialog('dlg_preview_resource');
                                var html = '<div style="height:500px;" id="doc_box"></div>';

                                dlg.html(html).dialog({
                                    title: "预览资源",
                                    width: 900,
                                    position: { my: 'center', at: 'top', of: window },
                                    draggable: true,
                                    modal: true,
                                    close: function () {
                                        $("#doc_box").html("");
                                    }
                                });
                                $('#doc_box').DViewer({
                                    data: r.url,
                                    baseUrl: '/common/js/dfs/',
                                });
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
                var Id = $(this).data("id");
                if (Id.length == 0) {
                    alert('请选择要删除的数据', 'warning');
                    return false;
                }
                var data = { Id: Id };
                confirm('是否删除选中的数据？', function () {
                    var type = $("[name=type]", h.el).val();
                    _.ajax(urls.doc_deleteDocInfo, data, function (r) {
                        h.refresh();
                    }, "json");
                }); 
                return false;
            });

            /*下载*/
            $(".download", h.el).off('click').on('click', function () {
                _.ajax(urls.doc_download, { Id: $(this).data("id") }, function (r) {
                    window.location = r.url;
                }, "json");
                return false;
            });

            /*查看*/
            $(".remark", h.el).click(function () {
                _.ajax(urls.doc_getThesisRemark, { Id: $(this).data("id") }, function (r) {
                    if (!r || r.code < 0) {
                        alert(r.msg || '发生未知错误');
                        return false;
                    }
                    if (r.code == 1) {
                        var dlg = jQuery.dynamic_dialog("dlg_add_data");
                        dlg.dialog({
                            title: "查看论文备注",
                            width: 500,
                            height: 300,
                            position: { my: "center", at: "100px", of: window },
                            draggable: true,
                            modal: true
                        });
                        $("#dlg_add_data").html(template("remark_html", r));
                        return false;
                    }
                }, "json");
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
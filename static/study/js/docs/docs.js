/**
 * @name        课程练习
 * @return       null
 * @depend    jQuery, template.js
 * @Date         2016-06-27 16:22:43
 * @author      wl
 * edit by wl 2016-8-24
 */
;
(function ($) {
    var form = $("#docs_form");
    var info = {
        el: $("#docs_wrapper"),
        get: function (ini) {
            var h = this;
            _.ajax(urls.docs_docsList, function (r) {
                if (r.code > 0){
                    var _html = "";
                    if ($('input[name=html_type]', h.el).val() == "1") {
                        _html = "item_html";
                    }

                    $("[name=parentId]", form).val(r.parentId);
                    $("[name=openClassId]", form).val(r.openClassId);

                    if (r.parentId == "0")
                    {
                        $("#toolbar ol li").remove();
                        $("#toolbar ol").append('<li data-parentid="0" class="first">授课资料</li>');
                    }
                    else
                    {
                        var lilen = $("#toolbar ol li[data-parentid=" + r.parentId + "]").length;
                        if (lilen == 0) {
                            $("#toolbar ol li").remove();
                            $("#toolbar ol").append('<li data-parentid="0" class="first"><a href="javascript:;" title="授课资料">授课资料</a></li>');

                            _.ajax(urls.docs_getNodePath, { courseDocId: r.parentId }, function (pr) {
                                if (pr.code > 0) {
                                    jQuery.each(pr.list, function (i, v) {
                                        if (pr.list.length - 1 == i) {
                                            $("#toolbar ol").append('<li class="last" data-parentid="' + v.Id + '">' + v.title + '</li>');
                                        }
                                        else {
                                            $("#toolbar ol").append('<li data-parentid="' + v.Id + '"><a href="javascript:;" title="' + v.title + '">' + v.title + '</a></li>');
                                        }
                                    });
                                }
                            }, "json");
                        }
                    }
                    $("#docs_container").html(template(_html, r));
                    _pagination(r.pagination, h.el);
                    _.resize();
                    h.events();
                } else {
                    alert(r.msg);
                    return false;
                }
            }, "json");
            return this;
        },

        formevents: function () {
            var h = this;

            $("#am-dropdown-content li", h.el).click(function () {
                _.hash.orderby = $(this).find('a').data("orderby");
                _.hash.page = 1;
                location.hash = "#" + _.obj2query(_.hash)
                $('#div_orderby').dropdown('close');
                $('#lbl_showorderby').html($(this).find('a').text());
                $('#lbl_showorderby').attr('name', $(this).data('orderby'))
                return false;
            });
            /*按钮查询*/
            $("#btn_search", h.el).click(function () {
                var data = form.serialize();
                data = decodeURIComponent(data, true);
                location.hash = "#" + data + "&page=" + 1;
                return false;
            });

            /*回车查询*/
            $("#txt_search").keydown(function (e) {
                if(e.keyCode==13){
                    $("#btn_search", h.el).trigger("click");
                    return false;
                }
            });
        },

        events: function () {
            var h = this;

            $(".download", h.el).click(function () {
                _.ajax(urls.docs_download, { docID: $(this).data("id") }, function (r) {
                    window.location = r.url;
                }, "json");
                return false;
            });

            $(".preview[data-isdir=0]", h.el).click(function () {
                _.ajax(urls.docs_preview, { docID: $(this).data("id") }, function (r) {
                    if (!r || r.code < 0) {
                        alert(r.msg || '发生未知错误');
                        return false;
                    }
                    if (r.code == 1) {
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
                    }
                }, "json");
                return false;
            });

            $(".preview[data-isdir=1]", h.el).one("click", function () {
                var _this = $(this),
                    id = _this.data("id"),
                    title = _this.data("title");
                $("[name=parentId]",form).val(id);
                
                var lititle = $("#toolbar ol li:last").text();
                $("#toolbar ol li:last").html("").removeClass("last").append("<a href='javascript:;' title=" + lititle + ">" + lititle + "</a>");
                $("#toolbar ol").append("<li class='last' data-parentid='" + id + "'>" + title + "</li>");

                location.hash = "#" + decodeURIComponent(form.serialize());
                return false;
            });

            $("#toolbar").off("click").one("click", "a" , function () {
                var _this = $(this);
                toolbara.apply(_this);
            });

        },
        refresh: function () {
            $(window).hashchange();
            return this;
        },

        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ('?' + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
            h.get(1);
            h.formevents();
        }
    };
    info.init();

    function toolbara() {
        $("#txt_search").val("");
        var _this = $(this),
               _parent = _this.parent(),
               li_index = _parent.index(),
               atitle = _this.text(),
               parentid = _parent.data("parentid");

        $("[name=parentId]", form).val(parentid);
        $("#toolbar ol li:gt(" + li_index + ")").remove();
        _parent.text(atitle).addClass("last").find("a").remove();
        location.hash = "#" + decodeURIComponent(form.serialize());
        return false;
    }
})(jQuery)
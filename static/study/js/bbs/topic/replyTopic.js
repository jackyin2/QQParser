/**
 * @name        回复主题贴
 * @return       null
 * @depend    jQuery, template.js
 * @Date      2016-9-21 17:02:34
 * @author     redo by cjcheng
 */
;
(function ($) {
    var categoryType = _.hash.categoryType;
    var info = {
        el: $("#reply"),
        /*获取主题帖*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.bbs_getTopic, function (r) {
                if (r.code==-2) {
                    alert("板块不存在！正在关闭当前页面");
                    setTimeout(function () {
                        window.close();
                    }, 2000);
                    return false;
                }

                $("#reply_panel_head").html(template('reply_title_head', r));
                $("#reply_headshow").html(template('reply_head', r));
                if (r.code>0) {
                    $("#reply_box_content").html(template('reply_box'));
                    $.bindUeditor("Content");
                    h.getreplylist();
                    h.event();
                }
            }, "json");
            return false;
        },
        /*回复列表*/
        getreplylist: function () {
            var h = this;
            _.ajax(urls.bbs_getReplyInfo, function (r) {
                $("#qa-comments").html(template('parent_reply', r));
                if (r.code > 0) {
                    _pagination(r.pagination, h.el);
                }
                _.resize();
                h.del();
                h.prase();
                h.sonreply();
                h.more();
                h.bbsTab();
                h.rate();
            }, "json");
            return false;
        },

        /*删除回复*/
        del: function () {
            var h = this;
            $(".delReply", h.el).die('click').live('click', function () {
                var replyId = $(this).data("replyid");
                confirm("确定要删除该回复？", function () {
                    _.ajax(urls.bbs_deleteReply, { replyId: replyId, categoryType: categoryType }, function (r) {
                        if (!r || r.code < 0) {
                            alert(r.msg || '发生未知错误，请刷新后重试！');
                            return false;
                        }
                        h.refresh();
                    }, "json");
                    return false;
                });
                return false;
            });
        },

        /*点赞*/
        prase: function () {
            var h = this;
            $(".addPrase", h.el).off('click').on('click', function () {
                var replyId = $(this).data("replyid");
                _.ajax(urls.bbs_addPrase, { replyId: replyId }, function (r) {
                    h.refresh();
                }, "json");
                return false;
            });
        },

        /*子级回复*/
        sonreply: function () {
            var h = this;
            $(".addReply", h.el).die('click').live('click', function () {
                var _this=$(this);
                var ParentId = _this.data("replyid");
                var ReplyName = _this.data("replyname");
                var ReplyContent = "回复 " + ReplyName + "：";
                $("[name=ParentId]").val(ParentId);
                $("[name=ReplyContent]").val(ReplyContent);
                $("#ueditor_0").contents().find(".view p").html(ReplyContent);
                scrollto($(".typebox").filter("[data-type=1]"));
                return false;
            });
        },

        /*回复*/
        event: function (ini) {
            var h = this;
            /*跳转到回复框位置*/
            $(".go_type", h.el).off('click').on('click', function () {
                scrollto($(".typebox").filter("[data-type=1]"));
            });

            $.bindUeditor("Content");
            $("#btn_reply", h.el).off('click').on('click',function () {
                var topicId = $('[name=topicId]', h.el).val();
                var courseOpenId = $('[name=courseOpenId]', h.el).val();
                // var Content = editor.getContent();
                var Content = UE.getEditor("Content").getContent();
                if (Content.length == 0 || Content.length > 200) { alert("内容不能为空并且不能超过200个字！"); return false; }
                var replyId = null;
                /*回复子级*/
                var ReplyContent = $("[name=ReplyContent]").val();
                /*如果子级回复存在，则返回parentId*/
                var x = Content.indexOf(ReplyContent);
                if (Content.indexOf(ReplyContent) != -1)
                {
                    var parentId = $("[name=ParentId]").val();
                }
                _.ajax(urls.bbs_addReply, { topicId: topicId, courseOpenId: courseOpenId, categoryType: categoryType, replyId: replyId, Content: Content, parentId: parentId }, function (r) {
                    if (!r || r.code < 0) {
                        alert(r.msg || '发生未知错误，请刷新后重试！');
                        return false;
                    }
                    h.refresh();
                    UE.getEditor("Content").setContent("");
                    $('body')[0].scrollTop = 0;
                }, "json");
                return false;
            });
        },

        /*加载更多*/
        more: function (ini) {
            h = this;
            $(".load_more").off('click').on('click', function () {
                var _this = $(this);
                var loadsize = _this.data("loadsize");
                var replyId = _this.data("replyid");
                var page = _this.data("page");
              
                var topicId = _.hash.topicId;
                page += 1;
                _.ajax(urls.bbs_getSonReply, { topicId: topicId, replyId: replyId, loadsize: loadsize, page: page }, function (r) {
                    $("#" + replyId + "").append(template('son_reply', r));
                    _this.hide();
                    h.more();
                }, "json");
                return false;
            });
        },

        /*帖子切换*/
        bbsTab:function (ini) {
            h = this;
            /*我的帖子*/
            $(".mybbs", h.el).off('click').on('click', function () {
                var _this = $(this);
                var courseOpenId = _this.data('courseopenid'),
                    categoryType = _this.data('categorytype'),
                    topicId = _this.data('topicid');
                _this.addClass("active").siblings().removeClass("active");

                location.hash = "#topicId=" + topicId + "&courseOpenId=" + courseOpenId + "&categoryType=" + categoryType + "&condition=mybbs";
                return false;
            });

            /*所有帖子*/
            $(".allbbs", h.el).off('click').on('click', function () {
                var _this = $(this);
                var courseOpenId = _this.data('courseopenid'),
                    categoryType = _this.data('categorytype'),
                    topicId = _this.data('topicid');
                _this.addClass("active").siblings().removeClass("active");

                location.hash = "#topicId=" + topicId + "&courseOpenId=" + courseOpenId + "&categoryType=" + categoryType ;
                return false;
            });
        },

        /*星级显示*/
        rate: function (ini) {
            h = this;
            jQuery.each($(".ratebox"), function () {
                var rate = $(this).data("rate"),
                src_on = $(this).data('on');
                src_off = $(this).data('off');
                if (rate > 0) {
                    $(this).show();
                    for (var i = 1; i <= rate; i++) {
                        $(this).find('.ratebox-' + i).attr('src', src_on);
                    }
                }
            });
        },

        /*刷新*/
        refresh: function () {
            $(window).hashchange();
            return false;
        },

        /*hash值*/
        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ('?' + location.hash.substring(1)).QueryStringToJSON();
                h.getreplylist();
            });
            h.get(1);
        }
    };
    function scrollto(y) {
        var scroll = $((navigator.userAgent.indexOf("MSIE") + navigator.userAgent.indexOf("rv:") > 0) ? window : document.body);
        y = $(y).offset().top - $(".headTop").outerHeight();
        try { scroll.stop().animate({ scrollTop: y }, 300, function () { scroll.scrollTop(y); }); }
        catch (e) { scroll.scrollTop(y); }
    }

    info.init();
})(jQuery)
/**
 * @name        在线答疑
 * @return       null
 * @depend    jQuery, template.js
 * @Date         2016-9-21 15:47:03
 * @author     redo by cjcheng
 */
;
(function ($) {
    var courseOpenId = _.hash.courseOpenId;
    var categoryType = _.hash.categoryType;
    var openClassId = _.hash.openClassId;
    var sort = null;
    var condition = null;
    var info = {
        el: $("#topic"),
        /*获取列表*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.bbs_topicList, function (r) {
                if (r.code < 0) {
                    alert("BBS板块不存在，正在关闭当前页面");
                    setTimeout(function () {
                        window.close()
                    }, 2000)
                }
                $("#bbs_headshow").html(template('bbs_head', r));
                $("#content_container").html(template('bbs_table', r));
                _pagination(r.pagination, h.el);
                _.resize();
                h.search();
                h.del();
            }, "json");
            return false;
        },

        /*加载数据*/
        load: function (ini) {
            var h = this;
            $("#dataload_show").html(template('dataload', { categoryType: categoryType }));
            h.event();
        },
        /*查询*/
        search: function () {
            var h = this;

            $("#btn_search", h.el).click(function () {
                var q = $('[name=q]', h.el).val();
                location.hash = "#courseOpenId=" + courseOpenId + "&openClassId=" + openClassId + "&categoryType=" + categoryType + "&sort=" + sort + "&Condition=" + condition + "&q=" + q;
                return false;
            });
        },

        /*删除*/
        del: function () {
            var h = this;
            $(".del_topic", h.el).click(function () {
                var topicId = $(this).data("topicid");
                confirm("确定要删除该主题帖？", function () {
                    _.ajax(urls.bbs_deleteTopic, { topicId: topicId, categoryType: categoryType }, function (r) {
                        if (!r || r.code < 0) {
                            alert(r.msg || '发生未知错误，请刷新后重试！');
                            return false;
                        }
                        h.refresh();
                    }, "json");
                });
                return false;
            });
        },

        /*Tab切换*/
        event: function () {
            $(".quealltab").click(function () {
                var _this = $(this);
                _this.addClass("active").siblings().removeClass("active");
                sort = _this.data("sort");
                condition = _this.data("condition");
                if (!sort) {
                    sort = "";
                }
                if (!condition) {
                    condition = "";
                }
                location.hash = "#courseOpenId=" + courseOpenId +"&openClassId=" + openClassId+ "&categoryType=" + categoryType + "&sort=" + sort + "&Condition=" + condition;
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
                h.get();
            });
            h.get(1);
            h.load();
        }
    };
    info.init();
})(jQuery)
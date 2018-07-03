/**
 * @name 学生成绩排行
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-27
 * @author   wzq
 * redo by cjcheng
 */

(function ($) {
    var info = {
        el: $("#indexForm"),
        get: function (ini) {
            var h = this;
            _.ajax(urls.viewScore_getStuScoreList, function (r) {
                $("#tabList").html(template("couser", r));
                $("#labClassInfo", h.el).text(r.openClassName + "(" + r.openClassCode + ")");

                if (r.viewIndex == 1)
                {
                    $("#content_container").html(template("table_htmlScore", r));
                }
                if (r.viewIndex == 2)
                {
                    $("#content_container").html(template("table_htmProgress", r));
                }
                if (r.viewIndex == 3)
                {
                    $("#content_container").html(template("table_htmlLearningTime", r));
                }
                h.tabChange();
                h.events();
                _pagination(r.pagination, h.el);
                _.resize();
            }, "json");
            return false;

        },
        events: function () {
            var h = this;

            /*按钮查询事件*/
            $("#btn_search", h.el).click(function () {
                var data = h.el.serialize();
                data = decodeURIComponent(data, true);
                location.hash = "#" + data;
                return false;
            });

            /*回车查询*/
            $("#stuName", h.el).keydown(function (e) {
                if (e.keyCode == 13) {
                    var data = h.el.serialize();
                    data = decodeURIComponent(data, true);
                    location.hash = "#" + data;
                    return false;
                }
            });
        },

        tabChange: function () {
            var h = this;
            /*tab切换*/   
            $("#tabList li", h.el).off("click").on("click", function () {
                var _this = $(this),
                    viewIndex = _this.data("viewindex");

                location.hash = "#courseOpenId=" + _.hash.courseOpenId + "&openClassId="+_.hash.openClassId+"&viewIndex=" + viewIndex;
                $("#stuName", h.el).val("");
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
                _.hash = ("?" + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
            h.get(1);
        }
    };
    info.init();
})(jQuery)
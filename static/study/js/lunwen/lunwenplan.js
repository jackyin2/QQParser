/**
 * @name        论文管理
 * @depend    jQuery, template.js
 * @Date         2016-11-29 14:07:27
 * @author      fxs
 */
;
(function ($) {
    var info = {
        el: $("#main_content"),

        /*获取列表（Table列表显示）*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.thesisquestion_getThesisPlanList, function (r) {
                $("#thesisQuestionList").html(template('thesisQuestionListShow', r));
                _pagination(r.pagination, h.el);
            }, "json");
            return false;
        },

        /*查询*/
        search: function () {
            var h = this;
            $("#search").click(function () {
                var search = $("input[name=key]").val();
                _.hash.key = search;
                _.hash.page = 1;
                location.hash = "#" + _.obj2query(_.hash);
                return false;
            });
        },

        /* 刷新*/
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
            h.search();
        }
    };
    info.init();
})(jQuery)
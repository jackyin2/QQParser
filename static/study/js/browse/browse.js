/**
 * @name        浏览记录
 * @depend    jQuery, template.js
 * @Date         2016-10-31 17:10:52
 * @author      summerice
 */
;
(function ($) {
    var info = {
        el: $("#browseinfo"),

        /*获取列表（Table列表显示）*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.browse_getBrowse, function (r) {
                $("#browseList").html(template('browseListShow', r));
                _pagination(r.pagination, h.el, "hash");
                h.search();
            }, "json");
            return false;
        },

        /*查询*/
        search: function () {
            var h = this;
            $("#search", h.el).click(function () {
                var search = $("input[name=search]").val();
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
        }
    };
    info.init();
})(jQuery)
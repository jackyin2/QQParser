(function ($) {
    var info = {
        el: $("#activityinfo"),

        /*获取列表*/
        get: function () {
            var h = this;
            _.ajax(urls.activity_getActivity, function (r) {
                $("#activityList").html(template('activityListShow', r));
                _pagination(r.pagination, h.el, "hash");
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
            h.search();
        }
    };
    info.init();
})(jQuery)
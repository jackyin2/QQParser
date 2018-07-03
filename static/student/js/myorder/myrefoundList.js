
(function ($) {
    var info = {
        el: $(".main_content"),

        /*获取列表（Table列表显示）*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.MyClassCourse_getRefoundList, function (r) {
                $("#MyRefoundList").html(template('MyRefoundListShow', r));
                _pagination(r.pagination, h.el);
                _.resize();
            }, "json");
            return false;
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
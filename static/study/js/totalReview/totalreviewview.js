/**
 * @name        学生总复习详情
 * @return       null
 * @depend    jQuery, template.js
 * @Date         2016/7/7
 * @author      wzq
 */
;
(function ($) {
    var info = {
        /*获取详情*/
        get: function (ini) {
            _.ajax(urls.totalreview, function (r) {
                $("#totalreview_show").html(template('totalreview_view', r));
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
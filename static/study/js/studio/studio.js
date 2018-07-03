/**
 * @name 学生工作室
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 11:14:38
 * @author   cc
 */
;
(function ($) {
    var info = {
        el: $('#right_content'),
        get: function (ini) {
            var h = this;
            _.ajax(urls.studio_Index, function (r) {
                if (r.code < 0) {
                    alert(r.msg);
                    return false;
                }
                $("#stuInfo", h.el).parent().html(template('stuInfo', r));
            }, "json");
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
        }
    };

    info.init();
})(jQuery)
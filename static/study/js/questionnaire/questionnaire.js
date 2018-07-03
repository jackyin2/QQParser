/**
 * @name 问卷列表
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016/7/27
 * @author   wzq
 */
;
(function ($) {

    var info = {
        get: function (ini) {
            var h = this;
            _.ajax(urls.questionnaire_getList, function (r) {
                $("#content_container").html(template('table_html', r));
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
            }, "json");
            return false;

        },
        events: function () {
            var h = this;
            var table = $("#table_info");
        },
        /* 刷新*/
        refresh: function () {
            $(window).hashchange();
            return false;
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
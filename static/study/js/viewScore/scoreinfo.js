/**
 * @name 成绩信息
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-27
 * @author   wzq
 */
;
(function ($) {

    var info = {
        el: $("#right_content"),

        get: function (ini) {
            var h = this;
            _.ajax(urls.viewScore_getHomeworkTable, function (r) {
                $("#content_container").html(template('homeworkinfo', r));
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
            }, "json");
            return false;

        },
        getPersonInfo: function (ini) {
            var h = this;
            _.ajax(urls.viewScore_getPersonInfo, function (t) {
                $("#getcourseId").html(template('courseId', t));
                $("#stuinfo").html(template('stu',t));
                _.resize();
            }, "json");
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
            h.getPersonInfo(1);
        }

    };

    info.init();

})(jQuery)
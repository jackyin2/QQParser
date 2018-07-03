/**
 * @name 人员信息
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-27
 * @author   wzq
 */

(function ($) {
    var info = {
        el: $("#indexForm"),

        get: function (ini) {
            var h = this;
            _.ajax(urls.openStudent_getOpenStudentList, function (r) {
                $("#content_container").html(template("table_html", r));
                $("#labClassInfo", h.el).text(r.openClassName + "(" + r.openClassCode + ")");
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
            }, "json");
            return false;

        },
        events: function () {
            var h = this;
            /*按钮查询*/
            $("#btn_search", h.el).off("click").on("click",function () {
                var data = $("#indexForm").serialize();
                data = decodeURIComponent(data, true);
                location.hash = "#" + data;
                return false;
            });

            /*回车查询*/
            $("#studentData", h.el).keydown(function (e) {
                if (e.keyCode == 13) {
                    var data = h.el.serialize();
                    data = decodeURIComponent(data, true);
                    location.hash = "#" + data;
                    return false;
                };
            });
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
/**
 * @name 在线作业
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-7-21
 * @author   wl
 */

$(function () {
    var info = {
        el: $("#indexForm"),
        get: function (ini) {
            var h = this;
            _.ajax(urls.homework_getHomeworkList, function (r) {
                if (r.code > 0) {
                    $("#container").html(template("table_html", r));
                }
                else {
                    alert(r.msg);
                    return false;
                }
                $("[name=courseOpenId]", h.el).val(r.courseOpenId);
                $("[name=openClassId]", h.el).val(r.openClassId);
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
            }, "json");
            return false;
        },
        events: function () {
            var h = this;
            var table = $("#maintab");
        },
        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ("?" + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
            h.get(1);
        },
        reloadData: function () {
            $(window).hashchange();
            return this;
        }
    };
    info.init();
});
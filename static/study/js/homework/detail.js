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
            _.ajax(urls.homework_detail, function (r) {
                $("#container").html(template("table_html", r));
                $("[name=courseOpenId]", h.el).val(r.courseOpenId);
                $("[name=homeworkId]", h.el).val(r.homeworkId);
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
            }, "json");
            return false;
        },
        initHomeworkData:function(){
            _.ajax(urls.homework_getHomeworkData, function (r) {
                $("#headContainer").html(template("table_head", r));
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
           
            h.initHomeworkData();
            h.get(1);
        },
        reloadData: function () {
            $(window).hashchange();
            return this;
        }
    };
    info.init();
});
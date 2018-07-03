/**
 * @name 在线考试
 * @return null
 * @depend   jQuery, template.js
 * @Date    2016-7-25 10:05:27
 * @author   cjcheng
 */

$(function () {
    var info={
        el: $("#finalExam_form"),
        get:function (ini) {
            var h = this;
            _.ajax(urls.finalExam_getList, function (r) {
                if (r.code>0) {
                    $("#mainContent", h.el).html(template('finalExamList_html', r))
                } else {
                    alert(r.msg);
                    return false;
                }
            });
            return false;
        },

        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ("?" + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
            h.get(1);
        },
    };
    info.init();
});



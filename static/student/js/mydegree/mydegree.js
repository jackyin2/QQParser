/**
 * @name 我的学位
 * @depend   jQuery, template.js
 * @Date     2017-1-3
 * @author   wzq
 */

(function ($) {

    var info = {
        el: $("#right_content"),
        get: function () {
            var h = this;
            _.ajax(urls.mydegree_getStudentInfos, function (r) {
                $("#degree", h.el).html(template("degreeInfo", r));
                h.events();
            }, "json");
            return false;
        },
        
        events: function () {
            var h = this;
            /*报考*/
            $(".examination",h.el).off('click').on('click', function () {
                var CourseId = $(this).data("courseid");
                var StuId = $(this).data("stuid");
                _.ajax(urls.mydegree_getExamInfo, { CourseId: CourseId, StuId: StuId }, function (r) {
                    var elems = template('examInfo', r);
                    $M({
                        title: '报考信息',
                        content: elems,
                        width: '550px',
                        height: '240px',
                        top: '50px',
                        position: { my: "center", at: "top", of: window },
                        lock: true,
                        ok: function () {
                            this.close();
                            return false;
                        }
                    });
                    $('.ui-MDialog-autofocus').focus();
                });
            });
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



/**
 * @name 我的毕业
 * @depend   jQuery, template.js
 * @Date    2017-01-04 11:06:31
 * @author   summerice
 */

(function ($) {
    var info = {
        el: $("#right_content"),
        /*获取信息*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.mygraduation_getPersonInfo, function (r) {
                $("#graduationShow", h.el).html(template("graduation", r));
                h.scoreDetail();
            }, "json");
            return false;
        },

        /*成绩详情*/
        scoreDetail: function () {
            $(".scoreDetail").off('click').on('click', function () {
                var CourseId = $(this).data("courseid");
                var StuId = $(this).data("stuid");
                _.ajax(urls.mygraduation_getExamInfo, { CourseId: CourseId, StuId: StuId }, function (r) {
                    var elems = template('examInfo', r);
                    $M({
                        title: '成绩详情',
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

        /*刷新*/
        refresh: function () {
            $(window).hashchange();
            return this;
        },

        /*初始加载*/
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



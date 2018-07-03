/**
 * @name 学生空间
 * @depend   jQuery, template.js
 * @Date     2017-12-06 16:05:00
 * @author   zp
 */

(function ($) {

    var info = {
        el: $("#right_content"),
        get: function (ini) {
            var h = this;
            var ClassId = _.hash.ClassId;
            _.ajax(urls.MyClass_GetClassCourseList, function (r) {
                
                $("#content_container", h.el).html(template("table_html", r));
                _pagination(r.pagination, h.el);
                $("#classInfoId").val(_.hash.name);
                _.resize();
                h.event();
            }, "json");
            return false;
        },

        /*查询*/
        event: function () {
            var h = this;
            $('.addShopCar', h.el).off('click').on('click', function () {
                var CourseChooseId = $(this).data("id");
                _.ajax(urls.MyClassCourse_AddShopCar, { CourseChooseId: CourseChooseId }, function (r) {
                    if (r.code == 1) {
                        alert(r.msg);
                        h.refresh();
                    } else {
                        alert("添加失败");
                    }
                },"json")
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



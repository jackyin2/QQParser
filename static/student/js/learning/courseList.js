/**
 * @name 学生空间
 * @depend   jQuery, template.js
 * @Date     2016-6-25 11:14:38
 * @author   zlhu
 */

(function ($) {

    var info = {
        el: $("#right_content"),
        get: function (ini) {
            var h = this;
            _.ajax(urls.learning_GetLearnningCourseList, function (r) {
                $("#content_container", h.el).html(template("table_html", r));
                $("#searchInfo").html(template('searchInfoTip', r));
                _pagination(r.pagination, h.el);
                h.search();
                h.event();
                $("#classInfoId").val(_.hash.name);
                _.resize();
            }, "json");
            return false;
        },

        event: function () {
            
            $(".courseOpen").off("click").on("click", function () {
                alert("该课程是收费课程，请先去缴费！");
            });
        },

        /*查询*/
        search: function () {
            $("#classInfoId").change(function () {
                var h = this;
                var search = $("#classInfoId").val();
                _.hash.name = search;
                _.hash.page = 1;
                location.hash = "#" + _.obj2query(_.hash);
                return false;
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



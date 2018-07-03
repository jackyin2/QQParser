/**
 * @name        论文管理
 * @depend    jQuery, template.js
 * @Date         2016-11-29 14:07:27
 * @author      fxs
 */
;
(function ($) {
    var info = {
        el: $(".main_content"),

        /*获取列表（Table列表显示）*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.MyClass_getClassList, function (r) {
                $("#MyClassList").html(template('MyClassListShow', r));
                _pagination(r.pagination, h.el);
                h.search();
                h.del();
                _.resize();
            }, "json");
            return false;
        },

        /*退出班级*/
        del: function () {
            var h = this;
            $('.del', h.el).off('click').on('click', function () {
                var Id = $(this).data("id");
                
                var ClassId = $(this).data("classid");
                var _this = this;
                if (!Id) {
                    alert('请选择要操作的数据', 'warning');
                    return false;
                };
                confirm('是否删退出该班级？', function () {
                    var type = $("[name=type]", h.el).val();
                    _.ajax(urls.myclass_deleteStudent, { Id: Id, ClassId: ClassId }, function (r) {
                        h.refresh();
                    }, "json");
                });
                return false;
            });
        },

        /*查询*/
        search: function () {
            var h = this;
            $("#search").click(function () {
                var search = $("input[name=key]").val();
                _.hash.key = search;
                _.hash.page = 1;
                location.hash = "#" + _.obj2query(_.hash);
                return false;
            });
        },

        /* 刷新*/
        refresh: function () {
            $(window).hashchange();
            return false;
        },

        /*hash值*/
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
/**
 * @name 学生工作室
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 11:14:38
 * @author   cc
 */
;
(function ($) {

    var info = {
        el: $('#right_content'),
        get: function (ini) {
            var h = this;
            _.ajax(urls.learning_GetLearnningCourseList, function (r) {
                $("#content_container", h.el).html(template('table_html', r));
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
            }, 'json');
            return this;
        },

        getIndex: function (ini) {
            var h = this;
            
            _.ajax(urls.studio_Index, function (r) {
                if (r.code < 0) {
                    alert(r.msg);
                    return false;
                }
                $("#stuInfo", h.el).parent().html(template('stuInfo', r));
            }, "json");
        },
        events: function () {
            var h = this;
            var table = $("#table_html");

            $(".courseOpen").off("click").on("click", function () {
                alert("该课程是收费课程，请先去缴费！");
            });

            // $('.quealltab', h.el).click(function () {
            //     location.hash = "#type=" + $(this).data("type");
            //     return false;
            // });

            $(".tabChange li", h.el).click(function () {
                location.hash = "#type=" + $(this).data("type");
                return false;
            });

            $(".delete_btn", h.el).click(function () {
                array = _.getSelectedRowIds(table);
                if (array.length == 0) {
                    alert('请选择要删除的数据', 'warning');
                    return false;
                }
                confirm('是否删除选中的数据？', function () {
                    var type = $("[name=type]", h.el).val();
                    _.ajax(urls.message_delete, { ids: array, type: type }, function (r) {
                        h.refresh();
                    }, "json");
                });
                return false;
            });

            //全选或全不选 同步全选框
            _.checkAll(table)

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
            h.getIndex(1);
        }
    };

    info.init();

})(jQuery)



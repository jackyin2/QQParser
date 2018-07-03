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
            var orderId = _.hash.Id;
            
            _.ajax(urls.MyClassCourse_getOrderInfo, function (r) {
                
                $("#MyCourseList").html(template('MyCourseListShow', r));
                _pagination(r.pagination, h.el);
                h.search();
                h.event();
            }, "json");
            return false;
        },

        event: function () {
            var h = this;
            $('.refound', h.el).off('click').on('click', function () {
                var id = $(this).data("id");
                var dlg = jQuery.dynamic_dialog("dlg_add_data");
                dlg.dialog({
                    title: "退款原因",
                    width: 500,
                    height: 350,
                    position: { my: "center", at: "100px", of: window },
                    draggable: true,
                    modal: true,
                    buttons: {
                        "保存": function () {
                            if ($("#reason").val() == "") {
                                alert("请填写退款的原因！");
                                $('#reason').focus();
                                return false;
                            }
                            var reason = $("#reason").val();
                            var remark = $("#remark").val();
                            _.ajax(urls.MyClassCourse_refound, { id: id, reason: reason, remark: remark }, function (r) {
                                alert(r.msg);
                                dlg.dialog("close");
                                h.refresh();
                            }, "json")
                        }, "取消": function () {
                            dlg.dialog("close");
                        }
                    }
                });
                $("#dlg_add_data").html(template("reason_html", data));
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
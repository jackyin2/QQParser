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
            _.ajax(urls.MyClassCourse_getOrderList, function (r) {
                $("#MyOrderList").html(template('MyOrderListShow', r));
                _pagination(r.pagination, h.el);
                h.search();
                h.event();
                _.resize();
            }, "json");
            return false;
        },

        event: function () {
            var h = this;
            $('.deleteOrder', h.el).off('click').on('click', function () {
                var id = $(this).data("id");
                confirm('确定删除订单？', function () {
                    _.ajax(urls.MyClassCourse_deleteOrder, { id: id }, function (r) {
                        alert(r.msg);
                        h.refresh();
                    }, "json")
                });
            });
        },

        /*查询*/
        search: function () {
            var h = this;
            $("#search").click(function () {
                var start_date = $("#start_date").val(),
                    end_date = $("#end_date").val();
                var pStartTime = new Date(start_date).getTime(),
                    pEndTime = new Date(end_date).getTime();

                if (pStartTime > pEndTime) {
                    alert('结束时间不能大于开始时间！');
                    $('#end_date').focus();
                    return false;
                }
                var search = $("input[name=key]").val();
                _.hash.startDate = start_date;
                _.hash.endDate = end_date;
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
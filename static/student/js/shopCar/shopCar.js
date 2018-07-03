/**
 * @name 学生空间
 * @depend   jQuery, template.js
 * @Date     2017-12-06 16:06:00
 * @author   zp
 */

(function ($) {

    var info = {
        el: $("#right_content"),
        get: function (ini) {
            var h = this;
            var ClassId = _.hash.ClassId;
            _.ajax(urls.MyClassCourse_getShopCarList, function (r) {
                $("#content_container", h.el).html(template("table_html", r));
                _pagination(r.pagination, h.el);
                checkAll($("#table_info", h.el));
                $("#classInfoId").val(_.hash.name);
                _.resize();
                h.event();
                h.search();
            }, "json");
            return false;
        },

        event: function () {
            var h = this;
            
            $('.removeShopCar', h.el).off('click').on('click', function () {
                var id = $(this).data("id");
                _.ajax(urls.MyClassCourse_removeShopCar, { id: id }, function (r) {
                    if (r.code == 1) {
                        alert(r.msg);
                        h.refresh();
                    } else {
                        alert("移出失败");
                    }
                }, "json")
            });
            /*提交订单*/
            $('.submitOrder', h.el).off('click').on('click', function () {
                var ids = _.getSelectedRowIds($("#table_info", h.el));
                if (ids.length < 1)
                {
                    alert("你还未选择课程，请先选择！");
                    return false;
                }
                _.ajax(urls.MyClassCourse_submitOrder, { ids: ids }, function (r){
                    if (r.code == 1) {
                        alert(r.msg);
                        h.refresh();
                    } else {
                        alert("订单提交失败");
                    }
                }, "json")
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

    function checkAll(table) {
        /*全选或全不选*/
        $('.checkAll', table).click(function () {
            if ($(this).is(':checked')) {
                $('.check', table).attr('checked', true);
                $('.check', table).parents('tr').addClass('current');
                var money = getSelectedRowMoney(table);
               
            } else {
                $('.check', table).attr('checked', false);
                $('.check', table).parents('tr').removeClass('current');
                var money = getSelectedRowMoney(table);
            }
        });

        /*同步全选框*/
        $('.check', table).click(function () {
            var objs = $('.check', table);
            $('.checkAll', table).attr('checked', objs.length == objs.filter(':checked').length);
            if ($(this).is(':checked')) {
                $(this).parents('tr').addClass('current');
                var money = getSelectedRowMoney(table);
            } else {
                $(this).parents('tr').removeClass('current');
                var money = getSelectedRowMoney(table);
            };
        });
    };

    function getSelectedRowMoney(table) {
        var money = 0;
        $.each($("tbody tr td:first-child :checkbox[checked]", table), function (i, v) {
            money = money + $(this).parents('tr:first').data('money')
        });
        $(".money").html(money);
        return money;
    };
})(jQuery)



/**
 * @name 我的邮件
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 13:41:25
 * @author   zqyou
 */

(function ($) {
    var info = {
        el: $("#right_content"),

        get: function (ini) {
            var h = this;
            _.ajax(urls.myMessage_getList, function (r) {
                $("#content_container").html(template('table_html', r));
                $("input[name=parentId]", h.el).val(r.parentId);
                $("#btnSendMsg").attr("href", "addMessage.html#parentId=" + r.parentId);
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
            }, "json");
            return this;
        },

        /*切换标签*/
        events: function () {
            var h = this;
            $('.quealltab', h.el).click(function () {
                location.hash = "type=" + $(this).data("type");
                return false;
            });

            /*全选或不选*/
            _.checkAll($("#table_info", h.el));

            $("#btn_search", h.el).off("click").on("click",(function () {
                var start_date = $("input[name=start_date]").val(),
                end_date = $("input[name=end_date]").val();
                if (start_date > end_date) {
                    alert("查询的开始时间大于结束时间!");
                    return false;
                }
                else {
                    var data = decodeURIComponent($("#right_content").serialize(), true);
                    location.hash = data;
                    return false;
                }
            }));
        },

        /*删除*/
        event_del: function () {
            var h = this;
            $(".delete_btn", h.el).click(function () {
                var array = _.getSelectedRowIds($("#table_info"));
                if (array.length == 0) {
                    alert('请选择要删除的数据', 'warning');
                    return false;
                }
                confirm('是否删除选中的数据？', function () {
                    var type = $("[name=type]", h.el).val();
                    _.ajax(urls.myMessage_delete, { ids: array, type: type }, function (r) {
                        h.refresh();
                    }, "json");
                });
                return false;
            });
        },

        /*刷新当前页面*/
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
            h.event_del();
        }
    };

    info.init();

})(jQuery)


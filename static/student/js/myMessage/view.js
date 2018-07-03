/**
 * @name 我的邮件
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 13:41:25
 */

(function ($) {
    var info = {
        el: $("#right_content"),

        get: function (ini) {
            var h = this;
            _.ajax(urls.myMessage_view, function (r) {
                if (r.code < 0)
                {
                    alert(r.msg);
                }
                h.el.html(template("view_html", r));
            }, "json");
            return this;
        },

        refresh: function () {
            $(window).hashchange();
            return this;
        },
        events: function () {
            var h = this;

            $(".delete_btn", h.el).click(function () {
                array = _.getSelectedRowIds($("#table_info"));
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

        },
        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ('?' + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
           
            h.get(1);
            h.events();
        }
    };

    info.init();

})(jQuery)


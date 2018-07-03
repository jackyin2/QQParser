
(function ($) {

    var info = {
        el: $('#d_coursetoc_t'),

        get: function (ini) {
            var h = this;
            _.ajax(urls.announcement_List, function (r) {
                $("#d_coursetoc_t").html(template('announcementlist', r));
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
            }, "json");
            return false;
        },

        events: function () {
            var h = this;
            var form = $("#form_announcement");
            /*选项卡切换*/
            $(".am-tabs li").click(function () {
                var _this = $(this);
                var teaType = _this.data('type');
                $("[name=teaType]", form).val(teaType);
                _this.addClass("am-active").siblings().removeClass("am-active");
                location.hash = "#courseOpenId=" + _.hash.courseOpenId + "&openClassId=" + _.hash.openClassId + "&dataType=" + teaType;
                return false;
            });

            /*按钮查询*/
            $('#btn_search').on('click', function () {
                var query = $(form, h.el).serialize();
                location.hash = "#" + decodeURIComponent(query, true);
                return false;
            });

            /*回车查询*/
            $("input[name=title]").keydown(function (e) {
                if (e.keyCode == 13) {
                    var query = $(form, h.el).serialize();
                    location.hash = "#" + decodeURIComponent(query,true);
                    return false;
                }
            });
        
        },
        refresh: function () {
            $(window).hashchange();
            return false;
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

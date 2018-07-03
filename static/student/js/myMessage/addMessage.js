/**
 * @name 发邮件
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 13:41:25
 * @author   zqyou
 */

(function ($) {
    var info = {
        el: $("#dataForm"),

        events: function () {
            var h = this;
            $('#UserNum', h.el).tokenInput(urls.myMessage_getUser, {
                theme: 'facebook', tokenLimit: 10
            });
          
            $("#btn_send", h.el).on("click", function () {
                var userId = $("[name=userId]", h.el).val().trim();
                var title = $("[name=Title]", h.el).val().ltrim();

                if (userId.length == 0)
                {
                    alert("请设置收件人！");
                    return false;
                }
                if (title.length == 0)
                {
                    alert("请填写主题！");
                    return false;
                }
                if ( title.length > 500)
                {
                    alert("主题不能超过500个字！");
                    return false;
                }
                var content = $("[name=content]", h.el).val();
                if (content.length > 5000)
                {
                    alert("内容不能超过5000个字！");
                    return false;
                }
                _.ajax(urls.myMessage_sendMessage, { UserId: userId, Title: title, Content: content }, function (r) {
                    if (r.code > 0) {
                        location.href = "/student/myMessage/myMessage.html#type=2&parentId=" + _.hash.parentId;
                    }
                }, "json");
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
            });
            h.events();
        }
    };
    info.init();

})(jQuery)


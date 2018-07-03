/**
 * @name 我的邮件
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 13:41:25
 * @author   zqyou
 */
;
(function ($) {

    var info = {
        el: $("#right_content"),

        get: function (ini) {
            var h = this;
            _.ajax(urls.myMessage_sendMessage, function (r) {
                if (r.code > 0) {
                    location.href = "/student/myMessage/myMessage.html#type=2";
                }
            }, "json");
            return false;
        },

        events: function () {
            $.bindUeditor("cm_content");
            var h = this;
            $('#UserNum', h.el).tokenInput(urls.myMessage_getUser, {
                theme: 'facebook', tokenLimit: 10
            });
          
            $("#btn_send", h.el).on("click", function () {
                var UserId = $("[name=UserId]", h.el).val().trim();
                var title = $("[name=Title]", h.el).val().ltrim();
                var content = editor.getContent();
                if (UserId.length == 0) { alert("收件人不能为空！"); return false; }
                if (title.length == 0 || title.length > 2000) { alert("主题不能为空并且不能超过2000个字！"); return false; }
                if (content.length == 0 || content.length > 5000) { alert("内容不能为空并且不能超过5000个字！"); return false; }
                _.ajax(urls.myMessage_sendMessage, { UserId: UserId, Title: title, Content: content }, function (r) {
                    if (r.code > 0) {
                        location.href = "/student/myMessage/myMessage.html#type=2";
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
                h.get();
            });
            h.events();
        }

    };

    info.init();

})(jQuery)


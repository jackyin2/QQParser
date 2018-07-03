/**
 * @name 我的邮件
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 13:41:25
 * @author   cc
 */
;
(function ($) {

    var info = {
        el: $("#right_content"),

        get: function (ini) {
            var h = this;
            _.ajax(urls.myMessage_reply, function (r) {
                if (r.code < 0)
                {
                    alert(r.msg);
                }
                $("#form_reply").html(template('reply_html', r));
                h.events();
            }, "json");
            return this;
        },

        send: function (ini) {
            var h = this;
            _.ajax(urls.myMessage_sendMessage, function (r) {
                if (r.code > 0) {
                    location.href = "/student/myMessage/myMessage.html#type=2";
                }
            }, "json");
            return this;
        },

        events: function () {
            $.bindUeditor("cm_content");
            var h = this;

            $("#btn_send", h.el).on("click", function () {
                var ReplyId = $("[name=ReplyID]", h.el).val();
                var UserId = $("[name=UserId]", h.el).val();
                var title = $("[name=Title]", h.el).val();
                var content = editor.getContent();
                if (UserId.length == 0) { alert("收件人不能为空！"); return false; }
                if (title.length == 0 || title.length > 2000) { alert("主题不能为空并且不能超过2000个字！"); return false; }
                if (content.length == 0 || content.length > 5000) { alert("内容不能为空并且不能超过5000个字！"); return false; }
                _.ajax(urls.myMessage_sendMessage, { replyId:ReplyId,UserId: UserId, Title: title, Content: content }, function (r) {
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
                h.send();
            });
            h.get(1);
        }

    };

    info.init();

})(jQuery)


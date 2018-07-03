/**
 * @name 我的邮件
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 13:41:25
 * @author   zlhu
 */

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

        events: function () {
            var h = this;
            var messageId = _.hash.messageId;
            $("#returnmain", h.el).off("click").on("click", function () {
                location.href = '/student/myMessage/view.html#messageId=' + messageId + '&type=1';
                return false;
            })

            $("#btn_send", h.el).on("click", function () {
                var replyId = $("[name=replyId]", h.el).val();
                var userId = $("[name=userId]", h.el).val();
                if (userId.length == 0)
                {
                    alert("请设置收件人！");
                    return false;
                }

                var title = $("[name=Title]", h.el).val().trim();
                if (title.length == 0)
                {
                    alert("请填写主题！");
                    return false;
                }
                if (title.length > 500)
                {
                    alert("主题不能超过500个字！");
                    return false;
                }

                var content = $("[name=content]", h.el).val().trim();
                
                if (content.length > 5000)
                {
                    alert("内容不能超过5000个字！");
                    return false;
                }

                _.ajax(urls.myMessage_sendMessage, { replyId: replyId, UserId: userId, Title: title, Content: content }, function (r) {
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
            });
            h.get(1);
        }
    };

    info.init();

})(jQuery)


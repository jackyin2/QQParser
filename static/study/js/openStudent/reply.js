/**
 * @name 我的邮件
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016/7/21
 * @author   wzq
 */

(function ($) {
    var courseOpenId="",
        openClassId = "";
    var info = {
        el: $("#right_content"),

        get: function (ini) {
            var h = this;
            _.ajax(urls.openStudent_reply, function (r) {
                $("#form_reply").html(template('reply_html', r));
                if (r.code > 0) {
                    courseOpenId = r.courseOpenId;
                    openClassId = r.openClassId;
                }
                h.events();
            }, "json");
            return false;
        },
        events: function () {
            var h = this;
            $("#returnmain", h.el).off("click").on("click", function () {
                location.href = "/study/openStudent/openStudent.html#courseOpenId=" + courseOpenId + "&openClassId=" + openClassId;
                return false;
            })

            $("#btn_send", h.el).on("click", function () {
                var userName = $("[name=userName]", h.el).val().trim(),
                    userId = $("[name=UserID]", h.el).val().trim();

                if (userName.length == 0) {
                    alert("收件人不能为空！");
                    return false;
                }

                var title = $("[name=Title]", h.el).val().ltrim();
                if (title.length == 0) {
                    alert("请填写主题！");
                    return false;
                }

                if (title.length > 200) {
                    alert("主题不能超过200个字！");
                    return false;
                }


                var content = $("[name=content]",h.el).val();
                if (content.length > 5000) {
                    alert("内容不能超过5000个字！");
                    return false;
                }
                _.ajax(urls.openStudent_sendMessage, { userId: userId, userName: userName, Title: title, Content: content }, function (r) {
                    if (r.code != 1) {
                        alert("数据异常！");
                        return false;
                    }
                    location.href = "/study/openStudent/openStudent.html#courseOpenId=" + courseOpenId + "&openClassId=" + openClassId;
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


/**
 * @name 学生工作室
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-25 11:14:38
 * @author   zqyou
 */

(function ($) {

    var info = {
        el: $('#right_content'),
        get: function (ini) {
            var h = this;
            _.ajax(urls.stuInfo_getStuInfo, function (r) {
                $("#content_stuInfo", h.el).html(template('table_html', r));
            }, "json");
            return false;
        },
        checkevents: function (ini) {
            var h = this;
            h.events_editInfo();
            h.events_editPassWord();
            $('.quealltab').click(function () {
                var type = $(this).data("type");
                $(this).addClass("active").siblings().removeClass("active");
                if (type == 1) {
                    $("#content_stuInfo").show();
                    $("#change").show();
                    $("#eidtPwdDiv").hide();
                } else {
                    $("#content_stuInfo").hide();
                    $("#eidtPwdDiv").show();
                    $("#change").hide();
                    $("#back").hide();
                    $("#save").hide();
                }
                return false;
            });
        },
        events_editInfo: function () {
            var h = this;
           
            $("#change", h.el).click(function () {
                $(".old", h.el).hide();
                $(".new", h.el).show();
                $("#change", h.el).hide();
                $("#back", h.el).show();
                $("#save", h.el).show();
            });

            $("#back", h.el).click(function () {
                $(".new", h.el).hide();
                $(".old", h.el).show();
                $("#change", h.el).show();
                $("#back", h.el).hide();
                $("#save", h.el).hide();
            });

            $("#save", h.el).click(function () {
                var Id = decodeURIComponent($("[name=Id]", h.el).val(), true),
                    Phone = decodeURIComponent($("[name=Phone]", h.el).val().trim(), true),
                    Mobile = decodeURIComponent($("[name=Mobile]", h.el).val().trim(), true),
                    Email = decodeURIComponent($("[name=Email]", h.el).val().trim(), true),
                    regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
                    regMobile = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/,
                    regPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
                if (!regEmail.test(Email)) {
                    alert("邮箱格式错误！请重新输入！");
                    $("[name=Email]", h.el).val("");
                    return false;
                }
                if (!regPhone.test(Phone)) {
                    alert("固定电话格式错误！请重新输入！");
                    $("[name=Phone]", h.el).val("");
                    return false;
                }
                if (!regMobile.test(Mobile)) {
                    alert("移动电话格式错误！请重新输入！");
                    $("[name=Mobile]", h.el).val("");
                    return false;
                }

                _.ajax(urls.stuInfo_editStuInfo, { Id: Id, Phone: Phone, Mobile: Mobile, Email: Email }, function (r) {
                    if (r.code < 0 || !r) {
                        alert(r.msg || "发生错误！请联系管理员")
                        return false;
                    }
                    else {
                        $("#Phone", h.el).html(Phone);
                        $("#Mobile", h.el).html(Mobile);
                        $("#Email", h.el).html(Email);
                        $(".new", h.el).hide();
                        $(".old", h.el).show();
                        $("#change", h.el).show();
                        $("#back", h.el).hide();
                        $("#save", h.el).hide();
                    }
                }, "json");
                return false;
            });
        },
        events_editPassWord: function () {
            var h = this;

            $("#editPw", h.el).click(function () {
                var Id = decodeURIComponent($("[name=Id]", h.el).val().trim(), true),
                    oldPwd = decodeURIComponent($("[name=oldPwd]").val().trim(), true),
                    newPwd = decodeURIComponent($("[name=newPwd]", h.el).val().trim(), true),
                    confrimPwd = decodeURIComponent($("[name=confirmPwd]", h.el).val().trim(), true);

                if (oldPwd.length == 0)
                {
                    alert("请输入原始密码！");
                    return false;
                }
                if (newPwd.length == 0)
                {
                    alert("请输入新密码！");
                    return false;
                }

                if (confrimPwd.length == 0) {
                    alert("再次密码不能为空！");
                    return false;
                }

                if (newPwd != confrimPwd) {
                    alert("两次输入的新密码不一致！");
                    return false;
                }
                _.ajax(urls.stuInfo_editPassWord, { Id: Id, oldPassword: oldPwd, newPassword: newPwd }, function (r) {
                    if (r.code < 0 || !r) {
                        alert(r.msg || "发生错误！请联系管理员");
                    }
                    else {
                        $("[name=oldPwd]", h.el).val(""),
                        $("[name=newPwd]", h.el).val(""),
                        $("[name=confirmPwd]", h.el).val("");
                        localStorage["user"] = "";
                        $.cookie('token', "", { expires: -1, path: "/" });
                        location.href = "/mainsite/mainsite/index.html";
                    }
                    return false;
                }, "json");
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
            h.checkevents(1);
        }
    };

    info.init();

})(jQuery)


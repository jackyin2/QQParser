/**
 * @name        个人空间
 * @depend    jQuery, template.js
 * @Date         2016-10-14 14:24:21
 * @author      summerice
 */
;
(function ($) {
    var info = {
        el: $("#personinfo"),

        /*获取列表（Table列表显示）*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.person_personInfo, function (r) {
                $("#personinfoList").html(template('personinfoListShow', r));
                h.upload();
                h.edit();
                h.update();
            }, "json");
            return false;
        },

        /*上传头像*/
        upload: function () {
            var fileurl = $("input[name=fileurl]").val();
            $("#uploader_pic").data('file_system_url', fileurl);
            /*图片上传按钮点击*/
            var button_pic = $('#uploader_pic');
            /*上传文件接收的文件类型*/
            var acceptDocTypePic = 'jpg,jpeg,png,tif,tiff,bmp,gif';
            /*上传文件不是接受文件的类型的提示消息*/
            var acceptDocTypeErrorMessagePic = '请选择图片文件!';
            /*必须引用uploadFile.js*/
            new uploadFile(button_pic, acceptDocTypePic, acceptDocTypeErrorMessagePic,
                successfull = function (data) {
                    uploadData_pic(data);
                }, fail = function () {
                    alert('上传失败');
                });

            var uploadData_pic = function (data) {
                _.ajax(urls.person_upLoadFile, { data: data }, function (r) {
                    if (r.code == 1) {
                        $("#cover").attr("src", r.url.url);
                    }
                }, 'json');
            };
        },

        /*编辑*/
        edit: function () {
            var h = this;
            $("#edit").off('click').on('click', function () {
                $(this).hide();
                $("#update").hide();
                $("#save").show();
                $("#back").show();
                $("#addHobby").show();
                $(".perinfos").attr("disabled", false);
                $(".perinfos").removeClass("noEditor");
                $('#Birthday').addClass('laydate-icon');
                $('.personinfoList input').addClass('hover');
                $('.personinfoList select').addClass('hover');
            });
            $("#save").off('click').on('click', function () {
                var data = {
                    sign: $("#sign").val(),
                    UserName: $("#UserName").val(),
                    City: $("#City").val(),
                    Email: $("#Email").val(),
                    Name: $("#Name").val(),
                    PhoneNum: $("#PhoneNum").val(),
                    QQNum: $("#QQNum").val(),
                    IdentityCardNum: $("#IdentityCardNum").val(),
                    Company: $("#Company").val(),
                    EduStatus: $("#EduStatus").val(),
                    ProfessionType: $("#ProfessionType").val(),
                    Hobbies: $("#Hobbies").val(),
                    Sex: $("#Sex").val(),
                    Birthday: $("#Birthday").val(),
                    Address: $("#Address").val(),
                };
                if (!data.UserName) {
                    $M().msg('用户名不能为空！').position('10%', '50%').time(3);
                    $('#UserName').focus();
                    return false;
                };

                if (!(/^[a-zA-Z0-9]{1,15}$/.test(data.UserName))) {
                    $M().msg("用户名请使用数字或英文！（15个字符以内）").position('10%', '50%').time(3);
                    $('#UserName').focus();
                    return false;
                };
                if (!(/^[\u4e00-\u9fa5]{2,5}$/.test(data.Name))) {
                    $M().msg('请输入真实姓名！').position('10%', '50%').time(3);
                    $('#Name').focus();
                    return false;
                };
                if (!data.City) {
                    $M().msg('地域不能为空！').position('10%', '50%').time(3);
                    $('#City').focus();
                    return false;
                };
                if (!data.Email) {
                    $M().msg('邮箱不能为空！').position('10%', '50%').time(3);
                    $('#Email').focus();
                    return false;
                };
                var nowtime = new Date();
                var birthday = new Date($("#Birthday").val());
                if (nowtime < birthday) {
                    $M().msg('日期不能大于今天！').position('10%', '50%').time(3);
                    $('#Birthday').focus();
                    return false;
                };

                if (!data.PhoneNum && !(/^1[34578]\d{9}$/.test(data.PhoneNum))) {
                    $M().msg('手机号码有误！').position('10%', '50%').time(3);
                    $('#PhoneNum').focus();
                    return false;
                };
                if (!data.Email && !(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(data.Email))) {
                    $M().msg('邮箱地址有误！').position('10%', '50%').time(3);
                    $('#Email').focus();
                    return false;
                };
                if (!data.IdentityCardNum && !(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(data.IdentityCardNum))) {
                    $M().msg('证件号格式不正确，请重新输入！').position('10%', '50%').time(3);
                    $('#IdentityCardNum').html("");
                    $('#IdentityCardNum').focus();
                    return false;
                };
                _.ajax(urls.person_savePerson, data, function (r) {
                    if (code = 1) {
                        $("#edit").show();
                        $("#update").show();
                        $("#save").hide();
                        $("#back").hide();
                        $(".perinfos").attr("disabled", true);
                        $M().msg("修改成功！").position('10%', '50%').time(3);
                        h.get();
                    }
                    else {
                        $M().msg(r.back).position('10%', '50%').time(3);
                    }
                }, "json");
                return false;
            });
            $("#back").off('click').on('click', function () {
                h.get();
                $(this).hide();
                $("#edit").show();
                $("#update").show();
                $("#save").hide();
                $(".perinfos").attr("disabled", true);
            });
            h.addHobby();
        },

        /*添加兴趣爱好*/
        addHobby: function () {
            $("#addHobby").off('click').on('click', function () {
                var hobby = $("#Hobbies").val();
                var hobbyname = hobby.split(",");
                var data = { hobby: hobbyname };
                var elem = template('AddHobby', data);
                $M({
                    title: '兴趣爱好',
                    content: elem,
                    width: '500px',
                    height: '220px',
                    ok: function () {
                        var hobbies = [];
                        $.each($(".hobsel li.current"), function (i, v) {
                            hobbies.push($(this).find(".check").html());
                        });
                        $("#Hobbies").val(hobbies);
                        this.close();
                    },
                    cancel: true
                })
                $(".hobsel li").off('click').on('click', function () {
                    if ($(this).hasClass("current")) { $(this).removeClass("current") }
                    else { $(this).attr("class", "current"); }
                });
            });
        },

        /*修改密码*/
        update: function () {
            $("#update").off('click').on('click', function () {
                var data = {};
                var elem = template('updates', data);
                $M({
                    title: '修改密码',
                    content: elem,
                    top: '150px',
                    width: '500px',
                    height: '160px',
                    position: '50% 50%',
                    cancel: true,
                    ok: function () {
                        var _this = this;
                        var passWord = $('#passWord').val(),
                            repassWord = $('#repassWord').val();
                        if (!passWord) {
                            $M().msg('请输入密码！').position('10%', '50%').time(3);
                            $('#passWord').focus();
                            return false;
                        };
                        if (repassWord != passWord) {
                            $M().msg('两次密码输入不一致！').position('10%', '50%').time(3);
                            $('#repassWord').val("");
                            $('#repassWord').focus();
                            return false;
                        };
                        _.ajax(urls.person_updateUser, { passWord: passWord }, function (r) {
                            $M().msg(r.msg).position('10%', '50%').time(3);
                            _this.close();
                            h.refresh();
                            return false;
                        }, "json");
                        _.ajax(_config.prefix + '/login/logout', function (r) {
                            if (r.code < 0) {
                                $M().msg(r.msg).position('10%', '50%').time(3);
                                return false;
                            }
                            if (r.code > 0) {
                                $.cookie('token', "", { expires: -1, path: _config.host });
                                location.href = "/mainsite/mainsite/index.html";
                            }
                        }, "json");
                    }
                });
                $('.ui-MDialog-autofocus').focus();
            });
        },

        /* 刷新*/
        refresh: function () {
            $(window).hashchange();
            return false;
        },

        /*hash值*/
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
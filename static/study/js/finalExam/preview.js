/**
 * @name 在线考试
 * @return null
 * @depend   jQuery, template.js
 * @Date   2016-7-25 13:53:24
 * @author   cjcheng
 */

var data = {};
var current_form;/*处理多个文件做答题问题*/

$(function () {
    var info={
        el: $("#finalExamPreview_div"),
        get:function (ini) {
            var h = this;
            _.ajax(urls.finalExam_preview, function (r) {
                if (r.code < 0) {
                    location.href = "/study/finalExam/finalExam.html#courseOpenId=" + r.courseOpenId;
                    return false;
                }
                $("#container", h.el).html(template('preview_html', r))
                _.resize();
                /*绑定scroll样式*/
                scroll();
                h.events();
            },"json");
            return false;
        },
        events: function () {
            var h = this;
            bindClick();
            initDownTime();
            bindUploader();
            bindUeditor();
        },

        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ("?" + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
            h.get(1);
        },
    };
    info.init();
   
});


//更新全部的作业是否做的状态
function updateDoWork() {
    var answers = $("[name=answer]");
    jQuery.each(answers, function (i, v) {
        var _this = $(v);
        var num = _this.parents(".e-q-body:first").data("num");
        var answer = _this.parents("form:first").find("[name=answer]").val();
        if (answer) {
            $(".question_nums").find("[data-num=" + num + "]").addClass("active");
        }
        else {
            $(".question_nums").find("[data-num=" + num + "]").removeClass("active");
        }
    });
}

function bindClick() {
   
    /*子题目中的单选题、判断题*/
    $(".e-q-body[data-questiontype=8] li[data-subquestiontype=3] ,.e-q-body[data-questiontype=9] li[data-subquestiontype=3],.e-q-body[data-questiontype=8] li[data-subquestiontype=1] ,.e-q-body[data-questiontype=9] li[data-subquestiontype=1],.e-q-body[data-questiontype=11] li[data-subquestiontype=1]").click(function () {
        var _this = $(this);
        var _form = _this.parents("form:first")
        _this.siblings("li").removeClass("checked").end().addClass("checked");
        _form.find("[name=answer]").val(_this.data("index"));
        isDoWork.apply(_this, []);
        _.ajax(urls.finalExam_online_homework_subanswer, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
            updateState(r,_form);
        }, 'json');
        return false;
    });

    /*子题目中的多选题*/
    $(".e-q-body[data-questiontype=8] li[data-subquestiontype=2] ,.e-q-body[data-questiontype=9] li[data-subquestiontype=2]").click(function () {
        var _this = $(this);
        var _form = _this.parents("form:first")
        _this.toggleClass("checked");

        var lis = _form.find("li.checked");
        var answers = "";
        jQuery.each(lis, function (i, v) {
            answers += $(v).data("index") + ",";
        });
        if (answers.length > 0)
            answers = answers.substr(0, answers.length - 1);

        _form.find("[name=answer]").val(answers);

        isDoWork.apply(_this, []);
        //jQuery.fn.gform.working = false;
        // _form.submit();
        _.ajax(urls.finalExam_online_homework_subanswer, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
            updateState(r, _form);
        }, 'json');
    });
    /*单选题，判断题*/
    $(".e-q-body[data-questiontype=1] li,.e-q-body[data-questiontype=3] li").click(function () {
        var _this = $(this);
        var _form = _this.parents("form:first")
        _this.siblings("li").removeClass("checked").end().addClass("checked");
        _form.find("[name=answer]").val(_this.data("index"));
        isDoWork.apply(_this, []);
        _.ajax(urls.finalExam_online_homework_answer, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
            updateState(r, _form);
        },'json');
        return false;
    });

    /*多选题*/
    $(".e-q-body[data-questiontype=2] li").click(function () {

        var _this = $(this);
        var _form = _this.parents("form:first");
        
        _this.toggleClass("checked");

        var lis = _form.find("li.checked");
        var answers = "";
        jQuery.each(lis, function (i, v) {
            answers += $(v).data("index") + ",";
        });
       
        if (answers.length > 0)
            answers = answers.substr(0, answers.length - 1);

        _form.find("[name=answer]").val(answers);

       isDoWork.apply(_this, []);
       _.ajax(urls.finalExam_online_homework_answer, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
           updateState(r, _form);
       }, 'json');

        return false;
    });

    /*填空题*/
    $(".e-q-body[data-questiontype=4] [name=answer],.e-q-body[data-questiontype=5] [name=answer]").blur(function () {
        var _this = $(this);
        var _form = _this.parents("form:first");
        solveComma.apply(_form, []);
        isDoWork.apply(_this, []);
       
        _.ajax(urls.finalExam_online_homework_checkspace, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
            updateState(r, _form);
        },'json');
        return false;
    });

    /*问答题*/
    $('.e-q-body[data-questiontype="6"] .btn_save').click(function () {
        var _this = $(this);
        var _form = _this.parents("form:first");
        isDoWork.apply(_this, []);       
        $.ajax({
            cache: true,
            type: "POST",
            url: urls.finalExam_online_homework_answer,
            data: _form.serialize(),
            async: false,
            error: function (request) {
                alert("Connection error");
            },
            success: function (r) {
                if (r.code < 0) {
                    alert(r.msg)
                }
            }
        });
        return false;
    });


    /*匹配题自动批阅*/
    $(".e-q-body[data-questiontype=7] [name=answer]").change(function () {
        var _this = $(this);
        var _form = _this.parents("form:first")
        isDoWork.apply(_this, []);
        _.ajax(urls.finalExam_online_homework_match, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
            updateState(r, _form);
        },'json');
        return false;
    });

    $(".deleteAnswer").click(function () {
        $(this).parents(".answer-content:first").addClass("am-hide")
                                                .find("[name=answer]").val("");
        updateDoWork();
        return false;
    });

    $("#submitHomeWork").click(function () {
        confirm("提交后将不可修改，您确定要提交吗？", function () {
            saveOnlineWork();
        });
        return false;
    });

   /*$("[data-questiontype=10] .uploader_preview").unbind("click").click(function () {
       //处理多个文件做答题问题
        current_form = $(this).parents("form:first");
    })*/
};

function bindUeditor() {
    jQuery.each($(".ueditorArea"), function (i, v) {
        var quesid = $(v).attr("id");
        jQuery.bindUeditor(quesid);
    });
};

/*处理选项中的逗号*/
function solveComma() {
    var _this = $(this);
    var optionContents = _this.find("[name=answer]");
    jQuery.each(optionContents, function (i, v) {
        var text = $(v).val();
        var replaceText = text.replace(new RegExp(/,/g), '，')
        $(v).val(replaceText);
    });
};

function bindUploader  () {
    var button = $('.uploader_preview');

    jQuery.each(button, function (i, v) {
        var accept = null;
        new uploadFile($(v), accept, "类型错误",
            successfull = function (data, currentButton) {
                uploadData(data, currentButton);
            }, fail = function () {
                alert('上传失败');
            });
    });


    /*上传完成后和创建数据*/
    var uploadData = function (_data, currentButton) {
        var form = currentButton.parents("form:first");
        var courseOpenId = $("[name=CourseOpenId]").val()
        _.ajax(urls.finalExam_uploadFile, { data: _data, courseOpenId: courseOpenId }, function (r) {

            alert(r.msg);
            /*显示下载内容，并更新下载链接*/
            $(".answer-content", form).removeClass("am-hide").find("[data-preview_url_ueditor]")
                                                             .attr("data-preview_url_ueditor", r.docUrl)
                                                             .text(r.docTitle);
            form.find("[name=answer]").val(r.docUrl);
            form.find("[name=MD5]").val(r.MD5);

            _.ajax(urls.finalExam_online_homework_answer, ("?" + decodeURIComponent(form.serialize(), true)).QueryStringToJSON(), function (r) {
                updateDoWork();
            },'json');
            return false;
        }, 'json');
    };
};

function isDoWork() {
    var _this = $(this);
    var num = _this.parents(".e-q-body:first").data("num");
    var type = _this.parents(".e-q-body:first").data("questiontype");
    var answer = _this.parents("form:first").find("[name=answer]").val();
    if (type != 8 && type != 9 && type != 11) {
        if (answer) {
            $(".question_nums").find("[data-num=" + num + "]").addClass("active");
        }
        else {
            $(".question_nums").find("[data-num=" + num + "]").removeClass("active");
        }
    }
};

function saveOnlineWork() {
    var useTime = $("[name=UseTime]").val();
    var replyTime = $("[name=ReplyTime]").val() * 60;
    if (useTime >= replyTime) {
        alert("作答超时，不能提交", "error");
        return false;
    }

    var answers = $("[name=answer]");
    var isNullAnswer = false;
    jQuery.each(answers, function (i, v) {
        if (!$(v).val()) {
            isNullAnswer = true;
        }
    });

    /*从这里开始提交作业*/
    var homeWorkUniqueFlag = $("[name=HomeWorkUniqueFlag]").val();
    var paperStructUniqueFlag = $("[name=paperStructUniqueFlag]").val();
    var paperId = $("[name=PaperId]").val();
    if (isNullAnswer) {
        confirm("你有部分题目没有作答,未作答的题目被视为错误，您确定要提交吗？", function () {
           submitHomeWork(useTime, homeWorkUniqueFlag, paperId, paperStructUniqueFlag);
        });
    }
    else {
       submitHomeWork(useTime, homeWorkUniqueFlag, paperId, paperStructUniqueFlag);
    }
};

function submitHomeWork(useTime, homeWorkUniqueFlag, paperId, paperStructUniqueFlag) {
    _.ajax(urls.finalExam_online_homework_save, { useTime: useTime, homeWorkUniqueFlag: homeWorkUniqueFlag, paperId: paperId, paperStructUniqueFlag: paperStructUniqueFlag },
       function (r) {
           if (r.code<0) {
               alert(r.msg);
               return false;
           }
           if (r.code > 0) {
               var courseOpenId = $("[name=CourseOpenId]").val(),
                   openClassId= $("[name=openClassId]").val();
               location.href = "/study/finalExam/finalExam.html#courseOpenId=" + courseOpenId + "&openClassId=" + openClassId;
           }
       }, "json");
}

function initDownTime  () {
    var initTime = $("[name=ReplyTime]").val();
    var initTime_second = initTime * 60;
    solveTime(initTime_second);
};

function solveTime(ts) {
    var initTime = ts;
    ts = ts - 1;
    var hh = parseInt(ts / 60 / 60 % 24, 10);//计算剩余的小时数  
    var mm = parseInt(ts / 60 % 60, 10);//计算剩余的分钟数  
    var ss = parseInt(ts % 60, 10);//计算剩余的秒数  
    hh = checkTime(hh);
    mm = checkTime(mm);
    ss = checkTime(ss);
    $(".photo .icon-photo").text(hh + ":" + mm + ":" + ss);
    $("[name=UseTime]").val($("[name=ReplyTime]").val() * 60 - ts);
    if (ts > 0) {
        setTimeout("solveTime(" + ts + ")", 1000);
    }
    if (ts == 0) {
        var useTime = $("[name=UseTime]").val();
        var homeWorkUniqueFlag = $("[name=HomeWorkUniqueFlag]").val();
        var paperStructUniqueFlag = $("[name=paperStructUniqueFlag]").val();
        var paperId = $("[name=PaperId]").val();
        alert("答题时间已到，正在提交试卷");
        setTimeout( submitHomeWork(useTime, homeWorkUniqueFlag, paperId, paperStructUniqueFlag),5000);
    }
};

function checkTime (time) {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
};

/*updateState*/
function updateState(r,_form) {
    if (r.subStudentQuestionId) {
        _form.find("[name=subStudentQuestionId]").val(r.subStudentQuestionId);
    }
    if (r.AllDo != null) {
        if (r.AllDo) {
            var num =_form.parents(".e-q-body:first").data("num");
            $(".question_nums").find("[data-num=" + num + "]").addClass("active");
        }
        else {
            var num = _form.parents(".e-q-body:first").data("num");
            $(".question_nums").find("[data-num=" + num + "]").removeClass("active");
        }
    }
}






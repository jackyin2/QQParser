/**
 * @name 学生做作业
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-7-26
 * @author   wl
 */
$(function () {
    var info = {
        el: $("#indexForm"),
        get: function (ini) {
            var h = this;
            _.ajax(urls.homework_preview, function (r) {
                var newData = { code: r.code, param: r.param, homework: r.homework, bigQuestions: r.bigQuestions, questions: r.questions, subQuestions: r.subQuestions};
                $("#container").html(template("table_html", newData));
                _.resize();
                /*绑定scroll样式*/
                scroll();
                initDownTime();
                h.events();
                bindUeditor();
            }, "json");
            return false;
        },
        events: function () {
            var h = this;
            var table = $("#maintab");

            /*单选题,判断题(1,3,8,9,11)*/
            $(".e-q-body[data-questiontype=1] li,.e-q-body[data-questiontype=3] li,.e-q-body[data-questiontype=8] li[data-subquestiontype=1],.e-q-body[data-questiontype=8] li[data-subquestiontype=3],"
                + ".e-q-body[data-questiontype=9] li[data-subquestiontype=1],.e-q-body[data-questiontype=9] li[data-subquestiontype=3],.e-q-body[data-questiontype=11] li[data-subquestiontype=1]").click(function () {
                    
                    var _this = $(this),
                      _questiontype = _this.parents("div.e-q-body:first").data("questiontype"),
                      _form = _this.parents("form:first");
                    _form.find("[name=answer]").val(_this.data("index"));

                    if (_questiontype == 8 || _questiontype == 9 || _questiontype == 11) {
                        var isallowrequest = _form.data("isallowrequest");
                        if (isallowrequest == 1) {
                            _form.data("isallowrequest", 0);
                            var alldo = dohkQuestion(_form, _questiontype, _this, true);
                            isDoWork.apply(_this, [alldo]);
                        }
                    }
                    else {
                        var alldo = dohkQuestion(_form, _questiontype, _this, true);
                        isDoWork.apply(_this, [alldo]);
                    }
                    return false;
                });

            /*多选题(2,8,9)*/
            $(".e-q-body[data-questiontype=2] li,.e-q-body[data-questiontype=8] li[data-subquestiontype=2],.e-q-body[data-questiontype=9] li[data-subquestiontype=2]").click(function () {
                var _this = $(this),
                    _questiontype = _this.parents("div.e-q-body:first").data("questiontype"),
                    _currindex = _this.data("index"),
                   _form = _this.parents("form:first");

                var lis = _form.find("li.checked");

                var answers = "", iscontain = false;
                jQuery.each(lis, function (i, v) {
                    if (_currindex == $(v).data("index"))
                        iscontain = true;
                    answers += $(v).data("index") + ",";
                });

                /*不包含 添加*/
                if (!iscontain) /*这里不要用indexOf*/
                    answers += _currindex + ",";
                /*包含 去除*/
                if (iscontain) {
                    answers = answers.replace(_currindex+",", "");
                }

                if (answers.length > 0)
                    answers = answers.substr(0, answers.length - 1);

                _form.find("[name=answer]").val(answers);
               
                if (_questiontype == 8 || _questiontype == 9) {
                    var isallowrequest = _form.data("isallowrequest");
                    if (isallowrequest == 1) {
                        _form.data("isallowrequest", 0);
                        var alldo = dohkQuestion(_form, _questiontype, _this, false);
                        isDoWork.apply(_this, [alldo]);
                    }
                }
                else {
                    var alldo = dohkQuestion(_form, _questiontype, _this, false); /*存在子题目的时候,子题目全部做完 右侧才标识为已做*/
                    isDoWork.apply(_this, [alldo]);
                }
                return false;
            });

            /*填空题(4,5)*/
            $(".e-q-body[data-questiontype=4] [name=answer],.e-q-body[data-questiontype=5] [name=answer]").blur(function () {
                var _this = $(this),
                     _questiontype = _this.parents("div.e-q-body:first").data("questiontype"),
                    _form = _this.parents("form:first");

                solveComma.apply(_form, []);
                var alldo = dohkQuestion(_form, _questiontype,_this,true); /*存在子题目的时候,子题目全部做完 右侧才标识为已做*/
                isDoWork.apply(_this, [alldo]);
                return false;
            });

            /*问答题(6)*/
            $(".e-q-body[data-questiontype=6] .btn_save").click(function () {
                var _this = $(this),
                    _questiontype = _this.parents("div.e-q-body:first").data("questiontype"),
                    _form = _this.parents("form:first");

                if ($("[name=answer]", _form).val().length == 0)
                {
                    alert("请先输入答案！");
                    return false;
                }
                var alldo = dohkQuestion(_form, _questiontype,_this,true);
                isDoWork.apply(_this, [alldo]);
                return false;
            });

            /*匹配题(7)*/
            $(".e-q-body[data-questiontype=7] [name=answer]").change(function () {
                var _this = $(this),
                    _questiontype = _this.parents("div.e-q-body:first").data("questiontype"),
                    _form = _this.parents("form:first");

                var alldo = dohkQuestion(_form, _questiontype,_this,true);
                isDoWork.apply(_this, [alldo]);
                return false;
            });

            /*文件作答题(10)*/
            bindUploader();

            $(".deleteAnswer").click(function () {
                $(this).parents(".answer-content:first").addClass("am-hide")
                                                        .find("[name=answer]").val("");
                updateDoWork();
                return false;
            });

            $("#submitHomeWork").off("click").on("click", function () {
                confirm("提交后将不可修改，您确定要提交吗？", function () {
                    saveOnlineWork();
                })
                return false;
            });

        },
        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ("?" + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
            h.get(1);
        },
        reloadData: function () {
            $(window).hashchange();
            return this;
        }
    };
    info.init();
});

/*提交作业*/
 function saveOnlineWork () {
    var useTime = $("[name=UseTime]").val();
    var replyTime =parseInt($("[name=ReplyTime]").val()) * 60;
    if (useTime >= replyTime) {
        alert("作答超时,不能提交！", "error");
        return false;
    }

    var answers = $("[name=answer]");
    var isNullAnswer = false;
    jQuery.each(answers, function (i, v) {
        if (!$(v).val()) {
            isNullAnswer = true;
        }
    });

    var homeWorkUniqueFlag = $("[name=HomeWorkUniqueFlag]").val();
    var paperStructUniqueFlag = $("[name=paperStructUniqueFlag]").val();
    var homeworkId = $("[name=homeworkId]").val();
    if (isNullAnswer) {
        confirm("你有部分题目没有作答,未作答的题目被视为错误，您确定要提交吗？", function () {
            submitHomeWork(useTime, homeWorkUniqueFlag, homeworkId, paperStructUniqueFlag);
        });
    }
    else {
        submitHomeWork(useTime, homeWorkUniqueFlag, homeworkId, paperStructUniqueFlag);
    }
};

 function submitHomeWork(useTime, homeWorkUniqueFlag, homeworkId, paperStructUniqueFlag) {
     _.ajax(urls.homework_onlineHomeworkSave,{ useTime: useTime, homeWorkUniqueFlag: homeWorkUniqueFlag, homeWorkId: homeworkId, paperStructUniqueFlag: paperStructUniqueFlag }, function (r) {
         if (r.code > 0) {
             window.location.href = "/study/homework/detail.html#courseOpenId=" + $("[name=courseOpenId]").val() + "&openClassId=" + $("[name=openClassId]").val() + "&termId=" + $("[name=termId]").val() + "&homeworkId=" + homeworkId;
         }
     }, "json");
 }


 function dohkQuestion(_form, questionType, _this, isSingle)
 {
    var alldo = true;
    var _url = "";
    if (questionType == 1 || questionType == 2 || questionType == 3 || questionType == 6)
    {
        _url = urls.homework_onlineHomeworkAnswer;
    }
    else if (questionType == 4 || questionType == 5)
    {
        _url = urls.homework_onlineHomeworkCheckSpace;
    }
    else if (questionType == 7)
    {
        _url = urls.homework_onlineHomeworkMatch;
    }
    else if (questionType == 8 || questionType == 9 || questionType == 11) {
        _url = urls.homework_onlineHomeworkSubAnswer;
    }
    $.ajax({
        cache: true,
        type: "POST",
        url: _url,
        data: _form.serialize(),
        async: false,
        error: function (request) {
            alldo = false;
            alert("网络异常,连接失败！");
            return false;
        },
        success: function (r) {
            if (r.code > 0) {
                alldo = r.allDo;
                if (questionType == 1 || questionType == 3) {
                    _this.siblings("li").removeClass("checked").end().addClass("checked");
                }
                else if (questionType == 2) {
                    _this.toggleClass("checked");
                }
                else if (questionType == 8 || questionType == 9 || questionType == 11) {
                    if (isSingle) {
                        _this.siblings("li").removeClass("checked").end().addClass("checked");
                    }
                    else {
                        _this.toggleClass("checked");
                    }
                    $("[name=subStudentQuestionId]", _form).val(r.subStudentQuestionId);
                    _form.data("isallowrequest", 1);
                }
            }
        }
    });
    return alldo;
}

/*初始化Ueditor*/
 function bindUeditor () {
     jQuery.each($(".ueditorArea"), function (i, v) {
         var _quesUeditor = $(v),
           uid = _quesUeditor.attr("id");
         jQuery.bindUeditor(uid,[],true);
    });
};

 function isDoWork(alldo) {
     var _this = $(this),
         bigquesorder = _this.parents(".bigquestionblock:first").data("bigquestionorder"),
         num = _this.parents(".e-q-body:first").data("num"),
         questype = _this.parents(".e-q-body:first").data("questiontype");

     var bigquespreview = $(".bigquesnums[data-bigquestionorder=" + bigquesorder + "]", $("#review"));
     if (alldo) {
         bigquespreview.find("[data-num=" + num + "]").addClass("active");
     }
     else {
         bigquespreview.find("[data-num=" + num + "]").removeClass("active");
     }
 };

/*处理选项中的逗号*/
solveComma = function () {
     var _this = $(this);
     var optionContents = _this.find("[name=answer]");
     jQuery.each(optionContents, function (i, v) {
         var text = $(v).val();
         var replaceText = text.replace(new RegExp(/,/g), '，')
         $(v).val(replaceText);
     });
 };

/*todo 需要优化解决刷新的问题 设置隐藏域*/
function initDownTime() {
    var initTime = $("[name=ReplyTime]").val();
    var initTime_second = initTime * 60;
    //solveTime(initTime_second);
};

//function solveTime(ts) {
//    var initTime = ts;
//    ts = ts - 1;
//    var hh = parseInt(ts / 60 / 60 % 24, 10);
//    var mm = parseInt(ts / 60 % 60, 10);
//    var ss = parseInt(ts % 60, 10);
//    hh = checkTime(hh);
//    mm = checkTime(mm);
//    ss = checkTime(ss);
//    $(".photo .icon-photo").text(hh + ":" + mm + ":" + ss);
//    $("[name=UseTime]").val($("[name=ReplyTime]").val() * 60 - ts);
//    if (ts > 0) {
//        setTimeout("solveTime(" + ts + ")", 1000);
//    }
//    if (ts == 0) {
//        var useTime = $("[name=UseTime]").val();
//        var homeWorkUniqueFlag = $("[name=HomeWorkUniqueFlag]").val();
//        var paperStructUniqueFlag = $("[name=paperStructUniqueFlag]").val();
//        var homeworkId = $("[name=homeworkId]").val();
//        alert("答题时间已到！");
//        /*submitHomeWork(useTime, homeWorkUniqueFlag, homeworkId, paperStructUniqueFlag);*/
//    }
//};

 function checkTime (time) {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
 };

 function bindUploader () {
     var button = $(".uploader_preview");
     jQuery.each(button, function (i, v) {
         var accept = null;
         new uploadFile($(v), accept, "类型错误",
             successfull = function (data, currentButton) {
                 uploadData(data, currentButton);
             }, fail = function () {
                 alert('上传失败！');
                 return false;
             });
     });

     /*上传完成后和创建数据*/
     var uploadData = function (_data, currentButton) {
         var form = currentButton.parents("form:first");
         var courseOpenId = $("[name=courseOpenId]").val()
         _.ajax(urls.homework_uploadFile, { data: _data, courseOpenId: courseOpenId }, function (r) {

             /*显示下载内容，并更新下载链接*/
             $(".answer-content", form).removeClass("am-hide").find("[data-preview_url_ueditor]").attr("data-preview_url_ueditor", r.docUrl).text(r.docTitle);
             form.find("[name=answer]").val(r.docUrl);
             form.find("[name=MD5]").val(r.MD5);

             _.ajax(urls.homework_onlineHomeworkAnswer, ("?" + decodeURIComponent(form.serialize(), true)).QueryStringToJSON(), function (r) {
                 updateDoWork();
             }, 'json');
             return false;
         }, 'json');
     };
 };


 //更新全部的作业是否做的状态
 function updateDoWork () {
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
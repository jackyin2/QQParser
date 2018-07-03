/**
 * @name 问卷列表
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016/7/27
 * @author   wzq
 */
;
(function ($) {

    var info = {
        get: function (ini) {
            var h = this;
            _.ajax(urls.questionnaire_getQuestionInfos, function (r) {
                $("#questioncontent").html(template('questionInfo', r));
                $("#top").html(template('stuInfo', r));
                _.resize();
                h.events();
            }, "json");
            return false;

        },
        events: function () {
            var h = this;
            /*收缩*/
            $('.sou-questionnaire-open').each(function (idx, el) {
                $(this).parents('.am-panel-hd').next().show();
            });
            $('.sou-questionnaire-close').each(function (idx, el) {
                $(this).parents('.am-panel-hd').next().hide();
            });
            $(document).on('click', '.sou-questionnaire-open,.sou-questionnaire-close', function (e) {
                if ($(e.currentTarget).is('.sou-questionnaire-open')) {
                    $(this)
                        .removeClass('sou-questionnaire-open')
                        .addClass('sou-questionnaire-close')
                        .parents('.am-panel-hd').next().stop().slideUp(200);

                } else if ($(e.currentTarget).is('.sou-questionnaire-close')) {
                    $(this)
                        .removeClass('sou-questionnaire-close')
                        .addClass('sou-questionnaire-open')
                        .parents('.am-panel-hd').next().stop().slideDown(200);
                }
            });

            /*单选和量表题*/
            $(".e-q-body[data-nairquestiontype=1] li,.e-q-body[data-nairquestiontype=3] li").click(function () {
                var _this = $(this);
                var _form = _this.parents("form:first")
                _this.siblings("li").removeClass("checked").end().addClass("checked");
                _form.find("[name=answers]").val(_this.data("index"));           
                _.ajax(urls.questionnaire_saveQuestionResult, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
                    $("#" + r.QuestionId + "").val(r.studentExaminationId);
                }, 'json');
                return false;
            });

            /*多选题*/
            $(".e-q-body[data-nairquestiontype=2] li").click(function () {
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
                _form.find("[name=answers]").val(answers);
                _.ajax(urls.questionnaire_saveQuestionResult, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
                    $("#" + r.QuestionId + "").val(r.studentExaminationId);
                }, 'json');
                return false;
            });
            /*问答题*/
            $('.e-q-body[data-nairquestiontype=4] [name=answers]').blur(function () {
                var _this = $(this);
                var _form = _this.parents("form:first");
                _.ajax(urls.questionnaire_saveQuestionResult, ("?" + decodeURIComponent(_form.serialize(), true)).QueryStringToJSON(), function (r) {
                    $("#" + r.QuestionId + "").val(r.studentExaminationId);
                }, 'json');
                return false;
            });
            /*问卷提交*/
            $(".saveQuestion").click(function () {
                if (h.verfiyEmpty()) { alert("存在没有回答的必答题，提交失败"); return false; }
                setTimeout(function () {
                    var activityId = $(".sh-questionnaire-container").data("activityid");
                    _.ajax(urls.questionnaire_submitExaminationResult, { activityId: activityId }, function (r) {
                        if (r.code > 0) {
                            alert("提交成功，正在关闭页面");
                            setTimeout(function () { window.close(); }, 1000);
                        }
                        return false;
                    }, "json");
                }, 500);
            });
        },

        verfiyEmpty : function () {
            var isEmpty = false;
            var Answers = $("[data-answertype=1]").find("[name=answers]");
            jQuery.each(Answers, function (i, v) {
                if (!$(v).val()) {
                    isEmpty = true;
                    return false;
                }
            })
            return isEmpty;
        },

        /* 刷新*/
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
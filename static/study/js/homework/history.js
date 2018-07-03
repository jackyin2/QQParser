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
            _.ajax(urls.homework_history, function (r) {
                if (r.code > 0) {
                    var newData = { code: r.code, param: r.param, homework: r.homework, bigQuestions: r.bigQuestions, questions: r.questions, subQuestions: r.subQuestions };
                    $("#container").html(template("table_html", newData));
                    _.resize();
                    scroll();
                    h.events();
                    bindUeditor();
                    displayAnswer();
                }
            }, "json");
            return false;
        },
        events: function () {
            var h = this;
            var table = $("#maintab");

            $(".optionRandomOrder", h.el).each(function (i, v) {
                var _this = $(this),
                   parentQues = _this.parents("div.quesbody:first");

                var strValue = "";
                parentQues.find("ul.optRandomOrderUl").find("li[data-isanswer=True]").each(function (j, k) {
                    strValue += $(k).data("optionvalue") + ",";
                });

                if (strValue.length > 0) {
                    strValue = strValue.substr(0, strValue.length - 1);
                }
                strValue = strValue.replace(",", "&emsp;&emsp;&emsp;");
                _this.html(strValue);
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

function displayAnswer() {
    var homework_div = $("#homework_div"),
           IsDisplayAnswer = homework_div.data("isdisplayanswer"),
           IsDisplayConsole = homework_div.data("isdisplayconsole"),
           IsDisplayScore = homework_div.data("isdisplayscore");
    if (IsDisplayAnswer == "2") {
        $(".displayAnswer").remove();
    }
    if (IsDisplayConsole == "2") {
        $(".displayConsole").remove();
    }
    if (IsDisplayScore == "2") {
        $(".displayScore").remove();
    }
}

/*初始化Ueditor*/
function bindUeditor() {
    jQuery.each($(".ueditorArea"), function (i, v) {
        var quesid = $(v).attr("id");
        jQuery.bindUeditor(quesid);
    });
};

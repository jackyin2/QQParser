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
        el: $("#finalExamHistry_div"),
        get:function (ini) {
            var h = this;
            _.ajax(urls.finalExam_history, function (r) {
                if (r.code < 0) {
                    location.href = "/study/finalExam/finalExam.html#courseOpenId=" + r.courseOpenId;
                    return false;
                }
                $("#container", h.el).html(template('history_html', r));
                _.resize();
                /*h.events(); */
                /*scroll样式*/
                scroll();
            },"json");
            return false;
        },
        /*events: function () {
            var h = this;
            $(".e-b-open", h.el).click(function (event) {
                var _this = $(this);
                var _anslysis = _this.parent().siblings('.e-a-analysis');
                if (_anslysis.hasClass('e-open')) {
                    _anslysis.hide('200', function () {
                        _this.text('展开解析');
                    }).removeClass('e-open');
                } else {
                    _anslysis.show('200', function () {
                        _this.text('收起解析');
                    }).addClass('e-open');
                };
                return false;
            });
        },*/

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

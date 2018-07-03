/**
 * @name        随学随考
 * @depend    jQuery, template.js
 * @Date         2016-11-29 14:07:27
 * @author      myw
 */
;
var select_NameArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
(function ($) {
    var user = JSON.parse(localStorage["user"]);
    var info = {
        el: $(".content"),
        /*考试批次Id*/
        batchId: _.hash.batchId,
        scsId: _.hash.scsId,
        type: _.hash.type,


        /*获取列表（Table列表显示）*/
        get: function (ini) {
            var h = this;

            _.ajax(urls.student_viewPaper, { batchId: h.batchId, scsId: h.scsId, type: h.type }, function (r) {
                var newr = {
                    paper: r.list[0].paper,
                    select_NameArr: select_NameArr,
                    pqList1: r.list[0].pqList1,
                    pqList2: r.list[0].pqList2,
                    pqList3: r.list[0].pqList3,
                    course: r.course,
                    UserName:r.userName
                };
                $(".subject_content").html(template('paper_html', newr));
                h.back();
                h.reCreate();
                h.submit();
                h.change();
            }, "json");
            return false;
        },

        /*添加课程*/
        back: function () {
            var h = this;
            $('.btn_back').off('click').on('click', function () {
                location.href = "/study/batch/student.html#batchId=" + h.batchId;
            });
        },
        /*再做一次*/
        reCreate: function () {
            var h = this;
            $('.btn_again').off('click').on('click', function () {
                _.ajax(urls.student_againPaper, { batchId: h.batchId, scsId: h.scsId, type: h.type }, function (r) {

                    if (r && r.code > 0) {
                        $M().msg("重新生成试卷成功").position('10%', '50%').time(3);
                        h.refresh();
                    }

                }, "json");
                return false;
            });
        },
        change: function () {
            var h = this;
            $('input[type=radio]').change(function () {
                var par = $(this).parents('.priList');
                _.ajax(urls.student_submitAnswers, { qId: par.data("qid"), num: $('input[type=radio]:checked', par).data("num") }, function (r) {
                }, "json");
            });

            $('input[type=checkbox]').change(function () {
                var par = $(this).parents('.priList');
                var num = "";
                $('input[type=checkbox]:checked', par).each(function (i, v) {
                    num += $(v).data("num") + "#";
                });
                num = num.substr(0, num.length - 1);
                _.ajax(urls.student_submitAnswers, { qId: par.data("qid"), num: num }, function (r) {

                }, "json");
            });
        },
        submit: function () {
            var h = this;
            $('.btn_submit').off('click').on('click', function () {
                var paperId = $('input[name=paperId]').val();
                _.ajax(urls.student_submitPaper, { paperId: paperId, type: h.type, batchId: h.batchId }, function (r) {
                    if (r && r.code > 0) {
                        $M().msg(r.msg).position('10%', '50%').time(3);
                        h.refresh();
                    }
                }, "json");
                return false;
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
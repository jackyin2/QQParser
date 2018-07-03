/**
 * @name 活动信息
 * @return null
 * @depend   jQuery, template.js
 * @Date     2016-6-29
 * @author   wzq
 */
;
(function ($) {

    var info = {
        el: $("#d_coursetoc_t"),

        get: function (ini) {
            var h = this;
            _.ajax(urls.questionnaire_getActivityInfo, function (r) {
                if (r.code < 0) {
                    alert(r.msg);
                    $("#questionnaire_show").html("");
                    return false;
                } else {
                    $("#questionnaire_show").html(template('questionnairet', r));
                }
                _.resize();
                h.events();
            }, "json");
            return false;
        },

        events: function () {
            var h = this;
            var table = $("#table_info");
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
/**
 * @name        论文管理
 * @depend    jQuery, template.js
 * @Date         2016-11-29 14:07:27
 * @author      fxs
 */
;
(function ($) {
    var info = {
        el: $(".main_content"),
        timer:null,
        /*获取列表（Table列表显示）*/
        get: function (ini) {
            var h = this;
            var orderId = _.hash.Id;

            _.ajax(urls.zfbao_zfbaoDingdan, function (r) {

                $("#Myinfo").html(template('Mydingdan', r));

                h.event();
            }, "json");
            return false;
        },

        event: function () {
            var h = this;

            $("#btnok").click(function () {

                var form = $('#dialog_form');

                var data = ("?" + decodeURIComponent(form.serialize(), true)).QueryStringToJSON();

                _.ajax(urls.zfbao_submitZfbao, data, function (r) {
                    if (r && r.code == 1) {

                        $("#Myinfo").html(template('Mycode', r));
                        h.checkPayStatus();
                        h.eventCode();


                    } else {
                        alert(r.msg);
                    }
                }, "json");

                return false;
            });


        },

        /*定时器*/
        checkPayStatus: function () {
            var count = 0;
            
            function print() {
                clearTimeout(info.timer);
                _.ajax(urls.zfbao_checkPayStatus, function (r) {
                    if (r && r.code == 1) {
                        alert(r.msg);
                        clearTimeout(info.timer);
                        return false;
                    }
                }, "json");
                info.timer = setTimeout(function () {
                    print();
                }, 5000);
            }
            info.timer = setTimeout(function () { print(); }, 5000);
        },

        eventCode: function () {
            var h = this;

            $(".js-detail").click(function () {
                $(this).parent().find(".detail-layer-tips").css("display", "block");
                return false;
            });

            $(".js-close").click(function () {
                $(this).parent().css("display", "none");
                return false;
            });

            var _nTimer = 0,
                _oGuide$ = $("#guide"),
                _oGuideTrigger$ = $("#QRcode");

            function _back() {
                _nTimer = setTimeout(function () {
                    _oGuide$.stop().animate({ marginLeft: "-101px", opacity: 0 }, "400", "swing", function () {
                        _oGuide$.hide();
                    });
                }, 100);
            }

            /*guide*/
            _oGuide$.css({ "left": "50%", "opacity": 0 });
            _oGuideTrigger$.mouseover(function () {
                clearTimeout(_nTimer);
                _oGuide$.css("display", "block").stop().animate({ marginLeft: "+147px", opacity: 1 }, 900, "swing", function () {
                    _oGuide$.animate({ marginLeft: "+134px" }, 300);
                });
            }).mouseout(_back);

            _oGuide$.mouseover(function () {
                clearTimeout(_nTimer);
            }).mouseout(_back);

            function backOrder() {
                //30s都为付款，关闭检测付款状态的定时器
                clearTimeout(info.timer);
            };
            window.setTimeout(backOrder, 30000);

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
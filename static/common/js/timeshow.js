/**
 * @return
 * @depend   jQuery MDialog.js
 * @Date     2016年8月24日
 * @author
 */
;
(function ($) {
    $('.submenu li').on('click', function () {
        $('.submenu li').removeClass('current');
        $(this).addClass('current');
    });
    var info = {
        //动态时间
        nowTime: function () {
            showTime();
            setInterval(showTime, 1000);
            function showTime() {
                var t = new Date(),
                    y = t.getFullYear(),
                    m = t.getMonth() + 1,
                    d = t.getDate(),
                    arr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
                    wd = arr[t.getDay()],
                    h = t.getHours(),
                    min = t.getMinutes(),
                    s = t.getSeconds();

                h = changeStyle(h);
                min = changeStyle(min);
                s = changeStyle(s);

                var nowTime = y + '-' + m + '-' + d + ' ' + wd + ' ' + h + ':' + min + ':' + s;
                $('.time').html(nowTime);
            };
            function changeStyle(time) {
                return time < 10 ? '0' + time : time;
            };
        },

        /*身份检验*/
        userCheck: function () {
            /*if (!_.token) {
                $M({
                    title: '提示',
                    content: '您暂未登录，请先登录！',
                    top: '80px',
                    width: '400px',
                    height: '300px',
                    cancel: null,
                    position: '50% 50%',
                    lock: true,
                    ok: function () {
                        //location.href = "/mainsite/mainsite/index.html"
                    }
                });
                $('.ui-MDialog-autofocus').focus();
            }*/
            _.ajax(urls.userCheck, function (r) {
                $(".userName").html(r.userName);
                var user = JSON.parse(localStorage["user"]);
                if (localStorage["subOrMain"] == "true" || localStorage["role"] == 9) {
                    //主站
                    $(".mainhomeLink").attr("href", "/mainsite/mainsite/index.html");
                    $(".mainlinktxt").html("返回主站首页");
                    $(".subhomeLink").hide();
                }
                if (user.UserType == 2)
                {
                    $(".subhomeLink").show();
                    $(".subhomeLink").attr("href", "/subsite/subsite/index.html#siteId="+user.Prop2);
                }
                else {
                    //子站模板
                    $(".mainhomeLink").attr("href", "/mainsite/mainsite/index.html");
                    $(".mainlinktxt").html("返回主站");
                    $(".subhomeLink").hide();
                }
            }, "json");
            return false;
        },

        init: function () {
            this.nowTime();
            this.userCheck();
        },
    };
    info.init();
})(jQuery)
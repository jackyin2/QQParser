/**
 * @name        课程学习
 * @return       null
 * @depend    jQuery, template.js
 * @Date         2016-07-11 10:10:46
 * @author      summerice
 */

(function ($) {
    var isOpen = false;
    var firstCellId = null;
    var info = {
        el: $("#topic"),
        /*获取列表*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.process_getList, function (r) {
                $("#process_container").html(template('process_table', r));
                if (r.process[0] && r.process[0].topics[0] && r.process[0].topics[0].cells[0])
                {
                    firstCellId = r.process[0].topics[0].cells[0].Id;
                }
                h.topic();
            }, "json");
            return false;
        },

        /*头部信息加载*/
        event: function () {
            var h = this;
            _.ajax(urls.process, function (r) {
                $("#process_headshow").html(template('process_head', r));
                if (r.code > 0) {
                    if (firstCellId != null) {
                        $("#continue").attr("href", "../directory/directory.html#courseOpenId=" + r.courseopenid + "&cellId=" + firstCellId);
                    }
                    h.get();
                    h.video();
                }
            }, "json");
            return false;
        },

        /*视频地址和js加载*/
        video: function () {
            var h = this;
            $(".play_video").off('click').on('click', function () {
                var baseUrl = '/common/';
                _.include({
                    jsFiles: [{
                        url: baseUrl + 'js/dfs/preview.js', cb: function () {
                            $('#div_video').html('');
                            var url = $('#div_video').data('video_url')
                            $('#div_video').DViewer({
                                data: JSON.stringify(url),
                                baseUrl: baseUrl + 'js/dfs/'
                            });
                        }
                    }], cssFiles: []
                });
            });
        },

        /*节点展开收缩*/
        topic: function () {
            $(".topic_condensation").off('click').on('click', function () {
                var id = $(this).data("id");
                if (isOpen == false) {
                    $("#" + id + "").css('height', 'auto');
                    $(this).removeClass("am-icon-caret-right").addClass("am-icon-caret-down");
                    isOpen = true;
                    return false;
                }
                $("#" + id + "").css('height', 0);
                $(this).addClass("am-icon-caret-right").removeClass("am-icon-caret-down");
                isOpen = false;
            });
        },

        /*刷新*/
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
            h.event();
        }
    };

    info.init();
})(jQuery)
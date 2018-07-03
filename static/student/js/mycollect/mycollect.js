/**
 * @name 学生空间
 * @depend   jQuery, template.js
 * @Date     2016-12-24
 * @author   wzq
 */

(function ($) {

    var info = {
        el: $("#right_content"),
        get: function (ini) {
            var h = this;
            if (ini) {
                searchPanduan = 0;
                _.hash.name = "";
                _.hash.eduId = "";
                _.hash.prosId = "";
                _.hash.matId = "";
                _.hash.page = 1;
                location.hash = "#" + _.obj2query(_.hash);
            }
            searchPanduan = 1;
            _.ajax(urls.mycollect_getMyCollectList, function (r) {
                $("#content_container", h.el).html(template("table_html", r));
                if (ini) { $("#searchInfo").html(template('searchInfoTip', r)); };
                if (r.list.length == 0) {
                    var old = r.pagination.pageIndex;
                    if (r.pagination.pageIndex > 1) {
                        r.pagination.pageIndex = r.pagination.pageIndex - 1;
                        location.href = location.href.replace("page=" + old, "page=" + r.pagination.pageIndex);
                    }
                }
                _pagination(r.pagination, h.el);
                _.resize();
                h.events();
                h.search();
            }, "json");
            return false;
        },

        events: function () {
            var h = this;
            var table = $("#table_html");
            /*全选或不选*/
            _.checkAll($("#table_info", h.el));

            /*取消收藏*/
            $("#cancelcollect").off('click').on('click', function () {
                var array = _.getSelectedRowIds($("#table_info"));
                if (array.length == 0) {
                    alert('请选择要删除的数据', 'warning');
                    return false;
                }
                confirm('是否取消所选收藏信息？', function () {
                    _.ajax(urls.mycollect_cancelCollect, { Id: array }, function (r) {
                        h.refresh();
                    }, "json");
                });
                return false;
            });
        },

        /*查询*/
        search: function () {
            var h = this;
            $("#search").click(function () {
                searchPanduan = 1;
                var search = $("input[name=search]").val();
                var search1 = $("#eduInfoId").val();
                var search2 = $("#prosInfoId").val();
                var search3 = $("#matInfoId").val();
                _.hash.name = search;
                _.hash.eduId = search1;
                _.hash.prosId = search2;
                _.hash.matId = search3;
                _.hash.page = 1;
                location.hash = "#" + _.obj2query(_.hash);
                return false;
            });
            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    var search = $("input[name=search]").val();
                    var search1 = $("#eduInfoId").val();
                    var search2 = $("#prosInfoId").val();
                    var search3 = $("#matInfoId").val();
                    _.hash.name = search;
                    _.hash.eduId = search1;
                    _.hash.prosId = search2;
                    _.hash.matId = search3;
                    _.hash.page = 1;
                    location.hash = "#" + _.obj2query(_.hash);
                    return false;
                }
            }
        },

        refresh: function () {
            $(window).hashchange();
            return this;
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



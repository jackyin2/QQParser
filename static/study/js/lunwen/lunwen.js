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
        Id: _.hash.Id,
        /*获取列表（Table列表显示）*/
        get: function (ini) {
            var h = this;
            _.ajax(urls.thesisquestion_getThesisQuestionChooseList, function (r) {
                $("#thesisQuestionList").html(template('thesisQuestionListShow', r));
                //_pagination(r.pagination, h.el);
                h.del();
                h.addThesis();
            }, "json");
            return false;
        },

        /*添加论文*/
        addThesis: function () {
            var h = this;
            $('#btnAddThesis').off('click').on('click', function () {
                h.Event();
            });
        },

        /*添加论文信息*/
        Event: function () {
            var h = this;
            _.ajax(urls.thesisquestion_getThesisQuestionList, { Id: _.hash.Id, page: 1 }, function (r) {
               
                var Id = _.hash.Id;
                if (r.code < 0) {
                    alert(r.msg);
                }
                var dlg = jQuery.dynamic_dialog("dlg_add_data");
                if (r.code == 1) {
                    dlg.dialog({
                        title: "添加论文选题",
                        width: 900,
                        height: 500,
                        position: { my: "center", at: "100px", of: window },
                        draggable: true,
                        modal: true,
                        buttons: {
                            "保存": function () {
                                var _this = this;
                                thesisId = _.getSelectedRowIds($("#table_info1"));
                                if (thesisId.length != 1) {
                                    alert("只能选择一个论文题目！");
                                    return false;
                                }
                                _.ajax(urls.thesisquestion_saveThesisQuestion, { ThesisId: thesisId[0], Id: Id }, function (r) {
                                    alert(r.msg);
                                    dlg.dialog("close");
                                    h.refresh();
                                    return false;
                                }, "json");
                            }, "取消": function () {
                                dlg.dialog("close");
                            }
                        }
                    });
                    $("#dlg_add_data").html(template("addThesis", r));
                    h.ajaxPaginations(r);
                }
            }, "json");
            return false;
        },

        /*删除*/
        del: function () {
            var h = this;
            $('.del', h.el).off('click').on('click', function () {
                var Id = $(this).data("id");
                if (Id.length == 0) {
                    alert('请选择要删除的数据', 'warning');
                    return false;
                }
                var data = { Id: Id };
                confirm('是否删除选中的数据？', function () {
                    var type = $("[name=type]", h.el).val();
                    _.ajax(urls.thesisquestion_deleteThesisQuestion, data, function (r) {
                        alert(r.msg);
                        h.refresh();
                    }, "json");
                });
                return false;
            })
        },

        ajaxPaginations: function (r) {
            var h = this;
            _.ajaxPagination = function (r) {
                $("#dlg_add_data").html(template("addThesis", r));
                _pagination(r.pagination, $("#dlg_add_data"), "ajax");
                $("form", $("#dlg_add_data")).attr("action", urls.thesisquestion_getThesisQuestionList);
                var dl = $("#dlg_add_data");
                /*弹框查询*/
                $("#query_btn", dl).click(function () {
                    var form = $('form', dl);
                    var data = ("?" + decodeURIComponent(form.serialize(), true)).QueryStringToJSON(),
                        url = form.attr("action");
                    _.ajax(url, data, function (r) {
                        _.ajaxPagination(r);
                    }, "json");
                    return false;
                });
                /*全选或全不选，同步全选框*/
                _.checkAll($("#form_data"));
            }
            _.ajaxPagination(r);
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
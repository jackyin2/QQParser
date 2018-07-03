/**
 * @name ueditor文件上传管理
 * edit by wl 2016-8-20
 * @depend   jQuery, template.js
 * @Date     2016-7-16
 * @author   cjcheng
 */


$(function () {
    /*获取资源html界面*/
    choosefileHtml = function (newr) {
        var html = template('chooseFile', newr);
        return html;
    }

    fileInit = function () {
        /*绑定checkbox全选*/
        var table = $("#QuesionFile_table");
        _.checkAll(table);

        var courseOpenId = $("[name=courseOpenId]").val();

        /*课程资源*/
        $("#courseResouce").click(function () {
            tabChange(2);
            return false;
        });

        /*上传历史*/
        $("#upHistory").click(function () {
            tabChange(1)
            return false;
        });

        /*我的网盘*/
        $("#myEdoc").click(function () {
            tabChange(3);
            return false;
        });

        /*文档上传*/
        var button = $('#uploader_choosefile');
        var accept = null;
        new uploadFile(button, accept, "类型错误",
            successfull = function (data) {
                _uploadData(data);
            }, fail = function () {
                alert('上传失败');
            });

        /*上传完成后和创建数据*/
        var _uploadData = function (data) {
            var courseOpenId = $('input[name="courseOpenId"]').val();
            _.ajax(urls2.Ueditor_uploadFile, { data: data, courseOpenId: courseOpenId }, function (r) {
                /*显示下载内容，并更新当前列表*/
                tabChange(1);
            }, 'json');
        };

        /*删除上传的资源*/
        $(".deleteQuestionFile", table).unbind("click").bind("click", (function () {
            var _this = $(this);
            var fileId = $(this).parents("tr:first").attr("id");
            confirm('确定删除？', function () {
                _.ajax(urls2.Ueditor_deleteQuestionFile, { fileId: fileId }, function (r) {
                    if (r.code > 0) {
                        tabChange(1);
                    }
                }, 'json')
                return false;
            });
        }));

        /*编辑资源名称 todo*/
        $(".edit_doc_question", table).unbind("click").bind("click", (function () {
            var _this = $(this);
            var fileId = $(this).parents("tr:first").attr("id");
            var td = _this.parents("tr:first").find("td:eq(2)")
            var title = _this.parents("tr:first").find("td:eq(2)").text();
            td.html('<div class="position:relative"><input style="width:300px;height:38px;float:left" type="text" value="' + title + '" name="QuestionDocTitle" /><a class="am-btn am-btn-left save_doc_question" style="margin-left:5px">保存</a></div>');
            _this.hide();
            return false;
        }));

        $("td").unbind("click").on("click", ".save_doc_question", function () {
            var _this = $(this);
            var docQuestionTitle = $(this).parents("tr:first").find("td:eq(2) input").val();
            var fileId = $(this).parents("tr:first").attr("id");
            _.ajax(urls2.Ueditor_save_doc_question, { fileId: fileId, docQuestionTitle: docQuestionTitle }, function (r) {
                if (r.code > 0) {
                    tabChange(1);
                }
            },'json');
            return false;
        });

        /*ajax的弹框分页*/
        function ajaxPagination(r) {
            _.ajaxPagination = function (r) {
                $("#dlg_fix_docs").html(template("chooseFile", r));
                _pagination(r.pagination, $("#dlg_fix_docs"), "ajax");
                fileInit();
            }
            _.ajaxPagination(r);
        };

        /*搜索文件*/
        function queryFile(tab) {
            $("#dlg_fix_docs").off("click.dlg").on("click.dlg", "#btnDialogQuery", function () {
                _.ajax(urls2.Ueditor_chooseFile, { Title: $("[name=Title]", $("#dlg_fix_docs")).val(), courseOpenId: courseOpenId, tab: tab }, function (qr) {
                    ajaxPagination(qr);
                    _.resize();
                }, "json");
                return false;
            });
        }

        /*选项卡切换*/
        function tabChange(tab) {
            _.ajax(urls2.Ueditor_chooseFile, { courseOpenId: courseOpenId, tab: tab }, function (r) {
                var newr = { doc: r.doc, tab: r.tab, userType: r.userType, fileSystemUrl: r.fileSystemUrl, pagination: r.pagination, courseOpenId: r.courseOpenId, Title: r.Title };
                $("#dlg_fix_docs").html(template("chooseFile", newr));
                ajaxPagination(r);
                queryFile(tab);
            }, "json");
        }
    };
})

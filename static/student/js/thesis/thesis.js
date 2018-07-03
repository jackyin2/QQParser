$(function () {
    var Info = {
        el: "#thesisForm",
        get: function () {
            var h = this;
            _.ajax(urls.thesis_getThesisInfo, function (r) {
                $("#thesisForm").html(template("thesis_info_html", r));
                h.upload();
                h.events();

            }, "json");
            return false;

        },

        upload:function () {
            var h = this;
            /*学生上传论文*/
            var button = $('.uploader_preview');
            var accept = "doc,docx";
            new uploadFile(button, accept, "类型错误",
                successfull = function (data, currentButton) {
                    uploadData(data, currentButton);
                }, fail = function () {
                    alert('上传失败');
                });
            /*上传完成后和创建数据*/
            var uploadData = function (_data, currentButton) {
                var stuThesisId = $("[name=stuThesisId]", h.el).val();
                _.ajax(urls.thesis_uploadFile, { data: _data, stuThesisId: stuThesisId }, function (r) {
                    if (r.code > 0) {
                        $(".uploader_preview", h.el).addClass("am-hide");
                        $(".upagain", h.el).addClass("am-hide");
                        $(".thesis-content", h.el).removeClass("am-hide");
                        $(".myThesis", h.el).data("preview_url_ueditor", r.docUrl).data("docurl", r.docUrl).data("md5", r.docMd5).data("doctitle", r.docTitle).data("docsize", r.docSize).data("doctype", r.docType);
                    }
                    alert(r.msg);
                }, 'json');
                return false;
            };
        },

        events:function () {
            var h = this;
            /*删除论文*/
            $(".deleteThesis", h.el).off("click").on("click", function () {
                var _this = $(this);
                _this.parents("div.thesis-content:first").addClass("am-hide");
                $(".uploader_preview", h.el).removeClass("am-hide");
                $(".upagain", h.el).removeClass("am-hide");
                return false;
            })

            /*提交论文*/
            $(".submitThesis", h.el).off("click").on("click", function () {
                var stuThesisId = $("[name=stuThesisId]", h.el).val(),
                    guideTeaId = $("[name=guideTeaId]",h.el).val(),
                    guideTeaName = $("[name=guideTeaName]", h.el).val();
                var _ele = $(this).siblings(".myThesis");
                var data = {
                    stuThesisId: stuThesisId,
                    guideTeaId: guideTeaId,
                    guideTeaName:guideTeaName,
                    docTitle: _ele.data("doctitle"),
                    docMd5: _ele.data("docmd5"),
                    docType: _ele.data("doctype"),
                    docUrl: _ele.data("docurl"),
                    docSize: _ele.data("docsize")
                };
                _.ajax(urls.thesis_stuSubmitThesis, data, function (r) {
                    if (r.code>0) {
                        h.get();
                    }
                }, "json");
                return false;
            })


        },

        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ('?' + location.hash.substring(1)).QueryStringToJSON();
                h.get();
            });
            h.get();
        }
    };

    Info.init();
})
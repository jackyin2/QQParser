$(function () {
    var info = {
        el: $("#title_container"),
        get: function () {
            var h = this;
            _.ajax(urls.thesis_getThesisTitle, function (r) {
                $("#title_container").html(template("title_list_html", r));
                $("#preLink").attr("href", "thesis.html#thesisBatchId=" + r.thesisBatchId);
                _pagination(r.pagination, h.el);
                h.events();
            }, "json");
            return false;
        },

        events:function () {
            var h = this;
            /*学生提交选题*/
            $("#saveTitle", h.el).off("click").on("click", function () {
                var selectedTitleId = $("[name=selectedTitle]:checked", h.el).parents("tr:first").data("titleid");
                if (!selectedTitleId || selectedTitleId.length==0) {
                    alert("请选择一个选题！");
                    return false;
                }

                var thesisBatchId = $("[name=thesisBatchId]", h.el).val(),
                    stuThesisId = $("[name=stuThesisId]",h.el).val();
                _.ajax(urls.thesis_stuChoiceTitle, { stuThesisId: stuThesisId, titleId: selectedTitleId }, function (r) {
                    if (r.code > 0) {
                        alert("选题成功！页面正在跳转...");
                        setTimeout( function () {
                            window.location.href = '/student/thesis/thesis.html#thesisBatchId=' + thesisBatchId;
                        },2000);
                     
                    } else {
                        alert(r.msg);
                        return false;
                    }
                }, "json");
                return false;

            })

            $("#btnQuery").off("click").on("click", function () {
                var query = $("#title_container").serialize(),
                    major = $("#major").val();
                location.hash = "#major=" +major+"&"+ decodeURIComponent(query, true);
                return false;
            });
            document.onkeydown = function (event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode == 13) {
                    $("#btnQuery").click();
                    return false;
                }
            };

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

    info.init();
})
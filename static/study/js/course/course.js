(function ($) {
    var info = {
        el: $("#courseinfo"),
        /*获取列表*/
        get: function () {
            var h = this;
            _.ajax(urls.course_getCourse, function (r) {
                $("#courseList").html(template('courseListShow', r));
                _pagination(r.pagination, h.el, "hash");
                h.restudy();
            }, "json");
            return false;
        },
        /*查询*/
        search: function () {
            var h = this;
            $("#search", h.el).click(function () {
                var search = $("input[name=search]").val();
                _.hash.key = search;
                _.hash.page = 1;
                location.hash = "#" + _.obj2query(_.hash);
                return false;
            });
        },

        /*重新学习*/
        restudy: function () {
            var h = this;
            /*全选或全不选，同步全选框*/
            _.checkAll($("#table"));
            /*单个重新学习*/
            $('.restudy', h.el).off('click').on('click', function () {
                var Id = $(this).data("id");
                $M({
                    title: '确认提示',
                    content: '您确定要重新学习吗？',
                    width: '300px',
                    lock: true,
                    cancel: true,
                    ok: function () {
                        var _this = this;
                        if (!Id) {
                            $M().msg('请选择已存在的数据！').position('10%', '50%').time(3);
                            _this.close();
                            return false;
                        };
                        var data = { Id: Id };
                        _.ajax(urls.course_reStudy, data, function (r) {
                            $M().msg(r.msg).position('10%', '50%').time(3);
                            _this.close();
                            h.refresh();
                            return false;
                        }, "json");
                    },
                    cancel: function () {
                        this.close();
                        return false;
                    }
                });
                $('.ui-MDialog-autofocus').focus();
            })
            /*一键全部学习*/
            $("#restudyAll").off('click').on('click', function () {
                var dictionaryIds = _.getSelectedRowIds($("#table"));
                $M({
                    title: '确认提示',
                    content: '您确定要重新学习吗？',
                    width: '300px',
                    lock: true,
                    cancel: true,
                    ok: function () {
                        var _this = this;
                        if (dictionaryIds.length < 1) {
                            $M().msg('请选择已存在的数据！').position('10%', '50%').time(3);
                            return false;
                        };
                        var data = { Id: dictionaryIds };
                        _.ajax(urls.dictionary_deleteDictionary, data, function (r) {
                            $M().msg(r.msg).position('10%', '50%').time(3);
                            _this.close();
                            h.refresh();
                            return false;
                        }, "json");
                    },
                    cancel: function () {
                        this.close();
                        return false;
                    }
                });
                $('.ui-MDialog-autofocus').focus();
            })
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
            h.search();
        }
    };
    info.init();
})(jQuery)
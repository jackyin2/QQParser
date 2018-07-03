
(function ($) {
    var info = {
        el: $('#updata'),
        get: function (ini) {
            var h = this;
            _.ajax(urls.info_navigation, function (r) {
                if (r && r.list.code == 1) {
                    $("#updata").html(template('upfile', r));
                    _.resize();
                    h.events();
                }
            }, 'json');
            return false;
        },

        events: function () {
            var h = this;
            var url = $('#div_doc').data('doc_url');
            if (url != '') {
                _.include({
                    jsFiles: [{
                        url: '/common/js/dfs/preview.js', cb: function () {
                            $('#div_doc')
                                .html('')
                                .height($(window).height() - 178)
                                .DViewer({
                                    data: JSON.stringify(url),
                                    baseUrl: '/common/js/dfs/'
                                });
                        }
                    }], cssFiles: []
                });
            }
        },

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

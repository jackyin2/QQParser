$(function () {
    var Info = {
        el: "#thesisForm",
        get: function () {
            var h = this;
            _.ajax(urls.thesis_getMyThesis, function (r) {
                $("#content_container").html(template("thesis_info_html", r));
            }, "json");
            return false;

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
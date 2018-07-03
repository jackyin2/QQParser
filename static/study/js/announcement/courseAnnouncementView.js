
(function ($) {
    var info = {
        el: $('#right_content'),

        get: function (ini) {
            var h = this;
            _.ajax(urls.announcement_View, function (r) {
                if(r.code<0)
                {
                    alert(r.msg);
                }
                $("#returnmain").html(template('course_return', r));
                $("#announcementtable").html(template('message', r));
            }, "json");
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

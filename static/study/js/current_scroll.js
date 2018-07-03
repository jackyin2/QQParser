function scroll() {
    var correct_scrool = {};

    var scroll = $((navigator.userAgent.indexOf("MSIE") + navigator.userAgent.indexOf("rv:") > 0) ? window : document.body);

    var navbar = $(".wl_types");/*导航条*/

    navbar.wrap("<div/>");

    var navbarbox = navbar.parent();
    navbarbox.height(0).css('margin-bottom', '70px');

    var typebox = $(".typebox");

    var gotype = $(".go_type", navbar);
    gotype.on("click", function () {
        scrollto(typebox.filter("[data-type=" + $(this).data("type") + "]"));
    });

    correct_scrool.navbar = navbar;
    correct_scrool.scrollPanel = navbar.find('.e-quest-p > .e-selects-g');
    correct_scrool.fixedPanel = navbar.find('.e-quest-p');
    correct_scrool.navbarbox = navbarbox;
    correct_scrool.gotype = gotype;
    correct_scrool.typebox = typebox;

    // $(window).resize(function () {
    //     if (navbar.hasClass('fixed')) {
    //         /*$('.types-l').css('left', typebox.offset().left);
    //         $('.w_e-q-panel').css('left', typebox.offset().left + typebox.width() + 12);*/
    //     }
    // });

    $(".question_nums .e-item").on("click", function () {
        var q = $(".e-q-body[data-num=" + $(this).data("num") + "]");
        var panel = q.parents(".e-q-panel:eq(0)");
        if (!panel.hasClass("close")) { scrollto(q); return; }
        $(".e-close", panel).trigger("click", [function () { scrollto(q); }]);
    });

    // $(window).scroll(function () {
    //     if (!(correct_scrool.navbar && correct_scrool.navbar)) { return; }
    //     var top = scroll.scrollTop();

    //     var navbar = correct_scrool.navbar;
    //     var navbarbox = correct_scrool.navbarbox;

    //     if (top > navbarbox.offset().top) {
    //         /*navbar.css("left", navbarbox.offset().left);*/
    //         navbar.addClass("fixed");
    //         /*$('.types-l').css('left', typebox.offset().left);
    //         $('.w_e-q-panel').css('left', typebox.offset().left + typebox.width() + 12);*/
    //     }
    //     else {
    //         navbar.removeClass("fixed");
    //         /*$('.types-l').css('left', typebox.offset().left);
    //         $('.w_e-q-panel').css('left', '');*/
    //     }

    //     var seltype = correct_scrool.typebox.eq(0).data("type");

    //     correct_scrool.typebox.has(":visible").each(function () {
    //         var typebox = $(this);
    //         if (typebox.offset().top > top + navbar.find(".types-l").outerHeight()) { return false; }
    //         seltype = typebox.data("type");
    //     });
    //     correct_scrool.gotype.removeClass("active");
    //     correct_scrool.gotype.filter("[data-type=" + seltype + "]").addClass("active");
    // }).trigger("scroll");

    function scrollto(y) {
        y = $(y).offset().top - correct_scrool.navbar.find(".types-l").outerHeight();
        try { scroll.stop().animate({ scrollTop: y }, 300, function () { scroll.scrollTop(y); }); }
        catch (e) { scroll.scrollTop(y); }
    }
    window.correct_scrool = correct_scrool;

    /*大题的折叠与展开*/
    $('.e-q-panel').on('click', '.e-q-header', function (event) {
        var panel = $(event.delegateTarget);
        if (panel.hasClass('closed')) {
            panel.removeClass('closed').children('.e-q-body').stop(true, true).slideDown(400);
        } else {
            panel.addClass('closed').children('.e-q-body').stop(true, true).slideUp(400);
        }
        return false;
    });

    /*解析的收起与展开*/
    $(".e-b-open").click(function (event) {
        var _this = $(this);
        var _anslysis = _this.parent().siblings('.e-a-analysis');
        if (_anslysis.hasClass('e-open')) {
            _anslysis.hide('200', function () {
                _this.text('展开解析');
            }).removeClass('e-open');
        } else {
            _anslysis.show('200', function () {
                _this.text('收起解析');
            }).addClass('e-open');
        };
        return false;
    });

    var scrollHandler = debounce(function scrollHandler() {
        if (!(correct_scrool.navbar && correct_scrool.navbar)) { return; }
        var top = scroll.scrollTop();

        var navbar = correct_scrool.navbar;
        var navbarbox = correct_scrool.navbarbox;

        if (top > navbarbox.offset().top) {
            /*navbar.css("left", navbarbox.offset().left);*/
            navbar.addClass("fixed");
            correct_scrool.scrollPanel.height($(window).height() - 320);
            /*$('.types-l').css('left', typebox.offset().left);
            $('.w_e-q-panel').css('left', typebox.offset().left + typebox.width() + 12);*/
        }
        else {
            navbar.removeClass("fixed");
            correct_scrool.scrollPanel.height($(window).height() - 410);
            /*$('.types-l').css('left', typebox.offset().left);
            $('.w_e-q-panel').css('left', '');*/
        }

        var seltype = correct_scrool.typebox.eq(0).data("type");

        correct_scrool.typebox.each(function () {
            var typebox = $(this);
            if (typebox.offset().top > top + navbar.find(".types-l").outerHeight()) { return false; }
            seltype = typebox.data("type");
        });
        correct_scrool.gotype.removeClass("active");
        correct_scrool.gotype.filter("[data-type=" + seltype + "]").addClass("active");

    }, 100);

    var resizeHandler = debounce(function resizeHandler() {
        if($(window).width() < 1200){
            correct_scrool.fixedPanel.css({'right': 0});
        }else{
            correct_scrool.fixedPanel.css({'right': ''});
        }

        correct_scrool.scrollPanel.height($(window).height() - 310);

        if (navbar.hasClass('fixed')) {
            //$('.types-l').css('left', typebox.offset().left);
            //$('.w_e-q-panel').css('left', typebox.offset().left + typebox.width() + 12);
        }
    }, 100);

    // 绑定改变窗口大小事件
    $(window).resize(resizeHandler).trigger("resize");;
    // correct_scrool.scrollPanel.height($(window).height() - 310);

    // 绑定窗口滚动事件
    $(window).scroll(scrollHandler).trigger("scroll");

    // 返回一个函数，如果它被不间断地调用，它将不会得到执行。
    // 该函数在停止调用 N 毫秒后，再次调用它才会得到执行。
    // 如果有传递 ‘immediate’ 参数，会马上将函数安排到执行队列中，而不会延迟。
    function debounce(func, wait, immediate) {
        var timeout;
        // if ( window.requestAnimationFrame ) {
        //     return function(){
        //         window.requestAnimationFrame(func);
        //     }
        // } else {
            return function() {
                
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        // };
    };

}
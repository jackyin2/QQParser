var menu = {
    menus: [
        {
            title: '我的首页',
            key: 'studio',
            clss: 'upc-icon-homesmall',
            url: '/study/studio/studio.html'
        },
        {
            title: '个人信息',
            key: 'stuInfo',
            clss: 'upc-icon-grxx',
            url: '/study/stuInfo/stuInfo.html'
        },
        {
            title: '考核管理',
            key: 'batch',
            clss: 'upc-icon-wdkc',
            url: '/study/batch/batch.html'
        },
         {
             title: '论文管理',
             key: 'lunwen',
             clss: 'upc-icon-wdkc',
             url: '/study/lunwen/lunwenplan.html'
         },
    ],

    loadMenu: function () {
       /* _.ajax(urls.menu_LoadMenuItemData, {}, function (r) {
            var _html_active = '<li class="menu-nav-li active"><a href="{{itemUrl}}#parentId={{parentId}}" class="menu-nav-btn">' + '<i class="upc-icon {{itemIcon}}"></i>{{itemName}}</a></li>';
            var _html = '<li class="menu-nav-li"><a href="{{itemUrl}}#parentId={{parentId}}" class="menu-nav-btn">' + '<i class="upc-icon {{itemIcon}}"></i>{{itemName}}</a></li>';

            var _this = this,
                container = $("#menu"),
                html = $('<div id="d_menu_course_t" class="d-menu"></div>'),
                html_ = $(' <nav class="menu-nav"><div id="upc_menu_hover" class="upc-menu-hover" style="top: 50px;"><span class="upc-menu-in"></span></div><ul class="menu-ul"></ul></nav>');

            var currUrl = window.location.href;
            html = html.append('<div class="menu-title am-text-lg plain"><span class="am-icon am-icon-university"></span>学生空间</div>');

            $.each(r.list, function (i, v) {
                var _t = "";
                if (currUrl.indexOf(v.itemUrl) >= 0 || (currUrl.indexOf("myMessage") >= 0 && v.itemUrl.indexOf("myMessage") >= 0)) {
                    _t = $(template.compile(_html_active)(v));
                }
                else {
                    _t = $(template.compile(_html)(v));
                }
                html_.find('ul').append(_t);
            });

            html.append(html_)
            container.html(html);

            var upcMenuHover = $('#upc_menu_hover');
            var timer = null;
            var queue = [];
            // 缓存offsetTop
            $('.menu-nav-li').each(function (idx, el) {
                $(el).data('idx', idx).data('offsetY', el.offsetTop);
            });

            // 初始化位置
            upcMenuHover.css('top', $('.menu-nav-li.active')[0].offsetTop);
        }, "json");*/

        var _html_menu = '<li class="menu-nav-li"><a href="{{url}}" class="menu-nav-btn">' + '<i class="upc-icon {{clss}}"></i>{{title}} </a> </li>',
           _html_menu_active = '<li class="menu-nav-li active"><a href="{{url}}" class="menu-nav-btn">' + '<i class="upc-icon {{clss}}"></i>{{title}} </a> </li>';
        var _this = this,
            container = $('#menu'),
            html = $('<div id="d_menu_course_t" class="d-menu"></div>'),
            html_ = $(' <nav class="menu-nav"><div class="upc-menu-hover" id="upc_menu_hover" style="top: 50px;"><span class="upc-menu-in"></span></div><ul class="menu-ul"></ul></nav>');

        var currUrl = window.location.href;

        html = html.append('<div class="menu-title am-text-lg plain"><span class="am-icon am-icon-university"></span>学生空间</div>');

        $.each(_this.menus, function (i, v) {
            var _t = null;
            if (v && currUrl.indexOf(v.key) >= 0 || (currUrl.indexOf("myMessage") >= 0 && v.key.indexOf("myMessage") >= 0)) {
                _t = $(template.compile(_html_menu_active)(v));
            } else {
                _t = $(template.compile(_html_menu)(v));
            }
            html_.find('ul').append(_t);
        });

        html.append(html_)
        container.html(html);

        var upcMenuHover = $('#upc_menu_hover');
        var timer = null;
        var queue = [];

        $('.menu-nav-li').each(function (idx, el) {
            $(el).data('idx', idx).data('offsetY', el.offsetTop);
        });

        //upcMenuHover.css('top', $('.menu-nav-li.active')[0].offsetTop);

        $('.menu-nav-li').mouseover(function (e) {
            e.stopPropagation();
            var _this = this;
            upcMenuHover.css('top', $(this).data('offsetY'));
            return false;
        });

        $('.menu-ul').mouseout(function (e) {
            upcMenuHover.css('top', $('.menu-nav-li.active')[0].offsetTop);
        });

     
    },
};

menu.loadMenu();
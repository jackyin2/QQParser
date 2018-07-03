var user = JSON.parse(localStorage["user"]);
var role = user.UserType;
var menu = {

    menus: role == 9 ? [{
        title: '我的首页',
        key: 'myfirstpage',
        url: '/study/myfirstpage/myfirstpage.html',
    }, {
        title: '我的活动',
        key: 'activity',
        url: '/study/activity/activity.html',
    }, {
        title: '我的课程',
        key: 'course',
        url: '/study/course/course.html',
    }, {
        title: '我的资源',
        key: 'resource',
        url: '/study/resource/resource.html',
    }, {
        title: '我的收藏',
        key: 'collect',
        url: '/study/collect/collect.html',
    }, {
        title: '浏览记录',
        key: 'browse',
        url: '/study/browse/browse.html',
    },
    {
        title: '个人信息',
        key: 'personinfo',
        url: '/study/personinfo/personinfo.html',
    }
    ] : [
    {
        title: '个人信息',
        key: 'personinfo',
        url: '/study/personinfo/personinfo.html',
    },
    {
        title: '考核管理',
        key: 'batch',
        url: '/study/batch/batch.html',
    },
       {
           title: '论文管理',
           key: 'lunwen',
           url: '/study/lunwen/lunwen.html',
       },
    ],

    loadMenu: function () {
        var _html = '<li><span class="border"></span><a href="{{url}}">{{title}}</a></li>'
        var _html_active = '<li class="current"><span class="border"></span><a href="{{url}}">{{title}}</a></li>'

        var _this = this,
            container = $('#submenu'),
            html = $('<ul></ul>');

        var key = window.location.href;

        $.each(_this.menus, function (i, v) {

            var _t = null;
            if (v && key.indexOf(v.key) < 0) {
                _t = $(template.compile(_html)(v));
            } else {
                _t = $(template.compile(_html_active)(v));
            }
            html = html.append(_t);
        });
        container.html(html);
    },

    init: function () {
        this.loadMenu();
    }
};

menu.init();
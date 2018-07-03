var header = {

    menus: [
      {
        title: '课程公告',
        key: 'announcement',
        clss: 'upc-icon-kcgg',
        url: '/study/announcement/announcement.html'
        },
       {
        title: '学习导航',
        key: 'infoIndex.html?t=1',
        clss: 'upc-icon-xxdh',
        url: '/study/info/infoIndex.html?t=1#type=1'
       },
       {
        title: '自学指导',
        key: 'infoIndex.html?t=2',
        clss: 'upc-icon-zxzd',
        url: '/study/info/infoIndex.html?t=2#type=2'
       },
      {
        title: '课程目录',
        key: 'process',
        clss: 'upc-icon-kcxx',
        url: '/study/process/process.html'
      },
      {
          title: '授课资料',
          key: 'docs',
          clss: 'upc-icon-kczy',
          url: '/study/docs/docs.html'
      },
     {
        title: '总复习',
        key: 'totalReview',
        clss: 'upc-icon-zfx',
        url: '/study/totalReview/totalReview.html'
     },
     {
        title: '在线作业',
        key: 'homework',
        clss: 'upc-icon-zxzy',
        url: "/study/homework/homework.html",
     },
    {
        title: '在线考试',
        key: 'finalExam',
        clss: 'upc-icon-zxks',
        url: "/study/finalExam/finalExam.html",
    },
    //{
    //    title: '问卷调查',
    //    key: 'questionnaire',
    //    clss: 'upc-icon-wjdc',
    //    url: '/study/questionnaire/questionnaire.html'
    //},
      {
          title: '课程问答',
          key: 'categoryType=bbskcwd',
          clss: 'upc-icon-zxdy',
          url: '/study/bbs/topic/bbs.html?t=1#categoryType=bbskcwd'
      }
      //,
    //{
    //    title: '课程笔记',
    //    key: 'categoryType=bbskcbj',
    //    clss: 'upc-icon-kcbj',
    //    url: '/study/bbs/topic/bbs.html?t=2#categoryType=bbskcbj'
    //},
    //{
    //    title: '资源评价',
    //    key: 'categoryType=bbskcpl',
    //    clss: 'upc-icon-zypj',
    //    url: '/study/bbs/topic/bbs.html?t=3#categoryType=bbskcpl'
    //}
    //{
    //    title: '排行榜',
    //    key: 'viewScore',
    //    clss: 'upc-icon-phb',
    //    url: '/study/viewScore/viewScore.html'
    //},
    //{
    //    title: '课程同学',
    //    key: 'openStudent',
    //    clss: 'upc-icon-kctx',
    //    url: '/study/openStudent/openStudent.html'
    //}
    ],

    loadMenu: function () {
        var _html = '<li class="menu-nav-li active"><a href="{{url}}" class="menu-nav-btn">'
                   + '<i class="upc-icon {{clss}}"></i>{{title}} </a> </li>';
        var _html_1 = '<li class="menu-nav-li"><a href="{{url}}" class="menu-nav-btn">'
             + '<i class="upc-icon {{clss}}"></i>{{title}} </a> </li>';

        var _this = this,
            container = $('#menu'),
            html = $('<div id="d_menu_course_t" class="d-menu"></div>'),
            html_ = $(' <nav class="menu-nav"><div class="upc-menu-hover" id="upc_menu_hover" style="top: 50px;"><span class="upc-menu-in"></span></div><ul class="menu-ul"></ul></nav>');
        var key = window.location.href;
         html = html.append('<div class="menu-title am-text-lg"><span class="am-icon am-icon-university"></span><p class="title"><span id="courseName" class="title-text"></span></p></div>');

         _.ajax(urls.courseLoad_getCourse, { courseOpenId: _.hash.courseOpenId }, function (r) {
             if (r.courseName) {
                 $("#courseName").html(r.courseName);
             }
         }, "json");
        $.each(_this.menus, function (i, v) {
            if (v.url.indexOf("#") > -1) {
                if (v.key == "announcement") {
                    v.url += "&courseOpenId=" + _.hash.courseOpenId + "&openClassId=" + _.hash.openClassId + "&dataType=1";
                } else if (v.key == "viewScore") {
                    v.url += "&courseOpenId=" + _.hash.courseOpenId + "&openClassId=" + _.hash.openClassId + "&viewIndex=1";
                }
                else {
                    v.url += "&courseOpenId=" + _.hash.courseOpenId + "&openClassId=" + _.hash.openClassId;
                }
            } else {
                if (v.key == "announcement") {
                    v.url += "#courseOpenId=" + _.hash.courseOpenId + "&openClassId=" + _.hash.openClassId + "&dataType=1";
                } else if (v.key == "viewScore") {
                    v.url += "#courseOpenId=" + _.hash.courseOpenId + "&openClassId=" + _.hash.openClassId + "&viewIndex=1";
                }
                else {
                    v.url += "#courseOpenId=" + _.hash.courseOpenId + "&openClassId=" + _.hash.openClassId;
                }
            }

            var _t = null;
            if (v && key.indexOf(v.key) < 0) {
                _t = $(template.compile(_html_1)(v));
            } else {
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
    scrolltop: function () {
        $("html,body").animate({
            scrollTop: $("li.active", $("#menu")).offset().top - 60
        }, 50);
    },
    init: function () {
        this.loadMenu();
        /*this.scrolltop();*/
    }
};

header.init();
(function ($) {
    var info = {
        el: $("#myfirstpageinfo"),
        /*获取列表*/
        get: function () {
            var h = this;
            _.ajax(urls.myfirstpage_getFirstInfo, function (r) {
                $("#myfirstpageList").html(template('myfirstpageListShow', r));
                h.bindPic(r);
            }, "json");
            return false;
        },

        /*统计图*/
        bindPic: function (r) {

            /*我的课程*/
            Highcharts.chart('container1', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                colors: [
                    '#FFFF00',
                    '#F5F5DC'
                ],
                title: {
                    text: '<p style="font-size:12px;">我的课程</p><br><p style="font-size:12px;">数</p>',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 20
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%']
                    }
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    type: 'pie',
                    name: '我的课程百分比',
                    innerSize: '50%',
                    data: [
                        //['', r.MyCourseCount],
                        //['', r.CourseCount],
                        //由于暂时没有我的课程该功能，所以这一块是写死的数据
                        ['', 3/4],
                       // ['',1],
                        {
                            name: '剩余课程',
                            y:1/4,
                            dataLabels: {
                                enabled: false
                            }
                        }
                    ]
                }]
            });

            /*我的活动*/
            Highcharts.chart('container2', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                colors: [
                    '#40E0D0',
                    '#F5F5DC'
                ],
                title: {
                    text: '  <br><p style="font-size:12px;">我参加过</p><br><p style="font-size:12px;">的活动</p>',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 20
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%']
                    }
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    type: 'pie',
                    name: '我参加的活动百分比',
                    innerSize: '50%',
                    data: [
                        ['', r.MyActivityCount / r.ActivityCount],
                        //['', r.ActivityCount - r.MyActivityCount],
                        {
                            name: '剩余活动',
                            y: (r.ActivityCount - r.MyActivityCount)/r.ActivityCount,
                            dataLabels: {
                                enabled: false
                            }
                        }
                    ]
                }]
            });

            /*我的资源*/
            Highcharts.chart('container3', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                colors: [
                   '#FF8C00',
                   '#F5F5DC'
                ],
                title: {
                    text: '<p style="font-size:12px;">我的资源</p><br><p style="font-size:12px;">数</p>',
                    align: 'center',
                    verticalAlign: 'middle',
                    y: 20
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%']
                    }
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    type: 'pie',
                    name: '我的资源百分比',
                    innerSize: '50%',
                    data: [
                          ['', r.MyResourceCount / r.ResourceCount],
                        //['', r.ResourceCount - r.MyResourceCount],
                       
                        {
                            name: '剩余资源',
                            y: (r.ResourceCount - r.MyResourceCount)/r.ResourceCount,
                            dataLabels: {
                                enabled: false
                            }
                        }
                    ]
                }]
            });

            /*我的收藏*/
            Highcharts.chart('container4', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false
                },
                colors: [
                   '#00FFFF',
                   '#F5F5DC'
                ],
                title: {
                    text: '<p style="font-size:12px;">我的收藏</p><br><p style="font-size:12px;">数</p>',
                    align: 'center',
                    size:'10',
                    verticalAlign: 'middle',
                    y: 20
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: true,
                            distance: -50,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: -90,
                        endAngle: 90,
                        center: ['50%', '75%']
                    }
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    type: 'pie',
                    name: '我的收藏百分比',
                    innerSize: '50%',
                    data: [
                          ['', r.MyCollectCount / r.DocCount],
                         // ['', r.DocCount - r.MyCollectCount],
                     
                        {
                            name: '剩余收藏',
                            y: (r.DocCount - r.MyCollectCount)/r.DocCount,
                            dataLabels: {
                                enabled: false
                            }
                        }
                    ]
                }]
            });

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
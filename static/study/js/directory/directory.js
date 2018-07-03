/**
 * @name        课程播放
 * @return       null
 * @depend    jQuery, template.js
 * @Date         2016-07-12 10:26:57
 * @author      summerice
 */
;
(function ($) {
    var courseOpenId = _.hash.courseOpenId;
    var cellId = _.hash.cellId;
    var info = {
        el: $("#d_study_t"),

        /*目录信息加载*/
        get: function (ini) {
            var h = this;
            var user = JSON.parse(localStorage["user"]);
            var role = user.UserType;

            if (role == 3) {
                $(".current").attr("href", "/teacher/homePage/homePage.html");
                $(".editPhoto").attr("href", "/design/teacherinfo/teacherinfo.html");
                $(".current").html("老师空间");
            } else {
                $(".current").attr("href", "/student/stuInfo/stuInfo.html");
                $(".current").html("学生空间");
            }
           
            _.ajax(urls.directory, function (r) {
                
                $("#d_cwnav").html(template('catalog', r));
                h.catalog();
                h.bindHandle();
                /*初始化*/
                h.setVideoEndTimeValue(0.0);
                h.setLockValue(0);
                h.setCheckAnswerValue(0);
                /*刚进入页面时隐藏问答、笔记、评价入口 因为此时还没有定位到具体的单元*/
                $(".isHideButton",h.el).hide();
            }, "json");
            return false;
        },

        /*目录*/
        catalog: function () {
            var h = this;
            window.onbeforeunload = h.onbeforeunload_handler;
            window.onunload = h.onunload_handler;
            /*设置右侧目录高度*/
            var wp = $('.wrapper')
               , ccNtt = $('.cell_content')
               , cwNav = $('.d-cwnav')
               , cwBd = $('.sh-cw-bd')
               , cwbox = $('#doc_box');

            wp.width('auto');
            ccNtt.css('height', $(window).height() - 86);
            cwNav.css({ 'min-height': $(window).height() - 86, 'height': $(window).height() - 86 });
            cwBd.css('height', $(window).height() - 125);

            /*目录点击事件*/
            $('#btn_cw_toc').on('click', function () {
                $('.right_button').removeClass('active');
                $(this).addClass('active');
                $('.right_show_content').hide();
                showRightPanel('b_cw_toc');
            });
            /*问答点击事件*/
            $('#btn_cw_faq').on('click', function () {
                h.bindQuestionEvent();
                $('.right_button').removeClass('active');
                $(this).addClass('active');
                $('.right_show_content').hide();
                showRightPanel('b_cw_faq');
            });

            /*笔记点击事件*/
            $('#btn_cw_nte').on('click', function () {
                h.bindNoteEvent();
                $('.right_button').removeClass('active');
                $(this).addClass('active');
                $('.right_show_content').hide();
                showRightPanel('b_cw_nte');
            });

            /*评价点击事件*/
            $('#btn_cw_eva').on('click', function () {
                h.bindCommentEvent();
                $('.right_button').removeClass('active');
                $(this).addClass('active');
                $('.right_show_content').hide();
                showRightPanel('b_cw_eva')
            });

            /*点击右上角的×*/
            $(".sh-cw-close").on("click", function () {
                $('.cell_content').animate({ 'padding-right': '50px' });
                $('#d_cwnavbot').animate({ 'right': '50px' });
                $(".right_show_content").animate({ 'width': '0px' }, function () {
                    $(".tab-content > div").hide();
                    $('.right_show_content').hide();
                    $('.cw-btn').removeClass('active');
                });
            });

            /*显示右边的内容*/
            function showRightPanel(id) {
                var content = $('#' + id);
                $('.cell_content').animate({ "padding-right": "50px" });
                $('#d_cwnavbot').animate({ "right": "50px" });
                content.animate({ "width": "0px" }, function () {
                    $('.cell_content').animate({ "padding-right": "340px" });
                    $('#d_cwnavbot').animate({ "right": "340px" });
                    content.css({ "display": "block" });
                    content.animate({ "width": "290px" });
                });
            }
        },

        /*节点展开收缩*/
        bindHandle: function () {
            var h = this;
            $('.course_catalog').find('.show_topic').on('click', function () {
                var isvalid = $(this).data("isvalid");
                /*if ($(this).data("isvalid") != 1) { alert("对不起,您的上一模块的学习进度没有达到要求"); return false; }*/
                var show_area = $(this).parent().parent().find('.div_show_cell');
                var show_icon = $(this).parent().parent().find('.show_cell_list');
                var isleaf = show_area.data('isleaf');
                if (show_area.css('display') == 'none') {
                    show_area.css('display', 'block');
                    show_icon.removeClass('am-icon-caret-right');
                    show_icon.addClass('am-icon-caret-down');
                } else {
                    show_area.css('display', 'none');
                    show_icon.removeClass('am-icon-caret-down');
                    show_icon.addClass('am-icon-caret-right');
                }
                if (isleaf == 'True') {
                    show_area.css('display', 'none');
                }
            });
            $('.cell_info').on('click', function () {
                $('.cell_info').find('a').removeClass('active');
                $(this).find('a').addClass('active');
                cellId = $(this).data("id");
                _.hash.cellId = cellId;
                location.hash = "#" + _.obj2query(_.hash);
                $("#dlg_show_question").dialog('close');
                h.showCellInformation();
                return false;
            });
        },

        /*问答*/
        bindQuestionEvent: function () {
            var h = this;
            $('#text_problem').val('');
            /*按钮先移除点击事件*/
            $('#submit_problem').unbind('click');
            $('#submit_problem').on('click', function () {
                var content = $('#text_problem').val();
                if ($.trim(content).length==0) {
                    alert('请填写内容！', 'error');
                    return false;
                }
                /*保存问题*/
                $("#loginloaddivimg").show();
                _.ajax(urls.directory_saveQuestion, { cellId: cellId,content: content }, function (r) {
                    $("#loginloaddivimg").hide();
                    if (!r) { alert("发生未知错误!", 'error'); return false; }
                    if (r.code < 0) { alert(r.msg, 'error'); return false; }
                }, "json");
                return false;
            });
            $('#cancel_problem').on('click', function () {
                $('#title_problem').val("");
                $('#text_problem').val("");
                return true;
            });

            $("#more_question").off("click").on("click", function () {
                var nowThis = $(this),
                /* 页面取值*/
                usertype = nowThis.data("usertype");
                if (usertype == "1") {
                    nowThis.attr('href', "http://" + window.location.host + '/study/bbs/topic/replyTopic.html#courseOpenId=' + courseOpenId + '&topicId=qa-' + cellId + '&categoryType=bbskcwd');
                } else {
                    nowThis.attr('href', "http://" + window.location.host + '/design/bbs/topic/replyTopic.html#courseOpenId=' + courseOpenId + '&topicId=qa-' + cellId + '&categoryType=bbskcwd');
                }
                return true;
            });
        },

        /*笔记*/
        bindNoteEvent: function () {
            var h = this;
            $('#txt_note').val('');
            /*按钮先移除点击事件*/
            $('#submit_note').unbind('click');
            $('#submit_note').on('click', function () {
                var content = $('#txt_note').val();
                if ($.trim(content).length==0) {
                    alert('请填写内容！', 'error');
                    return false;
                }
                var isopen = false;
                if ($('#check_isopen').attr('checked') == 'checked') {
                    isopen = true;
                }
                $("#loginloaddivimg").show();
                _.ajax(urls.directory_saveNote, { courseOpenId: courseOpenId, cellId: cellId, content: content, isopen: isopen }, function (r) {
                    $("#loginloaddivimg").hide();
                    if (!r) { alert("发生未知错误!", 'error'); return false; }
                    if (r.code < 0) { alert(r.msg, 'error'); return false; }
                    $('#note_message').css('display', '');
                }, "json");
                return false;
            });

            $("#more_note").off("click").on("click", function () {
                var nowThis = $(this),
                /* 页面取值*/
                usertype = nowThis.data("usertype");
                if (usertype == "1") {
                    nowThis.attr('href', "http://" + window.location.host + '/study/bbs/topic/replyTopic.html#courseOpenId=' + courseOpenId + '&categoryId=bbskcbj-' + courseOpenId + '&topicId=note-' + cellId + '&categoryType=bbskcbj');
                } else {
                    nowThis.attr('href', "http://" + window.location.host + '/design/bbs/topic/replyTopic.html#courseOpenId=' + courseOpenId + '&categoryId=bbskcbj-' + courseOpenId + '&topicId=note-' + cellId + '&categoryType=bbskcbj');
                }
                return true;
            });
        },

        /*评价*/
        bindCommentEvent: function () {
            var h = this;
            $('#text_comment').val('');
            /*按钮先移除点击事件*/
            $('.submit_comment').unbind('click');
            $('.submit_comment').on('click', function (e) {
                var content = $('#text_comment').val();
                if ($.trim(content).length ==0) {
                    alert('请填写内容！', 'error');
                    return false;
                }
                $("#loginloaddivimg").show();
                /*保存评论*/
                _.ajax(urls.directory_saveComment, { cellId: cellId, content: content }, function (r) {
                    $("#loginloaddivimg").hide();
                    if (!r) { alert("发生未知错误!", 'error'); return false; }
                    if (r.code < 0) { alert(r.msg, 'error'); return false; }
                    $('#comment_message').css('display', '');
                }, "json");
                e.stopPropagation;
                return false;
            });
            /*获取评论上方所展示的资源的信息*/
            _.ajax(urls.directory_getCourseDoc,{cellId: cellId }, function (r){
                if (!r) {
                    alert("发生未知错误!");
                    return false;
                }
                if (r.code < 0) {
                    return false;
                }
                /*给Uedit赋值*/
                $('#text_comment').val(r.content);
                /*给资源名赋值*/
                var cellname = r.cellname;
                $('#cell_name').html(cellname);
                h.commentRate(r.rate);
            }, "json");

            $("#more_comment").off("click").on('click', function () {
                var nowThis = $(this),
                /* 页面取值*/
                usertype = nowThis.data("usertype");
                if (usertype == "9") {
                    nowThis.attr('href', "http://" + window.location.host + '/study/bbs/topic/replyTopic.html#courseOpenId=' + courseOpenId + '&categoryId=bbskcpl-' + courseOpenId + '&topicId=comment-' + cellId + '&categoryType=bbskcpl');
                } else {
                    nowThis.attr('href', "http://" + window.location.host + '/design/bbs/topic/replyTopic.html#courseOpenId=' + courseOpenId + '&categoryId=bbskcpl-' + courseOpenId + '&topicId=comment-' + cellId + '&categoryType=bbskcpl');
                }
                return true;
            });
        },

        /*资源评级*/
        commentRate: function (ini) {
            var h = this;
            $('#rate_score').html(ini);
            $('#ratebox').raty('destroy').raty({
                path: '/common/css/images',
                size: 22,
                width: 160,
                score: ini,
                mouseout: function (v) {
                    $('#rate_score').text(ini);
                },
                mouseover: function (v) {
                    $('#rate_score').text(v);
                },
                hints: ['很差', '较差', '还行', '推荐', '力荐'],
                click: function () {
                    var score = $("#rate_score").text();
                    _.ajax(urls.directory_commentRate, { cellId: cellId, score: score }, function (r) {
                        if (r.code == -1) {
                            $('#rate_hint').html('您已评价！');
                            $('#ratebox').raty('score', ini);
                            $('#rate_score').text(ini);
                        } else {
                            $('#rate_hint').html('感谢您的评价！');
                            $('#ratebox').raty('score', score);
                            $('#rate_score').html(score);
                        }
                        $('#ratebox').raty('readOnly', true);
                    }, 'json');
                },
                start: ini,
                targetKeep: true,
                targetScore: '#rate_score',
                target: '#rate_hint',
            });
        },

        /*资源获取*/
        showCellInformation: function () {
            var h = this;
            h.cellLeaveLog()
            if (cellId != null) {
                _.ajax(urls.directory_getCell, { cellId: cellId, courseOpenId: courseOpenId }, function (r) {
                    
                    if (r.code == -1) {
                        alert(r.msg, 'error');
                        return false;
                    };
                    $(".isHideButton", h.el).show();

                    $('#btn_cw_eva').hide();
                    if (r.code == 2) {
                        $(".cell_show").html(template('download', r));
                        return false;
                    }
                    /*单元类型不是链接类型时显示评论功能*/
                    switch (r.cellType) {
                        case 1:
                            $(".cell_show").html(template('resourse', r));
                            $('#btn_cw_eva').show();
                            h.setVideoEndTimeValue(r.videoEndTime);
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            $(".cell_show").html(template('external', r));
                            h.externalLink_view($('.external-content').data('url'));
                            if ($('#btn_cw_eva').hasClass('active')) {
                                $('#b_cwfloat >div[id=btn_cw_toc]').trigger('click');
                            }
                            break;
                    }
                    /*将即时问题的数据赋值给window变量*/
                    if (r.videoShowQuestionData != '' && r.videoShowQuestionData != undefined) {
                        window['videoShowQuestionData'] = JSON.parse(r.videoShowQuestionData);
                    }
                    h.viewCellResource();
                    /*将当前的单元Id存放到hide中*/
                    $("#hide_cellId").val(cellId);
                }, "json");
                return false;
            }
        },

        /*资源查看功能*/
        viewCellResource: function () {
            var h = this;
            var baseUrl = '/common/';
            var box = $('#doc_box');
            box.height($(window).height() - 112);
            box.children().remove();
            var url = box.data('url');
            if (url != '' && url != undefined) {
                h.removejwPlayer();
                _.include({
                    jsFiles: [{
                        url: baseUrl + 'js/dfs/preview.js', cb: function (e) {
                            box.DViewer({
                                data: JSON.stringify(box.data("url")),
                                baseUrl: baseUrl + 'js/dfs/'
                            });
                            h.monitor();
                        }
                    }], cssFiles: []
                });
            }
        },

        /*监视播放器加载*/
        monitor: function () {
            var h = this;
            /*定义一个间隔函数，0.5秒调用一次*/
            var monitor = setInterval(monitorJwPlayer, 500);
            function monitorJwPlayer()
            {
                /*判断JwPlayer是否已经加载完成*/
                if (jwplayer($('.video_container').attr('id')).version != undefined) {
                    clearInterval(monitor);
                    /*设置视频即时问题*/
                    h.setImmediateQuestion();
                    /*断点继播的功能*/
                    h.setVideoStartTime();
                }
            }
        },

        /*移除播放器*/
        removejwPlayer: function () {
            var thePlayer = jwplayer($('.video_container').attr('id'));
            if (thePlayer.version != undefined) {
                thePlayer.remove();
            }
        },

        /*记录日志*/
        cellLeaveLog: function () {
            /*从hidden中获取上一次的单元数据如果不相同请求保存日志信息*/
            var lastCellId = $('#hide_cellId').val();
            var currentVideoTime = 0;
            var videoLengthTime = 0;
            var thePlayer = jwplayer($('.video_container').attr('id'));
            if (thePlayer.version != undefined) {
                currentVideoTime = thePlayer.getPosition();
                videoLengthTime = thePlayer.getDuration();
            }
            if (lastCellId != '') {
                _.ajax(urls.directory_cellLeaveLog, { cellId: lastCellId, videoEndTime: currentVideoTime, videoLengthTime: videoLengthTime }, function (r) {
                    /*不做任何操作*/
                });
            }
        },

        /*设置即时问题显示*/
        setImmediateQuestion: function () {
            var h = this;
            var videoShowQuestionData = window['videoShowQuestionData'];
            var thePlayer = jwplayer($('.video_container').attr('id'));
            /*如果没有设置即时问题*/
            if (videoShowQuestionData == '[]' || videoShowQuestionData == '') {
                return false;
            }
            thePlayer.onTime(function () {
                /*循环遍历出要显示的即时问题*/
                for (var i = 0; i < videoShowQuestionData.length; i++) {
                    var question = videoShowQuestionData[i];
                    var lock = h.getLockValue();
                    if (lock == 0 && thePlayer.getPosition() >= question.ShowTime && thePlayer.getPosition() < question.ShowTime + 0.25 && videoShowQuestionData[i].IsReplay == false) {
                        /*先暂停播放*/
                        thePlayer.play(false);
                        h.setLockValue(1);
                        h.getImmediateQuesionAndShow(question.Id);
                        videoShowQuestionData[i].IsReplay = true;
                    }
                }
            });

            /*移动进度条的时候设置为默认值*/
            thePlayer.onSeek(function () {
                var cellQuestionId = window['cellQuestionId']
                if (typeof (cellQuestionId) != 'undefined' && cellQuestionId != '') {
                    for (var i = 0; i < videoShowQuestionData.length; i++) {
                        if (cellQuestionId == videoShowQuestionData[i].Id) {
                            videoShowQuestionData[i].IsReplay = false;
                        }
                    }
                    window['cellQuestionId'] = '';
                }
            });
        },

        /*展示问题*/
        showQuestion: function () {
            if (jwplayer($('.video_container').attr('id')) != null) {
                /*获取视频播放的时间*/
                var position = jwplayer($('.video_container').attr('id')).getPosition();
                for (var i = 0; i < videoShowQuestionData.length; i++) {
                    var question = videoShowQuestionData[i];
                    if (position >= question.ShowTime - 0.5 && position < question.ShowTime + 0.5) {
                        /*暂停播放器播放*/
                        jwplayer($('.video_container').attr('id')).play(false);
                        videoShowQuestionData[i].IsReplay = true;
                        getImmediateQuesionAndShow(question.Id);
                    }
                }
            }
        },

        /*获取即时测验试题信息并显示*/
        getImmediateQuesionAndShow: function (cellQuestionId) {
            var h = this;
            /*发送获取教学设计的请求*/
            _.ajax(urls.directory_ImmediateQuestionInfo, {cellQuestionId: cellQuestionId},function (r) {
                if (!r.code) {
                    alert(r.msg);
                    return false;
                }
                var dlg = jQuery.dynamic_dialog("dlg_show_question");
                dlg.html(template("question_show", r)).dialog({
                    title: "即时测验",
                    width: 680,
                    heigth: 480,
                    draggable: true,
                    modal: true,
                    open: function (event, ui) {
                        $(".ui-dialog-titlebar-close", $(this).parent()).hide();
                    },
                    buttons: {
                        "确认": function () {
                            if ($("#question_view").find("[name=choice]:checked").length < 1) {
                                alert("请先做试题！");
                                return false;
                            }
                            h.checkQuestionAnswer(cellQuestionId);
                            $(this).dialog('close');
                        },
                    },
                    beforeClose: function () {
                        if (h.getCheckAnswerValue() == 1) {
                            h.setCheckAnswerValue(0);
                            return;
                        }
                        /*如果已经答题就不要提示没有答题*/
                        var isAnswer = $('#question_view').attr('name');
                        if (isAnswer != '1') {
                            var isReplay = $('#question_view').data('isreplay');
                            var thePlayer = jwplayer($('.video_container').attr('id'));
                            if (isReplay == 'True') {
                                alert('没有答题，回滚到上一阶段！');
                                var replayTime = $('#question_view').data('replaytime');
                                window['cellQuestionId'] = cellQuestionId;
                                thePlayer.seek(replayTime);
                            } else {
                                thePlayer.play(true);
                            }
                        }
                        h.setLockValue(0);
                    }
                });

                /*单选控制*/
                if (r.question.QuestionType == 1) {
                    $(':checkbox[name=choice]').each(function () {
                        $(this).click(function () {
                            if ($(this).attr('checked')) {
                                $(':checkbox[name=choice]').removeAttr('checked');
                                $(this).attr('checked', 'checked');
                            }
                        });
                    });
                }
            }, 'json');
            return false;
        },

        /*校验当前用户选择答案是否正确*/
        checkQuestionAnswer: function (cellQuestionId) {
            var h = this;
            h.setCheckAnswerValue(1);
            var userAnswer = null;
            $('#question_view').find('input[name="choice"]:checked').each(function () {
                userAnswer = userAnswer + $(this).data('sortorder') + ',';
            });
            /*如果Answer为多个，则去除最后一个','号*/
            if (userAnswer.length > 0) {
                userAnswer = userAnswer.substring(0, userAnswer.length - 1);
            }
            var correctAnswer = $('#question_view').data('answer');
            var thePlayer = jwplayer($('.video_container').attr('id'));
            /*判断答案是否正确*/
            if (userAnswer != correctAnswer) {
                /*控制是否已经答题*/
                $('#question_view').attr('name', '1');
                var isReplay = $('#question_view').data('isreplay');
                var replayTime = $('#question_view').data('replaytime');
                if (isReplay == 'True') {
                    alert('回答错误,需要重看视频！');
                    window['cellQuestionId'] = cellQuestionID;
                    thePlayer.seek(replayTime);
                } else {
                    alert('回答错误！');
                    thePlayer.play(true);
                }
                h.setImmediateQuestion();
            } else {
                /*控制是否已经答题*/
                $('#question_view').attr('name', '1');
                thePlayer.play(true);
                h.setImmediateQuestion();
            }
            h.setLockValue(0);
        },

        /*断点续播*/
        setVideoStartTime: function () {
            var h = this;
            var thePlayer = jwplayer($('.video_container').attr('id'));
            var startTime = h.getVideoEndTimeValue();
            if (thePlayer.version != undefined) {
                if (startTime != '') {
                    thePlayer.seek(startTime);
                }
                thePlayer.play();
            }
        },

        /*链接的处理*/
        externalLink_view: function (url) {
            $(".externallink").on("click", function () {

                $(".external-content").html("").append('<iframe id="external-iframe" src=' + url + ' width="900" height="600"></iframe>'
                    + '<button class="am-btn am-btn-success iframe-full" style="position: fixed;z-index: 1001;;left: 123px;top: 113px;">全屏</button>'
                    + '<button class="am-btn am-btn-success iframe-normal" style="position: fixed;display:none; z-index: 1002;left: 123px;top: 113px;">缩小</button>');

                /*全屏展示iframe内容*/
                $(".iframe-normal").hide();
                $(".iframe-full").on("click", function (e) {

                    $(".iframe-normal").show();
                    $("#external-iframe").css({ "position": "fixed", "top": "73px", "right": "0", "bottom": "0", "left": "0", "background": "white", "z-index": "1002", "padding-right": "50px" })
                    $("#external-iframe").attr({ "width": "100%", "height": "100%" });
                    $(".sh-cw-close").trigger("click");
                    e.stopPropagation;
                });

                /*iframe正常大小展示*/
                $(".iframe-normal").on("click", function (e) {
                    $("#external-iframe").css({ "position": "", "top": "", "right": "", "bottom": "", "left": "", "background": "", "z-index": "0" })
                    $("#external-iframe").attr({ "width": "900", "height": "600" });
                    $(".iframe-normal").hide();
                    e.stopPropagation;
                });
            });
        },

        /*设置锁定*/
        setLockValue: function (value) {
            window['lock'] = value;
        },

        /*获得锁定*/
        getLockValue: function () {
            return window['lock'];
        },

        /*设置回答*/
        setCheckAnswerValue: function (value) {
            window['is_checked_answer'] = value;
        },

        /*获取回答*/
        getCheckAnswerValue: function () {
            return window['is_checked_answer'];
        },

        /*设置video结束时间*/
        setVideoEndTimeValue: function (value) {
            window['video_end_time'] = value;
        },

        /*获取video结束时间*/
        getVideoEndTimeValue: function () {
            return window['video_end_time'];
        },

        /*重新加载页面之前*/
        onbeforeunload_handler: function () {
            info.cellLeaveLog();
        },

        /*重新加载页面*/
        onunload_handler: function () {
            info.cellLeaveLog();
            info.removejwPlayer();
            var warning = "您正在学习，确认退出？";
            return warning;
        },

        /*刷新*/
        refresh: function () {
            $(window).hashchange();
            return false;
        },

        /*hash值*/
        init: function () {
            var h = this;
            $(window).hashchange(function () {
                _.hash = ('?' + location.hash.substring(1)).QueryStringToJSON();
            });
            h.get(1);
            h.showCellInformation();
        }
    };
    info.init();
})(jQuery)
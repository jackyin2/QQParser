/**
 * @name 个人设置
 * @return null
 * @depend   jQuery, template.js
 * @Date     2017-2-6 16:10:02
 * @author   cjcheng
 */

$(function () {
    var win = window,
    doc = win.document,
    app = win.app,
    avatarUrl = "",
    uploadUrl = "";
  
    _.ajax(urls.stuInfo_getStuInfo, function (r) {
        
        $("#container").html(template("info_html", r));
       
       
        avatarUrl = r.user.AvatorUrl || "/design/images/icon.jpg"
        /*第一次显示默认图片*/
        //r.user.AvatorUrl = avatarUrl;
        //localStorage["user"] = JSON.stringify(r.user);
        uploadUrl = r.uploadUrl;
        
        if ($("<canvas></canvas>")[0].getContext) {
            //初始化剪裁框和查看
            jcrop.init("target");
            //获取头像地址，生成查看
            var avatar = new Image();
            avatar.onload = function () {
                jcrop.previewHeaderImage(avatar, 0, 0, 180, 180);
            }
            avatar.isUrl = true;
            avatar.src = avatarUrl;
        } else {
            $("#avatarWrap").html('<div id="flash_content"></div>')
            init_flash();
        }
    }, "json");

    //头像剪裁对像
    var jcrop = {
        //基本属性
        config: {
            jcrop_api: null,
            $preview: null,
            pimg: null,
            xsize: 180,
            ysize: 180,
            imageFile: null,
            uploadFile: null
        },
        //开始剪裁
        beginJcrop: function () {
            var _this = this;
            $(_this.config.pimg).Jcrop({
                onChange: _this.updatePreview,
                onSelect: _this.updatePreview,
                aspectRatio: _this.config.xsize / _this.config.ysize,
                boxHeight: 300,
                boxWidth: 300,
                allowSelect: false
            }, function () {
                var bounds = this.getBounds();
                this.boundx = bounds[0];
                this.boundy = bounds[1];
                this.xsize = _this.config.xsize;
                this.ysize = _this.config.ysize;
                this.pimg = _this.config.pimg;
                this.imageCrop = new Image();

                _this.config.jcrop_api = this;
            })
        },
        init: function (imageId) {
            var _this = this;
            this.config.pimg = $('#' + imageId);

            //选择图片后才可以保存
            $("#localSelect").change(function () {
                if (this.files[0]) {
                    _this.config.imageFile = this.files[0];
                    _this.beginJcrop();
                    _this.imageChange();
                }
            });

            $("#camera").click(function () {
                _this.beginCamera();
            });

        },
        beginCamera: function () {
            var _this = this,
				video = $('<video id="video" width="550" height="350" autoplay="autoplay"></video>')[0],
				videoObj = {
				    "video": true
				},
				// 一个出错的回调函数，在控制台打印出错信息
				errBack = function (error) {
				    if ("object" === typeof window.console) {
				        console.log("Video capture error: ", error.code);
				    }
				};
            if ($("#dlg").length == 0) {
                $('body').append('<div id="dlg"></div>');
            }

            var dlg = $("#dlg");

            dlg.html(video).dialog({
                title: "拍照上传",
                width: '600px',
                heigth: '500px',
                position: { my: 'center', at: 'center', of: window },
                modal: true,
                resizable: false,
                close: function () {
                    $("#dlg").empty();
                },
                buttons: {
                    "确定": function () {
                        if (!video.src) {
                            dlg.dialog("close");
                            return false;
                        }
                        var canvas = $('<canvas id="canvas' + 500 + '" width="' + 500 + '" height="' + 500 + '"></canvas>')[0],
                            ctx = canvas.getContext('2d');
                        _this.beginJcrop();
                        ctx.drawImage(video, 0, 0, 500, 500);
                        _this.imageChange(canvas.toDataURL());
                        dlg.dialog("close");
                    },
                    "取消": function () {
                        dlg.dialog("close");
                    }
                },

            })


            // Put video listeners into place
            // 针对标准的浏览器
            if (navigator.getUserMedia) { // Standard
                navigator.getUserMedia(videoObj, function (stream) {
                    video.src = stream;
                    video.play();
                }, errBack);
            } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
                navigator.webkitGetUserMedia(videoObj, function (stream) {
                    video.src = window.URL.createObjectURL(stream);
                    video.play();
                }, errBack);
            } else {
                alert("你的电脑没有摄像头或摄像头没有打开");
                dlg.close();
            }

        },
        //更新查看框和选择框
        updatePreview: function (c) {

            var w = c.w,
				h = c.h,
				x = c.x,
				y = c.y,
				iw = this.imageCrop.width,
				ih = this.imageCrop.height;

            if (iw > ih) {
                w *= iw / 300;
                h *= iw / 300;
                x *= iw / 300;
                y *= iw / 300;
            } else {
                w *= ih / 300;
                h *= ih / 300;
                x *= ih / 300;
                y *= ih / 300;
            }

            jcrop.previewHeaderImage(this.imageCrop, x, y, w, h)

            if (parseInt(c.w) > 0) {
                var rx = this.xsize / c.w;
                var ry = this.ysize / c.h;
                $(this.pimg).css({
                    width: Math.round(rx * this.boundx) + 'px',
                    height: Math.round(ry * this.boundy) + 'px',
                    marginLeft: '-' + Math.round(rx * c.x) + 'px',
                    marginTop: '-' + Math.round(ry * c.y) + 'px'
                });
            }
        },
        //更改图片
        imageChange: function (imageData) {
            var _this = this,
				jcrop_api = _this.config.jcrop_api;

            $("#avatarSave").removeClass("disabled").click(function () {
                _this.saveavatar();
            });

            if (imageData) {
                jcrop_api.imageCrop.src = imageData;
                jcrop_api.setImage(imageData);
                _this.createSelect(jcrop_api, imageData);
                return;
            }

            if (typeof FileReader === 'undefined') {
                alert('您的浏览器不支持读取文件...');
                return;
            }
            //读取文件并绑定
            var reader = new FileReader();
            reader.onload = function (e) {
                jcrop_api.imageCrop.src = this.result;

                jcrop_api.setImage(this.result);

                _this.createSelect(jcrop_api, this.result);
            }
            reader.readAsDataURL(_this.config.imageFile);
        },
        //创建选择框
        createSelect: function (jcropApi, imgUrl) {
            var _this = this;
            var img = new Image();
            img.onload = function () {
                var w = this.width,
					h = this.height,
					x, y, x2, y2;

                if (w > h) {
                    h = h / w * 300;
                    h4 = h / 4;
                    x = 150 - h4;
                    y = h / 2 - h4;
                    x2 = 150 + h4;
                    y2 = h / 2 + h4;
                } else {
                    w = w / h * 300;
                    w4 = w / 4;
                    x = w / 2 - w4;
                    y = 150 - w4;
                    x2 = w / 2 + w4;
                    y2 = 150 + w4;
                }
                jcropApi.setSelect([x, y, x2, y2]);
            }
            img.src = imgUrl;
        },
        //查看头像
        previewHeaderImage: function (img, x, y, w, h) {
            this.config.uploadFile = this.createPreviewImage(img, x, y, w, h, 180);
            this.createPreviewImage(img, x, y, w, h, 50);
            this.createPreviewImage(img, x, y, w, h, 30);
        },
        //创建查看头像
        createPreviewImage: function (img, x, y, w, h, size) {
            var canvas = $('<canvas id="canvas' + size + '" width="' + size + '" height="' + size + '"></canvas>')[0],
				ctx = canvas.getContext('2d');

            if (img.isUrl) {
                ctx.drawImage(img, 0, 0, size, size);
            } else {
                ctx.drawImage(img, x, y, w, h, 0, 0, size, size);
            }

            $("#preview" + size).html(canvas);
            return canvas;
        },
        //保存头像
        saveavatar: function () {
            var uploadFile = this.config.uploadFile,
				data = uploadFile.toDataURL("image/png");
            data = data.substr(data.indexOf("base64,") + 7);
            
            var url = uploadUrl + "&encode=base64"
            $.ajax({
                url: url,
                data: data,
                type: "POST",
                crossDomain: true,
                dataType: 'json',
                success: function (r) {
                    _.ajax(urls.stuInfo_saveAvatar, { avatarUrl: $.trim(r.url) }, function (s) {
                        
                        if (s) {
                            if (s.code > 0)
                            {
                                localStorage["user"] = JSON.stringify(s.user);
                            }
                            jcrop.init("target");
                            //1秒后刷新
                            setTimeout(function () {
                                location.href = "/common/uploadStuImg.html";
                            }, 1000)
                        }
                    }, 'json');
                },
                error: function (xhr, textStatus, errMsg) {
                    alert("发生未知错误");
                }
            });

        }
    };
})
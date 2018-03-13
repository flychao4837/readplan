'use strict'
$(function(){
    var globalAudio = $("#globalAudio");
    var bookID;
    var dialog = new Dialog();
    var dom = $(".content-home");
    var recordStart;
    var recordEnd;
    var timmer;
    var globalAPI = "/api"
    var globaluser,globaluserimg;
    dialog.tip("正在获取数据");
    var perLoadFiles = function(){
        var queue = new createjs.LoadQueue();
        var manifest=[
            {id: "p10", src:"http://datainfo.b0.upaiyun.com/image/icon_micphone.png", tag: "icon_record"},
            {id: "p2", src:"http://datainfo.b0.upaiyun.com/image/bg_weekinfo.png", tag: "task_info"},
            {id: "p22", src:"http://datainfo.b0.upaiyun.com/image/layer_close.png", tag: "close-page"},

            {id: "p1", src:"http://datainfo.b0.upaiyun.com/image/add_user_img.png"},
            
            {id: "p3", src:"http://datainfo.b0.upaiyun.com/image/dialog_close.png"},
            {id: "p4", src:"http://datainfo.b0.upaiyun.com/image/icon_book_gray.png"},
            {id: "p5", src:"http://datainfo.b0.upaiyun.com/image/icon_book_green.png"},
            {id: "p6", src:"http://datainfo.b0.upaiyun.com/image/icon_download.png"},
            {id: "p7", src:"http://datainfo.b0.upaiyun.com/image/icon_help.png"},
            {id: "p8", src:"http://datainfo.b0.upaiyun.com/image/icon_history.png"},
            {id: "p9", src:"http://datainfo.b0.upaiyun.com/image/icon_isdone.png"},
            
            {id: "p11", src:"http://datainfo.b0.upaiyun.com/image/icon_mine_gray.png"},
            {id: "p12", src:"http://datainfo.b0.upaiyun.com/image/icon_mine_green.png"},
            {id: "p13", src:"http://datainfo.b0.upaiyun.com/image/icon_money_pay.png"},
            {id: "p14", src:"http://datainfo.b0.upaiyun.com/image/icon_my.png"},
            {id: "p15", src:"http://datainfo.b0.upaiyun.com/image/icon_play_green.png"},
            {id: "p16", src:"http://datainfo.b0.upaiyun.com/image/icon_progress.png"},
            {id: "p17", src:"http://datainfo.b0.upaiyun.com/image/icon_promiss.png"},
            {id: "p18", src:"http://datainfo.b0.upaiyun.com/image/icon_ribbon.png"},
            {id: "p19", src:"http://datainfo.b0.upaiyun.com/image/icon_share.png"},
            {id: "p20", src:"http://datainfo.b0.upaiyun.com/image/icon_toplay.png"},
            {id: "p21", src:"http://datainfo.b0.upaiyun.com/image/icon_toplay_gray.png"},
            
            {id: "p23", src:"http://datainfo.b0.upaiyun.com/image/logo_1.png"},
            {id: "p24", src:"http://datainfo.b0.upaiyun.com/image/medal.png"},
            {id: "p25", src:"http://datainfo.b0.upaiyun.com/image/medal_1.png"},
            {id: "p26", src:"http://datainfo.b0.upaiyun.com/image/medal_2.png"},
            {id: "p27", src:"http://datainfo.b0.upaiyun.com/image/medal_3.png"},
            {id: "p28", src:"http://datainfo.b0.upaiyun.com/image/next_active.png"},
            {id: "p29", src:"http://datainfo.b0.upaiyun.com/image/next_gray.png"},
            {id: "p30", src:"http://datainfo.b0.upaiyun.com/image/prev_active.png"},
            {id: "p31", src:"http://datainfo.b0.upaiyun.com/image/prev_gray.png"},
            {id: "p32", src:"http://datainfo.b0.upaiyun.com/image/return.png"},
            {id: "p33", src:"http://datainfo.b0.upaiyun.com/image/slogn.png"},
            {id: "p34", src:"http://datainfo.b0.upaiyun.com/image/slogo_2.png"},
            {id: "p35", src:"http://datainfo.b0.upaiyun.com/image/st_pause.png"},
            {id: "p36", src:"http://datainfo.b0.upaiyun.com/image/st_play.png"},
            {id: "p37", src:"http://datainfo.b0.upaiyun.com/image/tip_con_1.png"},
            {id: "p38", src:"http://datainfo.b0.upaiyun.com/image/tip_con_100.png"},
            {id: "p39", src:"http://datainfo.b0.upaiyun.com/image/tip_msg.png"},
            {id: "p40", src:"http://datainfo.b0.upaiyun.com/image/tip_nofinish.png"},

            {id: "p41", src:"http://datainfo.b0.upaiyun.com/image/icon_recording_1.png"},
            {id: "p42", src:"http://datainfo.b0.upaiyun.com/image/icon_recording_2.png"},
            {id: "p43", src:"http://datainfo.b0.upaiyun.com/image/icon_recording_3.png"},
            {id: "p44", src:"http://datainfo.b0.upaiyun.com/image/icon_recording_4.png"},
            {id: "p45", src:"http://datainfo.b0.upaiyun.com/image/icon_recording_5.png"},
            {id: "p46", src:"http://datainfo.b0.upaiyun.com/image/icon_recording_6.png"},
        ]
        queue.on("complete", handleComplete, this);
        queue.on("progress" ,handleFileProgress);
        queue.on("fileload", handleFileLoad);
        queue.on("error", loadError);
        queue.loadManifest( manifest );

        function handleComplete() {
            for(var i in manifest){
                $("body").append('<img src="'+queue.getItem(manifest[i]['id']).src+'" class="hide">');
            }
        }
        function handleFileLoad(event) {}
        function loadError(evt) { }
        function handleFileProgress(event) { /*queue.progress*/}
    }
    perLoadFiles();

    var swiper = new Swiper('.swiper', {
        pagination : '.pagination-home',
        loop:false,
        grabCursor: true,
        onImagesReady: function(){
        },
        onTransitionEnd:function(swiper){
            var idx = swiper.realIndex;
            var len = swiper.slides.length;
            showSwitchery(idx);
            var d = $($(".content-home .swiper-slide").get(idx));
            $(".task_info").find(".num").html(d.attr("data-number"));
            $(".task_info").find(".week").html(d.attr("data-week")+"周");
        } 
    });
    $(".content-home .home-device").on("click",".title" ,function(){
        var idx = swiper.realIndex;
        var d = $($(".content-home .swiper-slide").get(idx));
        showCommonTip(d.attr("data-notice"));
    })
    $(".task-tips").on("click" ,function(){
        $(".layout-download-tip-box ").show()
    })
    $(".switchery").on("click" ,function(){
        var that = $(this);
        var curIdx = swiper.realIndex;
        var box = $($(".content-home .home-device .swiper-slide")[curIdx]);
        var eleFront = box.find(".listen.default");
        var eleBack = box.find(".listen.my");
        if(that.hasClass('off')){
            eleFront.addClass("out").removeClass("in");
            setTimeout(function() {
                eleBack.addClass("in").removeClass("out");
            }, 225);
        }else{
            eleBack.addClass("out").removeClass("in");
            setTimeout(function() {
                eleFront.addClass("in").removeClass("out");
            }, 225);
        }
        that.toggleClass('off');
        that.toggleClass('on');
    })
    /*朗读录音试听*/
    var audiolist;
    function playMedia(audiolist,cb){
        if(audiolist.length){
            var addr = audiolist.shift();
            globalAudio.attr('src',addr);
            globalAudio[0].play()
            globalAudio.on("ended", function(){
                playMedia(audiolist,cb)
            })
        }else{
            if(typeof(cb)==="function"){
                cb.call(cb);
            }
        }  
    }
    function playWxLoaclMedia(i,localMediaList,cb){
        var localId = localMediaList[i].localId;
        var len = localMediaList.length;
        if(!localId){
            dialog.tip({"msg":"本地录音不存在","time":1200});
        }else{
            voice.localId = localId;
            wx.playVoice({
                localId: localId,
            });
            wx.onVoicePlayEnd({
                complete: function (res) {
                    if(i<len){
                        playWxLoaclMedia(i*1+1,localMediaList,cb);
                    }
                }
            });
        }
    }
    $(".home-device").on("click" ,".listen", function(){
        var that = $(this);
        var bookid = that.parents(".swiper-slide").attr("data-book-id");
        var localMedia = localStorage.getItem(bookid);
        var localMediaList = localMedia? JSON.parse(localMedia) :{};

        audiolist = that.attr("data-media");
        if(audiolist){
            audiolist = audiolist.split(",");
        }
        
        globalAudio[0].pause();
        globalAudio.off("ended")
        if(that.hasClass('active')){
            
            that.removeClass('active');
            if(audiolist && audiolist.length){
                globalAudio[0].pause();
            }else if(!$.isEmptyObject(localMediaList)){
                var localId = voice.localId;
                if(!localId){
                    dialog.tip({"msg":"本地音频ID获取错误","time":1200});
                }else{
                    wx.stopVoice({
                        localId: localId,
                    });
                }
            }
        }else{
            $(".home-device").find(".listen.active").removeClass('active');
            if(audiolist && audiolist.length){
                that.addClass('active');
                playMedia(audiolist,function(){
                    globalAudio[0].pause();
                    that.removeClass('active');
                })
            }else if(!$.isEmptyObject(localMediaList)){
                that.addClass('active');
                playWxLoaclMedia(0,localMediaList,function(){
                    that.removeClass('active');
                })
            }else{
                console.log("没有找到录音地址")
            }
        }
    })
    /*开启录音页面*/
    $(".action .recorder").on("click" ,function(){
        var curIdx = swiper.realIndex;
        var box = $($(".content-home .home-device .swiper-slide")[curIdx]);
        var bookid = box.attr("data-book-id");
        var planstr = app.localStorage.get("plan");
        var plan;
        $(".layout-record .timer").html("00:00.000");
        if($(this).find(".icon_record").hasClass('icon_isdone')){
            return;
        }
        bookID = bookid;
        if(planstr && planstr !="undefined"){
            plan = JSON.parse(planstr);
            for(var i in plan){
                if(plan[i].id == bookid){
                    var images = plan[i]['book']['files'];
                    var tmp="";
                    if(images.length){
                        for(var j in images){
                            tmp+='<div class="swiper-slide"><img src="'+images[j]+'"></div>'
                        }
                        $(".content-record .swiper-wrapper").html(tmp);
                        $(".content-record").find(".counter span").html("1/"+images.length||0);
                        $(".layout-recordfinsish-box .cur-book").html(plan[i]['book']['name'])
                    }else{
                        dialog.tip({"msg":"没有找到文件列表","time":1600});
                        return;
                    }
                    break;
                }
            }
        }else{
            dialog.tip({"msg":"书籍列表存取失败"});
            bookID=void(0);
            return;
        }
        dialog.tip("正在加载图片");
        $(".layout-record").show();
        swiper1.init();
        setTimeout(function(){
            dialog.destroy();
        },1000)
    })
    var swiper1 = new Swiper('.swiper1', {
        loop:false,
        grabCursor: true,
        onImagesReady: function(){
        },
        onTransitionEnd:function(swiper1){
        	var idx = swiper1.realIndex;
        	var len = swiper1.slides.length;
        	if(idx==0){
            	$('.arrow-left').removeClass('active')
	        }else{
	            $('.arrow-left').addClass('active');
	        }
	        if(idx==len-1){
	            $('.arrow-right').removeClass('active')
	        }else{
	            $('.arrow-right').addClass('active');
	        }
	        $(".pagination1 .counter>span").html((+swiper1.realIndex+1)+"/"+len);
        }
    });
    $(".pagination1 .timer").html("00:00:00");
    var itemlen = $(".content-record .swiper-slide").length;
    $(".pagination1 .counter>span").html("1/"+itemlen);

    $('.arrow-left').click(function(e) {
        var idx = swiper1.realIndex;
        var len = swiper1.slides.length;
        var that = $(this);
        e.preventDefault();
        
        swiper1.slidePrev();
        $(".pagination1 .counter>span").html((+swiper1.realIndex+1)+"/"+len);
        $('.arrow-right').addClass('active')
        if(idx==0|| idx==1){
            that.removeClass('active')
        }else{
            that.addClass('active');
        }
    });
    $('.arrow-right').click(function(e) {
        var idx = swiper1.realIndex;
        var len = swiper1.slides.length;
        var that = $(this);
        e.preventDefault();
        swiper1.slideNext();
        $(".pagination1 .counter>span").html((+swiper1.realIndex+1)+"/"+len);
        $('.arrow-left').addClass('active');
        if(idx==len-1|| idx==len-2){
            that.removeClass('active')
        }else{
            that.addClass('active');
        }
    });
    
    $('.pagination1 .swiper-pagination-switch').click(function(){
        swiper1.swipeTo($(this).index())
    })
    function showSwitchery(i){
        var d = $($(".content-home .swiper-slide").get(i));
        var switchbox = $(".switch-box");
        var recorderbox = $(".action .icon_record");
        if(d[0]){
            if(d.find(".listen.my")[0]){
                switchbox.show();
                switchbox.find(".switchery").removeClass('off').addClass('on')
                recorderbox.addClass('icon_isdone');
                if(d.find(".listen.my.in")[0]){
                    switchbox.find(".switchery").removeClass('off').addClass('on')
                }else{
                    switchbox.find(".switchery").removeClass('on').addClass('off')
                }
            }else{
                switchbox.hide();
                switchbox.find(".switchery").removeClass('on').addClass('off')
                recorderbox.removeClass('icon_isdone')
            }
        }else{
            switchbox.hide();
            recorderbox.removeClass('icon_isdone')
        }
    }
    
    function initMainSwiper(){
        swiper.init();
        showSwitchery(0);
    }
    /*关闭弹层*/
    $(".common-tip-box,.layout-download-tip-box,.layout-task-tip-box,.layout-task-progress-box,.layout-newer-box,.layout-levelshow-box,.layout-taskdone-box")
        .on("click",".close" ,function(){
            $(this).parents(".layout ").hide();
        })

    /*展示通用信息提示框*/
    function showCommonTip(msg,cb){
        var commonbox = $(".common-tip-box");
        commonbox.show().find(".notice").html(msg);
        commonbox.on("click" ,".close-common-tip" ,function(){
            commonbox.hide();
            if(typeof(cb) ==="function"){
                cb.call(cb)
            }
        }) 
    }
    /*通用confir提示框*/
    function showCommonConfirm(msg,okcall,cancelcall){
        var dom = $(".layout-confirm-box");
        dom.find(".info>p").html(msg);
        dom.show();
        dom.find(".cancel").on("click" ,function(){
            dom.hide();
            if(typeof(cancelcall) === "funciton"){
                cancelcall.cal(cancelcall);
            }
        })
        dom.find(".ok").on("click" ,function(){
            dom.hide();
            if(typeof(okcall) === "function"){
                okcall.call(okcall);
            }
        })
        dom.find(".close-confirm-tip").on("click" ,function(){
            dom.hide();
        })
    }
    function chagelevelstaus(status,okcall,cancel){
        var box = $(".layout-setlevelstatus-box");
        box.show();
        box.on("click" ,".close-setlevelstatus-tip,.cancel" ,function(){
            box.hide();
        })
        box.on("click" ,".ok" ,function(){
            box.hide();
            dialog.tip({"msg":"数据提交中..."})
            $.ajax({
                url: globalAPI+'/user/leave',
                type: 'POST',
                dataType: 'jsonp',
                data: {status: status},
            })
            .done(function(res) {
                dialog.tip({"msg":"提交成功","time":1200})
            })
            .fail(function() {
                dialog.tip({"msg":"提交失败","time":1200})
            })
        }) 
    }
    function refundment(cb){
        var box = $(".layout-refundment-box");
        box.show();
        box.on("click" ,".close-setlevelstatus-tip,.cancel" ,function(){
            box.hide();
        })
        box.on("click" ,".ok" ,function(){
            box.hide();
            dialog.tip({"msg":"请求提交中..."})
            $.ajax({
                url: globalAPI+'/deposit/refund',
                type: 'POST',
                dataType: 'jsonp',
                data: {},
            })
            .done(function(res) {
                if(res.code==0){
                    dialog.tip({"msg":"提交成功"})
                    if(typeof(cb)==="function"){
                        setTimeout(function(){
                            cb.call(cb);
                        },1000)
                    }
                }else{
                    dialog.tip({"msg":"提交失败","time":1200})
                }
            })
            .fail(function() {
                dialog.tip({"msg":"提交失败","time":1200})
            })
        }) 
    }
    /*首页数据获取*/
    function getHomepage(){
        $.ajax({
            url: globalAPI+'/learn/index',
            type: 'GET',
            dataType: 'jsonp',
            data: {},
        })
        .done(function(res) {
            if(res.code==0){
                var data = res.data;
                if(!$.isEmptyObject(data)){
                    if(data.is_guest==1){
                        //未支付--游客
                        //if(data.redirect){
                        //    app.cookie.set("ydRedirect",data.redirect,{"hour":24});
                        //}else{
                        //    window.location.href = data.redirect;
                        //}
                        if(data['other']['pay_money']){
                            $(".footer").html('<a class="btn btn_sign" href="/payment/deposit" target="_self">立即报名</a>');

                            if(data["other"]["tips"]["plan"]["txt"]){
                                showCommonTip(data["other"]["tips"]["plan"]["txt"])
                            }
                        }else{
                            $(".footer").html('<a class="btn btn_sign" href="/payment/deposit" target="_self">立即报名</a>');
                        }
                        var plan = data.plan;
                        var tmp="";
                        for(var i in plan){
                            var item = plan[i];
                            tmp+='<div class="swiper-slide" data-book-id="'+item.id+'" data-week="'+item["book"]['week']+'" data-number="'+item['book']['number']+'" data-notice="'+item['book']['notice']+'">'
                            tmp+='<div class="cover">'
                            tmp+='    <img src="'+item['book']['icon']+'">'
                            
                            if(!$.isEmptyObject(item.recommend) && item.recommend.audios && item.recommend.audios.length>0){
                                tmp+='    <a class="listen default flip" data-media="'+item.recommend.audios.join(",")+'">'
                                tmp+='        <img src="'+item['recommend']['user_headimgurl']+'" />'
                                tmp+='        <i class="status"></i>'
                                tmp+='    </a>'
                            }
                            
                            tmp+='</div>'
                                if(!$.isEmptyObject(item.recommend) ){
                                tmp+='<p class="reader font-warning">领读：'+item.recommend.user_name+'</p>'
                            }
                            tmp+='<p class="title">'+item['book']['name']+'</p>'
                            tmp+='<p class="read_time">共<span class="font-warning blod">'+item['book']['words']+'</span>字 | 平均时长<span class="font-warning blod">'+item['book']['duration']+'</span>分钟</p>'
                            tmp+='</div>'
                        }
                        $(".content-home .swiper-wrapper").html(tmp);
                        $(".switch-box").hide();
                        $(".task-tips").remove();
                        $(".task_info").find(".num").html(plan[0]['book']['number']);
                        $(".task_info").find(".week").html(plan[0]['book']['week']+"周");
                        initMainSwiper();
                        app.localStorage.set("plan",JSON.stringify(plan));
                        dialog.destroy();
                        $(".layout-recordfinsish-box .uploadRecordAudio").addClass('guest').html("关闭");
                        $(".footer").fadeIn(600);
                        dom.removeClass('hide');
                    }else if(data.is_guest==0){
                        //已支付--用户
                        var plan = data.plan;
                        var tmp="";
                        for(var i in plan){
                            var item = plan[i];
                            tmp+='<div class="swiper-slide" data-book-id="'+item.id+'" data-week="'+item["book"]['week']+'" data-number="'+item['book']['number']+'" data-notice="'+item['book']['notice']+'">'
                            tmp+='<div class="cover">'
                            tmp+='    <img src="'+item['book']['icon']+'">'
                            if(!$.isEmptyObject(item.my)&&item.my.audios && item.my.audios.length>0){
                                tmp+='    <a class="listen my flip in" data-media="'+item.my.audios.join(",")+'">'
                                tmp+='        <img src="'+item['my']['user_headimgurl']+'" />'
                                tmp+='        <i class="status"></i>'
                                tmp+='    </a>'
                            }
                            if(!$.isEmptyObject(item.recommend) && item.recommend.audios && item.recommend.audios.length>0){
                                tmp+='    <a class="listen default flip out" data-media="'+item.recommend.audios.join(",")+'">'
                                tmp+='        <img src="'+item['recommend']['user_headimgurl']+'" />'
                                tmp+='        <i class="status"></i>'
                                tmp+='    </a>'
                            }
                            
                            tmp+='</div>'
                            tmp+='<p class="reader font-warning"></p>'
                            tmp+='<p class="title">'+item['book']['name']+'</p>'
                            tmp+='<p class="read_time">共<span class="font-warning blod">'+item['book']['words']+'</span>字 | 平均时长<span class="font-warning blod">'+item['book']['duration']+'</span>分钟</p>'
                            tmp+='</div>'
                        }
                        $(".content-home .swiper-wrapper").html(tmp);
                        
                        $(".user-name").html(data["my"]["user_name"]);
                        $(".user_img>img").html(data["my"]["headimgurl"]);

                        $(".task_info").find(".num").html(plan[0]['book']['number']);
                        $(".task_info").find(".week").html(plan[0]['book']['week']+"周");

                        initMainSwiper();
                        app.localStorage.set("plan",JSON.stringify(plan));
                        dialog.destroy();

                        $(".footer").fadeIn(600);
                        dom.removeClass('hide');

                        /*用户状态提示*/
                        if(data["other"]["down_info"]){
                            $(".layout-download-tip-box .notice").html(data["other"]["down_info"]);
                            $(".task-tips").show();
                        }else{
                            $(".task-tips").hide();
                        }
                        if(data['my']['is_leave']==1){
                            //==1休假 弹提示，不能录音
                            $(".action").remove();
                            showCommonTip(data['my']['leave_tips'])
                        }
                        /*任务未完成 扣保证金提示*/
                        if(data["other"]["tips"]["money"]["txt"]){
                            showCommonTip(data['my']['leave_tips'])
                        }
                        /*读书任务完成提示*/
                        if(data["other"]["tips"]["plan"]["txt"]){
                            showCommonTip(data["other"]["tips"]["plan"]["txt"])
                        }
                    }else{
                        dialog.tip({"msg":"用户状态错误","time":1600});
                    }
                }else{
                    dialog.tip({"msg":"用户数据错误","time":1600});
                }
                //根据hash跳
                jumpPageByparmes()
            }else{
                dialog.tip({"msg":"用户数据拉取失败","time":1600});
            }
        })
        .fail(function() {
            dialog.tip({"msg":"用户数据拉取失败","time":1600});
        })
    }
    var videolist=[];
    var voice = {
        localId: '',
        serverId: ''
    };
    var dorecordAni = {
        dom : $(".pagination1 .recorder>i"),
        timer: void(0),
        say:function(){
            var i = 1;
            dorecordAni.timer =  window.setInterval(frameAnmi, 200);

            function frameAnmi() {
                
                if(i >6) { 
                    i = 1;
                }
                dorecordAni.dom.css("background-image","url(http://datainfo.b0.upaiyun.com/image/icon_recording_"+i+".png)")
                i++;
                
            }
        },
        stop:function(){
            clearInterval(this.timer);
            dorecordAni.dom.css("background-image","url(http://datainfo.b0.upaiyun.com/image/icon_recording_1.png)")
        }
    }
    wx.ready(function(){    
        var copylist=[];
        function startrecord(){
            wx.startRecord({
                cancel: function () {
                    dialog.tip({"msg":'用户拒绝授权录音',"time":2000});
                },
                success: function(){
                    wx.onVoiceRecordEnd({
                        complete: function (res) {
                            voice.localId = res.localId;
                            var item = {
                                localId : res.localId,
                                serverId: "",
                            }
                            videolist.push(item);
                            localStorage.setItem(bookID,JSON.stringify(videolist));

                            startrecord();
                        },
                        fail: function(){
                            dialog.tip({"msg":"录音失败","time":1200});

                            clearInterval(timmer);
                            recordStart = void(0);
                            recordEnd = void(0);
                            $(".pagination1").find(".recorder").removeClass('recording');
                            $(".pagination1 .timer").html("00:00:00");
                        }
                    });
                },
                fail : function(res){
                    dialog.tip({"msg":"录音失败","time":2000});

                    clearInterval(timmer);
                    recordStart = void(0);
                    recordEnd = void(0);
                    $(".pagination1").find(".recorder").removeClass('recording');
                    $(".pagination1 .timer").html("00:00:00");
                }
            });
        }
        function stoprecord(cb){
            wx.stopRecord({
                success: function (res) {
                    //dialog.tip({"msg":"录音停止","time":1200});
                    var item = {
                        localId : res.localId,
                        serverId: "",
                    }
                    videolist.push(item);
                    localStorage.setItem(bookID,JSON.stringify(videolist));
                    copylist = videolist.concat();
                },
                fail: function (res) {
                    dialog.tip({"msg":"停止录音失败","time":1200});
                }
            });
        }
        function uploadLocal(id,i){

            if (id == '') {
                dialog.tip({"msg":"请先使用录制一段声音","time":1200});
                return;
            }
            wx.uploadVoice({
                localId: id,
                isShowProgressTips:0,
                success: function (res) {
                    videolist[i].serverId = res.serverId;
                    voice.serverId = res.serverId;
                    localStorage.setItem(bookID,JSON.stringify(videolist));
                    doUpload();
                },
                fail: function (res) {
                    dialog.tip({"msg":"上传失败","time":1200});
                }
            });
        }
        function doUpload(){
            if(copylist.length){
                var i = copylist.length-1;
                var item = copylist.pop();
                if(!item.serverId){
                    uploadLocal(item.localId,i);
                }else{
                    doUpload();
                }
            }else{
                postRecordIdToBase();
            }
        }
        function playLocalRecord(i){
            var localId = videolist[i].localId;
            var len = videolist.length;
            if(!localId){
                dialog.tip({"msg":"本地录音不存在","time":1200});
            }else{
                voice.localId = localId;
                wx.playVoice({
                    localId: localId,
                });
                wx.onVoicePlayEnd({
                    complete: function (res) {

                        if(i<len){
                            playLocalRecord(i*1+1);
                        }else{
                            $(".play-back").removeClass('on')
                        }
                    }
                });
            }
        }
        function stopPlay(){
            var localId = voice.localId;
            if(!localId){
                dialog.tip({"msg":"本地音频ID获取错误","time":1200});
            }else{
                wx.stopVoice({
                    localId: localId,
                });
            }
        }
        /*录音页开始录音*/
        function userDoRecord(){
            $(".pagination1").on("click" ,".recorder",function(){
                chcekWx()
                
                var that = $(this);
                if(that.hasClass('recording')){
                    recordEnd = +new Date();
                    if(recordEnd - recordStart <1500){
                        dialog.tip({"msg":"录音时间不能小于1秒","time":1200})
                        return;
                    }else{
                        dialog.tip({"msg":'结束录音',"time":1200});
                        stoprecord()
                        dorecordAni.stop();
                        clearInterval(timmer);
                        that.removeClass('recording');
                        that.find(".icon_record").css("background-image","url(http://datainfo.b0.upaiyun.com/image/icon_micphone.png)")
                        
                        $(".layout-recordfinsish-box .play-time").html( $(".pagination1 .timer").html() )
                        $(".layout-recordfinsish-box").show()
                    }
                }else{
                    dialog.tip({"msg":'开始录音',"time":1200});
                    that.addClass('recording');
                    dorecordAni.say();
                    recordStart = +new Date();
                    videolist=[]
                    startrecord()
                    setTimer();  
                }
            })
        }
        userDoRecord();
        /*点击上传，上传当前 bookID 对应的全部音频文件*/
        $(".uploadRecordAudio").on("click" ,function(){
            var that = $(this)
            if(that.hasClass('guest')){
                that.parents(".layout").hide();
            }else{
                //TODO 提交二次确认
                showCommonConfirm("录音上传后不可更改，是否上传?",function(){
                    dialog.tip({"msg":"正在上传语音，请不要关闭页面"});
                    doUpload();
                },function(){

                })
            }
        })
        /*试听本次录音*/
        $(".play-back").on("click" ,function(){
            var that = $(this);
            if(that.hasClass('on')){
                that.removeClass('on');
                stopPlay();
            }else{
                that.addClass('on');
                playLocalRecord(0);
            }
        })
        /*关闭录音页*/
        $(".layout-record .close-page").on("click" ,function(){
            showCommonConfirm("是否退出录音",function(){
                $(".layout-record").hide();
                globalAudio[0].pause();
                app.localStorage.remove(bookID);
                stoprecord()
                dorecordAni.stop();
                clearInterval(timmer);
                $(".pagination1 .timer").html("00:00.000");
                $(".pagination1 .recorder").removeClass('recording').find(".icon_record").css("background-image","url(http://datainfo.b0.upaiyun.com/image/icon_micphone.png)");
            },function(){

            })
        })
        /*关闭录音提交页*/
        $(".close-recordfinsish-tip").on("click" ,function(){
            showCommonConfirm("是否关闭录音上传界面",function(){
                globalAudio[0].pause();
                $(".layout-recordfinsish-box").hide();
            },function(){

            })
        });
        function postRecordIdToBase(){
            var duration=$(".pagination1 .timer").attr("data-duration");
            $(".action .icon_record").addClass('icon_isdone');
            var bookviewDom = $(".content-home .swiper-slide-active");
            var mytmp = ""

            $.ajax({
                url: globalAPI+'/learn/index',
                type: 'POST',
                dataType: 'json',
                data: {
                    "id" : bookID,
                    "duration" : duration,
                    "audios" : videolist,
                },
            })
            .done(function(res) {
                $(".switch-box").show();
                $(".switchery").removeClass('off').addClass('on');
                mytmp+='    <a class="listen my flip in" data-book-id="'+bookID+'">'
                mytmp+='        <img src="'+globaluserimg+'" />'
                mytmp+='        <i class="status"></i>'
                mytmp+='    </a>'
                if(bookviewDom.find(".listen.my")[0]){
                    bookviewDom.find(".listen.my").replaceWith(mytmp);
                }else{
                    bookviewDom.find(".cover").append(mytmp);
                }
                $(".layout-recordfinsish-box").hide();
                $(".layout-record").hide();
                if(res.code==0){
                    dialog.destroy();
                    var data = res.data;
                    if(!$.isEmptyObject(data)){
                        var tips = data.tips;
                        var dom;
                        if(data.all_finish==1){
                            if(tips){
                                if(tips.txt){
                                    if(tips.level && tips.week && tips.books && tips.words){
                                        dom = $(".layout-taskdone-box");
                                        dom.find(".weeks").html(tips.week);
                                        dom.find(".books").html(tips.books);
                                        dom.find(".words").html((tips.words/1000).toFixed(2));
                                    }
                                    refundment(function(){
                                        $(".layout-taskdone-box").show();
                                        dom.find(".btn-share").one("click" ,function(){
                                            dialog.tip({"msg":"正在处理分享信息","time":2000});
                                            var user_name = globaluser;
                                            var headimgurl = globaluserimg;
                                            var level = tips.level;
                                            var week = tips.week;
                                            var books = tips.books;
                                            var words = tips.words;
                                            var info = {
                                                "user_name" : user_name,
                                                "headimgurl" : headimgurl,
                                                "level" : level,
                                                "week" :week,
                                                "books" : books,
                                                "words" :words,
                                            }
                                            $.ajax({
                                                url: globalAPI+'/learn/level-share',
                                                type: 'POST',
                                                dataType: 'jsonp',
                                                data: {info: JSON.stringify(info)},
                                            })
                                            .done(function(res) {
                                                if(res.code==0){
                                                    var url = res.data.url;
                                                    window.location.href = url;
                                                }else{
                                                    dialog.tip({"msg":"分享信息错误","time":2000});
                                                }
                                            })
                                            .fail(function() {
                                                dialog.tip({"msg":"分享信息错误","time":2000});
                                            })
                                        }) 
                                    });
                                }else{
                                    // $.ajax({
                                    //     url: globalAPI+'/learn/jsshare',
                                    //     type: 'GET',
                                    //     dataType: 'jsonp',
                                    //     data: {"id": bookID},
                                    // })
                                    // .done(function(res) {
                                    //     if(res.code==0){
                                    //         window.top.location.href = res.data.url;
                                    //     }else{
                                    //         console.log("分享信息失败");
                                    //     }
                                    // })
                                    // .fail(function() {
                                    //     console.log("分享信息失败");
                                    // })
                                }
                            }else{
                                
                            }
                        }else{
                            if(tips){
                                if(tips.level && tips.week && tips.books && tips.words){
                                    if(data.all_finish==1){
                                        dom = $(".layout-taskdone-box");
                                        dom.find(".weeks").html(tips.week);
                                        dom.find(".books").html(tips.books);
                                        dom.find(".words").html((tips.words/1000).toFixed(2));

                                    }else{
                                        dom = $(".layout-levelshow-box");
                                        dom.find(".step").html(tips.level);
                                        dom.find(".medal-level").attr("src","http://datainfo.b0.upaiyun.com/image/medal_"+tips.level+".png");
                                        dom.find(".weeks").html(tips.week);
                                        dom.find(".books").html(tips.books);
                                        dom.find(".words").html((tips.words/1000).toFixed(2));  
                                    }
                                    dom.show();
                                    dom.find(".btn-share").on("click" ,function(){
                                        dialog.tip({"msg":"正在处理分享信息","time":2000});
                                        var user_name = globaluser;
                                        var headimgurl = globaluserimg;
                                        var level = tips.level;
                                        var week = tips.week;
                                        var books = tips.books;
                                        var words = tips.words;
                                        var info = {
                                            "user_name" : user_name,
                                            "headimgurl" : headimgurl,
                                            "level" : level,
                                            "week" :week,
                                            "books" : books,
                                            "words" :words,
                                        }
                                        $.ajax({
                                            url: globalAPI+'/learn/level-share',
                                            type: 'POST',
                                            dataType: 'jsonp',
                                            data: {info: JSON.stringify(info)},
                                        })
                                        .done(function(res) {
                                            if(res.code==0){
                                                var url = res.data.url;
                                                window.location.href = url;
                                            }else{
                                                dialog.tip({"msg":"分享信息错误","time":2000});
                                            }
                                        })
                                        .fail(function() {
                                            dialog.tip({"msg":"分享信息错误","time":2000});
                                        })
                                    }) 
                                }else{
                                    
                                }
                            }else{
                                
                            }
                        }
                    }
                }else{
                    dialog.tip({"msg":res.msg,"time":1200});
                }
            })
            .fail(function() {
                dialog.tip({"msg":"数据提交失败","time":1200});
                return false;
            })
        }
        function setTimer(){
            var timeDom = $(".pagination1 .timer");
            timmer = setInterval(function(){
                var dd = +new Date() - recordStart;
                var i = parseInt(dd/1000);
                var m,s,ss;
                m = parseInt(i/60);
                s = i%60;
                s = s>9 ? s : "0"+s;
                s = s ==60? "00" : s;
                m = s ==60? ++m :m;

                m = m>9 ? m : "0"+m;
                m = m ==60? "00" : m;

                ss = dd.toString().substr(-3,2);
                timeDom.html(m+":"+s+"."+ss).attr("data-duration",i);
            },33);
        }
    });    
         
    wx.error(function (res) {  
      console.log("调用微信jsapi返回的状态:"+res.errMsg);  
    });

    getHomepage();

    /*******单页滑动合并*******/
    $(".goback").on("click" ,function(){
        $(this).parents(".layout").removeClass('on');
    })
    /*tab页面切换*/
    $(".tab-home").on("click" ,function(){
        var that = $(this);
        if(that.hasClass('active')){
            return;
        }else{
            $(".tab.active").removeClass('active');
            that.addClass('active');
            globalAudio[0].pause();
            $(".layout.on").removeClass('on');
            $(".content-home").show();
            $(".content-my").hide();
        }
    })
    $(".tab-my").on("click" ,function(){
        var that = $(this);
        if(that.hasClass('active')){
            return;
        }else{
            $(".tab.active").removeClass('active');
            that.addClass('active');
            globalAudio[0].pause();
            $(".content-my").show();
            $(".content-home").hide();
            $(".layout-userinfo ,.layout-progress ,.layout-history ,layout-deposit").removeClass('hide');
        }
    });
    function getUser(){
        $.ajax({
            url: globalAPI+'/user/my',
            type: 'GET',
            dataType: 'jsonp',
            data: {},
        })
        .done(function(res) {
            console.log(res)
            if(res.code=="0"){
                var data = res.data;
                if(!$.isEmptyObject(data)){
                    var dom = $(".content-my")
                    $(".user_name").html(data.name)
                    $(".user_img>img").attr("src",data.headimgurl)
                    dom.find(".user_img>img").attr("src",data.headimgurl).attr("data-src",data.headimgurl);
                    dom.find(".user_name").html(data.name);
                    dom.find(".progress .small").html('('+data.point+'分)');
                    dom.find(".history .small").html('('+data.learning+'本)');
                    dom.find(".deposit .small").html('('+data.money+'元)');
                    if(data.leave_status==1){
                        /*休息中*/
                        dom.find(".user-status").html('<a class="btn start-read" data-status="'+data.leave_next_status+'">'+data.leave_status_info+'</a>')
                    }else{
                        dom.find(".user-status").html('<a class="btn pause-read" data-status="'+data.leave_next_status+'">'+data.leave_status_info+'</a>')
                    }
                    dialog.destroy();
                    globaluser = data.name;
                    globaluserimg= data.headimgurl;
                }
            }else{
                dialog.tip({"msg":"用户数据拉取失败","time":1600});
            }
        })
        .fail(function() {
            dialog.tip({"msg":"用户数据拉取失败","time":1600});
        })
    }
    getUser();

    $(".content-my").on("click",".pause-read" ,function(){
        var status = $(this).attr('data-status');
        chagelevelstaus(status)
    })
    $(".content-my").on("click" ,".start-read",function(){
        var status = $(this).attr('data-status');
        chagelevelstaus(status)
    })
    /**我的-子页面滑动**/
    var jcrop_api;
    var imageInfo;
    $(".content-my").on("click",".userinfo",function(e){
        e.preventDefault();
        e.stopPropagation();
        var that = $(this);
        var dom = $(".layout-userinfo");
        function formUpload(){
            var formData = new FormData($("#formUpload")[0]);
            $.ajax({
                url : 'http://v0.api.upyun.com/crash',
                type : 'POST',
                data : formData,
                processData : false,
                contentType : false,
                success : function(responseStr) {
                    var obj = $.parseJSON(responseStr);
                    var pic = obj.url;
                    var myurl = "http://datainfo.b0.upaiyun.com";
                    $(".headimg").attr("src" ,myurl+pic);
                    imageInfo = obj;
                    $("input[name=file]").val("");
                    $(".cropimage").attr("src",myurl+pic);
                    $(".cropimage").on("load",function(){
                        $(".layout-crop").show();
                        dialog.destroy();
                        setTimeout(function(){
                            initCrop();
                        },600)
                    })
                    dom.find("input[name=file]").removeClass('disabled')
                },
                error : function(responseStr) {
                    dialog.tip({"msg":"图片上传失败","time":2000});
                    dom.find("input[name=file]").removeClass('disabled')
                }
            });
        }
        //upyun 文件域的name 一定是file
        $("input[name=file]").off("change");
        $("input[name=file]").on("change" ,function(){
            var that = $(this);
            if(that.hasClass('disabled')){
                return;
            }else{
                that.addClass('disabled')
            }
            dialog.tip("图片上传中");
            formUpload();
        })
        
        
        function initCrop(){
            $('.cropimage').Jcrop({
              bgFade:  true,
              bgOpacity: .4,
              setSelect: [ 0, 0, 200, 200 ],
              aspectRatio :1,
            },function(){
              jcrop_api = this;
            });
        }
        dom.find(".btn.crop").off("click");
        dom.find(".btn.crop").on("click" ,function(){
            var opt = jcrop_api.tellSelect();

            var imgwidth = imageInfo['image-width'];
            var imgheight = imageInfo['image-height']
            var winwidth = $(window).width();
            var rat = imgwidth/winwidth;
            var cx1 = parseInt(opt.x * rat);
            var cy1 = parseInt(opt.y * rat);
            var cx2 = parseInt(opt.w * rat);
            var cy2 = parseInt(opt.h * rat);
            var url = "http://datainfo.b0.upaiyun.com"+imageInfo['url']+"!/crop/"+cx2+"x"+cy2+"a"+cx1+"a"+cy1;

            $(".headimg").attr("src",url).attr("data-src",imageInfo['url']+"!/crop/"+cx2+"x"+cy2+"a"+cx1+"a"+cy1);
            $(".user_img >img").attr("src",url).attr("data-src",imageInfo['url']+"!/crop/"+cx2+"x"+cy2+"a"+cx1+"a"+cy1);
            $(".layout-crop").hide();
            jcrop_api.release();
            jcrop_api.destroy();
            $(".imgbox").html('<img class="cropimage"/>');
        });

        dialog.tip("正在获取数据");
        $.ajax({
            url: globalAPI+'/user/profile',
            type: 'GET',
            dataType: 'jsonp',
            data: {},
        })
        .done(function(res) {
            if(res.code=="0"){
                var data = res.data;
                if(!$.isEmptyObject(data)){
                    
                    dom.find(".headimg").attr("src",data.headimgurl).attr('data-src',data.headimgurl)
                    dom.find(".user_name").html(data.name)
                    if(data.sex=="1"){
                        $(dom.find(".sex-item label")[0]).trigger("click");
                    }else{
                        $(dom.find(".sex-item label")[1]).trigger("click");
                    }
                    dom.find("input[name=user_name]").val(data.name);
                    dom.find("select[name=age]").val(data.age);
                    dom.find("input[name=school]").val(data.school);
                    dom.find("input[name=phone]").val(data.parent_tel);

                    dom.find("input[name=policy]").val(data.upyun.policy);
                    dom.find("input[name=signature]").val(data.upyun.signature);

                    dialog.destroy();
                    dom.fadeIn(200,function(){
                        dom.addClass('on');
                    });
                }else{
                    dialog.tip({"msg":"用户信息获取失败","time":1600});
                }
            }
        })
        .fail(function() {
            dialog.tip({"msg":"用户信息获取失败","time":1600});
        })
        /*提交用户数据*/
        dom.find(".edit-userinfo").on("click" ,function(){
            var that = $(this);
            if(that.hasClass('disabled')){
                return;
            }else{
                that.addClass('disabled');
            }
            dialog.tip({"msg":"数据提交中..."})
            var headimgurl = $(".headimg").attr('data-src');
            var sex  = $(".regular-radio:checked").val();
            var name = $.trim( $("input[name=user_name]").val() );
            var age = $.trim( $("select[name=age]").val());
            var school = $.trim( $("input[name=school]").val());
            var parent_tel = $.trim($("input[name=phone]").val());
            if(sex ===undefined){
                dialog.tip({"msg":"请选择性别","time":1200});
                return;
            }else if(!name){
                dialog.tip({"msg":"请填写孩子姓名","time":1200});
                return; 
            }else if(!age){
                dialog.tip({"msg":"请选择孩子的年龄","time":1200});
                return; 
            }else if(isNaN(age)){
                dialog.tip({"msg":"年龄只能是数字","time":1200});
                return; 
            }else if(!school){
                dialog.tip({"msg":"请填写所在学校","time":1200});
                return; 
            }else if(!parent_tel){
                dialog.tip({"msg":"请填写手机号","time":1200});
                return; 
            }else if(!app.isMobile(parent_tel)){
                dialog.tip({"msg":"请填写正确的手机号","time":1200});
                return; 
            }else{
                $.ajax({
                    url: globalAPI+'/user/profile',
                    type: 'POST',
                    dataType: 'jsonp',
                    data: {
                        "headimgurl" : headimgurl,
                        "name" : name,
                        "sex" : sex,
                        "age" : age,
                        "school" : school,
                        "parent_tel" :parent_tel,
                    },
                })
                .done(function(res) {

                    if(res.code==0){
                        dialog.tip({"msg":"数据提交成功","time":1200});
                    }else{
                        dialog.tip({"msg":"数据提交失败","time":1200});
                    }
                    that.removeClass("disabled")
                })
                .fail(function() {
                    dialog.tip({"msg":"数据提交失败","time":1200});
                    that.removeClass("disabled")
                    return;
                })
            }
        })
    })
    $(".content-my").on("click",".progress",function(e){
        e.preventDefault();
        e.stopPropagation();
        var that = $(this);
        var dom = $(".layout-progress");
        /*评分及进度*/
        function initProgress(a,b,c ,d,e,f){
            var num = 66;// 百分制
            var r = 60; //圆半径
            var r2 = 129;
            var percent1 = a / d ||0;
            var percent2 = b / e ||0;
            var percent3 = c / f ||0;
            var  perimeter = Math.PI * 2 * r;
            var perimeter2 = Math.PI * 2 * r2;
            
            $(".processingbar1 #progress")[0].setAttribute('stroke-dasharray', perimeter * percent1 + " " + perimeter * (1- percent1));
            $(".processingbar2 #progress")[0].setAttribute('stroke-dasharray', perimeter2 * percent2 + " " + perimeter2 * (1- percent2));
            $(".processingbar3 #progress")[0].setAttribute('stroke-dasharray', perimeter * percent3 + " " + perimeter * (1- percent3));

            var rate = parseInt($("html").css("font-size"))
            var size = rate*1.8666666666666667;
            $(".processingbar1>svg,.processingbar3>svg").attr({width:size,height:size});
            $(".processingbar1 .text-info .num").html(a);
            $(".processingbar3 .text-info .num").html(c)

            var size2 = rate*3.7066666666666666;
            $(".processingbar2>svg").attr({width:size2,height:size2});
            $(".processingbar2 .text-info .num").html(b+"分");
        }
        
        /*获取数据*/
        dialog.tip("正在获取数据");
        $.ajax({
            url: globalAPI+'/learn/my',
            type: 'GET',
            dataType: 'jsonp',
            data:{},
        })
        .done(function(res) {
            if(res.code=="0"){
                console.log(res);
                var data = res.data;
                if(!$.isEmptyObject(data)){
                    dom.find(".user_img").attr(data.my.headimgurl);
                    dom.find(".user_name").html(data.my.name);
                    dom.find(".minutes").html(data.my.duration);
                    if(data.my.level>0){
                        dom.find(".medal").attr("src","http://datainfo.b0.upaiyun.com/image/medal_"+data.my.level+".png").show();
                    }else{
                        dom.find(".medal").hide()
                    }
                    dom.find(".medal")
                    dom.find(".start-time").html("开始时间："+data.my.start_date);
                    dom.find(".days").html(data.my.hold);
                    initProgress(data.my_books.num ,data.my_books.duration , data.my_books.words ,data.books.num ,data.books.duration , data.books.words);
                    var tmp=""
                    //TODO  itmes字段名字拼错
                    for(var i in data.itmes){
                        var item = data.itmes[i];
                        tmp+='<div class="list-item"><div class="box"><div class="week-name">'+item.title+'</div><div class="boxflex"><p class="font-warning textright">'+item.description+'</p></div></div></div>'
                    }
                    dom.find(".list").html(tmp);
                    dialog.destroy();
                    dom.fadeIn(200,function(){
                        dom.addClass('on');
                    });
                }else{
                    dialog.tip({'msg':"用户数据错误","time":1600});
                }
            }else{
                dialog.tip({'msg':"用户数据获取失败","time":1600});
            }
            
            dom.fadeIn(600)
        })
        .fail(function() {
            dialog.tip({'msg':"用户数据获取失败","time":1600});
        })
    })
    $(".content-my").on("click",".history",function(e){
        e.preventDefault();
        e.stopPropagation();
        var that = $(this);
        dialog.tip("正在获取数据");
        var dom = $(".layout-history");
        var box = $(".content-histroyinfo");
        $.ajax({
            url: globalAPI+'/learn/history',
            type: 'GET',
            dataType: 'jsonp',
            data:{},
        })
        .done(function(res) {
            if(res.code==0){
                var data =res.data;
                if(!$.isEmptyObject(data)){
                    var tmp="";
                    var weekArr = [];
                    for(var i in data){
                        var item = data[i]
                        var week = item["book"]["week"];

                        if(weekArr.indexOf(week)<0){
                            weekArr.push(week);
                        }
                    }
                    weekArr = weekArr.sort();

                    if(weekArr.length){
                        for(var w =0,wl = weekArr.length;w<wl;w++){
                            tmp+='<div class="stage"><span>'+weekArr[w]+'</span></div>'
                            for(var j in data){
                                var item = data[j];
                                if(item["book"]["week"] ==weekArr[w]){
                                    if(!item.audios || item.audios.length<1){
                                        tmp+='<div class="list-item unfinish">'
                                        tmp+='    <div class="box">'
                                        tmp+='        <div class="boxflex">'
                                        tmp+='            <div class="book-cover">'
                                        tmp+='                <img src="'+item["book"]['icon']+'" />'
                                        tmp+='                <a class="nofinish_tag"></a>'
                                        tmp+='            </div>'
                                        tmp+='        </div>'
                                        tmp+='        <div class="boxflex">'
                                        tmp+='            <p class="book-name">'+item['book']['name']+'</p>'
                                        tmp+='            <p class="read-time">'+item['enddate']+'</p>'
                                        tmp+='            <p class="video-time">'+item['duration']+'</p>'
                                        tmp+='        </div>'
                                        tmp+='        <div class="boxflex">'
                                        tmp+='            <a class="wx_share unfinish" data-book-id="'+item['id']+'">'
                                        tmp+='                <img src="http://datainfo.b0.upaiyun.com/image/icon_wx_share.png"/>'
                                        tmp+='            </a>'
                                        tmp+='        </div>'
                                        tmp+='    </div>'
                                        tmp+='</div>'
                                    }else{
                                        tmp+='<div class="list-item">'
                                        tmp+='    <div class="box">'
                                        tmp+='        <div class="boxflex">'
                                        tmp+='            <div class="book-cover">'
                                        tmp+='                <img src="'+item["book"]['icon']+'" />'
                                        tmp+='                <a class="play" data-audios="'+item.audios.join(",")+'"></a>'
                                        tmp+='            </div>'
                                        tmp+='        </div>'
                                        tmp+='        <div class="boxflex">'
                                        tmp+='            <p class="book-name">'+item['book']['name']+'</p>'
                                        tmp+='            <p class="read-time">'+item['enddate']+'</p>'
                                        tmp+='            <p class="video-time">'+item['duration']+'</p>'
                                        tmp+='        </div>'
                                        tmp+='        <div class="boxflex">'
                                        tmp+='            <a class="wx_share" data-book-id="'+item['id']+'">'
                                        tmp+='                <img src="http://datainfo.b0.upaiyun.com/image/icon_wx_share.png"/>'
                                        tmp+='            </a>'
                                        tmp+='        </div>'
                                        tmp+='    </div>'
                                        tmp+='</div>'
                                    } 
                                }
                            }
                        }
                    }
                    dialog.destroy();
                    box.find(".list").html(tmp);
                    dom.fadeIn(200,function(){
                        dom.addClass('on');
                    });
                }else{
                    dialog.tip({"msg":"用户数据错误","time":1600});
                }
            }else{
                dialog.tip({"msg":"用户数据拉取失败","time":1600});
            }
        })
        .fail(function() {
            dialog.tip({"msg":"用户数据拉取失败","time":1600});
        })
        //播放声音
        function playAudio(audios,i){
            var audios = audios;
            var i = i;
            var len = audios.length;
            globalAudio.off("ended");
            if(!audios){
                dialog.alert("未找到录音文件");
            }else if(i<0 || i>=len){
                globalAudio[0].pause();
                dialog.destroy();
            }else{
                var curaudio = audios[i];
                globalAudio.attr('src',curaudio);
                globalAudio[0].play();
                globalAudio.on("ended" ,function(){
                    playAudio(audios,i+1)
                })
            }
        }
        box.on("click",".play", function(){
            var that= $(this);
            var audios = that.attr("data-audios");
            if(audios){
                audios = audios.split(",")
            }else{
                dialog.tip({"msg":"音频获取失败","time":1200})
                return;
            }
            if(that.hasClass('playing')){
                that.removeClass('playing')
                globalAudio[0].pause();
                globalAudio.off("ended");
                that.parents(".list-item").find(".video-time").removeClass('font-warning');
            }else{
                that.addClass('playing');
                that.parents(".list-item").find(".video-time").addClass('font-warning');
                playAudio(audios,0)
            }  
        })
        /*微信分享书*/
        box.on("click" ,".wx_share:not(unfinish)" ,function(){
            var that = $(this);
            var bookID = that.attr("data-book-id");
            //分享当前书 bookid
            $.ajax({
                url: globalAPI+'/learn/jsshare',
                type: 'GET',
                dataType: 'jsonp',
                data: {"id": bookID},
            })
            .done(function(res) {
                if(res.code==0){
                    window.top.location.href = res.data.url;
                }else{
                    dialog.tip({"msg":"分享信息失败","time":1200})
                }
            })
            .fail(function() {
                dialog.tip({"msg":"分享信息失败","time":1200})
            })
        })
    })
    $(".content-my").on("click",".deposit",function(e){
        e.preventDefault();
        e.stopPropagation();
        var that = $(this);
        dialog.tip("正在获取数据");
        var dom = $(".layout-deposit");
        function getdeposit(page){
            $.ajax({
                url: globalAPI+'/deposit/my',
                type: 'GET',
                dataType: 'jsonp',
                data:{"page":page},
            })
            .done(function(res) {

                if(res.code=="0"){
                    var data = res.data;
                    if(!$.isEmptyObject(data)){
                        dom.find(".money").html(data.user_money);
                        var tmp="";
                        for(var i=0,len=data.money_list.items.length;i<len;i++){
                            var item = data.money_list.items[i]
                            tmp+='<div class="list-item"><p class="act-time">'+item.updated_at+'</p><div class="box">'
                            tmp+='<div class="boxflex"><p>'+item.remarks+'</p>'
                            tmp+='</div><div class="boxflex"><p class="textright">扣除保证金：'+item.money+'元</p></div></div></div>'
                        }
                        dom.find(".list-dtail").html("").append(tmp);
                        dialog.destroy();
                        dom.fadeIn(200,function(){
                            dom.addClass('on');
                        });
                        var pages = data.money_list.page;
                        
                        if(!pages.has_next){
                            dom.find(".loadpage").remove() 
                        }else{
                            dom.find(".loadpage").attr("data-page",pages.current_page).attr("data-total",pages.total);
                        }
                    }else{
                        dialog.tip({'msg':"保证金数据获取失败","time":1600});
                    }
                }else{
                    dialog.tip({'msg':"保证金数据获取失败","time":1600});
                }
            })
            .fail(function() {
                dialog.tip({'msg':"保证金数据获取失败","time":1600});
            });
        }
        dom.find(".loadpage").on("click" ,function(){
            var that = $(this)
            var page = that.attr("data-page");
            var total = that.attr("data-total");
            if(page>=total){
                return
            }else{
                getdeposit(page*1+1)
            }
        })
        getdeposit(1);
    })
    
    function getQueryString(e) {
        var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
            str = decodeURIComponent(window.location.search),
            n = str.substr(1).match(t);
        return null != n ? unescape(n[2]) : null
    }
    /*根据参数跳页面*/
    function jumpPageByparmes(){
        var parm = window.location.hash.replace("#","");
        if(parm.indexOf("userinfo")>-1){
            showParmPage("userinfo")
        }else if(parm.indexOf("progress")>-1){
            showParmPage("progress")
        }else if(parm.indexOf("history")>-1){
            showParmPage("history")
        }else if(parm.indexOf("deposit")>-1){
            showParmPage("deposit")
        }else if(!isNaN(parm)){
            parm = (parm-1)<0 ? 0:parm-1;
            swiper.slideTo(parm);
        }
    }
    function showParmPage(tag){
        $(".tab.active").removeClass('active');
        $(".tab-my").addClass('active');
        globalAudio[0].pause();
        $(".content-my").show().find("."+tag).trigger('click');
        $(".content-home").hide();
        $(".layout-userinfo ,.layout-progress ,.layout-history ,layout-deposit").removeClass('hide');
    }
})
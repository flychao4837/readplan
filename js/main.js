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
            if(d.find(".listen").length>1){
                switchbox.show();
                switchbox.find(".switchery").removeClass('off').addClass('on')
                
                if(d.find(".listen.my.in")[0]){
                    switchbox.find(".switchery").removeClass('off').addClass('on')
                }else{
                    switchbox.find(".switchery").removeClass('on').addClass('off')
                }
            }else{
                switchbox.hide();
                switchbox.find(".switchery").removeClass('on').addClass('off')
            }

            if(d.find(".listen.my.in")[0]){
                recorderbox.addClass('icon_isdone');
            }else{
                recorderbox.removeClass('icon_isdone');
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
    $(".common-tip-box,.layout-download-tip-box,.layout-task-tip-box,.layout-task-progress-box,.layout-newer-box,.layout-levelshow-box,.layout-taskdone-box,.layout-encourage-box")
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
                            var statu = "in";
                            tmp+='<div class="swiper-slide" data-book-id="'+item.id+'" data-week="'+item["book"]['week']+'" data-number="'+item['book']['number']+'" data-notice="'+item['book']['notice']+'">'
                            tmp+='<div class="cover">'
                            tmp+='    <img src="'+item['book']['icon']+'">'
                            if(!$.isEmptyObject(item.my)&&item.my.audios && item.my.audios.length>0){
                                statu = "out";
                                tmp+='    <a class="listen my flip in" data-media="'+item.my.audios.join(",")+'">'
                                tmp+='        <img src="'+item['my']['user_headimgurl']+'" />'
                                tmp+='        <i class="status"></i>'
                                tmp+='    </a>'
                            }
                            if(!$.isEmptyObject(item.recommend) && item.recommend.audios && item.recommend.audios.length>0){
                                tmp+='    <a class="listen default flip '+statu+'" data-media="'+item.recommend.audios+'">'
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
                        if(data["other"]["tips"]&&data["other"]["tips"]["money"]&&data["other"]["tips"]["money"]["txt"]){
                            showCommonTip(data["other"]["tips"]["money"]["txt"])
                        }
                        /*读书任务完成提示*/
                        if(data["other"]["tips"] &&data["other"]["tips"]["plan"]&& data["other"]["tips"]["plan"]["txt"]){
                            showCommonTip(data["other"]["tips"]["plan"]["txt"])
                        }
                        if(data["other"]["tips"]&&data["other"]["tips"]["group"]&&data["other"]["tips"]["group"]["txt"]){
                            var tipbox = $(".layout-payment-tip-box");
                            tipbox.find(".tip-msg").html(data["other"]["tips"]["group"]["txt"]);
                            tipbox.show();
                            tipbox.find(".close-payment-tip,.readnote").on("click" ,function(){
                                tipbox.hide();
                            })
                        }
                        /*100本完成 提示 最上层*/
                        if(data["my"] && data["my"]["learning_finish"]==1){
                            var tipbox = $(".layout-taskdone-box");
                            var stagetip = $(".layout-stage-tip-box");
                            var tmp = '<div class="tip-msg"><p class="title">阅读培养在于坚持</p><p class="notice">当前没有你需要完成的计划</p><a class="operate-tip">更多计划请通过公众号查询</a></div>'
                            $(".content-home").removeClass('hide').html(tmp);
                            if(!$.isEmptyObject(data.share)){
                                tipbox.find(".done-tip>span").html(data["share"]["plan_name"]);
                                tipbox.find(".books").html(data["share"]["books"]);
                                tipbox.find(".words").html(data["share"]["hour"]);
                                tipbox.show();
                                tipbox.find(".btn-share").one("click" ,function(){
                                    dialog.tip({"msg":"正在处理分享信息","time":2000});
                                    var user_name = globaluser;
                                    var headimgurl = globaluserimg;
                                    var week = data["share"]["hour"];
                                    var books = data["share"]["books"];
                                    var info = {
                                        "user_name" : user_name,
                                        "headimgurl" : headimgurl,
                                        "week" :week,
                                        "books" : books,
                                    }
                                    $.ajax({
                                        url: globalAPI+'/learn/level-book-share',
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
                            }
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
        var playTimer,startTime,endTime,recordDuration=0,playstatus=true,duration,playduration;
        function stopTiming(){
            recordDuration =0;
            startTime=0;
            endTime =0;
            clearTimeout(playTimer);
        }
        function countdown(){
            if(!playstatus){
                stopTiming();
                return;
            }
            startTime = +new Date();
            playTimer = setTimeout(function(){
                recordDuration += (+new Date() - startTime)/1000;
                if(recordDuration>3600){
                    stopTiming()
                    return;
                }
                playduration = duration - recordDuration + 0.5;
                playduration = playduration >=0 ? playduration : 0;
                fillTimeStr(formatTime(playduration));
                countdown();
            },50)
        }
        function fillTimeStr(str){
            $(".layout-recordfinsish-box").find(".play-time").html(str);
        }
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
                    //dialog.tip({"msg":"停止录音失败","time":1200});
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
            var timeDom = $(".layout-recordfinsish-box").find(".play-time");
            if(!localId){
                dialog.tip({"msg":"本地录音不存在","time":1200});
            }else{
                timeDom.addClass('font-warning');
                voice.localId = localId;
                wx.onVoicePlayEnd({
                    complete: function (res) {
                        if(i<len-1){
                            playLocalRecord(i*1+1);
                        }else{
                            $(".play-back").removeClass('on');
                            timeDom.removeClass('font-warning');
                        }
                    }
                });
                wx.playVoice({
                    localId: localId,
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
                        
                        $(".layout-recordfinsish-box .play-time").html( formatTime($(".pagination1 .timer").attr("data-duration")) )
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
            duration = $(".pagination1 .timer").attr("data-duration");
            if(that.hasClass('on')){
                that.removeClass('on');
                stopPlay();
                playstatus  = false;
                stopTiming();
                $(".layout-recordfinsish-box").find(".play-time").html(formatTime(duration))
            }else{
                that.addClass('on');
                playstatus = true;
                playLocalRecord(0);
                countdown();
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
                
                mytmp+='    <a class="listen my flip in" data-book-id="'+bookID+'">'
                mytmp+='        <img src="'+globaluserimg+'" />'
                mytmp+='        <i class="status"></i>'
                mytmp+='    </a>'

                if(bookviewDom.find(".listen.my")[0]){
                    bookviewDom.find(".listen.my").replaceWith(mytmp);
                    
                }else{
                    bookviewDom.find(".cover").append(mytmp);
                }
                if(bookviewDom.find(".listen.default").length>0){
                    $(".switchery").removeClass('off').addClass('on');  
                    $(".switch-box").show();
                }else{
                    $(".switch-box").hide();
                }
                
                $(".layout-recordfinsish-box").hide();
                $(".layout-record").hide();
                if(res.code==0){
                    dialog.tip({"msg":"提交成功","time":1200});
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
                url : 'http://v0.api.upyun.com/datainfo',
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

                var data = res.data;
                if(!$.isEmptyObject(data)){
                    dom.find(".user_img").attr(data.my.headimgurl);
                    dom.find(".user_name").html(data.my.name);
                    if(data.my.level>0){
                        dom.find(".medal").attr("src","http://datainfo.b0.upaiyun.com/image/medal_"+data.my.level+".png").show();
                    }else{
                        dom.find(".medal").hide()
                    }
                    dom.find(".processingbar1 .num").html(data.my.books_num);
                    dom.find(".processingbar2 .num").html(data.my.point);
                    dom.find(".processingbar3 .num").html(data.my.duration);
                    dom.find(".task").html(data.my.group_name);
                    dom.find(".start-time").html("开始时间："+data.my.start_date);
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
                    var st=0;
                    for(var j in data){
                        var scop = data[j];
                        if(scop.length){
                            if(st==0){
                                tmp+='<div class="stage"><span>'+j+'本</span></div><div>'
                            }else{
                                tmp+='<div class="stage slideup"><span>'+j+'本</span></div><div>'
                            }
                            st=1;
                            for(var i in scop){
                                var item = scop[i];
                                if(item.stauts==0){
                                    //TODO 未完成 判断是否显示邀请按钮
                                    tmp+='<div class="list-item unfinish">'
                                    tmp+='    <div class="box">'
                                    tmp+='        <div>'
                                    tmp+='            <div class="book-cover">'
                                    tmp+='                <img src="'+item["book"]['icon']+'" />'
                                    tmp+='                <a class="nofinish_tag">未完成</a>'
                                    tmp+='            </div>'
                                    tmp+='        </div>'
                                    tmp+='        <div class="boxflex">'
                                    tmp+='            <p class="book-name">'+item['book']['name']+'</p>'
                                    tmp+='            <p class="video-time">'+item['duration']+'</p>'
                                    tmp+='        </div>'
                                    tmp+='        <div>'
                                    if($.isEmptyObject(item.helpme)){
                                       tmp+='       <p class="read-time">'+formatDate(item['enddate'])+'</p>'
                                    }else{
                                        tmp+='       <a class="invite-read" data-help-id="'+item['helpme']['help_id']+'">邀请好友完成</a>'
                                    }
                                    tmp+='        </div>'
                                    tmp+='        <div>'
                                    tmp+='            <a class="wx_share unfinish" data-book-id="'+item['id']+'">'
                                    tmp+='                <img src="image/icon_dot.png"/>'
                                    tmp+='            </a>'
                                    tmp+='        </div>'
                                    tmp+='    </div>'
                                    tmp+='</div>'
                                }else{
                                    //TODO 完成 判断是否来自好友帮助
                                    tmp+='<div class="list-item">'
                                    if(item['helpme'] && item['helpme']['user']&&item['helpme']['user']['nickname']){
                                        tmp+='<p class="invite-friend">来自微信好友:'+item['helpme']['user']['nickname']+'</p>'
                                    }
                                    tmp+='    <div class="box">'
                                    tmp+='        <div>'
                                    tmp+='            <div class="book-cover">'
                                    tmp+='                <img src="'+item["book"]['icon']+'" />'
                                    if(item.audios && item.audios.length>0){
                                        tmp+='            <a class="play" data-audios="'+item.audios.join(",")+'" data-time="'+item['duration']+'"></a>'
                                    }else{
                                        tmp+='            <a class="play" data-audios=""></a>'
                                    }
                                    tmp+='            </div>'
                                    tmp+='        </div>'
                                    tmp+='        <div class="boxflex">'
                                    tmp+='            <p class="book-name">'+item['book']['name']+'</p>'
                                    tmp+='            <p class="video-time">'+item['duration']+'</p>'
                                    tmp+='        </div>'
                                    tmp+='        <div>'
                                    tmp+='            <p class="read-time">'+formatDate(item['enddate'])+'</p>'
                                    tmp+='        </div>'
                                    tmp+='        <div>'
                                    tmp+='            <a class="wx_share" data-book-id="'+item['id']+'">'
                                    tmp+='                <img src="image/icon_dot.png"/>'
                                    tmp+='            </a>'
                                    tmp+='        </div>'
                                    tmp+='    </div>'
                                    tmp+='</div>'
                                } 
                            }
                            tmp+='</div>'
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
        var playTimer,startTime,endTime,recordDuration=0,playstatus=true,historyduration,playduration;
        function stopTiming(){
            recordDuration =0;
            startTime=0;
            endTime =0;
            clearTimeout(playTimer);
            globalAudio.off("play");
            globalAudio.off("error");
            globalAudio.off("ended");
        }
        function countdown(){
            if(!playstatus){
                stopTiming();
                return;
              }
            startTime = +new Date();
            playTimer = setTimeout(function(){
                recordDuration += (+new Date() - startTime)/1000;
                if(recordDuration>3600){
                    stopTiming()
                    return;
                }
                playduration = historyduration - recordDuration + 0.5;
                playduration = playduration >=0 ? playduration : 0;
                fillTimeStr(formatTime(playduration));
                countdown();
            },200)
        }
        function fillTimeStr(str){
            box.find(".video-time.font-warning").html(str);
        }
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
                var duration = box.find(".play.playing").attr('data-time');
                box.find(".video-time.font-warning").removeClass('font-warning').html(duration);
                box.find(".play.playing").removeClass('playing');
                stopTiming();
                playstatus = false;
            }else{
                var curaudio = audios[i];
                globalAudio.attr('src',curaudio);
                globalAudio[0].play();
                globalAudio.one("play" ,function(){
                    startTime=0;
                    endTime =0;
                    countdown();
                });
                globalAudio.one("error" ,function(){
                    playstatus = false;
                    box.find(".play.playing").removeClass('playing');
                    dialog.tip({"msg":"文件错误，播放失败","time":2000});
                    stopTiming();
                })
                globalAudio.one("ended" ,function(){
                    playAudio(audios,i+1)
                })
            }
        }
        box.on("click",".play", function(){
            var that= $(this);
            var audios = that.attr("data-audios");
            var duration = that.attr("data-time");
            var tmpduration = that.attr("data-time");
            tmpduration = tmpduration.split(":");
            historyduration = tmpduration[0]*3600 + tmpduration[1]*60 + tmpduration[2]*1;
            playstatus = true;
            if(audios){
                audios = audios.split(",")
            }else{
                playstatus = false;
                globalAudio.off("play");
                globalAudio.off("error");
                globalAudio.off("ended");
                dialog.tip({"msg":"音频获取失败","time":1200})
                return;
            }
            if(that.hasClass('playing')){
                that.removeClass('playing');
                globalAudio[0].pause();
                globalAudio.off("play");
                globalAudio.off("error");
                globalAudio.off("ended");
                playstatus = false;
                that.parents(".list-item").find(".video-time").removeClass('font-warning').html(duration);;
            }else{
                that.addClass('playing');
                that.parents(".list-item").find(".video-time").addClass('font-warning');
                playAudio(audios,0)
            }  
        })
        /*微信分享书*/
        box.on("click" ,".wx_share" ,function(){
            var that = $(this);
            var bookID = that.attr("data-book-id");
            if(that.hasClass('unfinish')){
                return;
            }else{
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
            }
        });
        /*邀请阅读*/
        box.on("click" ,".invite-read" ,function(){
            var that = $(this);
            var help_id = that.attr("data-help-id");
            if(help_id){
                window.location.href="helpme_share.html?id="+help_id;
            }else{
                dialog.tip({"msg":"邀请ID获取失败","time":1200})
                return false;
            }
        })
        box.on("click" ,".stage" ,function(){
            var that = $(this);
            var stages = box.find(".stage");
            stages.addClass('slideup');
            that.removeClass('slideup')
        })
    })
    $(".content-my").on("click",".deposit",function(e){
        e.preventDefault();
        e.stopPropagation();
        var that = $(this);
        dialog.tip("正在获取数据");
        var dom = $(".layout-deposit");
        var widthdrawbox = $(".widthdraw-tip-box");
        var withdrawmodify = $(".widthdraw-modify-tip-box");
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
                        dom.find(".money").html(data.user_money+"元");
                        var tmp="";
                        for(var i=0,len=data.money_list.items.length;i<len;i++){
                            var item = data.money_list.items[i]
                            tmp+='<div class="list-item"><p class="act-time">'+item.created_at+'</p><div class="box">'
                            
                            if(item.description.indexOf("提现")>-1){
                                var arr = item.remarks.split(":");
                                var str=""
                                if(arr.length>1){
                                    str = arr[0]+':<span class="blod">'+arr[1]+'</span>'
                                }
                                tmp+='<div class="boxflex"><p>'+str+'</p>'
                                tmp+='</div><div class="boxflex"><p class="textright">'+item.description+'：<span class="getmoney">'+item.money+'元</span></p></div></div></div>'
                            }else{
                                tmp+='<div class="boxflex"><p>'+item.remarks+'</p>'
                                tmp+='</div><div class="boxflex"><p class="textright">'+item.description+'：<span class="font-warning">'+item.money+'元</span></p></div></div></div>'
                            }
                        }
                        dom.find(".list-dtail").html("").append(tmp);
                        if(!$.isEmptyObject(data.withdraw)){
                            var withdraw = data.withdraw;
                            var wtmp="";
                            if(withdraw.day>0){
                                wtmp='<p class="wait-day">还剩:'+withdraw.day+'天</p><p class="wait-withdraw">申请提现</p>'
                            }else{
                                if(withdraw.weixin_account)
                                    wtmp ='<a class="btn-withdrawmodify" data-weixin="'+withdraw.weixin_account+'">申请提现</a>'
                                else
                                    wtmp ='<a class="btn-withdraw" data-min-money="'+withdraw.min_money+'">申请提现</a>'

                            }
                            dom.find(".withdraw").html(wtmp);
                        }
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
        getdeposit(1);
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
        dom.on("click", ".btn-withdraw", function(){
            $("input[name=pnumber]").val("");
            widthdrawbox.show()
        })
        dom.on("click", ".btn-withdrawmodify", function(){
            $("input[name=pnumber]").val("");
            withdrawmodify.show();
        })
        widthdrawbox.find(".close-widthdraw-tip").on("click" ,function(){
            widthdrawbox.hide();
            $("input[name=pnumber]").val("");
        })
        widthdrawbox.find(".ok").on("click" ,function(){
            var num = widthdrawbox.find("input[name=pnumber]").val();
            if(!num){
                dialog.tip({"msg":"请填写微信号或微信绑定手机号","time":1200});
            }else{
                dialog.tip("正在提交");
                $.ajax({
                    url: globalAPI+'/deposit/withdraw',
                    type: 'POST',
                    dataType: 'json',
                    data: {weixin: num},
                })
                .done(function(res) {
                    if(res.code=="0"){
                        dialog.tip({"msg":"提交成功","time":1000});
                        widthdrawbox.hide();
                        $(".btn-withdraw").addClass('btn-withdrawmodify').removeClass('btn-withdraw');
                    }else{
                        dialog.tip({"msg":res.msg||"提交失败，请稍后再试","time":1200});
                    }
                })
                .fail(function() {
                    dialog.tip({"msg":"提交错误，请稍后再试","time":1200});
                })
            }
        })
        withdrawmodify.find(".ok").on("click" ,function(){
            withdrawmodify.hide();
            widthdrawbox.show();
        })
        withdrawmodify.find(".close-widthdraw-modify-tip").on("click" ,function(){
            withdrawmodify.hide();
        })
    })
    
    function getQueryString(e) {
        var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
            n = window.location.search.substr(1).match(t);
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
        }else if(parm.indexOf("my")>-1){
            showParmPage("my");
        }else if(!isNaN(parm)){
            parm = (parm-1)<0 ? 0:parm-1;
            swiper.slideTo(parm);
        }
    }
    function showParmPage(tag){

        globalAudio[0].pause();
        if(tag=="my"){
            $(".content-home").removeClass('hide').html("");
            $(".content-my").hide();
            return;
        }
        $(".tab.active").removeClass('active');
        $(".tab-my").addClass('active');
        $(".content-my").show().find("."+tag).trigger('click');
        $(".content-home").hide();
        $(".layout-userinfo ,.layout-progress ,.layout-history ,layout-deposit").removeClass('hide');
    }
    function formatDate(t){
        if(t.indexOf("未完成")>-1){
            return t;
        }else{
            var t = t.replace(/-/g, "/");
            var date = new Date(t);
            var y = date.getFullYear(date);
            var m = date.getMonth()+1;
            var d = date.getDate();
            m = m>9 ? m : "0"+m;
            d = d>9 ? d : "0"+d;
            return y+"/"+m+"/"+d;
        }
    }
    /*播放时间格式*/
    function formatTime(t){
        if(isNaN(t)){
            return "00:00:00";
        }
        var h = parseInt(t/3600);
        var m,s;
        var dd = t%3600
        m = parseInt(dd/60);
        s = parseInt(dd%60);
        h = h>9 ? h : "0"+h;
        s = s>9 ? s : "0"+s;
        s = s ==60? "00" : s;
        m = s ==60? ++m :m;

        m = m>9 ? m : "0"+m;
        m = m ==60? "00" : m;
        return h+":"+m+":"+s
    }    
})
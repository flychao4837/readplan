'use strict'
$(function(){
    var globalAPI = "/api";
    var dialog = new Dialog();
    var shareData = {
        title: "",
        desc: "",
        link: "",
        imgUrl: ""
    };
    var bookID;
    var recordStart;
    var recordEnd;
    var timmer;
    var swiper = new Swiper('.swiper', {
        pagination : '.pagination-home',
        loop:false,
        grabCursor: true,
        onImagesReady: function(){
        },
        onTransitionEnd:function(swiper){
        } 
    });
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
    /*根据ID获取book信息*/
    var help_id = app.getQueryString("id");
    !function(){
        if(help_id){
            $.ajax({
                url: globalAPI+'/learn/helpme-share',
                type: 'GET',
                dataType: 'jsonp',
                data: {"id": help_id},
            })
            .done(function(res) {
                console.log(res)
                if(res.code==0){
                    var data = res.data;
                    var plan = data.plan;
                    var tmp="";
                    var dom = $(".invite-content");
                    if(plan.length){
                        for(var i in plan){
                            var item = plan[i];
                            tmp+='<div class="swiper-slide" data-book-id="'+item['id']+'">'
                            tmp+='    <div class="cover">'
                            tmp+='        <img src="'+item['book']['icon']+'">'
                            tmp+='        <a class="listen default my">'      
                            tmp+='            <img src="'+item['own']['user_headimgurl']+'">'
                            tmp+='        </a>'
                            tmp+='    </div>'
                            tmp+='    <p class="reader">我是<span class="font-warning">'+item['own']['user_name']+'</span></p>'
                            tmp+='    <p class="title">正在读:<span class="font-warning">'+item['book']['name']+'</span></p>'
                            tmp+='</div>'
                        }
                        $(".swiper-wrapper").html(tmp);
                        shareData.title = item['book']['name'];
                        shareData.desc = item['book']['name'];
                        shareData.imgUrl = item['book']['icon'];
                        swiper.init();
                        dom.removeClass('hidden');
                        app.localStorage.set("plan",JSON.stringify(plan));
                        if(data.other && data.other.alert){
                            //TOTO 勤快的大和已经帮我...
                            showCommonTip(data.other.alert)
                        }
                    }else{
                        dialog.tip({"msg":"获取邀请数据失败","time":1200})
                    }
                }else{
                    dialog.tip({"msg":"获取邀请数据失败","time":1200})
                }
            })
            .fail(function() {
                dialog.tip({"msg":"获取邀请数据失败","time":1200})
            })
        }else{
            dialog.tip({"msg":"邀请ID获取失败","time":1200})
            return false;
        }
    }()
    /*wxConfig*/
    !function(){
        ///learn/helpme-jsshare?id=ypaxGgLY
        $.ajax({
            url: globalAPI+'/learn/helpme-js',
            type: 'GET',
            dataType: 'jsonp',
            data: {id: help_id},
        })
        .done(function(res) {
            if(res.code==0){    
                wx.config({
                    debug: false,
                    appId: res.data.appId,
                    timestamp: res.data.timestamp,
                    nonceStr: res.data.nonceStr,
                    signature: res.data.signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'getLocation',
                        'startRecord',
                        'stopRecord',
                        'onVoiceRecordEnd',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'onVoicePlayEnd',
                        'uploadVoice',
                        'hideMenuItems',
                        'chooseWXPay'
                    ]
                });
                shareData.link = res.data.url;
            }else{
                dialog.tip({"msg":"分项数据获取失败","time":1200})
            }
        })
        .fail(function() {
            dialog.tip({"msg":"微信初始化失败","time":1200})
        })
    }()
    /*开启录音页面*/
    $(".action .recorder").on("click" ,function(){
        var curIdx = 0;
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
    /*录音*/
    var videolist=[];
    var voice = {
        localId: '',
        serverId: ''
    };
    var recordStart;
    var recordEnd;
    var timmer;
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
                url: globalAPI+'/learn/helpme',
                type: 'POST',
                dataType: 'json',
                data: {
                    "id" : help_id,
                    "duration" : duration,
                    "audios" : videolist,
                },
            })
            .done(function(res) {
                $(".layout-recordfinsish-box").hide();
                $(".layout-record").hide();
                if(res.code==0){
                    dialog.destroy();
                    var data = res.data;
                    /*TODO 提交成功 */

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
        /*分享*/
        wx.onMenuShareTimeline({
            title: shareData.title,
            link: shareData.link,
            imgUrl: shareData.imgUrl,
            success: function (res) {
                dialog.tip({"msg":"分享成功",'time':1200});
                window.history.go(-1);
            },
            cancel: function (res) {

            },
            fail: function (res) {

            }
        });
        wx.onMenuShareAppMessage({
            title: shareData.title,
            desc : shareData.desc,
            link: shareData.link,
            imgUrl: shareData.imgUrl,
            success: function (res) {
                dialog.tip({"msg":"分享成功",'time':1200});
                window.history.go(-1);
            },
            cancel: function (res) {

            },
            fail: function (res) {

            }
        });
        wx.onMenuShareQQ({
            title: shareData.title,
            desc : shareData.desc,
            link: shareData.link,
            imgUrl: shareData.imgUrl,
            success: function (res) {
                dialog.tip({"msg":"分享成功",'time':1200});
                window.history.go(-1);
            },
            cancel: function (res) {

            },
            fail: function (res) {

            }
        });
        wx.onMenuShareWeibo({
            title: shareData.title,
            desc : shareData.desc,
            link: shareData.link,
            imgUrl: shareData.imgUrl,
            success: function (res) {
                dialog.tip({"msg":"分享成功",'time':1200});
                window.history.go(-1);
            },
            cancel: function (res) {

            },
            fail: function (res) {

            }
        });
        wx.onMenuShareQZone({
            title: shareData.title,
            desc : shareData.desc,
            link: shareData.link,
            imgUrl: shareData.imgUrl,
            success: function (res) {
                dialog.tip({"msg":"分享成功",'time':1200});
                window.history.go(-1);
            },
            cancel: function (res) {

            },
            fail: function (res) {

            }
        });
    });    
         
    wx.error(function (res) {  
      console.log("调用微信jsapi返回的状态:"+res.errMsg);  
    });
})
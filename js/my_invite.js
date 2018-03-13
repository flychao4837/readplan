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
    var swiper = new Swiper('.swiper', {
        pagination : '.pagination-home',
        loop:false,
        grabCursor: true,
        onImagesReady: function(){
        },
        onTransitionEnd:function(swiper){
        } 
    });
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
                        shareData.title = '请你帮我朗读'+item['book']['name'];
                        shareData.desc = '我是【'+item['own']['user_name']+'】请你帮我完成一个朗读任务';
                        shareData.imgUrl = item['own']['user_headimgurl'];
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
            url: globalAPI+'/learn/helpme-jsshare',
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
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
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
   
    wx.ready(function(){    
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
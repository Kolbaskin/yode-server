/*
 * Thickbox 3.1-byrne - One Box To Rule Them All.
 * By Cody Lindley (http://www.codylindley.com)
 * Modifications by Byrne Reese (http://www.majordojo.com/)
 * Copyright (c) 2007 Cody Lindley
 * Copyright (c) 2009 Byrne Reese
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/
(function($){
    $.fn.thickbox = function(options) {
        var settings = $.extend( {}, $.fn.thickbox.defaults, options);
        var imgLoader = new Image(); // preload image
        imgLoader.src = settings.loadingImage;
        return this.each(function() {
            obj = $(this);
            obj.click(function(){
                var t = this.title || this.name || null;
                var a = this.href || this.alt;
                var g = this.rel || false;
                tb_show(t,a,g);
                this.blur();
                return false;
            });
        });
        function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link
            try {
                if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
                    $("body","html").css({
                        height: "100%",
                        width: "100%"
                    });
                    $("html").css("overflow","hidden");
                    if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
                        $("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
                        $("#TB_overlay").click(tb_remove);
                    }
                }else{//all others
                    if(document.getElementById("TB_overlay") === null){
                        $("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
                        $("#TB_overlay").click(tb_remove);
                    }
                }
	
                if(tb_detectMacXFF()){
                    //use png overlay so hide flash
                    $("#TB_overlay").addClass("TB_overlayMacFFBGHack");
                    $("#TB_overlay").css({
                        'background-image'  : 'url('+settings.macFFBgHack+')',
                        'background-repeat' : 'repeat'
                    });
                }else{
                    $("#TB_overlay").addClass("TB_overlayBG");//use background and opacity
                }
	
                if(caption===null){
                    caption="";
                }
                $("body").append("<div id='TB_load'><img src='"+imgLoader.src+"' /></div>");//add loader to the page
                $('#TB_load').show();//show loader
	
                var baseURL;
                if(url.indexOf("?")!==-1){ //ff there is a query string involved
                    baseURL = url.substr(0, url.indexOf("?"));
                }else{
                    baseURL = url;
                }
	
                var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
                var urlType = baseURL.toLowerCase().match(urlString);
	
                if(urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp'){//code to show images
	  
                    TB_PrevCaption = "";
                    TB_PrevURL = "";
                    TB_PrevHTML = "";
                    TB_NextCaption = "";
                    TB_NextURL = "";
                    TB_NextHTML = "";
                    TB_imageCount = "";
                    TB_FoundURL = false;
                    if(imageGroup){
                        TB_TempArray = $("a[rel="+imageGroup+"]").get();
                        for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
                            var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
                            if (!(TB_TempArray[TB_Counter].href == url)) {
                                if (TB_FoundURL) {
                                    TB_NextCaption = TB_TempArray[TB_Counter].title;
                                    TB_NextURL = TB_TempArray[TB_Counter].href;
                                    TB_NextHTML = "<span id='TB_next'><div style='width:100%; height:100%; background-image: url(/js/thickbox/blank.gif);'>&nbsp</div></span>";
                                //TB_NextHTML = "ok";
                                } else {
                                    TB_PrevCaption = TB_TempArray[TB_Counter].title;
                                    TB_PrevURL = TB_TempArray[TB_Counter].href;
                                    TB_PrevHTML = "<span id='TB_prev'><div style='width:100%; height:100%; background-image: url(/js/thickbox/blank.gif);'>&nbsp</div></span>";
                                    //TB_PrevHTML = "<span id='TB_prev'><a href='#' style='width: 40%; height: 100%; left: 0;position: absolute; top: 0;cursor: pointer; z-index: 105;'>&#08592;</a></span>";
                                }
                            } else {
                                TB_FoundURL = true;
                                TB_imageCount = (TB_Counter + 1) +"/"+ (TB_TempArray.length);
                            }
                        }
                    }
	  
                    imgPreloader = new Image();
                    imgPreloader.onload = function(){
                        imgPreloader.onload = null;
	    
                        // Resizing large images - orginal by Christian Montoya edited by me.
                        var pagesize = tb_getPageSize();
                        var x = pagesize[0] - 150;
                        var y = pagesize[1] - 150;
                        var imageWidth = imgPreloader.width;
                        var imageHeight = imgPreloader.height;
                        if (imageWidth > x) {
                            imageHeight = imageHeight * (x / imageWidth);
                            imageWidth = x;
                            if (imageHeight > y) {
                                imageWidth = imageWidth * (y / imageHeight);
                                imageHeight = y;
                            }
                        } else if (imageHeight > y) {
                            imageWidth = imageWidth * (y / imageHeight);
                            imageHeight = y;
                            if (imageWidth > x) {
                                imageHeight = imageHeight * (x / imageWidth);
                                imageWidth = x;
                            }
                        }
                        // End Resizing
	    
                        TB_WIDTH = imageWidth + 30;
                        TB_HEIGHT = imageHeight + 60;
                        $("#TB_window").append("<div id='imagediv' style='height:"+imageHeight+";'><img id='TB_Image' src='"+url+"' width='"+imageWidth+"' height='"+imageHeight+"' alt='"+caption+"'/>"+ TB_PrevHTML + TB_NextHTML+"</div>" + "<div id='TB_caption'>"+caption+"<div id='TB_secondLine'>" + TB_imageCount + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>&#0215;</a></div>");

                        $("#TB_closeWindowButton").click(tb_remove);
	    
                        if (!(TB_PrevHTML === "")) {
                            function goPrev(){
                                if($(document).unbind("click",goPrev)){
                                    $(document).unbind("click",goPrev);
                                }
                                $("#TB_window").remove();
                                $("body").append("<div id='TB_window'></div>");
                                tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
                                return false;
                            }
                            $("#TB_prev").click(goPrev);

                            $("#TB_prev").mouseover(function(e) {
                                $(this).css('background-image', 'url(/js/thickbox/prev.gif)');
                            });

                            $("#TB_prev").mouseout(function(e) {
                                $(this).css('background-image', 'url(/js/thickbox/blank.gif)');
                            });
                        }
	    
                        if (!(TB_NextHTML === "")) {
                            function goNext(){
                                $("#TB_window").remove();
                                $("body").append("<div id='TB_window'></div>");
                                tb_show(TB_NextCaption, TB_NextURL, imageGroup);
                                return false;
                            }
                            $("#TB_next").click(goNext);

                            $("#TB_next").mouseover(function(e) {
                                $(this).css('background-image', 'url(/js/thickbox/next.gif)');
                            });

                            $("#TB_next").mouseout(function(e) {
                                $(this).css('background-image', 'url(/js/thickbox/blank.gif)');
                            });
                        }
	    
                        document.onkeydown = function(e){
                            if (e == null) { // ie
                                keycode = event.keyCode;
                            } else { // mozilla
                                keycode = e.which;
                            }
                            if(keycode == 27){ // close
                                tb_remove();
                            } else if(keycode == 190){ // display previous image
                                if(!(TB_NextHTML == "")){
                                    document.onkeydown = "";
                                    goNext();
                                }
                            } else if(keycode == 188){ // display next image
                                if(!(TB_PrevHTML == "")){
                                    document.onkeydown = "";
                                    goPrev();
                                }
                            }
                        };
	    
                        tb_position();
                        $("#TB_load").remove();
                        $("#TB_ImageOff").click(tb_remove);
                        $("#TB_window").css({
                            display:"block"
                        }); //for safari using css instead of show

                        $("#TB_prev").css('height',$('#imagediv').height());
                        $("#TB_next").css('height',$('#imagediv').height());

//                        alert($("#TB_next a").height());
                    };
	  
                    imgPreloader.src = url;
                }else{//code to show html
	  
                    TB_WIDTH = (settings.width) + 30; //defaults to 630 if no paramaters were added to URL
                    TB_HEIGHT = (settings.height) + 40; //defaults to 440 if no paramaters were added to URL
                    ajaxContentW = TB_WIDTH - 30;
                    ajaxContentH = TB_HEIGHT - 45;
	  
                    if(settings.iframe){// either iframe or ajax window
                        urlNoQuery = url.split('TB_');
                        $("#TB_iframeContent").remove();
                        if(!settings.modal){//iframe no modal
                            $("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a> or Esc Key</div></div><iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;' > </iframe>");
                        }else{//iframe modal
                            $("#TB_overlay").unbind();
                            $("#TB_window").append("<iframe frameborder='0' hspace='0' src='"+urlNoQuery[0]+"' id='TB_iframeContent' name='TB_iframeContent"+Math.round(Math.random()*1000)+"' onload='tb_showIframe()' style='width:"+(ajaxContentW + 29)+"px;height:"+(ajaxContentH + 17)+"px;'> </iframe>");
                        }
                    }else{// not an iframe, ajax
                        if($("#TB_window").css("display") != "block"){
                            if(!settings.modal){//ajax no modal
                                $("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>"+caption+"</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>close</a> or Esc Key</div></div><div id='TB_ajaxContent' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px'></div>");
                            }else{//ajax modal
                                $("#TB_overlay").unbind();
                                $("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:"+ajaxContentW+"px;height:"+ajaxContentH+"px;'></div>");
                            }
                        }else{//this means the window is already up, we are just loading new content via ajax
                            $("#TB_ajaxContent")[0].style.width = ajaxContentW +"px";
                            $("#TB_ajaxContent")[0].style.height = ajaxContentH +"px";
                            $("#TB_ajaxContent")[0].scrollTop = 0;
                            $("#TB_ajaxWindowTitle").html(caption);
                        }
                    }
	  
                    $("#TB_closeWindowButton").click(tb_remove);
	  
                    if(settings.inlineId){
                        $("#TB_ajaxContent").append($('#' + settings.inlineId).children());
                        $("#TB_window").unload(function () {
                            $('#' + settings.inlineId).append( $("#TB_ajaxContent").children() ); // move elements back when you're finished
                        });
                        tb_position();
                        $("#TB_load").remove();
                        $("#TB_window").css({
                            display:"block"
                        });
                    }else if(settings.iframe) {
                        tb_position();
                        if($.browser.safari){//safari needs help because it will not fire iframe onload
                            $("#TB_load").remove();
                            $("#TB_window").css({
                                display:"block"
                            });
                        }
                    }else{
                        $("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()),function(){//to do a post change this load method
                            tb_position();
                            $("#TB_load").remove();
                            $("#TB_ajaxContent a.thickbox").thickbox(settings);
                            $("#TB_window").css({
                                display:"block"
                            });
                        });
                    }
	  
                }
	
                if(!settings.modal){
                    document.onkeyup = function(e){
                        if (e == null) { // ie
                            keycode = event.keyCode;
                        } else { // mozilla
                            keycode = e.which;
                        }
                        if(keycode == 27){ // close
                            tb_remove();
                        }
                    };
                }
            } catch(e) {
            //nothing here
            }
        };
        //helper functions below
        function tb_showIframe(){
            $("#TB_load").remove();
            $("#TB_window").css({
                display:"block"
            });
        };
        function tb_remove() {
            $("#TB_imageOff").unbind("click");
            $("#TB_closeWindowButton").unbind("click");
            $("#TB_window").fadeOut("fast",function(){
                $('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove();
            });
            $("#TB_load").remove();
            if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
                $("body","html").css({
                    height: "auto",
                    width: "auto"
                });
                $("html").css("overflow","");
            }
            document.onkeydown = "";
            document.onkeyup = "";
            return false;
        };
        function tb_position() {
            $("#TB_window").css({
                marginLeft: '-' + parseInt((TB_WIDTH / 2),10) + 'px',
                width: TB_WIDTH + 'px'
                });
            if ( !(jQuery.browser.msie && jQuery.browser.version < 8)) { // take away IE6
                $("#TB_window").css({
                    marginTop: '-' + parseInt((TB_HEIGHT / 2),10) + 'px'
                    });
            }
        };
        function tb_getPageSize(){
            var de = document.documentElement;
            var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
            var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
            arrayPageSize = [w,h];
            return arrayPageSize;
        };
        function tb_detectMacXFF() {
            var userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox')!=-1) {
                return true;
            }
        };
    };
    $.fn.thickbox.defaults = {
        modal: 0,
        inlineId: null,
        iframe: false,
        width: 600,
        height: 400,
        macFFBgHack: '/js/thickbox/macFFBgHack.png',
        loadingImage: '/js/thickbox/thickbox-loading.gif'
    };
})(jQuery);
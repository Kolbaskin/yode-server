<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html 
    xmlns="http://www.w3.org/1999/xhtml" 
    xml:lang="en" 
    lang="en" 
    id="facebook" 
    class="" 
    xmlns:fb="http://ogp.me/ns/fb#" 
    xmlns:og="http://ogp.me/ns#"
    itemscope itemtype="http://schema.org/Organization">

    <head>
    <title>${metatitle} :: Yode</title>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=IE7">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="keywords" content="${metakeywords}">
	<meta name="description" content="${metadesctiption}">
    
    <!-- Open Graph metatags -->
    {{if og_image}}
    <meta property="og:image" content="http://example.com${og_image}">
    <meta itemprop="image" content="http://example.com${og_image}">    
    {{/if}}
    <meta property="og:title" content="{{if metatitle}}${metatitle}{{/if}}">
    <meta property="og:description" content="${metadesctiption}">
    <meta property="og:site_name" content="Game Insight">
    <meta property="og:url" content="http://example.com${request.pathname}">
    <!-- / Open Graph metatags -->
    
    <link rel="stylesheet" href="/css/common.css" type="text/css">
    </head>

<body>
<div id="wrapper">
    <div id="topmenu">
        <ul>
            <li class="logo"><img src="/i/yode-logo.png" /></li>
            {{each(row) nav.MENU0}}
            <li><a href="${row.dir}">${row.name}</a></li>
            {{/each}}
        </ul>
    </div>
    
    <div id="content_wrapper">
        
        <img id="topimg" src="/images/road.jpg" width="740">
        
        {{each(row) BLOCK_1}}
        {{html row.html}}
        {{/each}}        
        
        {{if seo}}
        <div class="seotxt">
        {{html seo.text}}
        </div>
        {{/if}}
        
    </div>
    
</div>
<div id="foother">
    <ul>
        {{each(row) nav.MENU1}}
        <li><a href="${row.dir}">${row.name}</a></li>
        {{/each}}        
    </ul><br>
    <div class="copy">&copy; 2013</div>
</div>
</body>
</html>

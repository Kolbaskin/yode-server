<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
    <title>${metatitle} :: Yode</title>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=IE7">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="keywords" content="${metakeywords}">
	<meta name="description" content="${metadesctiption}">
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

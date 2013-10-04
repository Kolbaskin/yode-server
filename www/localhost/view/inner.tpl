<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
    <title>${metatitle} :: Yode</title>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=IE7">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="keywords" content="${metakeywords}">
    <meta name="description" content="${metadesctiption}">
    <link rel="stylesheet" href="/js/thickbox/thickbox.css" type="text/css">
    <link rel="stylesheet" href="/css/common.css" type="text/css">
    <!-- thickbox -->
    <script src="/js/jquery.js"></script>
    <script src="/js/thickbox/thickbox.js"></script>
    
    <script src="/js/code.js"></script>
    <!-- / thickbox -->
    </head>

<body>
<div id="wrapper">
    <div id="topmenu">
        <ul>
            <li class="logo"><a href="/"><img src="/i/yode-logo.png" /></a></li>
            {{each(row) nav.MENU0}}
            <li><a href="${row.dir}">${row.name}</a></li>
            {{/each}}
        </ul>
    </div>
    
    <div id="content_wrapper">
    
        
        <div class="adblock content">
                            
                        
            {{if childMenu && childMenu.length}}
            <div class="transp">            
                <ul>
                {{each(r) childMenu}}
                <li><a href="${r.dir}">${r.name}</a></li>
                {{/each}}
                </ul>
            </div>
            {{/if}}
            
            {{if crumbs}}
            <div id="crumbs">
                {{each(r) crumbs}}
                    {{if r.cur}}${r.name} {{else}}<a href="${r.dir}">${r.name}</a> / {{/if}}
                {{/each}}
            </div>
            {{/if}}
            
            <h2>${name}</h2>
            {{each(row) BLOCK_1}}
            {{html row.html}}
            {{/each}} 
        </div>
                        
               
        
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
    <div class="copy">&copy; 2013</div>
</div>
</body>
</html>

{{if pages}}
<div id="pager" class="light">
<ul class="inlined" id="navi">
    <li><b>Pages:</b></li>
    <li>&#8592; <span>Ctrl</span></li>
	<li>{{if pages.previous !== null}}<a href="${pages.previous.l}" id="prevLink">previous</a>{{else}}previous{{/if}}</li>
	<li>{{if pages.next}}<a href="${pages.next.l}" id="nextLink">next</a>{{else}}next{{/if}}</li>
	<li><span>Ctrl</span> &#8594;</li>
</ul>

<ul class="inlined" id="pages">    
    {{if pages.first}}
    <li><a href="${ads.pages.first.l}">${pages.first.p}</a></li>
    <li>...</li>
    {{/if}}
    
    {{each(p) pages.range}}
    <li>{{if p.p == pages.current}}<b>${p.p}</b>{{else}}<a href="${p.l}">${p.p}</a>{{else}}{{/if}}</li>
    {{/each}}
    
	{{if pages.last}}<li>...</li>
	<li><a href="${pages.last.l}">${pages.last.p}</a></li>
    {{/if}}
</ul>
</div>
{{/if}}
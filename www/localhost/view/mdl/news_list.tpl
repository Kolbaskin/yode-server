{{each(r,i) list}}
<div class="adblock">
<a href="/news/${r._id}"><h2>${r.title}</h2>
{{if r.photos && r.photos.length}}<img src="/admin.models.fileOperations:getimage/news/${r._id}/photos/0/preview/" />{{/if}}
<p>${r.shorttext}</p>
</a>
</div>
{{/each}}

{{include 'inc/pages.tpl'}}
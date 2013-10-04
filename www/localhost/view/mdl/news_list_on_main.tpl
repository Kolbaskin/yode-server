{{each(r,i) list}}
<div class="adblock{{if i==0}} color orange{{/if}}{{if i==1}} color blue{{/if}}{{if i==2}} color green{{/if}}">
<a href="/news/${r._id}"><h2>${r.title}</h2>
{{if r.photos && r.photos.length}}<img src="/admin.models.fileOperations:getimage/news/${r._id}/photos/0/preview/" />{{/if}}
<p>${r.shorttext}</p>
</a>
</div>
{{/each}}

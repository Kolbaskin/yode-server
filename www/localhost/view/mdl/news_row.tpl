<h2>${title}</h2>
{{if photos && photos.length}}
<div class="transp text-center"> 
    {{each(r,i) photos}}
    <p><a href="/admin.models.fileOperations:getimage/news/${_id}/photos/${i}/img/.jpeg" class="thickbox" rel="photos"><img src="/admin.models.fileOperations:getimage/news/${_id}/photos/${i}/preview/" /></a></p>
    {{/each}}
</div>
{{/if}}
{{html descript}}
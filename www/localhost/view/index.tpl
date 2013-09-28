<!DOCTYPE HTML>
<html>
<head>
	<title>${metatitle} :: </title>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=IE7">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="keywords" content="${metakeywords}">
	<meta name="description" content="${metadesctiption}">
	<meta name="google" value="notranslate">
	<meta http-equiv="imagetoolbar" content="no">
	

</head>

<body>

{{each(row) BLOCK_1}}
    {{html row.html}}
{{/each}}

</body>
</html>

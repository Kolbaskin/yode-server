<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
    <title>Login window</title>
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=IE7">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" type="text/css" href="/css/login.css" />
    <script type="text/javascript" src="/js/jquery.js"></script>
    <script type="text/javascript" src="/js/jquery.cookie.js"></script>
    <script type="text/javascript" src="/js/login.js"></script>
    </head>
<body>
<center>
<div class="loginWin">
<h2>Login window</h2>
<form onsubmit="return false;">
    <table id="step1">
    
    <tr><td>Login</td><td class="input"><input id="login" value="max" /></td></tr>
    <tr><td>Password</td><td class="input"><input type="password" id="pass" value="111111" /></td></tr>
    <tr><td>Lang</td><td class="input"><select><option value="">English</option><option value="ru">Русский</option></select></td></tr>
    <tr><td></td><td><button id="submit">Enter</button>&nbsp;&nbsp;<!--<button onclick="location='registration.htm'">Registration</button>--></td></tr>
    
    <tr><td></td><td id="error" style="display:none">Error in login or password</td></tr>
    </table>
    
    <table id="step2" style="display:none">

    <tr><td>Session Password</td><td class="input"><input type="password" id="sesspass" /></td></tr>
    <tr><td></td><td><button id="submit2">Enter</button>&nbsp;&nbsp;</td></tr>
    
    <tr><td></td><td id="error" style="display:none">Error in session password</td></tr>
    </table>
</form>
</div>
</center>
</body>
</html>
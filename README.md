Yode-server
===========

[![NPM](https://nodei.co/npm/yode-server.png)](https://nodei.co/npm/yode-server/)

## Install

First, install MongoDB and Memcached and run them. 

Yode-server needs a Node.js 0.10.+

Make a new directory and then:

```
npm install yode-server

npm start yode-server
```

## Usage

The installer will create a directory "www" for yor projects (if you didn't type another). 
There is an examples project in "www/localhost". 

All backend files are located in www/localhost/plugins,
all static files (css, images, browser-js) are in www/localhost/static,
html-templates are in www/localhost/view

You can create separate directory for your project in www. The name of project directory must be same as host name. For example: if your project hostname is www.example.com you must create directory "www/www.example.com"

Command
```
npm start yode-server
```
or
```
node server.js
```
starts all virtual hosts which located in project directory. If you need to start only one of them, do it:

```
node server.js www.example.com
```

### Admin interface

The enterance to the admin panel (don't forget to add the port if it is not 80):

http://localhost/admin/

login: yeti
pass: 111111


### Hello world (easy)

file: www/localhost/plugins/hello.js
```javascript
// the pattern of a yode-module
// object "server" contents connections to mongodb, memcached and has more useful properties 
exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.helloWorld = function(req, callback, auth) {
    callback('Hello World!')
}
```

in the browser :

http://localhost/hello:helloWorld/

### Hello world (MVC)

Model code (www/localhost/plugins/models/hello.js):
```javascript

exports.Plugin = function(server) {
    this.server = server;
}

// as in the previous example but an object has passed to the callback.
exports.Plugin.prototype.getHello = function(req, callback, auth) {
    callback({text: 'Hello World!'})
}

```

View, template code (www/localhost/plugins/view/hello.tpl)
```html
<!-- uses jqtpl engine -->
<h1>${text}</h1>
```

Controller code (www/localhost/plugins/hellomvc.tpl)
```javascript

exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.helloWorld = function(req, callback, auth) {
    
    var me = this
    me.server.getModel('models.hello').getHello(req, function(data, e) {
        this.server.tpl('hello.tpl', data, function(code) {
            callback(code);
        })
    })
}

```


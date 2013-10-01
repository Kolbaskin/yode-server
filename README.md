Yode-server
===========

[![NPM](https://nodei.co/npm/yode-server.png)](https://nodei.co/npm/yode-server/)

## Setup

First, install MongoDB and Memcached and run them. 

Yode-server needs a Node.js 0.10.+

```
mkdir yode
cd yode
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

#### Model code 
www/localhost/plugins/models/hello.js
```javascript

exports.Plugin = function(server) {
    this.server = server;
}

// as in the previous example but an object has passed to the callback.
exports.Plugin.prototype.getHello = function(req, callback, auth) {
    callback({text: 'Hello World!'})
}

```

#### View, template code 
www/localhost/view/hello.tpl
```html
<!-- uses jqtpl engine -->
<h1>${text}</h1>
```

#### Controller code 
www/localhost/plugins/hellomvc.js
```javascript

exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.helloWorld = function(req, callback, auth) {
    
    var me = this
    me.server.getModel('models.hello').getHello(req, function(data, e) {
        me.server.tpl('hello.tpl', data, function(code) {
            callback(code);
        })
    })
}

```

See the result: http://localhost/hellomvc:helloWorld/

Also, you can use the model in an outside apps as REST-service: http://localhost/models.hello:getHello/ 

### "Hello World" on CMS virtual pages 

1. goto admin interface: http://localhost/admin/ (yeti:111111)
2. goto Start -> Site tools -> Pages
3. Press (+) icon
4. Enter page name
5. Select template
5. Press [Add] - button (in right-bottom panel "Page blocks")
6. Enter "hellomvc:helloWorld" to folder "Content type"
7. Save

Now you can see your "Hello World" on the new page (the path is in the second column of pages tree in admin-panel)

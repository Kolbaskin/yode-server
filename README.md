Yode-server
===========

[![NPM](https://nodei.co/npm/yode-server.png)](https://nodei.co/npm/yode-server/)

## Setup

First, install MongoDB and Memcached and run both 

Yode-server also requires node.js version 0.10 and above

```
mkdir yode
cd yode
npm install yode-server
npm start yode-server
```

## Usage

The installer creates ```www``` directory. Or you can choose another name during installation.
This is where your projects to be placed. In ```www/localhost``` you’ll find a sample project.

All backend files are located in ```www/localhost/plugins```,

all static files (css, images, browser-js) are in ```www/localhost/static```,

html-templates are in ```www/localhost/view```

Each new project requires separate directory inside ```www```. The name of project directory must be same as host name. For example: if your project hostname is ```www.example.com``` the path should be ```www/www.example.com```

Command
```
npm start yode-server
```
or
```
node server.js
```
starts all virtual hosts located in project directory. If you need to start only one of them, specify it:

```
node server.js www.example.com
```

### Admin interface

Admin panel default access (don't forget to add the port number in case it's not 80):

```
http://localhost/admin/
login: yeti
pass: 111111
```

### Hello world (easy)

```javascript
// file: www/localhost/plugins/hello.js

// the pattern of a yode-module
// object "server" contents connections to mongodb, memcached and has more useful properties 
exports.Plugin = function(server) {
    this.server = server;
}

exports.Plugin.prototype.helloWorld = function(req, callback, auth) {
    callback('Hello World!')
}
```

in the browser ```http://localhost/hello:helloWorld/```

### Hello world (MVC)

#### Model code 

```javascript
// file: www/localhost/plugins/models/hello.js

exports.Plugin = function(server) {
    this.server = server;
}

// as in the previous example but an object has passed to the callback.
exports.Plugin.prototype.getHello = function(req, callback, auth) {
    callback({text: 'Hello World!'})
}

```

#### View, template code 
```html
<!-- 

file: www/localhost/view/hello.tpl

uses jqtpl engine 

-->
<h1>${text}</h1>
```

#### Controller code 

```javascript
// file: www/localhost/plugins/hellomvc.js

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

See the result: ```http://localhost/hellomvc:helloWorld/```

You can also use the model as REST-service in external apps: ```http://localhost/models.hello:getHello/``` 

### "Hello World" on CMS virtual pages 

1. Log into admin interface: ```http://localhost/admin/``` (yeti:111111)
2. Go to Start -> Site tools -> Pages
3. Click (+) icon
4. Enter page name
5. Select template
5. Click [Add] - button (in right-bottom panel ```Page blocks```)
6. Enter ```hellomvc:helloWorld``` to field ```Content type```
7. Save

Now you can see your "Hello World" on the new page (the path is in the second column of pages tree in admin-panel)

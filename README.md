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

### Hello world examples

file: www/localhost/


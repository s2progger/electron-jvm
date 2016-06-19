# Electron-JVM

This repository contains boilerpate code for an [Electron](http://electron.atom.io/) application that launches and connects to a JVM based web framework.

## Why would you want this?

There are a number of reasons why someone would want to use Electron, but opt not to build their entire application in Node/Javascript. Here are just a few of them:

* You want to make a web application, but don't want to have to get it to work in Internet Explorer 6/7/8 which is the version installed on the corporate computers 
* Electron means you only have to test in Chrome, but youdon't really like or want to use Node.js (In my case connecting to Oracle is much easier with JDBC).
* You've already built a web application in a JVM framework and would like to make it work offline.
* You really like [Vert.x](http://vertx.io)!

Of course there's nothing stopping someone from using something other than Java as this technique should work equaly well with servers built in .NET, Python, Ruby, Go,
or anything else with just a few small tweaks.

## How to get this working

Reading through the comments in *main.js* should provide you with the details, but you will need to update the *apiServerArgs* command with the arguements required
to start your server. By default it runs an executable jar, *api-server/backend-server.jar*. 

The part that will require changes to either you back end server or to the electron start up code is how electron determines what address and port the server is
listening on. By default it expects the following to be writen to **stdio**:

```
API Deployed: http://[address]:[port]
```




'use strict';

// The application name is only shown briefly as electron launches and loads the backend server
const APPLICATION_NAME = 'Electron JVM'

const electron = require('electron');
const windowStateKeeper = require('electron-window-state');
const spawn = require('child_process').spawn;
const exec = require('child_process').execFile;

const app = electron.app;

// By default this will try to use the java version installed on the computer. It's also possible to bundle a JRE
const apiServerCmd = 'java';

// The following arguments are a sample and can be modified to launch whatever java based server you want. All that
// is required is that the server outputs the address and port that it is listening on to stdio once it has started.
// To see what the format of this message needs to be please check the README.
const apiServerArgs = ['-jar', 'api-server/backend-server.jar', '-conf', 'api-server/api-application-conf.prod.json'];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected
let mainWindow;

const apiServerProc = exec(apiServerCmd, apiServerArgs, { cwd: __dirname }, function(error, stdout, stderr) {
    if (error) {
        console.error(error);
        
        app.quit();
        
        return;
    }
});

// This will real all stdio output from the started server and wait to see what port and and address the server 
// is listening on. Once it has the URL, the browser window will load it.
apiServerProc.stdout.on('data', function (data) {
    var message = data.toString();

    if (message.indexOf("API Deployed") >= 0) {
        var url = message.replace("API Deployed: ", "").split(/(\r?\n)/g)[0];

        console.log('API Server [' + apiServerProc.pid + '] running at ' + url);

        // There needs to be a valid route at "/" on the server. If this isn't the case, you can modify the URL below.
        mainWindow.loadURL(url + "/");
    } else {

    }
});

const BrowserWindow = electron.BrowserWindow;


app.on('ready', function() {
    // Set the window dimensions for the first run. Subsequent launches will remember window position and size
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1280,
        defaultHeight: 850
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        autoHideMenuBar: true,
        title: APPLICATION_NAME,
        nodeIntegration: false
    });

    mainWindowState.manage(mainWindow);

    // Modify splash.html if you don't like the default loading screen
    mainWindow.loadURL(`file://${__dirname}/splash.html`);

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

process.on('exit', function() {
    console.log("Shutting down API server");
    apiServerProc.kill();
});
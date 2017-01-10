const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')

// Open external urls in default browser
const open = function (target, appName, callback) {
  var opener;

  if (typeof(appName) === 'function') {
    callback = appName;
    appName = null;
  }

  if (appName)
    opener = 'open -a "' + escape(appName) + '"';
  else
    opener = 'open';

  if (process.env.SUDO_USER)
    opener = 'sudo -u ' + process.env.SUDO_USER + ' ' + opener;

  return exec(opener + ' "' + escape(target) + '"', callback);
}

function escape(s) {
  return s.replace(/"/g, '\\\"');
}

// Module to bind media shortcuts
const globalShortcut = require('electron').globalShortcut

// Works only for OS X now
if (process.platform != 'darwin') {
  dialog.showMessageBox({
    "type": "error",
    "title": "Unsupported Platform",
    "message": "Only for Mac"
  });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    //	logo: path.join(__dirname, 'logo.png'),
  })

  // And load saavn.com
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  var webView = mainWindow.webContents;

  // Open DevTools
  // webView.openDevTools()

  // Bind Media Shortcuts - This wouldn't have been required if the
  // client side code listened to these keys along with KEY_NEXT, KEY_SPACE etc.
  // For now trigger functionality by remapping the keys
  globalShortcut.register('MediaPlayPause', function () {
      webView.send('playpause')
  })

  globalShortcut.register('MediaNextTrack', function () {
      webView.send('next')
  })

  globalShortcut.register('MediaPreviousTrack', function () {
      webView.send('previous')
  })

  //Code to handle like/dislike feature
  globalShortcut.register('F5', function () {
      webView.send('dislike')
  })

  globalShortcut.register('F6', function () {
      webView.send('like')
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // hide the window instead of closing when `⌘ + W` is used
  mainWindow.on('close', function (e) {
    if (mainWindow.forceClose)
      return;

    e.preventDefault();
    mainWindow.hide();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // When quitting, unregister the shortcuts
  globalShortcut.unregisterAll()

  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('before-quit', function () {
  mainWindow.forceClose = true;
});

app.on('activate', function () {
  mainWindow.show();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

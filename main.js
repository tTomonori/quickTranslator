const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipc = electron.ipcMain
const Tray = electron.Tray
const Menu = electron.Menu
const gcut = electron.globalShortcut
const image = electron.nativeImage
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let configWindow
let tray;
let showingEditorWindow;
let mWindowWidth=800;
let mWindowHeight=300;
let mMaxHeight=550;
let mWindowBarSize=22;
let mScreenSize;
app.dock.hide();
// app.dock.setIcon("/Users/tomo/Desktop/game/quickTranslation/icons/dock_icon.png")
// app.dock.setIcon("./icons/dock_icon.png")
function createWindow () {
  let tWindowPositionX=mScreenSize.width-mWindowWidth;
  let tWindowPositionY=mScreenSize.height-mWindowHeight+mWindowBarSize;
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x:tWindowPositionX,
    y:tWindowPositionY,
    width: mWindowWidth,
    height: mWindowHeight,
    resizable: false,
    transparent: true,
    closable:false,
    alwaysOnTop: true,
    fullscreenable: false,
    skipTaskbar: true,
    show:false,
    titleBarStyle: "hiddenInset",
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/public/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  //エディターウィンドウ用
  // tray = new Tray(path.join(__dirname, 'lib' ,'img', 'chat.png'));
  // tray = new Tray(__dirname+"/icon.png");
  // tray = new Tray(__dirname+"/icons/gray_Icon.png");
  tray = new Tray(image.createFromPath(__dirname+"/image/dock_icon.png").resize({width:20,height:20}));
  // tray.on('click',e=>{
  //   changeShowMode();
  // })
  //メニューバークリックメニュー
  var tTrayMenu=[
    { label: "show or hide", click: function(){changeShowMode();} },
    { label: "config", click: function(){createConfigWindow()} },
    { label: "open devtools", click: function(){mainWindow.send("openDivTool")} },
    // { label: "quit", click: function(){app.quit()} },//←終了してくれない
  ]
  tray.setContextMenu(Menu.buildFromTemplate(tTrayMenu));

  // Create the Application's main menu
var template = [{
    label: "Application",
    submenu: [
        { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        { type: "separator" },
        // { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Reload", accelerator: "CmdOrCtrl+R", click: function() {mainWindow.reload();} },
        { label: "ShowOrHide", accelerator: "Cmd+Alt+H", click: function() {} },
        { type: "separator" },
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },

    ]}
];
Menu.setApplicationMenu(Menu.buildFromTemplate(template));

gcut.register("Cmd+Alt+H",changeShowMode);
gcut.register("Cmd+Alt+Down",adjustBottom);
}

//設定ウィンドウ生成
function createConfigWindow(){
  if(configWindow!=null){return;}
  configWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable:false,
    transparent: true,
    alwaysOnTop: true,
    fullscreenable: false,
    skipTaskbar: true,
    titleBarStyle: "hiddenInset",
  })

  // configWindow.webContents.openDevTools()

  configWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/public/config/config.html'),
    protocol: 'file:',
    slashes: true
  }))
  configWindow.on('closed', function () {
    configWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  mScreenSize=electron.screen.getPrimaryDisplay().workAreaSize;
  createWindow();
  //ショートカット
  // gcut.register("CommandOrControl+V",()=>{
  //   if(mainWindow.isFocused())
  //     console.log("f")
  //     return true;
  // })
  // gcut.register("CommandOrControl+A",()=>{
  //   if(mainWindow.isFocused())
  //     console.log("f")
  //     return true;
  // })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipc.on("changeHeight",(e,aHeight)=>{
  // console.log(aHeight)
  changeWindowHeight(aHeight);
})
//ウィンドウの高さ変更
function changeWindowHeight(aHeight){
  // console.log(aHeight)
  if(aHeight>mMaxHeight) aHeight=mMaxHeight;
  mainWindow.setMinimumSize(mWindowWidth,aHeight+mWindowBarSize);
  mainWindow.setMaximumSize(mWindowWidth,aHeight+mWindowBarSize);
  mainWindow.setSize(mWindowWidth,aHeight+mWindowBarSize);
  mWindowHeight=aHeight;
}

//ウィンドウの位置を合わせる
function adjustBottom(){
  let tPosition=mainWindow.getPosition();
  mainWindow.setPosition(tPosition[0],mScreenSize.height-mWindowHeight);
}

//ウィンドウを出す,しまう
function changeShowMode(){
  if(showingEditorWindow){
    mainWindow.hide();
  }
  else {
    mainWindow.show();
    // mainWindow.focus()
    mainWindow.webContents.send("focus");
  }
  showingEditorWindow=!showingEditorWindow;
}

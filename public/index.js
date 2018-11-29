var webview = document.getElementById("foo");
var gDb=new nedb({
	filename: __dirname+"/../database/database.db",
	autoload:true
})
const ipc=require("electron").ipcRenderer;
webview.addEventListener('dom-ready', () => {
	webview.send("fiddle");
	// webview.openDevTools();

	gDb.find({},(e,doc)=>{
		//設定したstyle適用
		for(var tData of doc){
			switch (tData._id) {
				case "libertyStyle":
					webview.send("addStyle",tData.style)
					break;
				case "coverStyle":
					webview.send("addStyle","#myFilterCover{"+tData.style+"}")
					break;
				case "imgStyle":
					webview.send("addStyle","#myBackgroundImg{"+tData.style+"}")
					break;
				case "imgData":
					webview.send("setBackImage",tData.style)
					break;
				default:
			}
		}
	})
});

//テキストボックスにfocus
ipc.on("focus",()=>{
	webview.focus();
	webview.send("focus");
})
//ディベロッパーツールを開く
ipc.on("openDivTool",()=>{
	webview.openDevTools()
})

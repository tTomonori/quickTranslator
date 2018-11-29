var electron = require("electron");
var ipc = electron.ipcRenderer;

var gCover
var gImg

ipc.on("fiddle",()=>{
	let tStyle=document.createElement("style")
	//全タグの背景色を透明に
	tStyle.textContent=`\
	body *{\
		background-color:rgba(0,0,0,0) !important;\
	}\
	body *:before{\
		background-color:rgba(0,0,0,0) !important;\
	}\
	`
	document.getElementsByTagName("head")[0].appendChild(tStyle)

	//背景画像の色合いを調整するタグ
	gCover=document.createElement("div")
	gCover.id="myFilterCover"
	// gCover.style.backgroundColor="rgba(0,0,0,0.7)"
	gCover.style.width="100vw"
	gCover.style.height="100vh"
	gCover.style.position="fixed"
	gCover.style.top=0
	gCover.style.left=0
	gCover.style.zIndex="-10"
	gCover.style.pointerEvents="none"
	document.getElementsByTagName("html")[0].appendChild(gCover)
	//背景画像のタグ
	gImg=document.createElement("img")
	gImg.id="myBackgroundImg"
	// gImg.src=gImageBase64
	gImg.style.width="100vw"
	gImg.style.position="fixed"
	gImg.style.top=0
	gImg.style.left=0
	gImg.style.zIndex="-11"
	gCover.style.pointerEvents="none"
	document.getElementsByTagName("html")[0].appendChild(gImg)
})
//styleタグ追加
ipc.on("addStyle",(e,aStyle)=>{
	let tStyle=document.createElement("style")
	tStyle.textContent=aStyle
	document.getElementsByTagName("head")[0].appendChild(tStyle)
})
//背景画像設定
ipc.on("setBackImage",(e,aBase)=>{
	gImg.src=aBase
})
//テキストをフォーカス
ipc.on("focus",()=>{
	document.getElementById("source").focus()
  // console.log(document.getElementById("source"));
})

// let gImageBase64

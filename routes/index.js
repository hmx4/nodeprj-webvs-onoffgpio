// javascript和C一樣使用//表示單行註解，使用/* */表示多行註解
// 載入express模組 
var express = require('express');
/* 使用express.Router類別來建立可裝載的模組路由的物件
   路由是指應用程式端點 (URI) 的定義，以及應用程式如何回應用戶端的要求。*/
var router = express.Router();

// 載入request模組
var request = require('request');

// 取得並顯示Server端的ip，請記得在專案中安裝underscore模組: npm install underscore
var sip = require('underscore')
    .chain(require('os').networkInterfaces())
    .values()
    .flatten()
    .find({family: 'IPv4', internal: false})
    .value()
    .address;
console.log('Server IP='+sip);

// 建立Web Video Streaming的狀態儲存檔wvs_status.txt(初始值為off)
fs = require('fs');
fs.writeFileSync('./wvs-status.txt', 'off');
console.log('The wvs-status.txt is created!');

// 建立Web Video Streaming的pid儲存檔wvs_pid.txt(初始值為0)
fs.writeFileSync('./wvs-pid.txt', '0');
console.log('The wvs-pid.txt is created!');

//**************************************************************************
//************ 根據Client端送來之請求命令顯示相對應網頁之方法 ************
//**************************************************************************
// 建立(附加)一個客戶端對應用程式提出 GET / 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他GET不同路徑的路由處理方法
// 顯示首頁
router.get('/', function(req, res) {
	res.render('index');
});

// 顯示遠端監控服務操作介面
router.get('/webcontrol8leds', function(req, res) {

	// 讓遠端監控網頁載入時，就顯示影像串流
	// 讀取Web Video Streaming的狀態
	fs=require('fs');
    wvs_status = fs.readFileSync('./wvs-status.txt','utf8'); 
	
    // 若影像串流關閉著，則啟動影像串流
	if(wvs_status=='off')
	{
		exec = require('child_process').exec;
		web_vs = exec('python3 ./web-vs-server.py', shell=false);
		wvs_pid = web_vs.pid+1;
		console.log('pid='+wvs_pid);
		
		// 將pid of Web Video Streaming存入檔案中
		fs = require('fs');
		fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
		
		// 將on存入Web Video Streaming的狀態檔中
		fs = require('fs');
		fs.writeFileSync('./wvs-status.txt', 'on'); 
		console.log('The pid and status of web video streaming is saved!');
	}
	// 然後顯示遠端監控網頁
	res.render('webcontrol8leds');
});

//**************************************************************************************************
//************************* 啟動與關閉即時網頁視訊串流之服務方法 ***********************************
//**************************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /web_video_streaming/:cmd 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/web_video_streaming/:cmd', function(req, res){
	cmd=req.params.cmd;
	if(cmd=='on')
	{
		// 讀取Web Video Streaming的狀態
		fs=require('fs');
		wvs_status = fs.readFileSync('./wvs-status.txt','utf8'); 
		
		//
		if(wvs_status=='off')
		{
			exec = require('child_process').exec;
			web_vs = exec('python3 ./web-vs-server.py', shell=false);
			wvs_pid = web_vs.pid+1;
			console.log('pid='+wvs_pid);
			
			// 將pid of Web Video Streaming存入檔案中
			fs = require('fs');
			fs.writeFileSync('./wvs-pid.txt', wvs_pid); 
			
			// 將on存入Web Video Streaming的狀態檔中
			fs = require('fs');
			fs.writeFileSync('./wvs-status.txt', 'on'); 
			console.log('The pid and status of web video streaming is saved!');
		}
		// 回傳訊息給網頁端
		message={'message':'網頁即時影像串流已經開啟!'};
		res.set({
			'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
		});
		res.send(message);
	}
  
	if(cmd=='off') 
	{
		// 讀取Web Video Streaming的狀態
		fs=require('fs');
		wvs_status=fs.readFileSync('./wvs-status.txt','utf8');
		
		//
		if(wvs_status=='on')
		{
			// 讀取pid of Web Video Streaming
			fs=require('fs');
			wvs_pid=fs.readFileSync('./wvs-pid.txt','utf8');
			
			// 透過pid關閉(殺掉)Web Video Streaming
			exec = require('child_process').exec;
			exec('sudo kill ' + wvs_pid);
			console.log('The ' + wvs_pid + ' process is killed!');
			
			// 將off存入Web Video Streaming的狀態檔中
			fs = require('fs');
			fs.writeFileSync('./wvs-status.txt', 'off');
		}
			
		// 回傳訊息給網頁端
		message={'message':'網頁即時影像串流已經關閉!'};
		res.set({
			'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
		});
		res.send(message);
	}
});

//********************************************************************************************
//********************************* 控制LED之服務方法 ****************************************
//********************************************************************************************
// 建立(附加)一個客戶端對應用程式提出 POST /control8leds/:cmd 方法時的路由處理方法(匿名式函數)
// 比照此方式，你可以建立其他POST不同路徑的路由處理方法
router.post('/control8leds/:cmd', function(req, res){
	cmd=req.params.cmd;
	console.log(cmd);

	// 引用相同目錄(routes)下的control-8leds.js
	var control = require("./control-8leds.js");

	flag = 1;
	if(cmd=="1") 
		result = {"message":"奇數LED燈正在閃爍!"};
	else if (cmd=="2") 
		result = {"message":"已經關閉奇數LED燈!"};
	else if (cmd=="3") 
		result = {"message":"偶數LED燈正在閃爍!"};
	else if (cmd=="4") 
		result = {"message":"已經關閉偶數LED燈!"};
	else if (cmd=="5") 
		result = {"message":"LED正在執行跑馬燈!"};
	else if (cmd=="6")
		result = {"message":"已經關閉LED燈!"};
	else if (cmd=="7") {
		var dhtsensor = require('node-dht-sensor');
		dhtsensor.initialize(22, 12); //22 is for DHT22, 12 is the GPIO12 we connect to on the Pi
		var readout = dhtsensor.read();  // read the sensor values
		temperature = readout.temperature.toFixed(1); // read the temperaure value
		console.log(temperature);
		humidity = readout.humidity.toFixed(1);       // read the humidity value
		console.log(humidity);
		result = {"temperature":temperature, "humidity":humidity};
	}
	else {
		flag = 0;
		result = {"message":"無效的命令!"};
	}
	res.set({
	  'charset': 'utf-8'  // 設定回傳結果之編碼為utf-8，網頁端才能正常顯示中文
	});
	res.send(result);    // 將JSON格式訊息回傳給前端網頁

  // cmd 為1~6時執行控制LED燈函數
	if(flag==1 && cmd !="7" )	{
		// 呼叫control_8leds方法(輸入命令cmd)
		control.control_8leds(cmd); 
	}
});

module.exports = router;
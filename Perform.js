$(document).ready(function(){
	
	// 現在時間 
	function now__Time(){
		var time = new Date();
		var year = time.getFullYear();
		var mon  = time.getMonth()+1;
		var day  = time.getDate();
			if( day < 10 ){ day = "0" + day };
		var hr   = time.getHours();
		var min  = time.getMinutes();
		$(".nowTime .now_time").html( year+"-"+mon+"-"+day+" "+hr+":"+min);
	}
	
	
	// 顯示濃度Data + 品質 + 圖示
	function displayData(set,unit){
		
		// 圖片連結
		var img_url = "Resource/level_";	
		// 各空氣品質標準
		// 參考網站-空氣品質監測網: https://airtw.epa.gov.tw/CHT/Information/Standard/AirQualityIndicator.aspx
		var level = {						
				"PM2.5":{
					danger:54,
					notice:35,
					normal:15
				},
				PM10:{
					danger:255,
					notice:125,
					normal:55
				},
				SO2:{
					danger:185,
					notice:75,
					normal:35
				},
				NO2:{
					danger:360,
					notice:100,
					normal:53
				},
				CO:{
					danger:12,
					notice:9,
					normal:4
				},
				O3:{
					danger:85,
					notice:70,
					normal:54
				}
			}
		
		// 點擊事件
		$(".dataDisplay .data_type ul li").click(function(){
			
			// 顯示濃度
			// 若 $(this).text() == "x", 則代表該筆無資料
			if( set[$(this).text()] == "x" ){
				$("#concentration_val").html("無資料");
				$("#concentration_unit").html(" ");
			}else{
				$("#concentration_val").html(set[$(this).text()]);
				$("#concentration_unit").html(unit[$(this).text()]);
			}
			
			// 顯示品質 + 圖示
			if( set[$(this).text()] == "x" ){
				$("#quality_val").html("無資料");
				$("#img_level").attr("src", img_url + "5" + ".png");
			}else{
				/*
				空氣品質標準:
				
				--------------
				
					危險
					
				--- danger ---
					
					注意
					
				--- notice ---
				
					一般
					
				--- normal ---
				
					良好
					
				----- 0 -----
				
				*/
				if( set[$(this).text()] < level[$(this).text()]["normal"] ){
					$("#quality_val").html("良好");
					$("#img_level").attr("src", img_url + "1" + ".png");
				}else if( set[$(this).text()] < level[$(this).text()]["notice"] ){
					$("#quality_val").html("一般");
					$("#img_level").attr("src", img_url + "2" + ".png");
				}else if( set[$(this).text()] < level[$(this).text()]["danger"] ){
					$("#quality_val").html("注意");
					$("#img_level").attr("src", img_url + "3" + ".png");
				}else if( set[$(this).text()] >= level[$(this).text()]["danger"] ){
					$("#quality_val").html("危險");
					$("#img_level").attr("src", img_url + "4" + ".png");
				}
			}
			
			// 按鈕樣式改變
			$(".dataDisplay .data_type ul li").removeClass("show");
			$(this).addClass("show");
		});
		
		// 初始: 點擊 PM2.5
		$(".dataDisplay .data_type ul li").first().click();
		
	};
	
	// JSON Data 分類
	function analyzeData(Data){
		
		// 更新資料時間
		var checkTimeData = Data.records[0]["MonitorDate"];
		// 資料數值
		var dataSet = {
			"PM2.5":"",
			PM10:"",
			SO2:"",
			NO2:"",
			CO:"",
			O3:"",
		};
		// 資料單位
		var dataunit = {
			"PM2.5":"",
			PM10:"",
			SO2:"",
			NO2:"",
			CO:"",
			O3:"",
		};
		
		// 存入各筆資料 & 單位
		for(let i=0;i<=5;i++){
			// 逐一查看各筆資料: console.log("Data",Data.records[i]);
			if(Data.records[i].ItemEngName == "PM2.5"){
				dataSet["PM2.5"] = Data.records[i].Concentration;
				dataunit["PM2.5"] = Data.records[i].ItemUnit;
			}else if(Data.records[i].ItemEngName == "PM10"){
				dataSet["PM10"] = Data.records[i].Concentration;
				dataunit["PM10"] = Data.records[i].ItemUnit;
			}else if(Data.records[i].ItemEngName == "SO2"){
				dataSet["SO2"] = Data.records[i].Concentration;
				dataunit["SO2"] = Data.records[i].ItemUnit;
			}else if(Data.records[i].ItemEngName == "NO2"){
				dataSet["NO2"] = Data.records[i].Concentration;
				dataunit["NO2"] = Data.records[i].ItemUnit;
			}else if(Data.records[i].ItemEngName == "CO"){
				dataSet["CO"] = Data.records[i].Concentration;
				dataunit["CO"] = Data.records[i].ItemUnit;
			}else if(Data.records[i].ItemEngName == "O3"){
				dataSet["O3"] = Data.records[i].Concentration;
				dataunit["O3"] = Data.records[i].ItemUnit;
			}
		}
		
		displayData(dataSet,dataunit);
		
		// 顯示更新資料時間
		$(".checkTime .check_time").text(checkTimeData.substring(0,checkTimeData.length-3));
	}
	
	// 取得即時 Data
	function getData(){
		
		// 公開資料JSON: https://data.epa.gov.tw/api/v1/aqx_p_212?offset=0&limit=6&api_key=eba411ad-cd50-4daa-9220-4afc4b1cdbcb
		var url = "https://data.epa.gov.tw/api/v1/aqx_p_212?offset=0&limit=6&api_key=eba411ad-cd50-4daa-9220-4afc4b1cdbcb";
		
		var HsinchuRequ = new XMLHttpRequest();
		HsinchuRequ.open("GET",url,true);
		HsinchuRequ.send();
		HsinchuRequ.onreadystatechange = function(){
			if(HsinchuRequ.readyState == 4){
				if(HsinchuRequ.status == 200){
					var HsinchuData = JSON.parse(HsinchuRequ.response);
					analyzeData(HsinchuData);
				}
			}
		}
	}
	
	getData();
	now__Time()
});
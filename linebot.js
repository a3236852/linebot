// Maded By Chun Shawn in jcshawn.com
// Contact : contact@jcshawn.com
// 當 LINE BOT 接收到訊息，會自動執行 doPost

function doPost(e) {
  // LINE Messenging API Token
  var CHANNEL_ACCESS_TOKEN = '';	//請放自己的TOKEN
  // 以 JSON 格式解析 User 端傳來的 e 資料
    var msg = JSON.parse(e.postData.contents);
  // 從接收到的訊息中取出 replyToken 和發送的訊息文字，詳情請看 LINE 官方 API 說明文件

  const replyToken = msg.events[0].replyToken; // 回覆的 token
  const userMessage = msg.events[0].message.text; // 抓取使用者傳的訊息內容
  const user_id = msg.events[0].source.userId; // 抓取使用者的 ID，等等用來查詢使用者的名稱
  const event_type = msg.events[0].source.type; // 分辨是個人聊天室還是群組，等等會用到

  var sheet_url = '';				//請放自己的Excel
  // 工作表名稱
  var sheet_name = 'reserve';
  var sheet_name2 = 'count';
  var SpreadSheet = SpreadsheetApp.openByUrl(sheet_url);
  var reserve_list = SpreadSheet.getSheetByName(sheet_name);
  var reserve_list2 = SpreadSheet.getSheetByName(sheet_name2);
  var current_list_row2 = reserve_list2.getLastRow();
  var current_list_row = reserve_list.getLastRow();
  var current_list_column = reserve_list.getLastColumn();
  var reply_message = [];
  var StringContact ="";
  var GetRepeat=0;
  var GetCount=0;
  var oldname='';
  var name='';
  var ready_namelist='';
  
  try {
    var groupid = msg.events[0].source.groupId;
  }
  catch {
    console.log("wrong");

  }

  switch (event_type) {
    case "user":
      var nameurl = "https://api.line.me/v2/bot/profile/" + user_id;
      break;
    case "group":
      var nameurl = "https://api.line.me/v2/bot/group/" + groupid + "/member/" + user_id;
      break;

  }



  try {
    //  呼叫 LINE User Info API，以 user ID 取得該帳號的使用者名稱
    var response = UrlFetchApp.fetch(nameurl, {
      "method": "GET",
      "headers": {
        "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
        "Content-Type": "application/json"
      },
    });

    var namedata = JSON.parse(response);
    var reserve_name = namedata.displayName;
  }

  catch {
    reserve_name = "not avaliable";
  }



  var usermsgArray = userMessage.split(" ");      //用空格拆分使用者輸入內容
  if(usermsgArray[0].length==1){                  //避免User打錯
      usermsgArray.splice(0, 1);                  //在+後面多了空格 刪除
  }
  if (userMessage == "開始") {
    reserve_list.clear();
    reserve_list2.clear();  
  }
  else if (userMessage.substring(0, 1) == "+") {
    var multi = userMessage.split("\n+");        									 //一次打多筆拆換行符號
    for(a=0;a<multi.length;a++){
      var multispace = multi[a].split(" ");
      multispace[0] = multispace[0].replace("+", "");                                //本來是+珍珠奶茶 = 珍珠奶茶
      reserve_list.getRange(current_list_row + 1, 1).setValue(reserve_name);         //第1格先輸入使用者名字
      for (var i = 0; i < multispace.length; i++) {
        reserve_list.getRange(current_list_row + 1, i + 2).setValue(multispace[i]);//從第2格將使用者輸入的東西寫入Excel
      }
      current_list_row++;
      // reply_messgae 為要回傳給 LINE 伺服器的內容，JSON 格式，詳情可看 LINE 官方 API 說明
      ready_namelist += "已記錄"+" "+reserve_name+" "+multispace[0]+"\n";
    }
  }
  else if (userMessage.substring(0, 1) == "-") {
    usermsgArray[0] = usermsgArray[0].replace("-", "")
    for (var i = 1; i <= current_list_row; i++) {
      if (reserve_name == reserve_list.getRange(i, 1).getValue() && reserve_list.getRange(i, 2).getValue() == usermsgArray[0]) {  //當使用者名稱吻合+輸入品項吻合 刪掉一筆
        reserve_list.deleteRow(i);     //刪除此列
        ready_namelist = usermsgArray[0]+"已刪除";
         break;
      }
    }
  }
  else if (userMessage.substring(0, 1) == "%") {
    usermsgArray[0] = usermsgArray[0].replace("%", "")
    //var usermsgArray = userMessage.split(" ");
    for (var i = 1; i <= current_list_row; i++) {
      if (reserve_name == reserve_list.getRange(i, 1).getValue() && reserve_list.getRange(i, 2).getValue() == usermsgArray[0]) { //當使用者名稱吻合+輸入品項吻合 刪掉一筆
        reserve_list.deleteRow(i);    //刪除此列
         break;
      }
    }
    current_list_row = reserve_list.getLastRow();  //因前面刪除,需重新抓取每一行的row
    reserve_list.getRange(current_list_row+1, 1).setValue(reserve_name);  //重新寫入資料
    for (var j = 1; j < usermsgArray.length; j++) {
        reserve_list.getRange(current_list_row+1, j + 1).setValue(usermsgArray[j]);
    }
    ready_namelist = usermsgArray[0]+"已修改為"+usermsgArray[1];
  }

  else if (userMessage == "[結單]") {
    reserve_list2.clear();  //先清除舊結單資料
    var ready_namelist = "[ 總結 ]\n";
    for (var x = 1; x <= current_list_row; x++) {
      current_list_column = reserve_list.getLastColumn();   //重新抓取每一行的column
      for (var j = 2; j <= current_list_column; j++) {      //名字不抓 只抓品項後面
        name = reserve_list.getRange(x, 1).getValue();
        ready_namelist = ready_namelist + reserve_list.getRange(x, j).getValue() + " ";
        StringContact=StringContact+reserve_list.getRange(x, j).getValue()+" ";

      }
      ready_namelist = ready_namelist+name + "\n";

      GetRepeat=0;    //初始值
      current_list_row2 = reserve_list2.getLastRow(); //取得總計Excel2行數
      for (var k = 1; k <= current_list_row2; k++) {
        if(reserve_list2.getRange(k, 1).getValue()==StringContact){         //如果有重複的值
          GetCount = parseFloat(reserve_list2.getRange(k, 2).getValue())+1; //取出值原本再+1
          reserve_list2.getRange(k, 2).setValue(GetCount);                  //重新寫入Excel
          oldname = reserve_list2.getRange(k, 3).getValue();                //取出原本名字
          reserve_list2.getRange(k, 3).setValue(oldname+';'+name);          //加上新的名字
          GetRepeat = 1;  
          break;                                                            //找到就不跑了
        }

      }
      if(GetRepeat==0){ //第一次資料新增OR無記錄
          reserve_list2.getRange(current_list_row2+1, 1).setValue(StringContact);
          reserve_list2.getRange(current_list_row2+1, 2).setValue("1");
          reserve_list2.getRange(current_list_row2+1, 3 ).setValue(name);
      }
      StringContact = ""; //清空

    }
  }
  else if(userMessage == "[查詢]"){
    var ready_namelist = "[ 查詢"+reserve_name+"紀錄 ]\n";
    var num = 0;
    for (var x = 1; x <= current_list_row; x++) {
      name = reserve_list.getRange(x, 1).getValue();
      if(name==reserve_name){
        for (var j = 2; j <= current_list_column; j++) {     
          ready_namelist = ready_namelist + reserve_list.getRange(x, j).getValue() + " ";
        }
        ready_namelist = ready_namelist+ " \n";
        num++;
      }
    }
    if(num==0){
      ready_namelist = "無資料";
    }
  }
  else {
    ready_namelist = "";
  }

  if(ready_namelist!=""){
    reply_message = [
      {
        "type": "text",
        "text": ready_namelist
      }]
    //回傳 JSON 給 LINE 並傳送給使用者
    var url = 'https://api.line.me/v2/bot/message/reply';
    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': reply_message,
      }),
    });
  }

}

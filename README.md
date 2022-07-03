# linebot
記錄飲料機器人

## 起源
LINE 群組訂飲料時，大家要的飲料要一個一個複製到Excel上，中間還會插聊天對話，手動紀錄很耗時
加入「LINE 機器人」自動紀錄使用者到 Google 試算表，並最後自動統計資料

### 2022/07/03新增指令
+ 查詢自己的紀錄:[查詢]
+ 新增:+ 可多筆(使用換行符號拆分) 
範例:
+珍珠紅茶 無糖微冰  
+珍珠綠茶 無糖微冰

## 語法
+ 清空Excel資料:開始  
+ 新增:+飲料 甜度 冰量  
+ 刪除:-飲料  
+ 修改:%舊飲料 新飲料 甜度 冰量 
+ 統計資料:[結單] 
+ 查詢自己的紀錄:[查詢]    
範例:+珍珠紅茶 無糖微冰 
+珍珠綠茶 無糖微冰  
可多筆新增(使用換行符號拆分) 

![test](https://user-images.githubusercontent.com/25762233/171980708-fae6555a-1086-4570-892b-c065b5c2f3ff.png)

![Timage](https://user-images.githubusercontent.com/25762233/171980637-9df27a24-d360-44f7-87ab-bcb2aaffaebc.png)


### 設定關鍵字
將使用者傳送的訊息文字變數設定為 "userMessage"，判斷 userMessage 中的字利用IF ELSE下去寫功能。

我需要判斷的關鍵字有四個：

+ "開始"->清空Excel資料 
+ "+" >新增飲料  
+ "-" >刪除飲料  
+ "%" >修改飲料  
+ "[結單]" >統計資料  
透過使用者第一個字判斷該進哪一個if  
用空格把使用者傳的資料拆成陣列 
陣列的值再一格一格回傳Excel  
![image](https://user-images.githubusercontent.com/25762233/171981411-863527c2-26de-4135-b1ae-4996cae98ec5.png)    
### 結單
會重新跑原有資料,記錄到第2個頁籤 
第一次出現的飲料會記錄1  
若後面出現相同的品項(包含甜度冰量也一樣)的資料 會+1  
![image](https://user-images.githubusercontent.com/25762233/171983761-70b70cf2-8fec-417a-aaf6-5192c72a19b1.png)   
資料回傳到小幫手  
![image](https://user-images.githubusercontent.com/25762233/171985886-58ff5a95-8a07-4d06-a897-5d4d90ed842a.png) 
![image](https://user-images.githubusercontent.com/25762233/171984093-f91343eb-005b-4c7d-91b0-845a3019a05e.png)

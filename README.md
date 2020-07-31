Ionic HTTP Demo
===

ionic http 範例

Setup
---

* 將專案透過 git clone 下載、或是直接下載 zip 壓縮檔
* 在專案根目錄中執行 `npm install` 將所需要的套件安裝起來
* 接著透過 `ionic serve` 即可觀看執行結果

step by step
---

P.S. 可以透過 git graph (https://gitlab.com/cocoing.info/ionic-http-demo/-/network/master) 來查看詳細內容

1. 在 AppModule 裡面，引入 HttpClientModule
2. 在 constructor 裡面注入 HttpClient
3. 撰寫呼叫 api 的程式碼
4. 過程中如果發生錯誤，需要另外進行的錯誤處
5. 將資料顯示到畫面上

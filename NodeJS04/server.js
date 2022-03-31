/* 使用最原始的方法創建服務器，使用 NodeJS 自帶的 HTTP Module(模塊)，
   - 要使用 HTTP Module 需要先將它導入，可以用 require函數 導入這個 HTTP Module(模塊)
*/

// 1. 導入 HTTP Module(模塊)
// 一般 http object 在程序運行的時候不會改變，所以我們可以用 constant 去儲存這個 http object
const http = require("http");
// 要讀取服務器的文件，我們需要先導入 fs模塊 （fs 是 file system 的縮寫）
const fs = require("fs"); // 導入 fs模塊 後，就可以使用 fs.readFile函數 讀取HTML文件

const port = 3000;
const ip = "127.0.0.1"; // 該地址指向我的電腦，也就是 本機IP，所以訪問該 IP地址，就能訪問到剛剛創建的 NodeJS服務器



// 先創建一個 sendResponse函數，用來統一讀取和發送 HTML源代碼
const sendResponse = (filename, statusCode, response) => {
   /* sendResponse()函數，需要三個參數
      - 第一個參數是：文件名，
      - 第二個參數是：返回給用戶的狀態碼，
      - 第三個參數是：response object
   */
   
    /* readFile的回調函數有兩個參數，第一個是 error，第二個是 data，
      - 如果成功讀取文件，error值是undefined，data會被賦予文件內容
      - 而在讀取文件時報錯，error就會賦予報錯信息
    */
      fs.readFile(`./html/${filename}`, (error, data) => { // . 點號代表當前目錄，也就是 NodeJS04 文件夾
         // 使用 if else 來判斷 readFile 是否成功讀取文件
         if (error) { // 一般在 NodeJS 裡都會先判斷程序有沒有報錯，因為如果 readFile出現錯誤，可以被優先處理，如果報錯我們可以將返回的狀態碼設置成 500
            response.statusCode = 500;
            response.setHeader("Content-Type", "text/plain");
            response.end("Sorry, Internal Error");
         } else {
            response.statusCode = statusCode; // 該 statusCode 是從參數得來 - const sendResponse = (filename, statusCode, response) => {}
            response.setHeader("Content-Type", "text/html"); // text/html 代表服務器會發送 HTML源代碼
            response.end(data); // 用 end函數 發送讀取的data
         }
      }); 
      // readFile()函數，需要提供兩個參數，第一個是文件名，第二個是 回調函數 - 該回調函數會在成功讀取文件後被調用，文件名可以從 filename參數獲得
      // readFile 需要我們提供文件的路徑，不能只提供文件名
};

// 請求頁面
// 2. 用 HTTP Module(模塊) 創建服務器
// 使用 http object 裡的 createServer函數 創建服務器
const server = http.createServer((request, response) => { // request = 請求 object，response = 響應object - 3. 從服務器植入一個請求監聽器，專門用來收集前端發過來的請求
   //console.log(request.url, request.method); // 可以返回請求頁面的 url
   // 搭配使用 request.url 和 request.method 就可以在 NodeJS裡得到用戶請求的頁面 和 請求的方法

   // 把 request.method 和 request.url 賦予變量，方便我們調用
   const method = request.method;
   let url = request.url; // 使用 let 是可以重設這個 url變量

   // 如果是 GET請求，再插入一個 if else判斷語句，這是用來判斷用戶是訪問主頁 about.html 還是 訪問其他的頁面
   // 調用 sendResponse函數
   // 如果用戶訪問的既不是主頁，也不是 about.html，NodeJS就返回 404，告訴用戶訪問的頁面不存在
   if (method === "GET") {
      // 獲取 GET請求 參數的代碼我們在這裡輸入，因為它是屬於 GET方法 的範疇
      const requestUrl = new URL(url, `http://${ip}:${port}`); 
      //console.log(requestUrl);
      //console.log(requestURL.searchParams.get("lang"));
      url = requestUrl.pathname;
      const lang = requestUrl.searchParams.get("lang");
      let selector; // 用來保存語言字符串

      if ( lang === null || lang === "en" ) { // 如果在地址欄裡不提供 lang請求參數，lang值是null，這就可以用來設置默認語言
         selector = "";
      } else if (lang === "zh") {
         selector = "-zh";
      } else {
         selector = "";
      }


      /* URL object 需要提供兩個參數，
         - 第一個參數是：當前訪問的頁面，這個數據可以從 url變量 獲取 - const url = request.url;
         - 第二個參數是：基本URL - 指的是 http，127.0.0.1:3000，而基本URL可以從 IP 和 PORT常量獲得
      */
      if (url === "/") { 
         sendResponse(`index${selector}.html`, 200, response);  // 當 selector 是空字符串，文件名就等於 index.html，如果 selector 是 zh，文件名就會變成 index-zh.html
      } else if (url === "/about.html") { 
         sendResponse(`about${selector}.html`, 200, response);
      } else {
         sendResponse(`404${selector}.html`, 404, response);
      }
   } else {

   }
}); 
// 根據請求URL，去讀取對應的 HTML源代碼，然後把這些源代碼通過 response object 裡 end()函數，發給用戶的瀏覽器
//response.end("Hello From NodeJS Server "); // 4. 通過 response.end函數把字符串返回到前端
// createServer函數會返回 server object，所以我們需要將返回的 server object 賦予一個 constant

/* 設置服務器在收到請求的時候該怎麼響應？我們需要把一個請求監聽器植入到剛創建的服務器裡，而我們應該怎麼定義和植入這個請求監聽器呢？
   - 所謂的監聽器就是一個函數， 監聽器(Listener) = 函數(Function)
   - 當該函數收到請求後就會開始處理請求，請求處理完畢，就會把處理好的信息返回到前端。 
   - 而要植入請求監聽器，我們直接在 const server = http.createServer(() => {}); 添加一個函數, 而該函數裡面有兩個參數，第一個是 request，第二個是 response
   - 該監聽器在每次收到請求的時候都會被執行，
   - 我們能從 request object 裡獲取從前端發過來的請求信息，包括：請求方法，是 GET請求，還是 POST請求，或者其他的 請求頭部信息，和 請求內容 等等。
   - response object 裡的函數是專門用來處理即將要反饋給前端的信息。例如：可以用 response.end()函數，從後端發送信息到前端，
   - 或者用 response.setHeader()函數 設置頭部信息
*/


/**
 * 5. 要開始監聽來自前端的請求，可以使用 server object 裡的 listen函數
 */


server.listen(port, ip, () => {
    console.log(`Server is running at http://${ip}:${port}`); // ip 和 port變量 需要用特殊符號包起來，就能輸出它們的值，而不是 ip 和 port字面
}); 
/* 在小括號裡面添加 3個參數，
   - 第一個參數是端口 (port)
   - 第二個參數是服務器的 IP地址，也就是你電腦的 IP地址
   - 第三個參數是 回調函數(call back)，該函數會在服務器開始監聽請求的時候被調用，一般該回調函數會用來顯示服務器已經開始運行的一些信息，讓我們知道服務器是否開始運行了！
*/


// NodeJS 更新代碼後，必須重啟服務器才能看到更新。
// Javascript 更新完代碼，直接刷新頁面就可以看到更新後的內容。

/* HTTP: HyperText Transfer Protocol（超文本傳輸協議） 的縮寫 - 規範了客戶端和後端服務器在請求響應的週期做些什麼
   - 包括：在傳輸數據前，客戶端和服務器必須先建立一個 TCP連結，才可以互相交換信息
   - 還有客戶端在發送請求的時候，必須依照 HTTP 協議裡請求各式，否則會造成服務器沒辦法識別客戶端的請求
   - HTTP協議是幫助我們標準化客戶端和後端服務器的數據交換流程，讓任何的瀏覽器和後端服務器，在它們想進行無障礙數據交換，就必須根據 HTTP協議裡的規範進行開發。
*/

/**
 * 創建服務器的 5大步驟!!!
 * 1. 導入 HTTP Module(模塊)
 * 2. 用 HTTP Module(模塊) 創建服務器 - 使用 http object 裡的 createServer函數 創建服務器
 * 3. 從服務器植入一個請求監聽器，專門用來收集前端發過來的請求 - request = 請求 object，response = 響應object 
 * 4. 通過 response.end函數把字符串返回到前端
 * 5. 要開始監聽來自前端的請求，可以使用 server object 裡的 listen函數
 */
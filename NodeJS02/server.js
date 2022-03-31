/* 使用最原始的方法創建服務器，使用 NodeJS 自帶的 HTTP Module(模塊)，
   - 要使用 HTTP Module 需要先將它導入，可以用 require函數 導入這個 HTTP Module(模塊)
*/

// 1. 導入 HTTP Module(模塊)
// 一般 http object 在程序運行的時候不會改變，所以我們可以用 const 去儲存這個 http object
const http = require("http");


// 2. 用 HTTP Module(模塊) 創建服務器
// 使用 http object 裡的 createServer函數 創建服務器
const server = http.createServer((request, response) => { // request = 請求 object，response = 響應object - 3. 從服務器植入一個請求監聽器，專門用來收集前端發過來的請求
    response.end("Hello From NodeJS Server "); // 4. 通過 response.end函數把字符串返回到前端
}); // createServer函數會返回 server object，所以我們需要將返回的 server object 賦予一個 constant

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
const port = 3000;
const ip = "127.0.0.1"; // 該地址指向我的電腦，也就是 本機IP，所以訪問該 IP地址，就能訪問到剛剛創建的 NodeJS服務器

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
   - 包括：在傳輸數據前，客戶端和服務器必須先建立一個 TCP連結（Transmission Control Protocoool 傳輸控制協議），才可以互相交換信息
   - 還有客戶端在發送請求的時候，必須依照 HTTP 協議裡請求格式，否則會造成服務器沒辦法識別客戶端的請求
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

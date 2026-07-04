/* Service Worker：網路優先、離線退回快取。
   注意：語音辨識本身需要網路（瀏覽器把聲音送雲端辨識），離線模式只保證頁面打得開。 */
var CACHE = "sc-v7";
var SHELL = [
  "./",
  "./index.html",
  "./content/current-week.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png"
];

// 安裝時用 no-store 抓 SHELL，避免把瀏覽器 HTTP 快取裡的舊檔存進 SW 快取
self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return Promise.all(SHELL.map(function(u){
        return fetch(new Request(u, { cache: "no-store" })).then(function(r){
          if(r && r.ok) return c.put(u, r);
        }).catch(function(){});
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

// 頁面請新版立即接管
self.addEventListener("message", function(e){
  if(e.data === "skip-waiting") self.skipWaiting();
});

self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  // 導航與核心檔（html/js/webmanifest）永遠繞過 HTTP 快取拿最新，避免卡在舊版
  var url;
  try{ url = new URL(e.request.url); }catch(err){ url = { pathname: "" }; }
  var bust = e.request.mode === "navigate" || /\.(html|js|webmanifest)$/.test(url.pathname);
  var req = bust ? new Request(e.request.url, { cache: "no-store" }) : e.request;
  e.respondWith(
    fetch(req).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return res;
    }).catch(function(){
      return caches.match(e.request, { ignoreSearch: true });
    })
  );
});

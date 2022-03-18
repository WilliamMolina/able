importScripts('dist/sw-lib.js');
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js'
);

workbox.setConfig({
  debug: true,
});

console.log(workbox)
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('main').then(function(cache) {
        return cache.addAll(
          [
            '/uaral/manifest.json',
            '/uaral/index.html',
            '/uaral/',
            '/uaral/core/libs/navigo.min.js',
            '/uaral/dist/core.js',
            '/uaral/AppImages/android/android-launchericon-144-144.png',
            '/uaral/loading.gif'
          ]
        );
      })
    );
  });

  /* Cache only
  self.addEventListener('fetch', function(event) {
    console.log(event.request);
    event.respondWith(caches.match(event.request));
  });
  */

  function cacheOnly(event){
    console.log('Cache first');
    console.log(event.request.url);
    event.respondWith(caches.match(event.request));
  }

  function networkFirst(event){
    event.respondWith(
      fetch(event.request).then(function(response){
        return caches.open('main').then(function(cache){
          if(event.request.url.includes('ngrok')){
            let cached = '/'+event.request.url.split('/').slice(3).join('/');
            let r = response.clone();
            console.log(cached);
            localforage.getItem(cached, function(err, value){
              console.log(cached+' '+value);
              if(!value){
                cache.put(cached, r);
                localforage.setItem(cached,true);
              }else
                console.log("Actualizado")
            });
          }else{
            cache.put(event.request, response.clone());
          }
          return response;
        })
      }).catch(function() {
          return caches.match(event.request);
      })
    )
  }
  /* Network first */
  self.addEventListener('fetch', function (event) {
    if(!event.request.url.includes('ngrok')&&event.request.url.includes('/uaral/'))
      return cacheOnly(event);
    else
      return networkFirst(event);
  });

  const handlerCb = ({url, event, params}) => {
    console.log(url);
    return fetch('/demo-popper.png');
  };

  workbox.routing.registerRoute('https:*\.(css|js)', handlerCb);
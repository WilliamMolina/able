importScripts('dist/sw-lib.js');
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js'
);

workbox.setConfig({
  debug: true,
});

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('main').then(function(cache) {
        return cache.addAll(
          [
            '/able/manifest.json',
            '/able/index.html',
            '/able/',
            '/able/core/libs/navigo.min.js',
            '/able/dist/core.js',
            '/able/dist/server.apk',
            '/able/AppImages/android/android-launchericon-144-144.png',
            '/able/loading.gif'
          ]
        );
      })
    );
  });

  function cacheOnly(event){
    event.respondWith(caches.match(event.request));
  }

  function networkFirst(event){
    event.respondWith(
      fetch(event.request).then(function(response){
        return caches.open('main').then(function(cache){
          if(event.request.url.includes('ngrok')){
            let cached = '/'+event.request.url.split('/').slice(3).join('/');
            let r = response.clone();
            localforage.getItem(cached, function(err, value){
              if(!value){
                cache.put(cached, r);
                localforage.setItem(cached,true);
              }
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
    return fetch('/demo-popper.png');
  };

  workbox.routing.registerRoute('https:*\.(css|js)', handlerCb);
// সার্ভিস ওয়ার্কার ইনস্টল ইভেন্ট
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  // ক্যাশে কিছু ফাইল সংরক্ষণ করুন
  event.waitUntil(
    caches.open('my-cache-v1').then((cache) => {
      return cache.addAll([
        '/manifest.json',
        '/index.html',
        '/icon-192x192.png',
        '/icon-512x512.png',
   // মূল ডিরেক্টরিতে আইকন
        // অন্যান্য ফাইল যা ক্যাশে রাখতে চান
      ]);
    })
  );
});

// সার্ভিস ওয়ার্কার অ্যাক্টিভেট ইভেন্ট
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  // পুরনো ক্যাশগুলি ক্লিন আপ করুন
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'my-cache-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ফেচ ইভেন্ট হ্যান্ডলার
self.addEventListener('fetch', (event) => {
  console.log('Fetch request for:', event.request.url);

  event.respondWith(
    caches.match(event.request).then((response) => {
      // ক্যাশে যদি কোনো উত্তর পাওয়া যায়, সেটা রিটার্ন করুন
      if (response) {
        return response;
      }
      // না হলে নেটওয়ার্ক থেকে ফেচ করুন
      return fetch(event.request);
    })
  );
});
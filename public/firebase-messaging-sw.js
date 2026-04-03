/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCTgPHIaw0duOb14YRWsLRA8LYKnG5EnPg",
  authDomain: "teleremate-a72e2.firebaseapp.com",
  projectId: "teleremate-a72e2",
  storageBucket: "teleremate-a72e2.firebasestorage.app",
  messagingSenderId: "952040424972",
  appId: "1:952040424972:web:69c49214f403ab2fbdd029"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

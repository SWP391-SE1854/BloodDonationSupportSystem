// firebase-messaging-sw.js (Service Worker)

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAlv8EpE86eXsuo3lP4g6tUPbYg2RolazE",
    authDomain: "blooddonationsystem-f2379.firebaseapp.com",
    projectId: "blooddonationsystem-f2379",
    storageBucket: "blooddonationsystem-f2379.appspot.com",
    messagingSenderId: "796297565410",
    appId: "1:796297565410:web:0db3f0669011b980e27abb",
    measurementId: "G-Q639QDNLSE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});



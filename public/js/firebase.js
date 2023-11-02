const { initializeApp } = require('firebase/app');
const { getAnalytics } = require('firebase/analytics');
const { getStorage } = require('firebase/storage');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyAAuB8J_836j7fe1nhJvXg7UUW3giYrakA',
	authDomain: 'planifi-80c66.firebaseapp.com',
	projectId: 'planifi-80c66',
	storageBucket: 'planifi-80c66.appspot.com',
	messagingSenderId: '450293342385',
	appId: '1:450293342385:web:1c96304d911010e6974290',
	measurementId: 'G-NG0TPJGFNG',
};

// Initialize Firebase
const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = storage.ref();

module.exports = { storage, storageRef };

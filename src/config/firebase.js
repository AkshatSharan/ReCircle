// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCvCJSFQkpSbTN28PKwc2cCgPcxN7Ldjw4",
    authDomain: "recircle-52a1e.firebaseapp.com",
    projectId: "recircle-52a1e",
    storageBucket: "recircle-52a1e.firebasestorage.app",
    messagingSenderId: "608101497278",
    appId: "1:608101497278:web:68bac1aff31944850721ef",
    measurementId: "G-J83H4WPBEJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
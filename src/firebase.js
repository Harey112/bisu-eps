// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import axios from "axios";
import server from "./server";



//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const response = await axios.get(`http://${server.host}:${server.port}/client/getConfig`);
// Initialize Firebase
const myFirebase = initializeApp(JSON.parse(response.data));
//const analytics = getAnalytics(app);


export { myFirebase };
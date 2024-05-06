

const { initializeApp } = require('firebase/app')
const admin = require('firebase-admin');
const serviceAccount = require('./asset/creds.json');
const firebaseConfig = {
  apiKey: "AIzaSyDZlvBikxj3Z_edNtNvbQR2971r-fzoNQk",
  authDomain: "managehotel-1cae3.firebaseapp.com",
  projectId: "managehotel-1cae3",
  storageBucket: "managehotel-1cae3.appspot.com",
  messagingSenderId: "774724583614",
  appId: "1:774724583614:web:a3259da14e2292fd5c5eef",
  measurementId: "G-L1SGFZFTHW"
};
const firebase= initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://managehotel-1cae3.appspot.com'
});
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');
const db = getFirestore()
module.exports = {firebase,admin,db};
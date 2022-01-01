const fb = require('firebase/app');
const { getDatabase, ref, onValue } = require('firebase/database');

const fbconfig = {

    apiKey: "AIzaSyB3eoBwySWz4kShfWN5PzDp7YMuxhjNS_E",
    authDomain: "publibrary-9515d.firebaseapp.com",
    databaseURL: "https://publibrary-9515d-default-rtdb.firebaseio.com/"
}


const fbapp = fb.initializeApp(fbconfig);

const db = getDatabase();

module.exports = {fbapp, db, ref, onValue};

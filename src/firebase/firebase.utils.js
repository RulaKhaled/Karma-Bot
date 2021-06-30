const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

var firebaseConfig = {
    apiKey: "AIzaSyB0SXTykk67SdRxy89VF4lV5fC--tAFMx8",
    authDomain: "art-bot-sever.firebaseapp.com",
    projectId: "art-bot-sever",
    storageBucket: "art-bot-sever.appspot.com",
    messagingSenderId: "449492726622",
    appId: "1:449492726622:web:1865689b4f1e9d2afe95cf",
    measurementId: "G-CD8DCP7YLR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const updateKarma = async (user, points) => {
    const { id, username } = user;
    const ref = firestore.doc(`users/${id}`);
    const snapShot = await ref.get(),
        data = snapShot.data();
    if (!snapShot.exists) {
        points = points >= 0 ? points : 0;
        ref.set({ ...data, karma: points, username: username }).then(res => {
            console.log("karma points were initialized");
        }).catch(err => {
            console.error(err)
        })
    } else {
        let oldPoints = snapShot.data().karma;
        let newPoints = oldPoints + points;
        newPoints = newPoints >= 0 ? newPoints : 0;
        ref.set({ ...data, karma: newPoints }).then(res => {
            console.log("karma points were updated");
        }).catch(err => {
            console.error(err)
        })
    }
}

const getKarmaPoints = async (userId) => {
    const ref = firestore.doc(`users/${userId}`);
    const snapShot = await ref.get();
    if (snapShot.exists) {
        let karmaPoints = snapShot.data().karma;
        return karmaPoints;
    }
}

module.exports = { updateKarma, getKarmaPoints }

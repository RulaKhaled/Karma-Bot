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

const saveArt = async (authorId, obj) => {
    const userRef = firestore.doc(`users/${authorId}`).collection("pics").doc();
    const snapShot = await userRef.get();
    userRef.set({ authorId, ...obj }).then(res => {
        console.log("saved to db");
    }).catch(err => {
        console.log(err, "could'nt be saved ")
    })
}

const userGetAll = async (authorId) => {
    const userRef = firestore.doc(`users/${authorId}`).collection('pics');
    let snapShot = userRef.get().then((res) => res).catch((err) => console.log(err, "err getting all art works!"))
    if (snapShot) return snapShot;
}

const deleteArt = async (authorId, artId) => {
    const userRef = firestore.doc(`users/${authorId}`).collection('pics');
    let snapShot = await userRef.get(),
        flag = false;
    snapShot.docs.forEach(doc => {
        if (doc.data().id === artId) {
            flag = true;
            let ref = firestore.doc(`users/${authorId}`).collection('pics').doc(doc.id);
            ref.delete().then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }
    })
    console.log(flag);
    return flag === false ? `failed to delete art of ${artId}, you sure about the id?` : `successfully deleted art of ${artId}`;
}

const updateKarma = async (user, points) => {
    console.log(user, points, "-----------")
    const { id, username } = user;
    const ref = firestore.doc(`users/${id}`);
    const snapShot = await ref.get(),
        data = snapShot.data();
    if (!snapShot.exists) {
        points = points >= 0 ? points : 0;
        ref.set({ ...data, karma: points, username:username }).then(res => {
            console.log("karma points were intilized");
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
    const ranks = firestore.collection(`users`);
    const rankdocs = await ranks.orderBy('karma').get();
    let rank;
    rankdocs.docs.reverse().forEach((doc, idx) => {
        if (doc.id === userId) {
            rank = idx + 1
        }
    })
    if (snapShot.exists) {
        let karmaPoints = snapShot.data().karma;
        return { karmaPoints, rank };
    }
}

module.exports = { saveArt, userGetAll, deleteArt, updateKarma, getKarmaPoints }

import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
    apiKey: "<your api Key>",
    authDomain: "<your firebase app domain>",
    databaseURL: "https://<your collection>.firebaseio.com",
    projectId: "g-covidtracker",
    storageBucket: "g-covidtracker.appspot.com",
    messagingSenderId: "<will be present in the firebase setting>",
    appId: "<will be present in the firebase setting>", 
    measurementId: "<will be present in the firebase setting>"
  };
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
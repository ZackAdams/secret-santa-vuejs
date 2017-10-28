import Firebase from 'firebase'

export default Firebase.initializeApp({
  apiKey: 'AIzaSyCymYD6jUQrHvd8pYvl0gxwKuP6MQ8kp2k',
  authDomain: 'incandescent-fire-4896.firebaseapp.com',
  databaseURL: 'https://incandescent-fire-4896.firebaseio.com',
  projectId: 'incandescent-fire-4896',
  storageBucket: 'incandescent-fire-4896.appspot.com',
  messagingSenderId: '760333911761'
}).database()

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady() {  
    firebaseApp();
}

function firebaseApp() {
    var registerButton = document.getElementById("register-button");
    registerButton.addEventListener("click", registerInFirebase, false);

    var loginButton = document.getElementById("login-button");
    loginButton.addEventListener("click", loginWithFirebase, false);

    // var signoutButton = document.getElementById("signout-button");
    // signoutButton.addEventListener("click", signoutWithFirebase, false);

    var saveButton = document.getElementById("save-data-button");
    saveButton.addEventListener("click", saveDataWithFirebase, false);
}

//hide other content
document.getElementById('login').style.display = 'block';
document.getElementById('goals').style.display = 'none';
document.getElementById('main').style.display = 'none';
document.getElementById('progress').style.display = 'none';

function registerInFirebase() {
    var email = document.getElementById('register-email-input').value;
    var password = document.getElementById('register-password-input').value;

    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }

    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(firebaseUser) {
            alert('user registered!'); 
            document.getElementById('register-email-input').value = '';
            document.getElementById('register-password-input').value = '';
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } 
            else {
                alert(errorMessage);
            }
            console.log(error);
        }
    );
}

function loginWithFirebase() {
    console.log("attempting to login");
    var email = document.getElementById('login-email-input').value;
    var password = document.getElementById('login-password-input').value;

    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }

    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(firebaseUser) {
            alert('user logged in!'); 
            
           //change page
           document.getElementById('login').style.display = 'none';
           document.getElementById('main').style.display = 'block';
           document.getElementById('progress').style.display = 'none';

            document.getElementById('login-email-input').value = '';
            document.getElementById('login-password-input').value = '';

            // load data
            retrieveDataFromFirebase();
        })
        .catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } 
            else {
                alert(errorMessage);
            }
        }
    );
}

function signoutWithFirebase() {
    firebase.auth().signOut().then(function() {
        // if logout was successful
        if (!firebase.auth().currentUser) {
            document.getElementById('some-data-textarea').value = '';
        }
    });
    alert('user was logged out!');
}

function saveDataWithFirebase() {
    console.log("attempting to save");
    var userId = firebase.auth().currentUser.uid;

    
    // SAVE DATA TO REALTIME DB
    //Get a reference to the database service
    var database = firebase.database();

    database.ref('users/' + userId).set({
        text: document.getElementById('some-data-textarea').value
    });
    

    // SAVE DATA TO FIRESTORE
    var db = firebase.firestore(app);

    db.collection('users').doc(userId).set(
        {
            text: document.getElementById('some-data-textarea').value,
        }, 
        { 
            merge: true // set with merge set to true to make sure we don't blow away existing data we didnt intend to
        }
    )
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
}

function retrieveDataFromFirebase() {
    var userId = firebase.auth().currentUser.uid;
    
    
    // LOAD DATA FROM REALTIME DB
    firebase.database().ref('run-the-world-d0df6/users/test' + userId).once('value').then(function(snapshot) {
        document.getElementById('some-data-textarea').value = snapshot.val().text;
    });
    
    // LOAD DATA FROM FIRESTORE
    var db = firebase.firestore(app);
    var docRef = db.collection("users").doc(userId);

    // read once from data store
    docRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById('some-data-textarea').value = doc.data().text
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    // For real-time updates:
    
    docRef.onSnapshot(function(doc) {
        document.getElementById('some-data-textarea').value = doc.data().text
        console.log("Current data: ", doc.data());
    });
   //end of Firebase 
   console.log(userId);
}

function startMain() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('main').style.display = 'block';
    document.getElementById('progress').style.display = 'none';
}

function startProgress() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('main').style.display = 'none';
    document.getElementById('progress').style.display = 'block';
}
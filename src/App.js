import React, { useRef, useState } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  //configs
  apiKey: "AIzaSyAIwHwmEa1pNAYZlacX25tOjADKR91moAA",
  authDomain: "chat-app-b12d4.firebaseapp.com",
  projectId: "chat-app-b12d4",
  storageBucket: "chat-app-b12d4.appspot.com",
  messagingSenderId: "843213801224",
  appId: "1:843213801224:web:365945330d99165dfecebd",
  measurementId: "G-YLY5X7VD45",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  // const user = null;
  console.log(user);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth?.currentUser && (
      <button onClick={() => auth.signOut()}>Sign Out</button>
    )
  );
}

function ChatRoom() {
  const messageRef = firestore.collection("messages");
  const query = messageRef.orderBy("createdAt").limit(25);
  const [formValue, setFormValue] = useState("");

  //listen to data with hook
  const [messages] = useCollectionData(query, { idField: "id" });
  const dummy = useRef();
  const sendMessage = async (e) => {
    e.preventDefault(); //stop refresh
    const { uid, photoURL } = auth.currentUser;
    //creating new document
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <React.Fragment>
      <main>
        {messages &&
          messages?.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        <div ref={dummy}></div>
      </main>
      {/* message send from user side */}
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">🕊️</button>
      </form>
    </React.Fragment>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  //sent and received message
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  console.log("here", uid, auth.currentUser.uid);
  return (
    <div className={`message ${messageClass}`}>
      <img
        src={
          photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
        }
        alt="user profile"
      />
      <p>{text}</p>
    </div>
  );
}
export default App;

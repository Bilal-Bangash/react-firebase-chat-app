import React from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ChatRoom, SignIn, SignOut } from "./Screens";
import { configs } from "./configs/configs";

firebase.initializeApp(configs);

const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut auth={auth} />
      </header>
      <section>
        {user ? (
          <ChatRoom auth={auth} firebase={firebase} firestore={firestore} />
        ) : (
          <SignIn firebase={firebase} auth={auth} />
        )}
      </section>
    </div>
  );
}

export default App;

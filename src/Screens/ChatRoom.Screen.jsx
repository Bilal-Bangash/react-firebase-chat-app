import React, { useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ChatMessage } from "../components";

const ChatRoom = ({ auth, firebase, firestore }) => {
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
            <ChatMessage auth={auth} key={message.id} message={message} />
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
};

export default ChatRoom;

const ChatMessage = ({ message, auth }) => {
  const { text, uid, photoURL } = message;
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
};

export default ChatMessage;

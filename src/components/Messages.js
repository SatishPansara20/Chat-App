import { doc, onSnapshot, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    const chatData = async () => {
      const docRef = doc(db, "chats", data.chatId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data from Messages Between Users:", docSnap.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    chatData();

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;

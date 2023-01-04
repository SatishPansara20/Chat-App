import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const divRef = useRef();

  useEffect(() => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log("---1---");
  }, [message]);

  return (
    <div
      ref={divRef}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="messageContent">
        <p>
          {message.text}
          {message.img && <img src={message.img} alt="" />}
        </p>
      </div>
    </div>
  );
};

export default Message;

// import { storage } from "../firebase";
// import { getDownloadURL, ref } from "firebase/storage";

// const [imageURL, setImageURL] = useState("");

// const forImagePath = async (data) => {
//   // Get the download URL

//   await getDownloadURL(data)
//     .then((url) => {
//       setImageURL(url);
//     })
//     .catch((error) => {
//       // A full list of error codes is available at
//       // https://firebase.google.com/docs/storage/web/handle-errors
//       switch (error.code) {
//         case "storage/object-not-found":
//           // File doesn't exist
//           break;
//         case "storage/unauthorized":
//           // User doesn't have permission to access the object
//           break;
//         case "storage/canceled":
//           // User canceled the upload
//           break;

//         // ...

//         case "storage/unknown":
//           // Unknown error occurred, inspect the server response
//           break;
//         default:
//           console.log("field again");
//       }
//     });
// };

// if (message.img) {
//   const starsRef = ref(storage, `ChatImages/${message.img}`);
//     console.log(`ChatImages/${message.img}`);

//   forImagePath(starsRef);
//   console.log("Received URL :", imageURL);
// }

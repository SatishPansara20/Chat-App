import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  
  };


  return (
    <>
      <div className="chats">
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={chat[1].userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Chats;











  // //   console.log(chatData);

  //   const storageRef = ref(storage, `ChatImages/${newName}${uuid()}`);
  //   const uploadTask = uploadBytesResumable(storageRef, chatData.img);

  //   if (chatData.imgName === "" && chatData.text === "") {
  //     alert("Enter a message");
  //   } else if (chatData.text !== "" && chatData.imgName !== "") {
  //     // Send Messages with User text and photo
  //     //NOTE: First
  //     console.log("1");

  //     uploadTask.on(
  //       (snapshot) => {
  //         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log("Upload is " + progress + "% done");
  //         switch (snapshot.state) {
  //           case "paused":
  //             console.log("Upload is paused");
  //             break;
  //           case "running":
  //             console.log("Upload is running");
  //             break;
  //           default:
  //             console.log("From default case");
  //         }
  //       },

  //       (error) => {
  //         //TODO:Handle Error
  //         console.log(
  //           "Error While Uploading Chat Data and Error Message is : ",
  //           error
  //         );

  //         switch (error.code) {
  //           case "storage/unauthorized":
  //             // User doesn't have permission to access the object
  //             console.log(
  //               "User is unauthenticated, please authenticate and try again."
  //             );
  //             break;
  //           case "storage/canceled":
  //             // User canceled the upload
  //             console.log("User canceled the operation.");
  //             break;

  //           case "storage/unknown":
  //             // Unknown error occurred, inspect error.serverResponse
  //             break;
  //           default:
  //             console.log(error);
  //         }
  //       },

  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
  //           console.log(downloadURL);
  //           //   await updateDoc(doc(db, "chats", data.chatId), {
  //           //     messages: arrayUnion({
  //           //       id: uuid(),
  //           //       text,
  //           //       senderId: currentUser.uid,
  //           //       date: Timestamp.now(),
  //           //       img: downloadURL,
  //           //     }),
  //           //   });
  //         });
  //       }
  //     );
  //   } else if (chatData.text === "" && chatData.imgName !== "") {
  //     // Send Messages with ImageName and Photo
  //     console.log("2");
  //     setChatData({ ...chatData, imgName: newName });

  //     uploadTask.on(
  //       (error) => {
  //         //TODO:Handle Error
  //         console.log(
  //           "Error While Uploading Chat Data and Error Message is : ",
  //           error
  //         );

  //         switch (error.code) {
  //           case "storage/unauthorized":
  //             // User doesn't have permission to access the object
  //             console.log(
  //               "User is unauthenticated, please authenticate and try again."
  //             );
  //             break;
  //           case "storage/canceled":
  //             // User canceled the upload
  //             console.log("User canceled the operation.");
  //             break;

  //           case "storage/unknown":
  //             // Unknown error occurred, inspect error.serverResponse
  //             break;

  //           case " storage/object-not-found":
  //             // Unknown error occurred, inspect error.serverResponse
  //             break;
  //           default:
  //             console.log(error);
  //         }
  //       },

  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
  //           console.log(downloadURL);
  //           // await updateDoc(doc(db, "chats", data.chatId), {
  //           //   messages: arrayUnion({
  //           //     id: uuid(),
  //           //     text,
  //           //     senderId: currentUser.uid,
  //           //     date: Timestamp.now(),
  //           //     img: downloadURL,
  //           //   }),
  //           // });
  //         });
  //       }
  //     );
  //   } else if (chatData.imgName === "" && chatData.text !== "") {
  //     // Send only message
  //     console.log("3");

  //     updateDoc(doc(db, "chats", data.chatId), {
  //       messages: arrayUnion({
  //         id: uuid(),
  //         text: chatData.text,
  //         senderId: currentUser.uid,
  //         date: Timestamp.now(),
  //       }),
  //     });
  //   }

  //   await updateDoc(doc(db, "userChats", currentUser.uid), {
  //     [data.chatId + ".lastMessage"]: {
  //       text: chatData.text,
  //     },
  //     [data.chatId + ".date"]: serverTimestamp(),
  //   });

  //   await updateDoc(doc(db, "userChats", data.user.uid), {
  //     [data.chatId + ".lastMessage"]: {
  //       text: chatData.text,
  //     },
  //     [data.chatId + ".date"]: serverTimestamp(),
  //   });

  // };

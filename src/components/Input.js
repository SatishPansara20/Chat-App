import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db, storage } from "../firebase";

import { v4 as uuid } from "uuid";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [chatData, setChatData] = useState({
    text: "",
    img: "",
    imgName: "",
  });
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (chatData.imgName === "" && chatData.text === "") {
      alert("Enter a message");
    }
    //NOTE:  1
    else if (chatData.text !== "" && chatData.imgName !== "") {
      // Send Messages with User text and photo
      console.log("1");

      const text = e.target[0].value;
      const img = e.target[1].files[0];
      const imgName = e.target[1].files[0].name;

      const storageImageName = `${imgName}${uuid()}`;
      const storageRef = ref(storage, `ChatImages/${storageImageName}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      try {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setProgress(
              Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              )
            );
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log(progress);
                console.log("Upload is running");
                break;
              default:
                console.log("Unexpected Errore while uploading the Image");
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                setChatData({ ...chatData, img: downloadURL });
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text: text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
            );
          }
        );
      } catch (err) {
        setErr(true);
        setLoading(false);
      }
    }

    //NOTE:  2
    else if (chatData.text === "" && chatData.imgName !== "") {
      //Send Messages with ImageName and Photo
      setChatData({ ...chatData, text: chatData.imgName });
      const img = e.target[1].files[0];
      const imgName = e.target[1].files[0].name;

      const storageImageName = `${imgName}${uuid()}`;
      const storageRef = ref(storage, `ChatImages/${storageImageName}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      console.log(img, imgName);
      try {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setProgress(
              Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              )
            );

            console.log(progress);

            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log(progress);
                console.log("Upload is running");
                break;
              default:
                console.log("Unexpected Errore while uploading the Image");
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                setChatData({ ...chatData, img: downloadURL });
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text: imgName,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
            );
          }
        );
      } catch (err) {
        setErr(true);
        setLoading(false);
      }
    }
    //NOTE:  3
    else if (chatData.imgName === "" && chatData.text !== "") {
      console.log("3");
      const text = e.target[0].value;
      updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text: chatData.text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: chatData.text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setChatData({
      text: "",
      img: "",
      imgName: "",
    });

    setProgress(0)
  };

  const handleChange = (e) => {
    setChatData({
      ...chatData,
      [e.target.name]: e.target.value,
    });
  };

  const hadnleImage = (event) => {
    let file = event.target.files[0];
    const newImage = file.name.split(" ");
    const newImageWithoutSpace = newImage.join("");
    const onlyImageName = newImageWithoutSpace.split(".");

    setChatData({
      ...chatData,
      img: file,
      imgName: onlyImageName[0],
    });
  };

  return (
    <div className="input">
      <form onSubmit={handleSubmit}
      style= {{display:"flex",width:"100%"}}
      >
        <input
          type="text"
          name="text"
          placeholder="Type something..."
          onChange={handleChange}
          value={chatData.text}
          style= {{alignItems:"start",flexGrow:"1"}}
        />
        <div className="send"  >
          <input
            type="file"
            accept="image/png, image/jpeg"
            style={{ display: "none" }}
            id="file"
            onChange={hadnleImage}
          />
          <label htmlFor="file">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCwLypGHmZkQWYbK__Qi19Pc_A5aqyA7Hf_A&usqp=CAU" alt="" />
          </label>
          <button type="submit" disabled={loading}>
            Send
          </button>
        </div>
        {loading && (
          <div className="w-full bg-gray-200 rounded-full">
            <div
              className=" w-20 h-12 bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}
        {err && <span>Something went wrong</span>}
      </form>
    </div>
  );
};

export default Input;

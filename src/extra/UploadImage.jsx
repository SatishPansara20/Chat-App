/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

import { Link } from "react-router-dom";
import { useState } from "react";

import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const UploadImage = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [productImage, setProductImage] = useState({
    image: "",
  });

  const [progress, setProgress] = useState(0);

  const hadnleImage = (event) => {
    let file = event.target.files[0];

    setProductImage({ ...setProductImage, image: file });
  };

  const [err, setErr] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const fileName = productImage.name;
    const file = productImage;
    try {
      const date = new Date().getTime();
      const storageRef = ref(storage, `${fileName + date}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
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
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setProductImage({ ...setProductImage, image: "" });
          });
        }
      );

    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="imageFile"
            className="form-label inline-block mb-2 text-gray-700"
          >
            Choose New input
          </label>

          <input
            name="imageFile"
            accept="image/png, image/jpeg"
            className="form-control block w-full mpx-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            type="file"
            id="imageFile"
            onChange={hadnleImage}
          />

          <img
            className=" w-full h-96 md:m-2 md:items-center md:h-auto md:w-auto  object-cover rounded-t-lg md:rounded-none md:rounded-l-lg"
            src={setProductImage.image}
            alt="Product Look"
          />

          <button
            className="bg-neutral-500 border-2 rounded-md w-1/2 border-sky-400"
            disabled={loading}
          >
            Sign up
          </button>

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

        <Link to="/login">
          <button
            onClick={() => {
              signOut(auth)
                .then(() => {
                  console.log("Successfully Signout");
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log("User SignOut ErrorCode " + errorCode);
                  console.log("User SignOut  Error Message " + errorMessage);
                });
            }}
          >
            logout
          </button>
        </Link>
      </div>
    </>
  );
};

export default UploadImage;

// // Send Messages with ImageName and Photo
//     setChatData({
//       ...chatData,
//       text: chatData.imgName.trim(),
//     });

//     console.log("2");
//     console.log(chatData);

//     uploadTask.on(
//       (snapshot) => {
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
//             break;
//         }
//       },

//       (error) => {
//         console.log(
//           "Error While Uploading Chat Data and Error Message is : ",
//           error
//         );
//         switch (error.code) {
//           case "storage/object-not-found":
//             // Unknown error occurred, inspect error.serverResponse
//             break;
//           default:
//             if (error.totalBytes === error.bytesTransferred) {
//               console.log("Upload Successully");
//             }
//         }
//       }
//     );

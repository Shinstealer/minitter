import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const MinitFactory = ({ userObj }) => {
  const [minit, setMinit] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    let attachmentUrl = "";
    if (attachment !== "") {

      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const uploadFile = await uploadString(attachmentRef, attachment, "data_url");
      console.log(uploadFile);
      attachmentUrl = await getDownloadURL(attachmentRef);
    }



    const minitObj = {
      text: minit,
      createdAt: new Date(),
      creatorId: userObj.uid,
      attachmentUrl,
    }
    await addDoc(collection(dbService, "minit"),
      minitObj,
    );
    setMinit("");
    setAttachment("");
  }

  const onChange = (e) => {
    const { target: { value } } = e;
    setMinit(value);
  }
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = "";

  };

  return (
    <>
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">

          <input value={minit}
            className="factoryInput__input"
            onChange={onChange}
            type="text"
            name="email"
            placeholder="What is on your mind"
            maxLength={120}
          />
          
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}s
        />
        {attachment && (
          <div className="factoryForm__attachment">
            <img
              src={attachment}
              style={{
                backgroundImage: attachment,
              }}
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}

      </form>
    </>
  );
};

export default MinitFactory;

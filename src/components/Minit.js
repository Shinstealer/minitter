import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { ref, deleteObject } from "@firebase/storage";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Minit = ({ minitObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newMinit, setNewMinit] = useState(minitObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this minit?");
    const MinitTextRef = doc(dbService, "minit", `${minitObj.id}`);
    if (ok) {
      const urlRef = ref(storageService, minitObj.attachmentUrl);
      await deleteDoc(MinitTextRef);
      await deleteObject(urlRef);
    }
  }

  const toggleEditing = () => {
    setEditing(prev => !prev);
  };
  const onChange = (e) => {
    const { target: { value } } = e;
    setNewMinit(value);
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(dbService, "minit", `${minitObj.id}`), {
      text: newMinit,
    });
    setEditing(false);
  }

  return (
    <div className="minit" >
      {
        editing ? (
          <>
            <form onSubmit={onSubmit} className="container minitEdit">
              <input type="text"
                placeholder="Eidt your minit"
                value={newMinit}
                onChange={onChange}
                required></input>
              <input type="submit" value="Update minit" className="formBtn"></input>
            </form>
            <span onClick={toggleEditing} className="formBtn cancelBtn">
              Cancel
            </span>
          </>
        ) : (
          <>
            <h4>{minitObj.text}</h4>
            {minitObj.attachmentUrl && (<img src={minitObj.attachmentUrl} />)}
            {
              isOwner && (
                <div className="minit__actions">
                  <span onClick={onDeleteClick}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                  <span onClick={toggleEditing}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </span>
                </div>
              )
            }
          </>
        )

      }

    </div>
  );
};

export default Minit;
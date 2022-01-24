import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { ref,deleteObject } from "@firebase/storage";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

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
    <div >
      {
        editing ? (
          <>
            <form onSubmit={onSubmit}>
              <input type="text"
                placeholder="Eidt your minit"
                value={newMinit}
                onChange={onChange}
                required></input>
              <input type="submit" value="Update minit"></input>
            </form>
            <button onClick={toggleEditing}>Cancel</button>
          </>
        ) : (
          <>
            <h4>{minitObj.text}</h4>
              {minitObj.attachmentUrl && (<img src={minitObj.attachmentUrl} width="50px" height="50px" />)}
            {
              isOwner && (
                <>
                  (<button onClick={onDeleteClick}> Delete Minit</button>
                  <button onClick={toggleEditing}>Edit Minit</button>)
                </>
              )
            }
          </>
        )

      }

    </div>
  );
};

export default Minit;
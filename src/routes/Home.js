import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { dbService, storageService } from "fbase";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import Minit from "components/Minit";

const Home = ({ userObj }) => {
    const [minit, setMinit] = useState("");
    const [minits, setMinits] = useState([]);
    const [attachment, setAttachment] = useState("");
    // const getMinits = async () => {
    //     const q = query(collection(dbService, "minit"), orderBy('createdAt' , "desc"));
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach(doc => {
    //         const minitObj = {
    //             ...doc.data(),
    //             id: doc.id
    //         }
    //         setMinits(prev => [minitObj, ...prev]);
    //     });

    // };
    const getRealTimeupdates = () => {
        const q = query(collection(dbService, "minit"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            const newArray = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            setMinits(newArray);
        });
        return () => unsubscribe();
    }
    useEffect(() => {
        // getMinits();
        getRealTimeupdates();

    }, []);
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
        <div>
            <form onSubmit={onSubmit}>

                <input value={minit}
                    onChange={onChange}
                    type="text"
                    name="email"
                    placeholder="What is on your mind"
                    maxLength={120}
                />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
                <input type="submit" value="MInit" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}

            </form>
            <div>
                {
                    minits.map(minit => (
                        <Minit key={minit.id}
                            minitObj={minit}
                            isOwner={minit.creatorId === userObj.uid}
                        />
                    ))}
            </div>

        </div>
    );
}
export default Home;
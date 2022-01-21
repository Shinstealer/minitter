import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { dbService } from "fbase";
import Minit from "components/Minit";

const Home = ({ userObj }) => {
    const [minit, setMinit] = useState("");
    const [minits, setMinits] = useState([]);
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
        await addDoc(collection(dbService, "minit"), {
            text: minit,
            createdAt: new Date(),
            creatorId: userObj.uid,
        });

        setMinit("");
    }
    const onChange = (e) => {
        const { target: { value } } = e;
        setMinit(value);
    }
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

                <input type="submit" value="MInit" />

            </form>
            <div>
                {
                    minits.map(minit => (
                        <Minit key={minit.id} 
                        minitObj={minit} 
                        isOwner={minit.creatorId === userObj.uid} />
                    ))}
            </div>

        </div>
    );
}
export default Home;
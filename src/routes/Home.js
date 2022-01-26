import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { dbService } from "fbase";
import Minit from "components/Minit";
import MinitFactory from "components/MinitFactory";

const Home = ({ userObj }) => {
    
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

    return (
        <div className="container">
            <MinitFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
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
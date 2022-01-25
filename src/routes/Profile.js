import React, { useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useHistory } from "react-router-dom";
import { authService } from "fbase";

export default ({ userObj, refreshUser }) => {
    const [newProfileName, setNewProfileName] = useState("");
    const auth = getAuth();
    const history = useHistory();
    const onLogOutClick = () => {
        signOut(auth);
        history.push("/");
    };
    const onChangeProfileName = (e) => {
        const { target: { value } } = e;
        setNewProfileName(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (userObj.displayName !== newProfileName) {
            const res = await updateProfile(authService.currentUser, {
                displayName: newProfileName,
            });
            refreshUser();
            console.log(res);
        }
    }
    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text"
                    onChange={onChangeProfileName}
                    value={newProfileName}
                    placeholder="Display name" />
                <input type="submit" placeholder="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    )

};

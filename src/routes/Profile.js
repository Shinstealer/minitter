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
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input type="text"
                    onChange={onChangeProfileName}
                    value={newProfileName}
                    autoFocus
                    placeholder="Display name"
                    className="formInput" />
                <input type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }} />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>

        </div>
    )

};

import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";


function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => { updateProfile(user, { args }) },
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);

    })
  }, []);
  console.log(authService.currentUser);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => { updateProfile(user, { args }) },
    });
  }
  return (
    <>
      {init ? < AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "Loading..."}
      <footer style={{
        marginTop: "30px",
        textAlign: "center",
        color: "white",
      }}>&copy; {new Date().getFullYear()} minitter</footer>
    </>
  );
}

export default App;

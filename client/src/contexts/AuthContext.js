import React, { useContext, useEffect, useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import app from '../firebase/firebase';



const AuthContext = React.createContext();

const auth = getAuth(app);

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

    function sign_up(email, password){
       return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function reAuth(currentPass){
        const cred = EmailAuthProvider.credential(currentUser.email, currentPass)
        return reauthenticateWithCredential(currentUser, cred)
    }

    function changePass(user, newpassword){
        return updatePassword(user, newpassword);
    }

    function logout(){
        return signOut(auth);
    }

    function deleteAccnt(user){
        return deleteUser(user);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged( user => {
            setCurrentUser(user)
            setLoading(false)
        })
        
        return unsubscribe
    }, [])
    
    const value = {
        currentUser,
        sign_up,
        login,
        logout,
        changePass,
        reAuth,
        deleteAccnt,
    }
  return (
      <AuthContext.Provider value={value}>
          {!loading && children}
      </AuthContext.Provider>
  )
}

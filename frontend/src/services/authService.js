import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig"

function validateEmail(email) {
    if (!email.endsWith("@lion.lmu.edu")) {
        throw new Error("Email must end with @lion.lmu.edu");
    }
}

export function login(email, password) {
    validateEmail(email);
    return signInWithEmailAndPassword(auth, email, password);
}

export function signUp(email, password) {
    validateEmail(email);
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return sendEmailVerification(userCredential.user)
                .then(() => {
                    return userCredential;
                });
        });
}
export function resendVerificationEmail() {
    if (auth.currentUser) {
        return sendEmailVerification(auth.currentUser);
    }
    throw new Error("No user is currently signed in");
}

export function sendPasswordReset(email) {
    validateEmail(email);
    return sendPasswordResetEmail(auth, email);
}

export function logout() {
    return signOut(auth)
}

export function useAuth() {
    const [user, setUser] = useState(null)
    const [emailVerified, setEmailVerified] = useState(false)
    
    useEffect(() => {
        return auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user)
                setEmailVerified(user.emailVerified)
                user.reload().then(() => {
                    setEmailVerified(user.emailVerified)
                }).catch(() => {
                    setEmailVerified(user.emailVerified)
                })
            } else {
                setUser(null)
                setEmailVerified(false)
            }
        })
    }, [])
    
    return { user, emailVerified }
}
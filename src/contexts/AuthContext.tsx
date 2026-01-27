"use client";

import api from "@/configs/axios";
import { auth } from "@/configs/firebase";
import { AuthResult, User } from "@/types";
import { AuthError, confirmPasswordReset, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
   user: User | null;
   fbToken: string | null;
   loading: boolean;
   setUser: (user: User | null) => void;
   googleSignIn: () => Promise<AuthResult>;
   emailSignIn: (email: string, password: string) => Promise<AuthResult>;
   emailSignUp: (email: string, password: string, userName: string) => Promise<AuthResult>;
   forgotPassword: (email: string) => Promise<AuthResult>;
   resetPassword: (oobCode: string, newPassword: string) => Promise<AuthResult>;
   logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) => {
   const [fbToken, setFbToken] = useState<string | null>(null);
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   const getAuthErrorMessage = (error: AuthError): string => {
      switch (error.code) {
         /** ---------- SIGN IN ---------- */
         case "auth/user-not-found":
            return "No account found with this email.";

         case "auth/wrong-password":
            return "Incorrect password.";

         case "auth/invalid-credential":
            return "Invalid email or password.";

         case "auth/user-disabled":
            return "This account has been disabled.";

         /** ---------- SIGN UP ---------- */
         case "auth/email-already-in-use":
            return "This email is already registered.";

         case "auth/weak-password":
            return "Password must be at least 6 characters long.";

         case "auth/operation-not-allowed":
            return "Email/password sign-in is not enabled.";

         /** ---------- GOOGLE SIGN IN ---------- */
         case "auth/popup-closed-by-user":
            return "Sign-in popup was closed before completion.";

         case "auth/cancelled-popup-request":
            return "Popup sign-in was cancelled.";

         case "auth/popup-blocked":
            return "Popup was blocked by the browser.";

         case "auth/account-exists-with-different-credential":
            return "This email is already linked with another sign-in method.";

         /** ---------- FORGOT PASSWORD ---------- */
         case "auth/invalid-email":
            return "Please enter a valid email address.";

         case "auth/missing-email":
            return "Email address is required.";

         case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";

         /** ---------- RESET PASSWORD ---------- */
         case "auth/expired-action-code":
            return "This reset link has expired. Please request a new one.";

         case "auth/invalid-action-code":
            return "Invalid or already used reset link.";

         case "auth/missing-action-code":
            return "Reset link is missing or invalid.";

         /** ---------- NETWORK ---------- */
         case "auth/network-request-failed":
            return "Network error. Please check your connection.";

         /** ---------- FALLBACK ---------- */
         default:
            return "Something went wrong. Please try again.";
      }
   };

   const syncUserWithBackend = async () => {
      try {
         const firebaseUser = auth.currentUser;
         if (!firebaseUser) return;
   
         const token = await firebaseUser.getIdToken(true);
         setFbToken(token);
   
         const result = await api.post("/auth/login");
         if (result.data.success) {
            setUser(result.data.data);
         }
         else {
            await logOut();
         }
      } catch (error) {
         console.error("Backend sync failed:", error);
         await logOut();
         return { success: false };
      }
   }

   const googleSignIn = async (): Promise<AuthResult> => {
      try {
         const provider = new GoogleAuthProvider();
         provider.setCustomParameters({ prompt: "select_account" });
         await signInWithPopup(auth, provider);
         await syncUserWithBackend();
         return { success: true };
      } catch (error) {
         return {
            success: false,
            error: getAuthErrorMessage(error as AuthError),
         };
      }
   };

   const emailSignIn = async (
      email: string,
      password: string,
   ): Promise<AuthResult> => {
      try {
         await signInWithEmailAndPassword(auth, email, password);
         await syncUserWithBackend();
         return { success: true };
      } catch (error) {
         return {
            success: false,
            error: getAuthErrorMessage(error as AuthError),
         };
      }
   };

   const emailSignUp = async (
      email: string,
      password: string,
      userName: string
   ): Promise<AuthResult> => {
      try {
         const result = await createUserWithEmailAndPassword(auth, email, password);
         await updateProfile(result.user, {
            displayName: userName,
         });
         await syncUserWithBackend();
         return { success: true };
      } catch (error) {
         return {
            success: false,
            error: getAuthErrorMessage(error as AuthError),
         };
      }
   };

   const forgotPassword = async (email: string): Promise<AuthResult> => {
      try {
         await sendPasswordResetEmail(auth, email);
         return { success: true };
      } catch (error) {
         return {
            success: false,
            error: getAuthErrorMessage(error as AuthError),
         };
      }
   };

   const resetPassword = async (
      oobCode: string,
      newPassword: string
   ): Promise<AuthResult> => {
      try {
         await confirmPasswordReset(auth, oobCode, newPassword);
         return { success: true };
      } catch (error) {
         return {
            success: false,
            error: getAuthErrorMessage(error as AuthError),
         };
      }
   };

   const logOut = async () => {
      await signOut(auth);
      setUser(null);
      setFbToken(null);
      sessionStorage.setItem('redirectLogout', "true");
   };

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
         if (currentUser) {
            const token = await currentUser.getIdToken(true);
            setFbToken(token);

            if(!user){
               try {
                  const result = await api.get("/user");
                  if (result.data.success){
                     setUser(result.data.data);
                  }
                  else{
                     await logOut();
                  }
               } catch (error) {
                  console.error("Failed to fetch user profile:", error);
               }
            }
         } else {
            setUser(null);
            setFbToken(null);
         }
         setLoading(false);
      });

      return unsubscribe;
   }, []);

   return (
      <AuthContext.Provider
         value={{
            user,
            fbToken,
            setUser,
            loading,
            googleSignIn,
            emailSignIn,
            emailSignUp,
            forgotPassword,
            resetPassword,
            logOut,
         }}
      >  
         {children}
      </AuthContext.Provider>
   );
}


export const UserAuth = () => {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error("UserAuth must be used within AuthContextProvider");
   }

   return context;
};

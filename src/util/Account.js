import { myFirebase } from "../firebase";
import { getAuth, signInWithEmailAndPassword, signOut,createUserWithEmailAndPassword, onAuthStateChanged, updateEmail, sendEmailVerification} from "firebase/auth";
import { getUserByID } from "./Database";

export const auth = getAuth(myFirebase);

const errorMessage = (error) => {

    let errorMessage = '';
  
    switch (error.code) {
      case "auth/user-not-found":
          errorMessage = "User not found.";
          break;
      case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
      case "auth/invalid-email":
          errorMessage = "Invalid email.";
          break;
      case "auth/missing-password":
          errorMessage = "Please enter a password.";
          break;
      case "auth/operation-not-allowed":
          errorMessage = "Login not allowed. Contact support.";
          break;
      case "auth/invalid-credential":
          errorMessage = "Invalid Credentials."
          break;
      case "auth/network-request-failed":
        errorMessage = "Network issue. Please check your connection and try again.";
        break;
      case "auth/user-disabled":
        errorMessage = "This user is currently disabled. Please contact your Administrator."
        break;

      default:
          errorMessage = `Login Error (${error.code}): ${error.message}`;
  }
  
    return errorMessage;
};



const loginAccount = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const uid = user.uid;
    const token = await user.getIdToken();
    const data = await getUserByID(uid);

    return { isLoggedIn: true, user: { uid: uid, token: token, userType: data.data.employmentInformation.role }, message: "Login Successful" };
  } catch (error) {
    return { isLoggedIn: false, user: null, message: errorMessage(error) };
  }
};
  

  const createAccount = async (email, password) => {
    try {
      let response = await createUserWithEmailAndPassword(auth, email, password);
      return { isCreated: true, uid: response.user.uid, message: "Successfully Created." };
    } catch (error) {
      return { isCreated: false, uid: null, message: errorMessage(error)};
    }
  };


  const getEmail = onAuthStateChanged(auth, (user) => {
    if (user) {
      return user.email;
      
    } else {
      console.log('User is signed out');
    }
  });
  


  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
  
        unsubscribe();
      }, (error) => {
        reject(error);
      });
    });
  };


  const updateUserEmail = (newEmail) => {
    const user = auth.currentUser;

    if (user) {
      updateEmail(user, newEmail)
        .then(() => {
          //return sendEmailVerification(user);
          console.log("Email updated successfully");
        })
        .catch((error) => {
          console.error("Error updating email:", error.message);
        });
    } else {
      console.log("No user is signed in");
    }
  }


  const logOutAccount = async () => {
    signOut(auth)
    .then(() => {
      console.log("User signed out successfully");
    })
    .catch((error) => {
      console.error("Error signing out:", error.message);
    });
  };



export {loginAccount, createAccount, logOutAccount, getEmail, getCurrentUser, updateUserEmail};
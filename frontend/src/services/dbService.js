import { db } from "../../firebaseConfig"
import { arrayUnion, collection, getDocs, addDoc, serverTimestamp, orderBy, query, updateDoc, onSnapshot, where, doc, deleteDoc } from "firebase/firestore"

export async function createGig({ header, body, type, member_limit, user, scheduledDate, endTime }) {
  try {
    const members = [];
    const docRef = await addDoc(collection(db, "gigs"), {
        header,
        body,
        type,
        members,
        member_limit,
        user,
        scheduledDate,
        endTime,
        date: serverTimestamp()
    });
    console.log("Created group");
    return { id: docRef.id, header, body, type, members, member_limit, user, scheduledDate, endTime, date: new Date()}; // WILL RETURN IMMEDIATELY ON CALL
  } catch (error) {
    console.error("Error creating group:", error);
  }
}

export async function fetchAllGigs() {
  const snapshot = await getDocs(
    query(collection(db, "gigs"), orderBy("date", "desc"))
  );
  const gigs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return gigs;
}

export function subscribeToGigs(callback) {
  const q = query(collection(db, "gigs"), orderBy("date", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const gigs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(gigs);
  });
  return unsubscribe;
} // Allows feed to update automatically

export function addUserToGig(gigId, userId) {
  const gigRef = doc(db, "gigs", gigId);
  return updateDoc(gigRef, {
    members: arrayUnion(userId)
  });
}

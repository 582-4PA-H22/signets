import { bdFirestore } from "./init";
import { getDocs, query, orderBy, collection, addDoc, Timestamp, getDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";

export async function creer(uid, idDossier, url) {
    // Référence au document dans laquelle on veut ajouter le signet
    let doc = doc(bdFirestore, 'signets', uid, 'dossiers', idDossier);
    return await updateDoc(docRef, {});
}
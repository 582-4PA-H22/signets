import { bdFirestore } from "./init";
import { updateDoc, doc } from "firebase/firestore";

/**
 * Ajoute un signet en recréant le tableau des top3 dans le dossier identifié
 * @param {String} uid Identifiant Firebase Auth de l'utilisateur connecté
 * @param {String} idDossier Identifiant Firestore du dossier auquel on ajoute le signet
 * @param {Object[]} derniers3 Tableau des objest signets représentant les derniers 3 signets à conserver
 * @returns {Promise<void>} Promesse (sans paramètre) une fois que la requête Firestore est complétée
 */
export async function creer(uid, idDossier, derniers3) {
    // Référence au document dans laquelle on veut ajouter le signet
    let docRef = doc(bdFirestore, 'signets', uid, 'dossiers', idDossier);
    return await updateDoc(docRef, {top3: derniers3});
}
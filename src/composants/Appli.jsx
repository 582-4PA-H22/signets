// Fichier CSS
import './Appli.scss';

// Sous-composants
import Entete from './Entete';
import ListeDossiers from './ListeDossiers';
import FrmDossier from './FrmDossier';
import Accueil from './Accueil';

// Composants externes
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

// Fonctionnalités requises
import { useState, useEffect, createContext } from 'react';
// Remarquer les deux façons différentes d'importer des fonctionnalités
import { observerEtatConnexion } from '../code/utilisateur-modele';
import * as dossierModele from '../code/dossier-modele';

// Créer une variable de 'contexte' (globale) qui sera accessible dans les composants enfants
export const UtilisateurContext = createContext(null);

export default function Appli() {
  // État 'utilisateur'
  const [utilisateur, setUtilisateur] = useState(null);

  // État des 'dossiers' de l'utilisateur connecté
  const [dossiers, setDossiers] = useState([]);

  // État du formulaire d'ajout de dossier
  const [ouvert, setOuvert] = useState(false);

  // Gérer l'ajout d'un dossier
  function ajouterDossier(id, titre, couverture, couleur) {
    dossierModele.creer(utilisateur.uid, {
      titre: titre,
      couverture: couverture,
      couleur: couleur
    }).then(
      // On augmente les dossiers avec le nouveau document que nous 
      // venons d'ajouter dans Firestore
      // Remarquez que le document reçu est un objet complexe Firestore, et 
      // on doit construire l'objet simple avec le quel nous travaillons qui
      // contient uniquement les propriétés 'id' et 'titre', 'couleur', 
      // 'couverture', 'dateModif'
      doc => setDossiers([{id: doc.id, ...doc.data()}, ...dossiers])
    );
  }

  // Surveiller l'état de la connexion Firebase Auth
  useEffect(() => observerEtatConnexion(setUtilisateur),[]);
  
  return (
      utilisateur ?
        <UtilisateurContext.Provider value={utilisateur}>
          <div className="Appli">
            <Entete />
            <section className="contenu-principal">
              <ListeDossiers dossiers={dossiers} setDossiers={setDossiers}  />
              {/* Ajouter un composant FormDialog de MUI */}
              <FrmDossier ouvert={ouvert} setOuvert={setOuvert} gererActionDossier={ajouterDossier} />
              <Fab onClick={() => setOuvert(true)} size="large" className="ajoutRessource" color="primary" aria-label="Ajouter dossier">
                <AddIcon />
              </Fab>
            </section>
          </div>
        </UtilisateurContext.Provider>
      :
        <Accueil />
  
  );
}

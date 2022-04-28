import './Entete.scss';
import Avatar from '@mui/material/Avatar';
import { deconnexion } from '../code/utilisateur-modele';
import { UtilisateurContext } from './Appli';
import { useContext } from 'react';

export default function Entete() {
  const utilisateur = useContext(UtilisateurContext);
  return (
    <header className="Entete">
      <div className="logo">Signets</div>
      <nav>
        <div className="utilisateur">
          {utilisateur.displayName} 
          <Avatar className="avatar" title={utilisateur.email} alt={utilisateur.displayName} src={utilisateur.photoURL} />
        </div>
        <div className="btn-deconnexion" onClick={deconnexion}>Déconnexion</div>
      </nav>
    </header>
  );
}
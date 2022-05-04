import './Dossier.scss';
import IconButton from '@mui/material/IconButton';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import couvertureDefaut from '../images/couverture-defaut.webp';
import { formaterDate } from '../code/helper';
import { useState, useContext } from 'react';
import FrmDossier from './FrmDossier';
import * as signetModele from '../code/signet-modele';
import { UtilisateurContext } from './Appli';

export default function Dossier({ id, titre, couleur, dateModif, couverture, top3, supprimerDossier, modifierDossier, ajouterSignet }) {
  // État de la carte active
  const [carteActive, setCarteActive] = useState(false);
  
  // Identifiant de l'utilisateur 
  const utilisateur = useContext(UtilisateurContext)
  const uid = utilisateur.uid;

  // État des signets dans ce dossier
  const [signets, setSignets] = useState(top3 || []);

  // État du menu contextuel
  const [eltAncrage, setEltAncrage] = useState(null);
  const ouvertMenu = Boolean(eltAncrage);

  // État du formulaire de modification
  const [ouvertFrm, setOuvertFrm] = useState(false);

  function gererMenu(event) {
    setEltAncrage(event.currentTarget);
  };

  function gererFermerMenu() {

    setEltAncrage(null);
  };

  function afficherFormulaireDossier() {
    // Ouvrir le formulaire de modification du dossier (transférer l'info sir le
    // dossier dans le formulaire) ...
    setOuvertFrm(true);
    // ... puis fermer le menu.
    gererFermerMenu();
  }

  function gererSupprimer() {
    // Appeler la fonction de ListeDossiers qui gère la suppression dans Firestore
    supprimerDossier(id);

    // ... puis fermer le menu.
    gererFermerMenu();
  }

  // [TODO : enlever d'ici...]
  // Tester si l'URL dans la variable couverture est valide
  let urlCouverture;
  try {
    urlCouverture = new URL(couverture);
  }
  catch (e) {
    couverture = couvertureDefaut;
  }

  // État dropzone
  const [dropzone, setDropzone] = useState(false);

  function gererDragEnter(evt) {
    // Limiter aux liens
    evt.dataTransfer.effectAllowed = 'link';
    evt.preventDefault();
    setDropzone(true);
  }

  function gererDragOver(evt) {
    evt.preventDefault();
  }

  function gererDragLeave(evt) {
    setDropzone(false);
  }

  function gererDrop(evt) {
    evt.preventDefault();
    setDropzone(false);
    let url = evt.dataTransfer.getData("URL");
    // On aimerait aussi chercher le TITLE (une autre fois)

    // On appelle la méthode d'ajout d'un signet dans un dossier définie dans le composant
    // parent et passée ici en props
    // Elle prend deux arguments : id du dossier et chaîne de l'url glissée/déposée
    ajouterSignet(id, url);
  }

  function ajouterSignet(idDossier, url) {
    // signets[signets.length] = {adresse: url, titre: 'bla bla'};
    const derniers3 = [...signets, { adresse: url, titre: 'bla bla' }].slice(-3);
    console.log("Derniers 3 : ", derniers3);
    signetModele.creer(uid, idDossier, derniers3).then(
      () => setSignets(derniers3)
    )
  }

  return (
    <article className={"Dossier" + (dropzone ? ' dropzone' : '') + (carteActive ? ' actif' : '')} onDrop={gererDrop} onDragEnter={gererDragEnter} onDragOver={gererDragOver} onDragLeave={gererDragLeave} style={{ backgroundColor: couleur }}>
      <div className="carte">
        <div className="endroit" onClick={() => setCarteActive(true)}>
          <IconButton className="deplacer" aria-label="déplacer" disableRipple={true}>
            <SortIcon />
          </IconButton>
          <div className="couverture">
            <img src={couverture || couvertureDefaut} alt={titre} />
          </div>
          <div className="info">
            <h2>{titre}</h2>
            <p>Modifié : {formaterDate(dateModif.seconds)}</p>
          </div>
          <IconButton onClick={gererMenu} className="modifier" aria-label="modifier" size="small">
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="menu-contextuel-dossier"
            anchorEl={eltAncrage}
            open={ouvertMenu}
            onClose={gererFermerMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={afficherFormulaireDossier}>Modifier</MenuItem>
            <MenuItem onClick={gererSupprimer}>Supprimer</MenuItem>
          </Menu>
        </div>
        <div className="envers">
          <ButtonUnstyled onClick={() => setCarteActive(false)} className="tourner-carte" size="small">
            <CloseIcon />
          </ButtonUnstyled>
            {
              signets.map(
                signet => <a href={signet.adresse} target="_blank">{signet.titre}</a>
              )
            }
        </div>
      </div>

      <FrmDossier gererActionDossier={modifierDossier} ouvert={ouvertFrm} setOuvert={setOuvertFrm} id={id} titre_p={titre} couleur_p={couleur} couverture_p={couverture} />
    </article>
  );
}
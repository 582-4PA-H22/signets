import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TwitterPicker } from 'react-color';
import { useState } from 'react';

export default function FrmDossier({ id=null, titre_p='', couleur_p='#000', couverture_p='', ouvert, setOuvert, gererActionDossier }) {
    const [titre, setTitre] = useState(titre_p);
    const [couverture, setCouverture] = useState(couverture_p);
    const [couleur, setCouleur] = useState(couleur_p);

    function viderEtFermerFrm() {
        setTitre(titre_p);
        setCouverture(couverture_p);
        setCouleur(couleur_p);
        setOuvert(false);
    };

    function gererSoumettre() {
        // Code qui gère l'ajout dans Firestore
        if(titre.search(/[a-z]/i) != -1) {
            gererActionDossier(id, titre, couverture, couleur);
            
            // On doit l'appeler UNIQUEMENT lorsqu'on ajoute un nouveau dossier
            if(id === null) {
                viderEtFermerFrm();
            }
            
            setOuvert(false);
        }
    }

    return (
        <div>
            <Dialog open={ouvert} onClose={viderEtFermerFrm}>
                <DialogTitle>Modifier ce dossier</DialogTitle>
                <DialogContent>
                    {/* Titre du dossier */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="titre"
                        label="Titre du dossier"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={e => setTitre(e.target.value)}
                        value={titre}
                    />
                    {/* URL de l'image */}
                    <TextField
                        margin="dense"
                        id="couverture"
                        label="Image couverture du dossier"
                        type="url"
                        fullWidth
                        variant="standard"
                        style={{ marginBottom: "1.5rem" }}
                        onChange={e => setCouverture(e.target.value)}
                        value={couverture}
                    />
                    {/* Choix de couleur */}
                    <TwitterPicker
                        triangle='hide'
                        color={couleur}
                        colors={["#900", "#090", "#009", "orange"]}
                        width="auto"
                        onChangeComplete={(couleur, e) => setCouleur(couleur.hex)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={viderEtFermerFrm}>Annuler</Button>
                    <Button onClick={gererSoumettre}>Soumettre</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

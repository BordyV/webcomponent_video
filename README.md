# webcomponent_video

Exemple d'utilisation en ligne :
https://valentinbordy.fr/webcomponent/

## API du webComponent :
Il se peut qu'il manque des opérations dans les exemples suivants, n'hésitez pas à consulter le code [github](https://github.com/BordyV/webcomponent_video/blob/main/monLecteurVideo/index.js)
## Exemple d'utilisation :
Télécharger le dossier [monLecteurVideo](https://github.com/BordyV/webcomponent_video/blob/main/monLecteurVideo) du projet git et l'ajouter à votre projet puis :
````html
<script src="./monLecteurVideo/index.js" type="module"></script>
````
````html
   <my-player id="player" width-size="50%" start-second="20"
                controller-video="true" controller-canvas="true" controller-audio="true" 
                keyboard-listener="false" src="PathToTheVideo/video.mp4"></my-player>
````
## définition des attributs :
- **width-size** - **Non obligatoire** - Permet de régler la taille du component
- - Valeur par défaut : **65%**
<br><br>

- **controller-video** - **Non obligatoire** - Permet d'afficher les controllers vidéo du component
- - Valeur par défaut : **true**
- - Valeurs possibles : **true / false**
<br><br>

- **controller-canvas** - **Non obligatoire** - Permet d'afficher le canvas du spectre audio du component
- - Valeur par défaut : **true**
- - Valeurs possibles : **true / false**
<br><br>

- **controller-audio** - **Non obligatoire** - Permet d'afficher les controllers audio du component
- - Valeur par défaut : **true**
- - Valeurs possibles : **true / false**
<br><br>

- **keyboard-listener** - **Non obligatoire** - Permet d'activer les commandes clavier du web component
- - Valeur par défaut : **true**
- - Valeurs possibles : **true / false**
<br><br>

- **start-second** - **Non obligatoire** - Secondes de départ de la vidéo
<br><br>

- **src** - **Obligatoire** - Source de la vidéo
## Touche possible avec les commandes claviers : 
- **espace** - met la vidéo en pause ou en lecture en fonction de son état
- **M **- permetde couper le son de la vidéo
- **D ou →** - permet d'avancer la vidéo de 10 secondes
- **Q ou ←** - permet de reculer la vidéo de 10 secondes
- **I** - permet d'afficher les informations de la vidéo
- **clique sur la vidéo** - met la vidéo en pause ou en lecture en fonction de son état

## Opérations video : 
- **play()** //jouer la vidéo
- **pause()** //mettre en pause la vidéo
- **playpause()** //alterner jouer/pause la vidéo
- **avance10()** //avance de 10 secondes la vidéo
- **avanceX(secondes)** //avance de X temps la vidéo (param en secondes)
- **recule10()** //recule de 10 secondes la vidéo
- **reculeX(secondes)** //recule de X temps la vidéo (param en secondes)
- **openInfoModal()** //ouvre la modal d'information
- **closeModal()** //ferme la modal d'information
- **changeVitesse(vitesse)** //change la vitesse de la vidéo
- **goToSecond(secondes)** //se rend à la seconde passé en param 
##  Opérations audio :
- **changeVolume(de 0 à 1)** //change le volume de la vidéo de 0 à 1 
- **changeBalance(de -1 à 1)** //change la balance gauche droite -1 étant gauche et 1 étant droite
- **changeMasterGain(de 0 à 10)** //change le gain global de 0 à 1
- **changeGain(-30 à 30,numéro filtre)** //change le gain d'un filtre particulier entre -30 et 30, le numéro de filtre est entre 0 et 5 soit : 60Hz -> 0, 170Hz -> 1, 350Hz -> 2, 1000Hz -> 3, 3500Hz->4, 10000Hz->5

## Autres opérations : 
- **togglePictureInPicture()** //ouvre le mode big picture ou le ferme
- **setWidthSizeWebComponent(taille + unité (ex : 800 px))** //change la largeur et la taille global du web component 
 - **changeSource(lien de la vidéo (source))** //change la source de la vidéo
- **setDisplayController( false, true, false)** //active ou désactive les controles de la vidéo, le premier param est les controles vidéos, le second est l'affichage du canvas et le dernier les controles audios
- **activeEcouteurKeyboard()** //active les controles via les touches claviers
- **disabledEcouteurKeyBoard()** //desactive les controles via les touches claviers
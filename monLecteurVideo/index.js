
import './lib/webaudio-controls.js';

const getBaseURL = () => {
    return new URL('.', import.meta.url);
};

let style = `
/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 350px;
}

/* The Close Button */
#close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

#close:hover,
#close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

figure {
    box-shadow:
      0 2.8px 2.2px rgba(0, 0, 0, 0.034),
      0 6.7px 5.3px rgba(0, 0, 0, 0.048),
      0 12.5px 10px rgba(0, 0, 0, 0.06),
      0 22.3px 17.9px rgba(0, 0, 0, 0.072),
      0 41.8px 33.4px rgba(0, 0, 0, 0.086),
      0 100px 80px rgba(0, 0, 0, 0.12);
    width: 65%;
  }
  
  video {
    display: block;
    width: 100%;
  }
  progress {
      width: 100%
  }
  
  figcaption {
    align-items: center;
    background: #eaeaea;
    display: grid;
    grid-gap: 1rem;
    /* play +10 vitessex4 volume progressbar timing info*/
    grid-template-columns: 35px 50px 50px 50px 30px auto 50px 20px;
    padding: .5rem;
  }

  button {
    border: 0;
    display: inline;
    padding: .5rem;
    transition: opacity .25s ease-out;
    width: 100%;
  }
  
  
`;

let template = /*html*/`
<figure>
<video id="player">
  <br>  
  </video>
  <figcaption>
  <button aria-label="Play" id="playPause">▶️</button>
  <button id="recule10">-10s</button>
  <button id="avance10">+10s</button>
  <select name="vitesse" id="vitesse-select">
    <option value="0.5">x0.5</option>
    <option value="1" selected="selected">x1</option>
    <option value="2">x2</option>
    <option value="4">x4</option>
  </select>
  <webaudio-knob id="volume" min=0 max=1 value=0.5 step="0.01" 
         tooltip="%s" diameter="20" src="./assets/Aqua.png" sprites="100"></webaudio-knob>

  <progress id="progress" max="100" value="0">Progress</progress>
  <label id="timer" for="progress" role="timer">0min0</label>
  <button id="info">ℹ️</button>

  </figcaption>
</figure>
  <br>





         <!-- The Modal -->
<div id="myModal" class="modal" style="display: none;">

  <!-- Modal content -->
  <div class="modal-content">
    <span id="close">&times;</span>
    <p id="textModal">
 </p>
  </div>

</div>

   `;

let isModalOpen = false;
let playing = false;

class MyVideoPlayer extends HTMLElement {
    constructor() {
        super();

        console.log("BaseURL = " + getBaseURL());
        this.attachShadow({ mode: "open" });
    }


    fixRelativeURLs() {
        // pour les knobs
        let knobs = this.shadowRoot.querySelectorAll('webaudio-knob, video');
        knobs.forEach((e) => {
            let path = e.getAttribute('src');
            e.src = getBaseURL() + '/' + path;
        });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = '';

        // Appelée avant affichage du composant
        //this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;
        this.fixRelativeURLs();

        this.player = this.shadowRoot.querySelector("#player");
        // récupération de l'attribut HTML
        this.player.src = this.getAttribute("src");

        // déclarer les écouteurs sur les boutons
        this.definitEcouteurs();
    }

    definitEcouteurs() {
        console.log("ecouteurs définis")
        this.shadowRoot.querySelector("#playPause").onclick = () => {
            playing = !playing;
            this.playpause();
        }
        this.shadowRoot.querySelector("#player").onclick = () => {
            playing = !playing;
            this.playpause();
        }
        this.shadowRoot.querySelector("#avance10").onclick = () => {
            this.player.currentTime += parseFloat("10.0");
        }
        this.shadowRoot.querySelector("#recule10").onclick = () => {
            this.player.currentTime -= parseFloat("10.0");
        }
        this.shadowRoot.querySelector("#vitesse-select").onclick = (event) => {
            this.player.playbackRate = this.shadowRoot.querySelector("#vitesse-select").value;
        }
        this.shadowRoot.querySelector("#info").onclick = (event) => {
            let minutes = Math.floor(this.player.duration / 60);
            let seconds = this.player.duration - minutes * 60;
            let minSec = minutes + seconds / 100 + "";

            console.log("Durée de la vidéo : " + minSec);
            console.log("Temps courant : " + this.player.currentTime);
            console.log("lien de la vidé : " + this.player.currentSrc);
            let modalText = this.shadowRoot.querySelector("#textModal");
            modalText.innerHTML = '<b>Durée de la vidéo : </b>' + minutes + "min" +
                Math.round(seconds) +
                '<b><br> Lien de la vidéo : </b>' + this.player.currentSrc;
            this.openModal(event);
        }
        this.shadowRoot.querySelector("#player").onplay = () => {
            this.progressLoop();
        }
        this.shadowRoot.querySelector("#volume").oninput = (event) => {
            const vol = parseFloat(event.target.value);
            this.player.volume = vol;
        }
        this.shadowRoot.querySelector("#close").onclick = (event) => {
            this.shadowRoot.querySelector("#myModal").style.display = "none";
        }
        // window.onclick = (event) => {
        //     let modal = this.shadowRoot.querySelector("#myModal");

        //     //isModalOpen repasse à false car l'event est appelé 1 fois avant qu'on souhaite le fermer
        //     //une fois sur le clique du bouton info 
        //     console.log(event.target);
        //     console.log("test", this);
        //     console.log(event.target == modal);

        //     if (modal && event.target == this && isModalOpen) {
        //         isModalOpen = false;
        //         this.shadowRoot.querySelector("#myModal").style.display = "none";
        //     }

        // }

    }
    playpause() {
        if (playing) {
            this.play();
            this.shadowRoot.querySelector("#playPause").innerHTML = "⏸️";
        } else {
            this.pause();
            this.shadowRoot.querySelector("#playPause").innerHTML = "▶️";
        }
    }

    openModal(event) {
        this.shadowRoot.querySelector("#myModal").style.display = "block";
        isModalOpen = true;
        event.stopPropagation();
    }

    progressLoop() {
        let progress = this.shadowRoot.querySelector("#progress");
        let timer = this.shadowRoot.querySelector("#timer");

        setInterval(() => {

            let minutes = Math.floor(this.player.currentTime / 60);
            let seconds = this.player.currentTime - minutes * 60;

            progress.value = Math.round((this.shadowRoot.querySelector("#player").currentTime / this.shadowRoot.querySelector("#player").duration) * 100);
            timer.innerHTML = minutes + "min" +
                Math.round(seconds);
        });
    }

    // API de mon composant
    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }
}

customElements.define("my-player", MyVideoPlayer);



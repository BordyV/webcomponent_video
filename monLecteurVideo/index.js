
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
      /**valeur par défaut si rien n'est sélectionné */
      width: 65%;
  }
  
  video {
    display: block;
    width: 100%;
  }
  canvas {
      width: 30%
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
    padding: .5rem;
  }

  figcaption#figcaptionVideo {
    /* play +10 vitessex4 volume progressbar timing info*/
    grid-template-columns: 35px 50px 50px 50px 30px auto 50px 15px 20px;
  }

  figcaption#figcaptionCanvas canvas {
    margin-left: auto;
    margin-right: auto;
  }

  #figcaptionAudio {
      text-align:center;
    padding-bottom : 25px;
    grid-template-columns: auto 50px 50px 50px 50px 50px 50px auto;
  }

  button  {
    border: 0;
    display: inline;
    padding: .5rem;
    transition: opacity .25s ease-out;
    width: 100%;
    cursor: pointer;
  }
  select {
    border: 0;
    display: inline;
    cursor: pointer;

  }
  
  
`;

let template = /*html*/`
<figure id="figureVideo">
<video id="player" crossorigin="anonymous">
  <br>  
  </video>
  <figcaption id="figcaptionVideo">
  <button aria-label="Play" id="playPause" title="play/pause de la vidéo">▶️</button>
  <button id="recule10" title="reculer de 10 secondes">-10s</button>
  <button id="avance10" title="avancer de 10 secondes">+10s</button>
  <select name="vitesse" id="vitesse-select" title="vitesse">
    <option value="0.5">x0.5</option>
    <option value="1" selected="selected">x1</option>
    <option value="1.5" >x1.5</option>
    <option value="2">x2</option>
    <option value="4">x4</option>
  </select>
  <webaudio-knob id="volume" min=0 max=1 value=0.5 step="0.01" 
         tooltip="%s" diameter="30" src="./assets/Aqua.png" sprites="100"></webaudio-knob>

  <progress id="progress" max="100" value="0">Progress</progress>
  <label id="timer" for="progress" role="timer">0min0</label>
  <button id="info" title="info de la vidéo">ℹ️</button>
  <button id="pictureInPicture" title="mode picture in picture">🗖</button>

  </figcaption>
  <figcaption id="figcaptionCanvas">
    <canvas id="canvas" height=100></canvas>
  </figcaption>
  
  <figcaption id="figcaptionAudio">
    <webaudio-knob id="balance" min=-1 max=1 value=0 step="0.01" 
    tooltip="%s" diameter="50" src="./assets/LittlePhatty.png" sprites="100">balance</webaudio-knob>
    
    <webaudio-knob id="gain0" min="-30" max="30" value="0" step="1" 
        tooltip="%s" diameter="50" src="./assets/LittlePhatty.png" sprites="100">60Hz</webaudio-knob>
    
    <webaudio-knob id="gain1" min="-30" max="30" value="0" step="1" 
        tooltip="%s" diameter="50" src="./assets/LittlePhatty.png" sprites="100">170Hz</webaudio-knob>
    
    <webaudio-knob id="gain2" min="-30" max="30" value="0" step="1" 
        tooltip="%s" diameter="50" src="./assets/LittlePhatty.png" sprites="100">350Hz</webaudio-knob>
        
    <webaudio-knob id="gain3" min="-30" max="30" value="0" step="1" 
        tooltip="%s" diameter="50" src="./assets/LittlePhatty.png" sprites="100">1000Hz</webaudio-knob>
        
    <webaudio-knob id="gain4" min="-30" max="30" value="0" step="1" 
        tooltip="%s" diameter="50" src="./assets/LittlePhatty.png" sprites="100">3500Hz</webaudio-knob>
    
        
    <webaudio-knob id="gain5" min="-30" max="30" value="0" step="1"
        tooltip="%s" diameter="50" src="./assets/LittlePhatty.png" sprites="100">10000Hz</webaudio-knob>
         
    <webaudio-knob id="masterGain" min="0" max="10" value="10" step="0.1"
        tooltip="%s" diameter="50" src="./assets/LittlePhatty.png" sprites="100">Master Gain</webaudio-knob>
         
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

var audioContext;
var stereoPanner;
var audioCtx = window.AudioContext || window.webkitAudioContext;
var analyser, analyserLeft, analyserRight;
var dataArray, bufferLength;
var dataArrayLeft, dataArrayRight;
var pannerNode;
var filters = [];

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


        this.canvas = this.shadowRoot.querySelector("#canvas");
        this.player = this.shadowRoot.querySelector("#player");
        this.filters = [];

        // récupération des attributs HTML
        this.player.src = this.getAttribute("src");
        let widthSize = this.getAttribute("width-size");

        this.setWidthSizeWebComponent(widthSize);

        let controllerVideo = this.getAttribute("controller-video");
        let controllerCanvas = this.getAttribute("controller-canvas");
        let controllerAudio = this.getAttribute("controller-audio");
        this.setDisplayController(controllerVideo, controllerCanvas, controllerAudio);
        // déclarer les écouteurs sur les boutons
        this.definitEcouteurs();

        this.init();
        requestAnimationFrame(() => this.visualize());
        this.drawAnimation();
    }

    definitEcouteurs() {
        console.log("ecouteurs définis")
        this.shadowRoot.querySelector("#playPause").onclick = () => {
            this.playpause();
        }
        this.shadowRoot.querySelector("#player").onclick = () => {
            this.playpause();
        }
        this.shadowRoot.querySelector("#avance10").onclick = () => {
            this.avance10();
        }
        this.shadowRoot.querySelector("#recule10").onclick = () => {
            this.recule10();
        }
        this.shadowRoot.querySelector("#vitesse-select").onclick = () => {
            this.changeVitesse(this.shadowRoot.querySelector("#vitesse-select").value);
        }
        this.shadowRoot.querySelector("#info").onclick = (event) => {
            this.openModal();
        }
        this.shadowRoot.querySelector("#player").onplay = () => {
            this.audioContext.resume();
            this.progressLoop();
            this.play();
        }
        this.shadowRoot.querySelector("#player").onpause = () => {
            this.pause();
        }
        this.shadowRoot.querySelector("#volume").oninput = (event) => {
            const vol = parseFloat(event.target.value);
            this.changeVolume(vol);
        }
        this.shadowRoot.querySelector("#close").onclick = (event) => {
            this.closeModal();
        }
        this.shadowRoot.querySelector("#balance").oninput = (event) => {
            var value = parseFloat(event.target.value);
            this.changeBalance(value);
        }
        this.shadowRoot.querySelector("#gain0").oninput = (event) => {
            var value = event.target.value;
            this.changeGain(value, 0);
        }
        this.shadowRoot.querySelector("#gain1").oninput = (event) => {
            var value = event.target.value;
            this.changeGain(value, 1);
        }
        this.shadowRoot.querySelector("#gain2").oninput = (event) => {
            var value = event.target.value;
            this.changeGain(value, 2);
        }
        this.shadowRoot.querySelector("#gain3").oninput = (event) => {
            var value = event.target.value;
            this.changeGain(value, 3);
        }
        this.shadowRoot.querySelector("#gain4").oninput = (event) => {
            var value = event.target.value;
            this.changeGain(value, 4);
        }
        this.shadowRoot.querySelector("#gain5").oninput = (event) => {
            var value = event.target.value;
            this.changeGain(value, 5);
        }
        this.shadowRoot.querySelector("#masterGain").oninput = (event) => {
            var value = event.target.value;
            this.changeMasterGain(value);
        }
        this.shadowRoot.querySelector("#pictureInPicture").onclick = (event) => {
            this.togglePictureInPicture();
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

    init() {
        this.audioContext = new audioCtx();

        const interval = setInterval(() => {
            if (this.player) {

                this.sourceNode = this.audioContext.createMediaElementSource(this.player);
                this.analyser = this.audioContext.createAnalyser();

                this.analyser.fftSize = 256;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);

                // this.sourceNode.connect(this.analyser);
                // this.analyser.connect(this.audioContext.destination);

                this.stereoPanner = this.audioContext.createStereoPanner();

                // connect nodes together
                // this.sourceNode.connect(this.stereoPanner);
                // this.stereoPanner.connect(this.audioContext.destination);


                // Set filters
                [60, 170, 350, 1000, 3500, 10000].forEach((freq, i) => {
                    this.eq = this.audioContext.createBiquadFilter();
                    this.eq.frequency.value = freq;
                    this.eq.type = "peaking";
                    this.eq.gain.value = 0;
                    this.filters.push(this.eq);
                });

                // Connect filters in serie
                this.sourceNode.connect(this.filters[0]);
                for (var i = 0; i < this.filters.length - 1; i++) {
                    this.filters[i].connect(this.filters[i + 1]);
                }

                // Master volume is a gain node
                this.masterGain = this.audioContext.createGain();
                this.masterGain.value = 1;


                // connect the last filter to the speakers
                this.filters[this.filters.length - 1].connect(this.masterGain);

                // for stereo balancing, split the signal
                // connect master volume output to the panner
                this.masterGain.connect(this.stereoPanner);
                this.stereoPanner.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);

                clearInterval(interval);
            }
        }, 500);

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.canvasContext = this.canvas.getContext('2d');

    }

    visualize() {
        if (!this.analyser) {
            setTimeout(() => {
                requestAnimationFrame(() => this.visualize());
            }, 100);
            return;
        }

        this.canvasContext.clearRect(0, 0, this.width, this.height);
        this.analyser.getByteFrequencyData(this.dataArray);

        const barWidth = this.width / this.bufferLength;
        var barHeight;
        var x = 0;
        const heightScale = this.height / 128;

        for (var i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i];
            this.canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ', 150, 50)';
            barHeight *= heightScale;
            this.canvasContext.fillRect(x, this.height - barHeight / 2, barWidth, barHeight / 2);
            x += barWidth + 1;
        }
        requestAnimationFrame(() => this.visualize());
    }

    drawAnimation() {
        requestAnimationFrame(this.drawAnimation.bind(this));
    }



    playpause() {
        playing = !playing;
        if (playing) {
            this.audioContext.resume();
            this.play();
        } else {
            this.pause();
        }
    }

    openModal() {
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
        this.shadowRoot.querySelector("#myModal").style.display = "block";
        isModalOpen = true;
    }
    closeModal() {
        this.shadowRoot.querySelector("#myModal").style.display = "none";
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
        playing = true;
        this.shadowRoot.querySelector("#playPause").innerHTML = "⏸️";
        this.audioContext.resume();
        this.player.play();
    }
    pause() {
        playing = false;
        this.shadowRoot.querySelector("#playPause").innerHTML = "▶️";
        this.player.pause();
    }
    changeVitesse(vitesse) {
        this.player.playbackRate = vitesse;

        this.player.currentTime += parseFloat("10.0");
    }
    avance10() {
        this.player.currentTime += parseFloat("10.0");
    }
    recule10() {
        this.player.currentTime -= parseFloat("10.0");
    }
    changeVolume(vol) {
        this.player.volume = vol;
    }
    changeBalance(value) {
        this.stereoPanner.pan.value = value;
    }
    changeGain(sliderVal, nbFilter) {
        var value = parseFloat(sliderVal);
        if (isFinite(value)) {
            this.filters[nbFilter].gain.value = value;
            console.log(this.filters[nbFilter].gain.value)

        }
    }
    changeMasterGain(sliderVal) {
        var value = parseFloat(sliderVal);
        this.masterGain.gain.value = value / 10;
    }
    togglePictureInPicture() {
        if (this.player !== document.pictureInPictureElement)
            this.player.requestPictureInPicture();
        else
            document.exitPictureInPicture();
    }

    setDisplayController(controllerVideo, controllerCanvas, controllerAudio) {
        //controllerVideo
        if (controllerVideo === "false") {
            this.shadowRoot.querySelector("#figcaptionVideo").style.display = "none";
        } else if (controllerVideo === "true") {
            this.shadowRoot.querySelector("#figcaptionVideo").style.display = "grid";
        }
        //controllerCanvas
        if (controllerCanvas === "false") {
            this.shadowRoot.querySelector("#figcaptionCanvas").style.display = "none";
        } else if (controllerCanvas === "true") {
            this.shadowRoot.querySelector("#figcaptionCanvas").style.display = "grid";
        }
        //controllerAudio
        if (controllerAudio === "false") {
            this.shadowRoot.querySelector("#figcaptionAudio").style.display = "none";
        } else if (controllerAudio === "true") {
            this.shadowRoot.querySelector("#figcaptionAudio").style.display = "grid";
        }
    }

    setWidthSizeWebComponent(widthSize) {
        this.shadowRoot.querySelector("#figureVideo").style.width = widthSize;
    }
}

customElements.define("my-player", MyVideoPlayer);



class PCube extends HTMLElement {
  offset =  "calc(var(--size)/4)";
  size = "30vh";
  static observedAttributes = ["offset", "size"];
  constructor() {
    super();
  }
  initFields(){
    this.offset = this.getAttribute("offset") ?? "calc(var(--size)/4)";
    this.size = this.getAttribute("size") ?? "30vh";

  }
  connectedCallback() {
    this.initFields();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = this.getCube();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name){
        case "offset":
            this.offset = newValue;
            break;
        case "size":
            this.size = newValue;
            break;
    }
    this.refreshView();
  }
  
  refreshView(){
    if(this.shadowRoot)
    {
      var scene = this.shadowRoot.querySelector(".scene");
      if(scene){
        scene.setAttribute("style",`
        --size:${this.size};
        --offset:${this.offset};
        `)
      }
    }
  }
  getCube() {
    return `
      <style>
        .scene {
            --size: ${this.size};
            --offset: ${this.offset};
            --deg0: 0deg;
            --deg90: 90deg;
            --deg180: 180deg;
            --deg270: 270deg;
            --radial: radial-gradient(var(--size), rgba(145, 143, 143, 0.3), 15%, rgb(255, 255, 255));
            --radial: radial-gradient(var(--size), rgb(32 220 29), 15%, rgb(226 255 230));

            z-index: -1;
            height: var(--size);
            width: var(--size);
            transform-style: preserve-3d;
            animation: rotate 5s linear infinite;
            transition: 1sec;
        
        }
            
        
    .box {
        --angleX: 0deg;
        --angleY: 0deg;
        width: 100%;
        transition: 1s linear;
        backface-visibility: visible;
        height: 100%;
        background-image: var(--radial);
        position: absolute;
        transform:rotateX(var(--angleX)) rotateY(var(--angleY)) translateZ(var(--offset));
    }

    .front {
        --angleX: var(--deg0);
        --angleY: var(--deg0);
    }
    .bottom {
        --angleX: var(--deg90);
        --angleY: var(--deg0);
    }
    .top {
        --angleX: var(--deg270);
        --angleY: var(--deg0);
    }
    .left {
        --angleX: var(--deg0);
        --angleY: var(--deg90);
    }
    .back {
        --angleX: var(--deg0);
        --angleY: var(--deg180);
    }
    .right {
        --angleX: var(--deg0);
        --angleY: var(--deg270);
    }

    @keyframes rotate {
        from {
            transform: rotate3d(1, 0, 0, 0deg);
        }

        to {
            transform: rotate3d(1, 1, 1, 360deg);
        }
    }

      
      </style>
       <div class="scene">
           <div class="front box"></div>
           <div class="back box"></div>
           <div class="left box"></div>
           <div class="right box"></div>
           <div class="top box"></div>
           <div class="bottom box"></div>
       </div>
       `;
  }

}

customElements.define("p-cube", PCube);

class PName extends HTMLElement {
    text =  "Pratik Mohite";
    static observedAttributes = ["text"];
   
    constructor() {
      super();
    }

    initFields(){
      this.text = this.getAttribute("text") ?? "Pratik Mohite";
    }

    connectedCallback() {
      this.initFields();
      this.shadow = this.attachShadow({ mode: 'open' });
      this.shadow.innerHTML = this.getContent();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      switch(name){
          case "text":
              this.text = newValue;
              break;
      }
      this.refreshView();
    }
    
    refreshView(){
      if(this.shadowRoot)
      {
        var pnames = this.shadowRoot.querySelectorAll(".pname");
        for(var n in pnames){
          console.log(n);
        }
      }
    }
    getContent() {
      return `
      <style>
      .svg-text {
        transform: rotateX(10deg) scale(1.2);
        font-family: Kreon, sans-serif;
      }
      .svg-text__shaded {
        text-shadow: 0 1px 1px rgba(33, 33, 33, 0.15),
          0 3px 10px rgba(33, 33, 33, 0.15), 0 3px 20px rgba(33, 33, 33, 0.35);
      }
      .svg-text .bold {
        font-size: 2rem;
        font-family: Kreon, sans-serif;
        font-weight: 700;
      }
      </style>
      <svg
      class="svg-text"
      height="50px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <symbol id="stroke-2">
          <text
            class="bold pname"
            x="50%"
            y="87%"
            fill="none"
            stroke-width=".1rem"
            stroke-linecap="round"
            stroke-linejoin="round"
            paint-order="stroke fill"
            text-anchor="middle"
          >
            ${this.text}
          </text>
        </symbol>
        <symbol id="fill-2">
          <text class="bold pname" x="50%" y="80%" text-anchor="middle">
           ${this.text}
          </text>
        </symbol>
      </defs>
      <g stroke="#00cccc">
        <use
          y="5%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#stroke-2"
          opacity="0.5"
          filter="url(#drop-stroke-shadow)"
        ></use>
        <use
          y="3%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#stroke-2"
        ></use>
        <use
          y="2%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#stroke-2"
        ></use>
        <use
          y="1%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#stroke-2"
        ></use>
        <use
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#stroke-2"
          stroke="cyan"
        ></use>
      </g>
      <g fill="#e6e6e6">
        <use
          class="svg-text__shaded"
          y="7%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
        ></use>
        <use
          y="6.5%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
        ></use>
        <use
          y="6%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
        ></use>
        <use
          y="5.5%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
        ></use>
        <use
          y="5%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
        ></use>
        <use
          y="4.5%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
        ></use>
        <use
          y="4%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
        ></use>
        <use
          y="3.5%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
        ></use>
        <use
          y="3%"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          xlink:href="#fill-2"
          fill="white"
        ></use>
      </g>
    </svg>
         `;
    }
  
  }
  
  customElements.define("p-name", PName);
  
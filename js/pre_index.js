async function loadTemplates() {
  const templateUrl = "./templates.html";
  await fetch(templateUrl)
    .then((r) => r.text())
    .then((content) => {
      var tempateConainer = document.getElementById("template-container")
      tempateConainer.innerHTML = content;
    });
}

function getTemplateContent(templateId) {
  const template = document.getElementById(templateId);
  if (template) {
    const content = template.content;
    return content;
  } else {
    return document.createElement("div");
  }
}

function attachTemplateToShadowDom(shadow, templateId) {
  const content = getTemplateContent(templateId);
  if (shadow) {
    shadow.replaceChildren(content);
  }
}

class PNav extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    attachTemplateToShadowDom(shadow, "p-nav");
  }
}

class PHeader extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    attachTemplateToShadowDom(shadow, "p-header");
  }
}

class PFooter extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    attachTemplateToShadowDom(shadow, "p-footer");
  }
}

class PBitList extends HTMLElement {
  url = "./resource/index.json"
  constructor() {
    super();
  }
  connectedCallback() {
      this.shadow = this.attachShadow({ mode: "open" });
      this.shadow.innerHTML = `<label>Bit List</label>`;
      this.fetchProjects();
 }
 
  fetchProjects(){
      fetch(this.url).then(res=>res.json()).then(projects=>{
          var projectTable = document.createElement("ul");
          projects.forEach(function(project) {
              var row = document.createElement("li");
              var demoLinkCell = document.createElement("td");
              var demoLink = document.createElement("a");
              demoLink.href = project.demo_link;
              demoLink.textContent =  project.title;;
              demoLinkCell.appendChild(demoLink);
              var tagsCell = document.createElement("td");
              project.tags.forEach(function(tag) {
                  var tagSpan = document.createElement("span");
                  tagSpan.classList.add("tag", tag.color);
                  tagSpan.textContent = tag.text;
                  tagsCell.appendChild(tagSpan);
              });
              row.appendChild(demoLinkCell);
              projectTable.appendChild(row);
          });
          this.shadow.appendChild(projectTable);
      })
  }
}

class PLoadHtml extends HTMLElement {
  path =  "";
  static observedAttributes = ["path"];
  constructor() {
    super();
  }
  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.innerHTML = "<div>Loading...</div>"
    this.refreshView();
  }
  attributeChangedCallback(name, oldValue, newValue) {
      switch(name){
          case "path":
              this.path = newValue;
              break;
      }
      this.refreshView();
  }
  refreshView(){
      if(this.shadow)
      {
          this.shadow.innerHTML = "<div>Loading...</div>"
          fetch(this.path)
          .then((value)=> value.text())
          .then(content=> {
          this.shadow.innerHTML = content;
          })
      }
  }
}

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
      font-family: Kreon, fantasy, sans-serif;
    }
    .svg-text__shaded {
      text-shadow: 0 1px 1px rgba(33, 33, 33, 0.15),
        0 3px 10px rgba(33, 33, 33, 0.15), 0 3px 20px rgba(33, 33, 33, 0.35);
    }
    .svg-text .bold {
      font-size: 2rem;
      font-family: Kreon, fantasy, sans-serif;
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


  await loadTemplates();
  customElements.define("p-name", PName);
  customElements.define("p-cube", PCube);
  customElements.define("p-bit-list", PBitList);
  customElements.define("p-nav", PNav);
  customElements.define("p-header", PHeader);
  customElements.define("p-footer", PFooter);
  customElements.define("p-load", PLoadHtml);
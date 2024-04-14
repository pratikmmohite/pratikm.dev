class PNav extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
        <link rel="stylesheet" href="./css/common.css" />
        <link rel="stylesheet" href="./css/nav.css" />
        <nav class="pc-nav p-flex-c p-flex-fdr">
           <a href="#">Home</a>
           <a href="#">Project</a>
           <a href="#">Diary</a>
        </nav>
        `;
   }
    
  }

  customElements.define("p-nav", PNav);

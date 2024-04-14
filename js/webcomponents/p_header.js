class PHeader extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
        <link rel="stylesheet" href="./css/common.css" />
        <link rel="stylesheet" href="./css/header.css" />
        <header class="pc-header p-flex-c p-flex-fdc">
            <aside>
            <div class="pc-profile p-flex-c p-flex-fdc">
                <img
                class="pc-profile-logo"
                height="100px"
                width="100px"
                src="https://avatars.githubusercontent.com/u/32018912"
                alt="profile"
                loading="lazy"
                />
                <p-name text="PRATIK MOHITE"></p-name>
            </div>
            </aside>
        </header>
        `;
   }
    
  }

  customElements.define("p-header", PHeader);

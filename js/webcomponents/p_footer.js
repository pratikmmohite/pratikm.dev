class PFooter extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
        <link rel="stylesheet" href="./css/common.css" />
        <link rel="stylesheet" href="./css/footer.css" />
        <footer class="pc-footer p-flex-c p-flex-fdr">
            <a
            href="https://github.com/pratikmmohite"
            target="_blank"
            rel="noopener"
            >
            <img width="30px" height="30px" src="images/github.png" alt="github"
            /></a>
            <a
            href="https://pratikmmohite.blogspot.com/"
            target="_blank"
            rel="noopener"
            ><img
                width="30px"
                height="30px"
                loading="lazy"
                src="images/blogger.png"
                alt="blogger"
            /></a>
            <a
            href="https://www.sololearn.com/Profile/3003792"
            target="_blank"
            rel="noopener"
            ><img
                width="30px"
                height="30px"
                loading="lazy"
                src="images/sololearn.svg"
                alt="sololearn"
            /></a>
            <a
            href="https://www.hackerrank.com/pratikmmohite"
            target="_blank"
            rel="noopener"
            ><img
                width="30px"
                height="30px"
                src="images/hackerrank.png"
                loading="lazy"
                alt="hackerrank"
            /></a>
            <a
            href="https://twitter.com/PratikMMohite"
            target="_blank"
            rel="noopener"
            ><img
                width="30px"
                height="30px"
                src="images/x.png"
                loading="lazy"
                alt="linkedin"
            /></a>
            <a href="mailto:mohitepm1998@gmail.com" target="_blank" rel="noopener"
            ><img
                width="30px"
                height="30px"
                src="images/email.png"
                loading="lazy"
                alt="gmail"
            /></a>
      </footer>
        `;
   }
    
  }

  customElements.define("p-footer", PFooter);

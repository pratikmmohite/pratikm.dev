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
  
  customElements.define("p-load", PLoadHtml);
  
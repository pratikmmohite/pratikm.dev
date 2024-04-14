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

  customElements.define("p-bit-list", PBitList);

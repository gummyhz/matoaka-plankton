let currentOrganism = null;   // whichever plankton is open
let activeTab = "Habitat";
let activeImgIndex = 0;

const TABS = ["Habitat", "Diet", "Predators", "Classification", "Fun Facts"];
const TAB_KEYS = {
  "Habitat": "habitat",
  "Diet": "diet",
  "Predators": "predators",
  "Classification": "classification",
  "Fun Facts": "facts",
};

document.addEventListener("DOMContentLoaded", () => {
  buildGallery();
  buildProfileShell();
});

function buildGallery() {
  gallery_cont = document.getElementById("gallery-photos");
  gallery_cont.innerHTML = "";

  plankton.forEach((organism) => {
    org = document.createElement("div");
    org.className = `all-img ${organism.id}`;

    const img = document.createElement("img");
    img.src = organism.thumb;
    img.alt = organism.name;
    img.classList.add('gallery-img')
    img.classList.add('border')
    img.addEventListener("click", () => toggleProfile(organism.id));

    org.appendChild(img);
    gallery_cont.appendChild(org);
  });
}

function buildProfileShell() {
  const panel = document.getElementById("profile-panel");
  panel.style.display = "none"; // hidden until a card is clicked

  panel.innerHTML = `
    <button class="prof-close-btn" onclick="closeProfile()">✕ Close</button>

    <nav class="border prof-top-menu" id="prof-tabs"></nav>

    <div class="border prof-main">
      <div class="border prof-main-img" id="prof-gallery">
        <img id="prof-main-photo" src="" alt="">
        <div id="prof-img-meta" class="prof-img-meta"></div> 
        <div id="prof-thumbs"></div>
      </div>
      <div class="border prof-main-body">
        <h2 id="prof-name"></h2>
        <p  id="prof-latin"></p>
      </div>
    </div>

    <div class="border prof-info" id="prof-info-body"></div>
  `;

  // Build tabs
  const tabNav = document.getElementById("prof-tabs");
  TABS.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "border prof-top-menu-btn";
    btn.textContent = tab;
    btn.dataset.tab = tab;
    btn.addEventListener("click", () => switchTab(tab));
    tabNav.appendChild(btn);
  });
}

function locationFromPath(src) {
  // "assets/Berkeley/IMG_0909.JPG" → "Berkeley"
  const parts = src.split("/");
  return parts.length >= 2 ? parts[parts.length - 2] : "Unknown";
}

function renderImageMeta(imgObj) {
  let box = document.getElementById("prof-img-meta");
  if (!box) return;
  box.innerHTML = `
    <strong> ${imgObj.location}</strong>
    ${imgObj.notes ? `<span><em>${imgObj.notes}</em></span>` : ""}
  `;
}

function openProfile(id) {
  currentOrganism = plankton.find((p) => p.id === id);
  if (!currentOrganism) return;

  activeImgIndex = 0;
  activeTab = "Habitat";

  // Populate static fields
  document.getElementById("prof-name").textContent = currentOrganism.name;
  document.getElementById("prof-latin").textContent = currentOrganism.latinName;

  // Populate image gallery
  const mainPhoto = document.getElementById("prof-main-photo");
  mainPhoto.src = currentOrganism.images[0].src;
  mainPhoto.alt = currentOrganism.name;

  const thumbs = document.getElementById("prof-thumbs");
  thumbs.innerHTML = "";
  currentOrganism.images.forEach((imgObj, i) => {
    const t = document.createElement("img");
    t.src = imgObj.src;
    t.alt = `${currentOrganism.name} image ${i + 1}`;
    t.className = i === 0 ? "active-thumb" : "";
    t.addEventListener("click", () => {
      mainPhoto.src = imgObj.src;
      renderImageMeta(imgObj);
      document.querySelectorAll("#prof-thumbs img").forEach((el) => el.classList.remove("active-thumb"));
      t.classList.add("active-thumb");
    });
    thumbs.appendChild(t);
  });
  renderImageMeta(currentOrganism.images[0]);

  // Populate first tab
  renderTabContent("Habitat");

  // Highlight first tab button
  document.querySelectorAll(".prof-top-menu-btn").forEach((btn) => {
    btn.classList.toggle("tab-active", btn.dataset.tab === "Habitat");
  });

  // Show the panel, hide the lightbox if open
  document.getElementById("profile-panel").style.display = "flex";

  // Smooth scroll to panel
  document.getElementById("profile-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function switchTab(tab) {
  activeTab = tab;
  renderTabContent(tab);
  document.querySelectorAll(".prof-top-menu-btn").forEach((btn) => {
    btn.classList.toggle("tab-active", btn.dataset.tab === tab);
  });
}

function renderTabContent(tab) {
  const key = TAB_KEYS[tab];
  const data = currentOrganism[key];
  
  const box = document.getElementById("prof-info-body");
  

  if (Array.isArray(data)) {
    // Fun Facts → bulleted list
    box.innerHTML = "<ul>" + data.map((f) => `<li>${f}</li>`).join("") + "</ul>";
  } else {
    // box.textContent = data;
    box.innerHTML = data.replace(/\n/g, "<br>");
  }
}

function closeProfile() {
  document.getElementById("profile-panel").style.display = "none";
  currentOrganism = null;
}

function toggleProfile(id) {
  if (currentOrganism && currentOrganism.id == id) {
    closeProfile()
  } else {
    openProfile(id)
  }
}
// ==========================================
// CONFIGURATION & GLOBAL STATE
// ==========================================
const API_KEY = "ViY4CYjnsCHrkflfpap9GcU1p2936qimzfuTXBML"; // Replace with your actual NASA API key for higher limits!
const APOD_API_URL = "https://api.nasa.gov/planetary/apod";

// LevelUp: Array of space facts configured for core terminal display
const SPACE_FACTS = [
  "One day on Venus is longer than one year on Venus.",
  "Neutron stars are so dense that a single teaspoon of their material would weigh about 6 billion tons!",
  "Space is completely silent because there is no atmosphere for sound waves to travel through.",
  "Footprints left by astronauts on the Moon will probably stay there for at least 100 million years.",
  "The Sun is massive enough that approximately 1.3 million Earths could fit inside it.",
  "There are more trees on Earth than stars in the Milky Way galaxy.",
  "Sunset on Mars appears blue to human observers due to the fine dust particles in its atmosphere."
];

// ==========================================
// DOM ELEMENTS
// ==========================================
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const getImagesBtn = document.getElementById("get-images-btn");
const galleryContainer = document.getElementById("gallery");
const loadingMessage = document.getElementById("loading-message");
const factText = document.getElementById("fact-text");

// Modal Elements
const modal = document.getElementById("space-modal");
const modalMediaContainer = document.getElementById("modal-media-container");
const modalTitle = document.getElementById("modal-title");
const modalDate = document.getElementById("modal-date");
const modalExplanation = document.getElementById("modal-explanation");
const closeModalBtn = document.getElementById("close-modal-btn");

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  displayRandomFact();
  setupEventListeners();
});

function displayRandomFact() {
  if (factText) {
    const randomIndex = Math.floor(Math.random() * SPACE_FACTS.length);
    factText.textContent = `CORE FIELD OBSERVATION // L-STRATA: ${SPACE_FACTS[randomIndex]}`;
  }
}

function setupEventListeners() {
  getImagesBtn.addEventListener("click", fetchSpaceImages);
  closeModalBtn.addEventListener("click", closeModal);
  
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// ==========================================
// API FETCH & DATA HANDLING
// ==========================================
async function fetchSpaceImages() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate || !endDate) {
    alert("TERMINAL ERROR // TENSOR FIELD PARAMETERS UNASSIGNED");
    return;
  }

  loadingMessage.style.display = "block";
  galleryContainer.innerHTML = "";

  try {
    const response = await fetch(`${APOD_API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`);
    
    if (!response.ok) {
      throw new Error(`HTTP status failure: ${response.status}`);
    }

    const data = await response.json();
    displayGallery(data);
  } catch (error) {
    console.error("Error fetching APOD data:", error);
    galleryContainer.innerHTML = `<p class="error-msg">MATRIX LINK REJECTED // STREAM TIMEOUT: Verify local dimensional date syntax coordinates.</p>`;
  } finally {
    loadingMessage.style.display = "none";
  }
}

// ==========================================
// GALLERY RENDERING
// ==========================================
function displayGallery(items) {
  const dataList = Array.isArray(items) ? items : [items];

  if (dataList.length === 0) {
    galleryContainer.innerHTML = "<p class='error-msg'>NULL MATRIX FEED // NO STELLAR ENTRIES FOUND IN SPECIFIED FIELD RANGE.</p>";
    return;
  }

  dataList.forEach(item => {
    const galleryCard = document.createElement("div");
    galleryCard.classList.add("gallery-card");

    let mediaHTML = "";
    if (item.media_type === "image") {
      mediaHTML = `<img src="${item.url}" alt="${item.title}" class="gallery-img">`;
    } else if (item.media_type === "video") {
      mediaHTML = `
        <div class="video-thumbnail-placeholder">
          <span class="play-icon">CAPTURE</span>
          <p class="video-label">COSMIC RADIAL ENVELOPE</p>
        </div>
      `;
    } else {
      return;
    }

    galleryCard.innerHTML = `
      <div class="media-wrapper">
        ${mediaHTML}
      </div>
      <div class="card-info">
        <h3>${item.title}</h3>
        <span class="card-date">FIELD DATA // CHRONO: ${item.date}</span>
      </div>
    `;

    galleryCard.addEventListener("click", () => openModal(item));
    galleryContainer.appendChild(galleryCard);
  });
}

// ==========================================
// MODAL LOGIC
// ==========================================
function openModal(item) {
  modalTitle.textContent = item.title;
  modalDate.textContent = `PROJECTED INDEX VECTOR // ${item.date}`;
  modalExplanation.textContent = item.explanation;

  modalMediaContainer.innerHTML = "";

  if (item.media_type === "image") {
    const img = document.createElement("img");
    img.src = item.hdurl || item.url;
    img.alt = item.title;
    img.classList.add("modal-media-content");
    modalMediaContainer.appendChild(img);
  } else if (item.media_type === "video") {
    const iframe = document.createElement("iframe");
    iframe.src = item.url;
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.classList.add("modal-media-content", "video-iframe");
    modalMediaContainer.appendChild(iframe);
  }

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
  modalMediaContainer.innerHTML = "";
}
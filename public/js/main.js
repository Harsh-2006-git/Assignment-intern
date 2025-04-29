// public/js/main.js

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".nav-links");

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener("click", function () {
      this.classList.toggle("active");
      navLinks.classList.toggle("show");
    });
  }

  // Mobile filter toggle
  const filterToggle = document.querySelector(".mobile-filter-toggle");
  const filtersSidebar = document.querySelector(".filters-sidebar");

  if (filterToggle) {
    filterToggle.addEventListener("click", function () {
      filtersSidebar.classList.toggle("show");

      // Change toggle text based on visibility
      if (filtersSidebar.classList.contains("show")) {
        this.innerHTML = '<i class="fas fa-times"></i> Close Filters';
      } else {
        this.innerHTML = '<i class="fas fa-filter"></i> Filters';
      }
    });
  }

  // Clear all filters
  const clearAllBtn = document.querySelector(".clear-all");
  const filterCheckboxes = document.querySelectorAll(".filter-checkbox");

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", function () {
      filterCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Trigger filter update
      updateDoctorsList();
    });
  }

  // Filter checkboxes change event
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updateDoctorsList();
    });
  });

  // Sort options change event
  const sortOptions = document.getElementById("sort-options");
  if (sortOptions) {
    sortOptions.addEventListener("change", function () {
      updateDoctorsList();
    });
  }

  // Search form submit
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");

      if (searchInput.value.trim()) {
        // Add search animation
        searchInput.classList.add("pulse-animation");

        // Remove animation after 1 second
        setTimeout(() => {
          searchInput.classList.remove("pulse-animation");
        }, 1000);

        updateDoctorsList(searchInput.value.trim());
      }
    });
  }

  // Load doctors data and render doctors list
  loadDoctorsData();
});

function loadDoctorsData() {
  const doctorsContainer = document.getElementById("doctors-container");
  if (doctorsContainer) {
    doctorsContainer.innerHTML = '<div class="loader">Loading doctors...</div>';
  }

  // Set default sort to relevance-low
  const defaultSort = "relevance-low";

  // Set the select element to show this option
  const sortSelect = document.getElementById("sort-options");
  if (sortSelect) {
    sortSelect.value = defaultSort;
  }

  // Include sort parameter in initial fetch
  fetch(`/api/doctors?sort=${defaultSort}`)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      renderDoctors(data.doctors);
      renderPagination(1, data.totalPages);
      updateDoctorCount(data.totalDoctors);
    })
    .catch((error) => {
      console.error("Error fetching doctors:", error);
      if (doctorsContainer) {
        doctorsContainer.innerHTML =
          '<div class="error">Error loading doctors. Please try again later.</div>';
      }
    });
}

// Function to render doctors list
function renderDoctors(doctors) {
  const doctorsContainer = document.getElementById("doctors-container");

  if (!doctorsContainer) return;

  // Clear previous content
  doctorsContainer.innerHTML = "";

  if (doctors.length === 0) {
    doctorsContainer.innerHTML =
      '<div class="no-results">No doctors found matching your criteria.</div>';
    return;
  }

  // Render each doctor card
  doctors.forEach((doctor) => {
    const doctorCard = createDoctorCard(doctor);
    doctorsContainer.appendChild(doctorCard);
  });
}

// Function to create a doctor card element
function createDoctorCard(doctor) {
  const card = document.createElement("div");
  card.className = "doctor-card animate-fadeIn";

  card.innerHTML = `
    <div class="doctor-header">
      <img src="${doctor.imageUrl}" alt="${doctor.name}" class="doctor-avatar">
      <div class="doctor-info">
        <h3>${doctor.name}</h3>
        <div class="doctor-specialty">${doctor.specialization}</div>
        <div class="doctor-qualification">${doctor.qualification}</div>
        <div class="doctor-experience">${
          doctor.experience
        } Years Experience</div>
      </div>
    </div>
    <div class="doctor-body">
      <div class="doctor-features">
        <span class="feature-badge">
          <i class="fas fa-star" style="color: #FFD700;"></i> ${doctor.rating}
        </span>
        <span class="feature-badge">
          <i class="fas fa-comments"></i> ${doctor.languages
            .slice(0, 2)
            .join(", ")}
        </span>
        <span class="feature-badge">
          <i class="fas fa-${
            doctor.consultMode.includes("Online Consult") ? "video" : "hospital"
          }" 
             style="color: ${
               doctor.consultMode.includes("Online Consult")
                 ? "#4CAF50"
                 : "#2196F3"
             };">
          </i>
          ${doctor.consultMode[0]}
        </span>
      </div>
      <div class="doctor-clinic">
        <i class="fas fa-clinic-medical"></i> ${doctor.clinic}
      </div>
      <div class="doctor-actions">
        <div class="doctor-fee">₹${doctor.fees}</div>
        <button class="consult-btn">Book Appointment</button>
      </div>
    </div>
  `;

  // Add click event to book appointment button
  const consultBtn = card.querySelector(".consult-btn");
  consultBtn.addEventListener("click", function () {
    alert(`Booking appointment with ${doctor.name}`);
  });

  return card;
}

// Function to render pagination
function renderPagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("pagination-container");

  if (!paginationContainer || totalPages <= 1) {
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = "";

  // Previous button
  paginationHTML += `<button class="pagination-btn ${
    currentPage === 1 ? "disabled" : ""
  }" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>
    <i class="fas fa-chevron-left"></i>
  </button>`;

  // Page numbers
  if (totalPages <= 5) {
    // Show all pages if total pages are 5 or less
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `<button class="pagination-btn ${
        i === currentPage ? "active" : ""
      }" data-page="${i}">${i}</button>`;
    }
  } else {
    // Show limited pages with ellipsis
    if (currentPage <= 3) {
      // Near the start
      for (let i = 1; i <= 3; i++) {
        paginationHTML += `<button class="pagination-btn ${
          i === currentPage ? "active" : ""
        }" data-page="${i}">${i}</button>`;
      }
      paginationHTML += `<span class="pagination-dots">...</span>`;
      paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
      paginationHTML += `<span class="pagination-dots">...</span>`;
      for (let i = totalPages - 2; i <= totalPages; i++) {
        paginationHTML += `<button class="pagination-btn ${
          i === currentPage ? "active" : ""
        }" data-page="${i}">${i}</button>`;
      }
    } else {
      // Middle
      paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
      paginationHTML += `<span class="pagination-dots">...</span>`;
      paginationHTML += `<button class="pagination-btn" data-page="${
        currentPage - 1
      }">${currentPage - 1}</button>`;
      paginationHTML += `<button class="pagination-btn active" data-page="${currentPage}">${currentPage}</button>`;
      paginationHTML += `<button class="pagination-btn" data-page="${
        currentPage + 1
      }">${currentPage + 1}</button>`;
      paginationHTML += `<span class="pagination-dots">...</span>`;
      paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
  }

  // Next button
  paginationHTML += `<button class="pagination-btn ${
    currentPage === totalPages ? "disabled" : ""
  }" data-page="${currentPage + 1}" ${
    currentPage === totalPages ? "disabled" : ""
  }>
    <i class="fas fa-chevron-right"></i>
  </button>`;

  paginationContainer.innerHTML = paginationHTML;

  // Add click events to pagination buttons
  const paginationButtons = paginationContainer.querySelectorAll(
    ".pagination-btn:not(.disabled)"
  );
  paginationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const page = parseInt(this.getAttribute("data-page"));
      if (page) {
        changePage(page);
      }
    });
  });
}

// Function to change page
function changePage(page) {
  // Get current URL params
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set("page", page);

  // Update URL with page parameter
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  history.pushState(null, "", newUrl);

  // Fetch data for the page
  fetch(`/api/doctors?page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      renderDoctors(data.doctors);
      renderPagination(page, data.totalPages);
      updateDoctorCount(data.totalDoctors);
    })
    .catch((error) => {
      console.error("Error fetching page data:", error);
    });

  // Scroll to top of doctors container
  const doctorsContainer = document.getElementById("doctors-container");
  if (doctorsContainer) {
    doctorsContainer.scrollIntoView({ behavior: "smooth" });
  }
}

// Function to update doctor count display
function updateDoctorCount(count) {
  const countElement = document.getElementById("doctor-count");

  if (countElement) {
    countElement.textContent = count;
  }
}

// Function to update doctors list based on filters, search, and sort
function updateDoctorsList(searchQuery = "") {
  // Get all selected filters
  const selectedConsultModes = Array.from(
    document.querySelectorAll('input[name="consultMode"]:checked')
  ).map((input) => input.value);
  const selectedExperience = Array.from(
    document.querySelectorAll('input[name="experience"]:checked')
  ).map((input) => input.value);
  const selectedFees = Array.from(
    document.querySelectorAll('input[name="fees"]:checked')
  ).map((input) => input.value);
  const selectedLanguages = Array.from(
    document.querySelectorAll('input[name="language"]:checked')
  ).map((input) => input.value);
  const selectedGenders = Array.from(
    document.querySelectorAll('input[name="gender"]:checked')
  ).map((input) => input.value);
  const selectedSpecialties = Array.from(
    document.querySelectorAll('input[name="specialty"]:checked')
  ).map((input) => input.value);

  // Get sort option
  const sortOption = document.getElementById("sort-options").value;

  // Build query parameters for API call
  const params = new URLSearchParams();

  if (searchQuery) {
    params.append("search", searchQuery);
  }

  selectedConsultModes.forEach((mode) => {
    params.append("consultMode", mode);
  });

  selectedExperience.forEach((exp) => {
    params.append("experience", exp);
  });

  selectedFees.forEach((fee) => {
    params.append("fees", fee);
  });

  selectedLanguages.forEach((lang) => {
    params.append("languages", lang);
  });

  selectedGenders.forEach((gender) => {
    params.append("gender", gender);
  });

  selectedSpecialties.forEach((specialty) => {
    params.append("specialization", specialty);
  });

  if (sortOption) {
    params.append("sort", sortOption);
  }

  // Update URL to reflect filters
  history.pushState(
    null,
    "",
    `${window.location.pathname}?${params.toString()}`
  );

  // Fetch filtered data from API
  fetch(`/api/doctors?${params.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      renderDoctors(data.doctors);
      renderPagination(1, data.totalPages);
      updateDoctorCount(data.totalDoctors);
    })
    .catch((error) => {
      console.error("Error fetching filtered doctors:", error);
      const doctorsContainer = document.getElementById("doctors-container");
      if (doctorsContainer) {
        doctorsContainer.innerHTML =
          '<div class="error">Error loading doctors. Please try again later.</div>';
      }
    });
}

// Optional: Add click-to-copy feature for doctor details
document.addEventListener("click", function (e) {
  if (e.target.closest(".doctor-card")) {
    const doctorCard = e.target.closest(".doctor-card");
    const doctorName = doctorCard.querySelector(".doctor-info h3").textContent;

    // Show a subtle animation to indicate clicking on card
    doctorCard.style.transform = "scale(0.98)";
    setTimeout(() => {
      doctorCard.style.transform = "";
    }, 150);
  }
});

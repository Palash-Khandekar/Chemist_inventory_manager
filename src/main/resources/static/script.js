const API_BASE_URL = "http://localhost:8008";

// ===============================
// ELEMENTS
// ===============================

const loginScreen = document.getElementById("loginScreen");
const appScreen = document.getElementById("appScreen");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const searchInput = document.getElementById("searchInput");
const addMedicineBtn = document.getElementById("addMedicineBtn");
const medicineTableBody = document.getElementById("medicineTableBody");

const medicineModal = document.getElementById("medicineModal");
const medicineForm = document.getElementById("medicineForm");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");

const toast = document.getElementById("toast");

// ===============================
// STATE
// ===============================

const state = {
  medicines: [],
  filteredMedicines: []
};

// ===============================
// LOGIN CHECK
// ===============================

function authenticated() {
  return sessionStorage.getItem("chemistInventoryLoggedIn") === "true";
}

function toggleScreens() {
  const isLoggedIn = authenticated();

  loginScreen.classList.toggle("hidden", isLoggedIn);
  appScreen.classList.toggle("hidden", !isLoggedIn);
}

// ===============================
// TOAST
// ===============================

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.classList.remove("hidden");

  toast.style.background =
    type === "error" ? "#d54848" : "#1a2433";

  clearTimeout(showToast.timeoutId);

  showToast.timeoutId = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
}

// ===============================
// API FUNCTION
// ===============================

async function fetchJson(url, options = {}) {

  const response = await fetch(`${API_BASE_URL}${url}`, {

    ...options,

    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(options.headers || {})
    }

  });

  const text = await response.text();

  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {

    const message =
      typeof payload === "string"
        ? payload
        : payload?.message ||
          payload?.error ||
          `Request failed (${response.status})`;

    throw new Error(message);
  }

  return payload;
}

// ===============================
// LOAD ALL MEDICINES
// ===============================

async function loadMedicines() {

  try {

    const response = await fetchJson("/getAllMedicines");

    state.medicines =
      Array.isArray(response?.data)
        ? response.data
        : [];

    state.filteredMedicines = [...state.medicines];

    renderTable(state.medicines);

  } catch (error) {

    console.error("Load medicines error:", error);

    showToast(error.message, "error");

    state.medicines = [];
    state.filteredMedicines = [];

    renderTable([]);
  }
}

// ===============================
// SEARCH
// ===============================

async function handleSearch(query) {

  const trimmed = query.trim();

  // Show all medicines when search is empty
  if (!trimmed) {

    state.filteredMedicines = [...state.medicines];

    renderTable(state.medicines);

    return;
  }

  try {

    const response = await fetchJson(
      `/search?name=${encodeURIComponent(trimmed)}`
    );

    const items =
      Array.isArray(response?.data)
        ? response.data
        : [];

    state.filteredMedicines = items;

    renderTable(items);

  } catch (error) {

    console.error("Search error:", error);

    showToast(error.message, "error");
  }
}

// ===============================
// DATE FORMAT
// ===============================

function formatDate(value) {

  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ===============================
// STATUS CLASS
// ===============================

function getStatusClass(status) {

  if (status === "Expired") {
    return "status-danger";
  }

  if (status === "About to Expire") {
    return "status-warning";
  }

  return "status-active";
}

// ===============================
// UPDATE DASHBOARD STATS
// ===============================

function updateStats() {

  const medicines =
    state.filteredMedicines.length > 0
      ? state.filteredMedicines
      : state.medicines;

  const total = medicines.length;

  const active =
    medicines.filter(
      item => item.status === "Active"
    ).length;

  const expiring =
    medicines.filter(
      item => item.status === "About to Expire"
    ).length;

  const expired =
    medicines.filter(
      item => item.status === "Expired"
    ).length;

  document.getElementById("totalMedicines").textContent = total;

  document.getElementById("activeMedicines").textContent = active;

  document.getElementById("expiringMedicines").textContent = expiring;

  document.getElementById("expiredMedicines").textContent = expired;

  document.getElementById("stockSummary").textContent =
    `${total} Items`;
}

// ===============================
// RENDER TABLE
// ===============================

function renderTable(items = state.medicines) {

  const rows = items.map(medicine => `

    <tr>

      <td>
        <strong>${medicine.name || "N/A"}</strong>
        <br>
        <small>${medicine.description || ""}</small>
      </td>

      <td>${medicine.category || "N/A"}</td>

      <td>${medicine.company || "N/A"}</td>

      <td>₹${medicine.price || "0"}</td>

      <td>${medicine.quantity || "0"}</td>

      <td>${formatDate(medicine.expiryDate)}</td>

      <td>${formatDate(medicine.updatedAt)}</td>

      <td>
        <span class="status-badge ${getStatusClass(medicine.status)}">
          ${medicine.status || "Active"}
        </span>
      </td>

      <td>

        <div class="row-actions">

          <button
            class="small-btn edit-btn"
            data-action="edit"
            data-id="${medicine.id}">
            Edit
          </button>

          <button
            class="small-btn delete-btn"
            data-action="delete"
            data-id="${medicine.id}">
            Delete
          </button>

        </div>

      </td>

    </tr>

  `).join("");

  medicineTableBody.innerHTML =
    rows ||
    `
      <tr>
        <td
          colspan="9"
          style="text-align:center; color: var(--muted); padding: 30px;">
          No medicines found.
        </td>
      </tr>
    `;

  updateStats();
}

// ===============================
// OPEN MEDICINE MODAL
// ===============================

function openModal(mode, medicine = null) {

  medicineModal.classList.remove("hidden");

  modalTitle.textContent =
    mode === "edit"
      ? "Edit Medicine"
      : "Add Medicine";

  document.getElementById("medicineId").value =
    medicine?.id || "";

  document.getElementById("medicineName").value =
    medicine?.name || "";

  document.getElementById("medicineDescription").value =
    medicine?.description || "";

  document.getElementById("medicinePrice").value =
    medicine?.price || "";

  document.getElementById("medicineQuantity").value =
    medicine?.quantity || "";

  document.getElementById("medicineCategory").value =
    medicine?.category || "";

  document.getElementById("medicineCompany").value =
    medicine?.company || "";

  document.getElementById("medicineExpiry").value =
    medicine?.expiryDate
      ? medicine.expiryDate.slice(0, 16)
      : "";
}

// ===============================
// CLOSE MODAL
// ===============================

function closeModal() {

  medicineModal.classList.add("hidden");

  medicineForm.reset();

  document.getElementById("medicineId").value = "";
}

// ===============================
// SAVE / UPDATE MEDICINE
// ===============================

async function submitMedicine(event) {

  event.preventDefault();

  const id =
    document.getElementById("medicineId").value;

  const payload = {

    name:
      document
        .getElementById("medicineName")
        .value
        .trim(),

    description:
      document
        .getElementById("medicineDescription")
        .value
        .trim(),

    price:
      document
        .getElementById("medicinePrice")
        .value
        .trim(),

    quantity:
      document
        .getElementById("medicineQuantity")
        .value
        .trim(),

    category:
      document
        .getElementById("medicineCategory")
        .value
        .trim(),

    company:
      document
        .getElementById("medicineCompany")
        .value
        .trim(),

    expiryDate:
      document
        .getElementById("medicineExpiry")
        .value || null
  };

  console.log("Sending medicine:", payload);

  try {

    // ===========================
    // UPDATE MEDICINE
    // ===========================

    if (id) {

      const response = await fetchJson(
        `/updateMedicine/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(payload)
        }
      );

      console.log("Update response:", response);

      showToast("Medicine updated successfully");
    }

    // ===========================
    // CREATE MEDICINE
    // ===========================

    else {

      const response = await fetchJson(
        "/medicines",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(payload)
        }
      );

      console.log("Create response:", response);

      showToast("Medicine added successfully");
    }

    closeModal();

    await loadMedicines();

  } catch (error) {

    console.error("Save medicine error:", error);

    showToast(error.message, "error");
  }
}

// ===============================
// DELETE MEDICINE
// ===============================

async function deleteMedicine(id) {

  const confirmed =
    window.confirm(
      "Are you sure you want to delete this medicine?"
    );

  if (!confirmed) {
    return;
  }

  try {

    await fetchJson(
      `/deleteMedicine/${id}`,
      {
        method: "DELETE"
      }
    );

    showToast("Medicine deleted successfully");

    await loadMedicines();

  } catch (error) {

    console.error("Delete error:", error);

    showToast(error.message, "error");
  }
}

// ===============================
// ADMIN LOGIN
// ===============================

loginForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    const username =
      document
        .getElementById("username")
        .value
        .trim();

    const password =
      document
        .getElementById("password")
        .value
        .trim();

    try {

      const response =
        await fetchJson(
          "/login",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({
              username: username,
              password: password
            })
          }
        );

      console.log("Login response:", response);

      // Backend returns:
      // "Login successful"

      if (
        typeof response === "string" &&
        response
          .toLowerCase()
          .includes("login successful")
      ) {

        sessionStorage.setItem(
          "chemistInventoryLoggedIn",
          "true"
        );

        toggleScreens();

        await loadMedicines();

        showToast("Login successful");

      } else {

        showToast(
          "Invalid username or password",
          "error"
        );
      }

    } catch (error) {

      console.error("Login error:", error);

      showToast(
        error.message,
        "error"
      );
    }
  }
);

// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener(
  "click",
  () => {

    sessionStorage.removeItem(
      "chemistInventoryLoggedIn"
    );

    state.medicines = [];
    state.filteredMedicines = [];

    searchInput.value = "";

    medicineForm.reset();

    toggleScreens();

    renderTable([]);

    showToast(
      "Logged out successfully"
    );
  }
);

// ===============================
// SEARCH EVENT
// ===============================

searchInput.addEventListener(
  "input",
  event => {

    handleSearch(
      event.target.value
    );

  }
);

// ===============================
// ADD MEDICINE
// ===============================

addMedicineBtn.addEventListener(
  "click",
  () => {

    openModal("add");

  }
);

// ===============================
// CLOSE MODAL
// ===============================

closeModalBtn.addEventListener(
  "click",
  closeModal
);

cancelBtn.addEventListener(
  "click",
  closeModal
);

// ===============================
// MEDICINE FORM
// ===============================

medicineForm.addEventListener(
  "submit",
  submitMedicine
);

// ===============================
// EDIT / DELETE BUTTONS
// ===============================

medicineTableBody.addEventListener(
  "click",
  async event => {

    const button =
      event.target.closest("button");

    if (!button) {
      return;
    }

    const action =
      button.dataset.action;

    const id =
      button.dataset.id;

    const medicine =
      state.medicines.find(
        item =>
          String(item.id) ===
          String(id)
      );

    // EDIT

    if (action === "edit") {

      if (medicine) {
        openModal(
          "edit",
          medicine
        );
      }

    }

    // DELETE

    if (action === "delete") {

      await deleteMedicine(id);

    }

  }
);

// ===============================
// INITIAL PAGE LOAD
// ===============================

toggleScreens();

if (authenticated()) {

  loadMedicines();

} else {

  renderTable([]);

}
/* =====================================================
   MECHCARE FRONTEND
===================================================== */


/* =========================
   VEHICLE MODELS
========================= */

const vehicleModels = {

    Bike: [
        "Royal Enfield Classic 350",
        "Royal Enfield Hunter 350",
        "Yamaha MT-15",
        "Yamaha R15",
        "Honda Activa 6G",
        "Honda Shine",
        "TVS Apache RTR 160",
        "Bajaj Pulsar 150"
    ],

    Car: [
        "Maruti Swift",
        "Maruti Baleno",
        "Hyundai i20",
        "Hyundai Creta",
        "Tata Nexon",
        "Tata Punch",
        "Honda City",
        "Toyota Glanza"
    ],

    SUV: [
        "Mahindra XUV700",
        "Mahindra Scorpio",
        "Mahindra Thar",
        "Tata Harrier",
        "Tata Safari",
        "Hyundai Creta",
        "Kia Seltos",
        "Toyota Fortuner"
    ],

    EV: [
        "Tata Nexon EV",
        "Tata Tiago EV",
        "MG ZS EV",
        "Hyundai Ioniq 5",
        "Mahindra XUV400 EV",
        "Ola S1 Pro",
        "Ather 450X"
    ]

};


/* =========================
   SERVICE PRICES
========================= */

const servicePrices = {

    "Oil Change": 499,

    "General Service": 999,

    "Wheel Service": 699,

    "Battery Service": 399,

    "AC Service": 799,

    "Engine Repair": 1499

};


/* =========================
   ELEMENTS
========================= */

const vehicleType =
    document.getElementById("vehicleType");

const vehicleModel =
    document.getElementById("vehicleModel");

const service =
    document.getElementById("service");

const price =
    document.getElementById("price");

const bookingForm =
    document.getElementById("bookingForm");

const dateInput =
    document.getElementById("date");

const trackingId =
    document.getElementById("trackingId");

const trackingResult =
    document.getElementById("trackingResult");

const historyList =
    document.getElementById("historyList");

const historySearch =
    document.getElementById("historySearch");

const toast =
    document.getElementById("toast");


/* =========================
   SET MINIMUM DATE
========================= */

function setMinimumDate() {

    const today =
        new Date().toISOString().split("T")[0];

    dateInput.min = today;
}

setMinimumDate();


/* =========================
   VEHICLE TYPE CHANGE
========================= */

vehicleType.addEventListener(
    "change",
    function () {

        const type = this.value;

        vehicleModel.innerHTML = "";

        if (!type) {

            vehicleModel.disabled = true;

            vehicleModel.innerHTML =
                `<option value="">
                    Select vehicle type first
                </option>`;

            return;
        }

        vehicleModel.disabled = false;

        vehicleModel.innerHTML =
            `<option value="">
                Select vehicle model
            </option>`;

        vehicleModels[type].forEach(
            model => {

                const option =
                    document.createElement("option");

                option.value = model;

                option.textContent = model;

                vehicleModel.appendChild(option);

            }
        );

    }
);


/* =========================
   PRICE UPDATE
========================= */

service.addEventListener(
    "change",
    updatePrice
);

vehicleType.addEventListener(
    "change",
    updatePrice
);

function updatePrice() {

    const selectedService =
        service.value;

    let amount =
        servicePrices[selectedService] || 0;

    if (vehicleType.value === "SUV") {
        amount += 200;
    }

    if (vehicleType.value === "EV") {
        amount += 300;
    }

    price.textContent =
        `₹${amount.toLocaleString("en-IN")}`;
}


/* =========================
   TOAST
========================= */

let toastTimer;

function showToast(
    message,
    type = "success"
) {

    toast.textContent = message;

    toast.className =
        `toast show ${type}`;

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);
}


/* =========================
   FORM SUBMIT
========================= */

bookingForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const type =
            vehicleType.value;

        const model =
            vehicleModel.value;

        const selectedService =
            service.value;

        const date =
            dateInput.value;

        const time =
            document.getElementById("time").value;

        if (!name ||
            !phone ||
            !type ||
            !model ||
            !selectedService ||
            !date ||
            !time) {

            showToast(
                "Please complete all required fields.",
                "error"
            );

            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {

            showToast(
                "Enter a valid 10-digit phone number.",
                "error"
            );

            return;
        }

        const selectedDate =
            new Date(date + "T00:00:00");

        const today =
            new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {

            showToast(
                "Please select today or a future date.",
                "error"
            );

            return;
        }

        const submitBtn =
            document.getElementById("submitBtn");

        submitBtn.disabled = true;

        submitBtn.textContent =
            "Booking Appointment...";

        try {

            const response =
                await fetch("/api/bookings", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name,

                        phone,

                        vehicleType: type,

                        vehicleModel: model,

                        service: selectedService,

                        date,

                        time,

                        price:
                            calculatePrice()

                    })

                });

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Booking failed."
                );
            }

            document.getElementById(
                "modalBookingId"
            ).textContent =
                data.booking.bookingId;

            document.getElementById(
                "successModal"
            ).classList.add("show");

            bookingForm.reset();

            vehicleModel.disabled = true;

            vehicleModel.innerHTML =
                `<option value="">
                    Select vehicle type first
                </option>`;

            price.textContent = "₹0";

            loadHistory();

        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        } finally {

            submitBtn.disabled = false;

            submitBtn.textContent =
                "Confirm Appointment →";

        }

    }
);


/* =========================
   CALCULATE PRICE
========================= */

function calculatePrice() {

    let amount =
        servicePrices[service.value] || 0;

    if (vehicleType.value === "SUV") {
        amount += 200;
    }

    if (vehicleType.value === "EV") {
        amount += 300;
    }

    return amount;
}


/* =========================
   TRACK VEHICLE
========================= */

document
    .getElementById("trackBtn")
    .addEventListener(
        "click",
        trackVehicle
    );


trackingId.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            trackVehicle();
        }

    }
);


async function trackVehicle() {

    const id =
        trackingId.value.trim();

    if (!id) {

        showToast(
            "Enter your booking ID.",
            "error"
        );

        return;
    }

    trackingResult.innerHTML =
        `<div class="empty-state">
            <div>⏳</div>
            <h3>Loading vehicle...</h3>
            <p>Please wait.</p>
        </div>`;

    try {

        const response =
            await fetch(
                `/api/bookings/${encodeURIComponent(id)}`
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Booking not found."
            );
        }

        renderTracking(data.booking);

        document
            .getElementById("tracking")
            .scrollIntoView({
                behavior: "smooth"
            });

    } catch (error) {

        trackingResult.innerHTML =
            `<div class="empty-state">

                <div>❌</div>

                <h3>
                    Booking Not Found
                </h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>`;

    }
}


/* =========================
   RENDER TRACKING
========================= */

function renderTracking(booking) {

    const date =
        formatDate(booking.date);

    trackingResult.innerHTML = `

        <div class="tracking-card">

            <div class="tracking-header">

                <div>

                    <h3>
                        ${escapeHtml(
        booking.vehicleModel
    )}
                    </h3>

                    <p>
                        Booking ID:
                        <strong>
                            ${escapeHtml(
        booking.bookingId
    )}
                        </strong>
                    </p>

                </div>

                <span class="status-pill">
                    ${escapeHtml(
        booking.status
    )}
                </span>

            </div>


            <div class="timeline">

                ${booking.tracking
            .map((item, index) => `

                    <div class="
                        timeline-item
                        ${item.completed
                    ? "completed"
                    : ""}
                    ">

                        <div class="timeline-dot">
                            ${item.completed
                    ? "✓"
                    : index + 1}
                        </div>

                        <div class="timeline-content">

                            <h4>
                                ${escapeHtml(
                        item.title
                    )}
                            </h4>

                            <p>
                                ${escapeHtml(
                        item.description
                    )}
                            </p>

                            ${item.time
                    ? `
                                <small>
                                    ${formatDateTime(
                        item.time
                    )}
                                </small>
                                `
                    : ""
                }

                        </div>

                    </div>

                `).join("")}

            </div>


            <div class="booking-details">

                <div class="detail">

                    <span>Customer</span>

                    <strong>
                        ${escapeHtml(
                    booking.name
                )}
                    </strong>

                </div>

                <div class="detail">

                    <span>Service</span>

                    <strong>
                        ${escapeHtml(
                    booking.service
                )}
                    </strong>

                </div>

                <div class="detail">

                    <span>Appointment</span>

                    <strong>
                        ${date} ·
                        ${escapeHtml(
                    booking.time
                )}
                    </strong>

                </div>

                <div class="detail">

                    <span>Vehicle Type</span>

                    <strong>
                        ${escapeHtml(
                    booking.vehicleType
                )}
                    </strong>

                </div>

                <div class="detail">

                    <span>Estimated Cost</span>

                    <strong>
                        ₹${Number(
                    booking.price
                ).toLocaleString("en-IN")}
                    </strong>

                </div>

                <div class="detail">

                    <span>Phone</span>

                    <strong>
                        ${escapeHtml(
                    booking.phone
                )}
                    </strong>

                </div>

            </div>

        </div>
    `;
}


/* =========================
   LOAD HISTORY
========================= */

async function loadHistory() {

    historyList.innerHTML =
        `<div class="empty-state">
            <div>⏳</div>
            <h3>Loading appointments...</h3>
        </div>`;

    try {

        const response =
            await fetch("/api/bookings");

        const data =
            await response.json();

        renderHistory(data.bookings);

    } catch (error) {

        historyList.innerHTML =
            `<div class="empty-state">
                <div>❌</div>
                <h3>Unable to load history</h3>
                <p>Make sure the server is running.</p>
            </div>`;

    }
}


/* =========================
   RENDER HISTORY
========================= */

let allBookings = [];

function renderHistory(bookings) {

    allBookings = bookings;

    const search =
        historySearch.value
            .toLowerCase()
            .trim();

    const filtered =
        bookings.filter(booking => {

            const text = `
                ${booking.bookingId}
                ${booking.name}
                ${booking.vehicleModel}
                ${booking.service}
            `.toLowerCase();

            return text.includes(search);
        });

    if (!filtered.length) {

        historyList.innerHTML =
            `<div class="empty-state">

                <div>📋</div>

                <h3>
                    No appointments yet
                </h3>

                <p>
                    Your bookings will appear here.
                </p>

            </div>`;

        return;
    }

    historyList.innerHTML =
        filtered.map(booking => {

            const cancelled =
                booking.status === "Cancelled";

            return `

                <div class="
                    history-card
                    ${cancelled ? "cancelled" : ""}
                ">

                    <div class="history-main">

                        <div class="history-icon">
                            🚗
                        </div>

                        <div>

                            <h3>
                                ${escapeHtml(
                booking.vehicleModel
            )}
                            </h3>

                            <p>
                                ${escapeHtml(
                booking.bookingId
            )}
                                ·
                                ${escapeHtml(
                booking.service
            )}
                                ·
                                ${formatDate(
                booking.date
            )}
                            </p>

                            <p>
                                Status:
                                <strong>
                                    ${escapeHtml(
                booking.status
            )}
                                </strong>
                            </p>

                        </div>

                    </div>


                    <div class="history-actions">

                        ${!cancelled
                    ? `
                                <button
                                    class="
                                        small-btn
                                        track-small
                                    "
                                    onclick="
                                        trackFromHistory(
                                            '${booking.bookingId}'
                                        )
                                    "
                                >
                                    Track
                                </button>

                                <button
                                    class="
                                        small-btn
                                        cancel-small
                                    "
                                    onclick="
                                        cancelBooking(
                                            '${booking.bookingId}'
                                        )
                                    "
                                >
                                    Cancel
                                </button>
                            `
                    : `
                                <span class="status-pill">
                                    Cancelled
                                </span>
                            `
                }

                    </div>

                </div>

            `;

        }).join("");
}


/* =========================
   SEARCH HISTORY
========================= */

historySearch.addEventListener(
    "input",
    () => renderHistory(allBookings)
);


/* =========================
   REFRESH HISTORY
========================= */

document
    .getElementById("refreshHistory")
    .addEventListener(
        "click",
        loadHistory
    );


/* =========================
   TRACK FROM HISTORY
========================= */

window.trackFromHistory =
    function (id) {

        trackingId.value = id;

        trackVehicle();

    };


/* =========================
   CANCEL BOOKING
========================= */

window.cancelBooking =
    async function (id) {

        const confirmed =
            confirm(
                `Cancel appointment ${id}?`
            );

        if (!confirmed) return;

        try {

            const response =
                await fetch(
                    `/api/bookings/${id}`,
                    {
                        method: "DELETE"
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to cancel."
                );

            }

            showToast(
                "Appointment cancelled successfully."
            );

            loadHistory();

        } catch (error) {

            showToast(
                error.message,
                "error"
            );

        }

    };


/* =========================
   MODAL
========================= */

const modal =
    document.getElementById(
        "successModal"
    );

document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        () => modal.classList.remove("show")
    );

modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {
            modal.classList.remove("show");
        }

    }
);


/* =========================
   COPY BOOKING ID
========================= */

document
    .getElementById("copyBookingId")
    .addEventListener(
        "click",
        async function () {

            const id =
                document.getElementById(
                    "modalBookingId"
                ).textContent;

            try {

                await navigator.clipboard.writeText(id);

                showToast(
                    "Booking ID copied."
                );

            } catch {

                showToast(
                    "Copy failed.",
                    "error"
                );

            }

        }
    );


/* =========================
   MODAL TRACK BUTTON
========================= */

document
    .getElementById("modalTrackBtn")
    .addEventListener(
        "click",
        () => {

            const id =
                document.getElementById(
                    "modalBookingId"
                ).textContent;

            modal.classList.remove("show");

            trackingId.value = id;

            document
                .getElementById("tracking")
                .scrollIntoView({
                    behavior: "smooth"
                });

            setTimeout(
                trackVehicle,
                500
            );

        }
    );


/* =========================
   SERVICE CARD CLICK
========================= */

document
    .querySelectorAll(".service-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const selected =
                    card.dataset.service;

                service.value =
                    selected;

                updatePrice();

                document
                    .getElementById("booking")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    });


/* =========================
   THEME
========================= */

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

const savedTheme =
    localStorage.getItem(
        "mechcare-theme"
    );

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀";

}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        const dark =
            document.body.classList.contains(
                "dark"
            );

        themeBtn.textContent =
            dark ? "☀" : "☾";

        localStorage.setItem(
            "mechcare-theme",
            dark ? "dark" : "light"
        );

    }
);


/* =========================
   MOBILE MENU
========================= */

document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("navMenu")
                .classList.toggle("open");

        }
    );


document
    .querySelectorAll("#navMenu a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                document
                    .getElementById("navMenu")
                    .classList.remove("open");

            }
        );

    });


/* =========================
   DATE FORMAT
========================= */

function formatDate(dateString) {

    if (!dateString) return "-";

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================
   DATETIME FORMAT
========================= */

function formatDateTime(dateString) {

    if (!dateString) return "";

    return new Date(
        dateString
    ).toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


/* =========================
   SECURITY
========================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   INITIAL LOAD
========================= */

loadHistory();
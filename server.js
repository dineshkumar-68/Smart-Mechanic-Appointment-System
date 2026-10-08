const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

app.use(express.json());
app.use(express.static(__dirname));

try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "[]");
    }
} catch (e) {
    console.warn("Notice: File system write restricted, using fallback storage:", e.message);
}

function readBookings() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, "utf8");
            return JSON.parse(data || "[]");
        }
        return [];
    } catch (error) {
        return [];
    }
}

function saveBookings(bookings) {
    try {
        fs.writeFileSync(
            DATA_FILE,
            JSON.stringify(bookings, null, 2)
        );
    } catch (e) {
        console.warn("Could not save bookings to disk:", e.message);
    }
}

function generateBookingId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let id = "MC-";

    for (let i = 0; i < 6; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }

    return id;
}

function getInitialTracking() {
    const now = new Date().toISOString();

    return [
        {
            status: "Booked",
            title: "Appointment Booked",
            description: "Your service appointment has been confirmed.",
            completed: true,
            time: now
        },
        {
            status: "Inspection",
            title: "Vehicle Inspection",
            description: "Our mechanic will inspect your vehicle.",
            completed: false,
            time: null
        },
        {
            status: "In Service",
            title: "Service In Progress",
            description: "Vehicle servicing and repairs are in progress.",
            completed: false,
            time: null
        },
        {
            status: "Quality Check",
            title: "Quality Check",
            description: "Final inspection is being performed.",
            completed: false,
            time: null
        },
        {
            status: "Ready",
            title: "Vehicle Ready",
            description: "Your vehicle is ready for collection.",
            completed: false,
            time: null
        }
    ];
}

/* =========================
   CREATE APPOINTMENT
========================= */

app.post("/api/bookings", (req, res) => {
    try {
        const {
            name,
            phone,
            vehicleType,
            vehicleModel,
            service,
            date,
            time,
            price
        } = req.body;

        if (
            !name ||
            !phone ||
            !vehicleType ||
            !vehicleModel ||
            !service ||
            !date ||
            !time
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 10-digit phone number."
            });
        }

        const bookings = readBookings();

        let bookingId = generateBookingId();

        while (
            bookings.some(
                booking => booking.bookingId === bookingId
            )
        ) {
            bookingId = generateBookingId();
        }

        const booking = {
            id: Date.now(),
            bookingId,
            name,
            phone,
            vehicleType,
            vehicleModel,
            service,
            date,
            time,
            price: Number(price) || 0,
            status: "Booked",
            createdAt: new Date().toISOString(),
            tracking: getInitialTracking()
        };

        bookings.push(booking);

        saveBookings(bookings);

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            booking
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
});


/* =========================
   GET ALL BOOKINGS
========================= */

app.get("/api/bookings", (req, res) => {
    const bookings = readBookings();

    bookings.sort(
        (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
    );

    res.json({
        success: true,
        bookings
    });
});


/* =========================
   GET SINGLE BOOKING
========================= */

app.get("/api/bookings/:bookingId", (req, res) => {

    const bookingId =
        req.params.bookingId.toUpperCase();

    const bookings = readBookings();

    const booking = bookings.find(
        item =>
            item.bookingId.toUpperCase() === bookingId
    );

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found."
        });
    }

    res.json({
        success: true,
        booking
    });
});


/* =========================
   CANCEL BOOKING
========================= */

app.delete("/api/bookings/:bookingId", (req, res) => {

    const bookingId =
        req.params.bookingId.toUpperCase();

    const bookings = readBookings();

    const index = bookings.findIndex(
        item =>
            item.bookingId.toUpperCase() === bookingId
    );

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Booking not found."
        });
    }

    bookings[index].status = "Cancelled";

    bookings[index].tracking =
        bookings[index].tracking.map(item => ({
            ...item,
            completed: false
        }));

    saveBookings(bookings);

    res.json({
        success: true,
        message: "Appointment cancelled successfully.",
        booking: bookings[index]
    });
});


/* =========================
   UPDATE STATUS
   DEMO ADMIN API
========================= */

app.patch("/api/bookings/:bookingId/status", (req, res) => {

    const bookingId =
        req.params.bookingId.toUpperCase();

    const { status } = req.body;

    const allowedStatuses = [
        "Booked",
        "Inspection",
        "In Service",
        "Quality Check",
        "Ready",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status."
        });
    }

    const bookings = readBookings();

    const booking = bookings.find(
        item =>
            item.bookingId.toUpperCase() === bookingId
    );

    if (!booking) {
        return res.status(404).json({
            success: false,
            message: "Booking not found."
        });
    }

    booking.status = status;

    const statusIndex = [
        "Booked",
        "Inspection",
        "In Service",
        "Quality Check",
        "Ready"
    ].indexOf(status);

    booking.tracking =
        booking.tracking.map((item, index) => {

            if (status === "Cancelled") {
                return {
                    ...item,
                    completed: false
                };
            }

            return {
                ...item,
                completed: index <= statusIndex,
                time:
                    index <= statusIndex
                        ? item.time || new Date().toISOString()
                        : null
            };
        });

    saveBookings(bookings);

    res.json({
        success: true,
        message: "Vehicle status updated.",
        booking
    });
});


/* =========================
   HEALTH CHECK
========================= */

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "MechCare backend is running."
    });
});


/* =========================
   SPA FALLBACK
========================= */

app.use((req, res) => {
    res.sendFile(
        path.join(__dirname, "index.html")
    );
});


app.listen(PORT, () => {
    console.log("");
    console.log("==================================");
    console.log("🚗 MechCare Server Running");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log("==================================");
    console.log("");
});

module.exports = app;
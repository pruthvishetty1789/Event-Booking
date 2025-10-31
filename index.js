import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Booking } from "./models/Booking.js";

dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to the Synergia Event Booking API");
});


app.post("/api/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/bookings/filter", async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) return res.status(400).json({ error: "Event query parameter required" });
    const bookings = await Booking.find({ event: { $regex: event, $options: "i" } });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/bookings/search", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email query parameter required" });
    const bookings = await Booking.find({ email: email.toLowerCase() });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.put("/api/bookings/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking updated successfully", updatedBooking });
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});


app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted successfully", deletedBooking });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
export default app;

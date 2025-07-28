// VistaraStay
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// EJS engine & views setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// MongoDB connection
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/VistaraStay");
  console.log("MongoDB connection successful");
}
main().catch((err) => console.log(err));

// Home route
app.get("/", (req, res) => {
  res.send("Root is working");
});

// Index route - All listings
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    res.status(500).send("Error fetching listings: " + err.message);
  }
});

// New listing form
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Create listing
app.post("/listings", async (req, res) => {
  console.log("Form submitted:", req.body);
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect(`/listings/${newListing._id}`);
});

// Show listing
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log("Fetched listing:", listing);
  res.render("listings/show", { listing });
});

// Edit listing form
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

// Update listing
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// Delete listing (via GET for testing; should use DELETE in production)
app.get("/listings/:id/delete", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.send("Listing deleted");
});

// Test: Insert a sample listing
app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My New Villa",
    description: "By the beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });
  await sampleListing.save();
  console.log("Sample was saved");
  res.send("Successful testing");
});

// Debug route: check for one listing
app.get("/check-listing", async (req, res) => {
  const listing = await Listing.findOne({ title: "Beachfront Bungalow in Bali" });
  console.log(listing);
  res.send(listing);
});

// Server
const port = 8080;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});


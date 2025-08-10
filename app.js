// VistaraStay
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// EJS setup
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

// Index route - all listings
app.get("/listings", wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
}));

// New listing form
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Create listing
app.post("/listings", wrapAsync(async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError("Invalid Listing Data", 400);
  }

  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect(`/listings/${newListing._id}`);
}));

// Show listing
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }

  res.render("listings/show", { listing });
}));

// Edit form
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }

  res.render("listings/edit", { listing });
}));

// Update listing
app.put("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });

  if (!updatedListing) {
    throw new ExpressError("Unable to update listing", 400);
  }

  res.redirect(`/listings/${id}`);
}));

// Delete listing
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);

  if (!deleted) {
    throw new ExpressError("Listing not found or already deleted", 404);
  }

  res.redirect("/listings");
}));

// Catch-all route
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found!', 404));
});


// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err }); // not .send
});



// Server start
const port = 3000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

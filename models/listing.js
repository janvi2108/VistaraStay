const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1348963437/photo/foot-path-to-jetty.jpg?s=1024x1024&w=is&k=20&c=dOF_XGVk3S8M1gHbCXQ7l05-5FqMlgsV2XCtNTLAjqc=",
      set: (v) =>
        v === ""
          ? "https://media.istockphoto.com/id/1348963437/photo/foot-path-to-jetty.jpg?s=1024x1024&w=is&k=20&c=dOF_XGVk3S8M1gHbCXQ7l05-5FqMlgsV2XCtNTLAjqc="
          : v
    }
  },
  price: Number,
  location: String,
  country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

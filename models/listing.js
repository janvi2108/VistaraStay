const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Default fallback image URL
const defaultImageURL =
  "https://media.istockphoto.com/id/1348963437/photo/foot-path-to-jetty.jpg?s=1024x1024&w=is&k=20&c=dOF_XGVk3S8M1gHbCXQ7l05-5FqMlgsV2XCtNTLAjqc=";

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  image: {
    filename: String,
    url: {
      type: String,
      required: true,
      default: defaultImageURL,
      set: (v) => (v === "" ? defaultImageURL : v),
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(v);
        },
        message: (props) => `"${props.value}" is not a valid image URL`
      }
    }
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"]
  },
  location: {
    type: String,
    required: [true, "Location is required"]
  },
  country: {
    type: String,
    required: [true, "Country is required"]
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

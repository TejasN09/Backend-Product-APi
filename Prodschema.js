const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    requried: true
  },
  name: {
    type: String,
    requried: [true,"name requried"]
  },
  price: {
    type: Number,
    requried: [true,"price requried"]
  },
  featured: {
    type: String,
  },
  rating: {
    type: Number,
    min:0,
    max:5,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  createdOn: {
    type: String
  },
  company: {
    type: String,
    requried: [true,"company name requried"]
  },
});

// module.exports = mongoose.model("Users", UserSchema)
module.exports = mongoose.model("Products", ProductSchema);

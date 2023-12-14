import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "propertys";

const schema = new mongoose.Schema({
  price: {
    money: String,
    price: Number,
  },
  landSize: Number,
  coveredGround: Number,
  bathrooms: Number,
  dormitory: Number,
  environments: Number,
  type: String,
  zone: String,
  direction: String,
  operation: String,
  description: String,
  position: {
    lat: Number,
    lng: Number,
  },
  features: [String],
  images: [String],
});

schema.plugin(mongoosePaginate);

const property = mongoose.model(collection, schema);

export default property;

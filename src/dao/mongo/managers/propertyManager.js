import mongoose from "mongoose";
import propertyModel from "../models/propertys.js";

class PropertyManager {
  getPropertys = () => {
    return propertyModel.find();
  };

  getPropertysWithPaginate = (filters, options) => {
    return propertyModel.paginate(filters, options);
  };

  getPropertysById = (id) => {
    return propertyModel.findById(id).lean();
  };

  getPropertysByParams = (params) => {
    return propertyModel.find(params);
  };

  createProperty = (property) => {
    return propertyModel.create(property);
  };

  updateProperty = (id, property) => {
    return propertyModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
      $set: property,
    });
  };

  deleteProperty = (id) => {
    return propertyModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  };

  deleteImageFromArray = (imageName) => {
    return propertyModel.updateOne(
      { images: imageName },
      { $pull: { images: imageName } }
    );
  };
}

export default new PropertyManager();

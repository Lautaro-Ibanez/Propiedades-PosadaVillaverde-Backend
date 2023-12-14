import propertyManager from "../dao/mongo/managers/propertyManager.js";
import { generateProperty } from "../mocks/property-mock.js";
import __dirname from "../util.js";
import fs from "fs";

const getPropertyByParams = async (req, res) => {
  const params = req.query;
  const property = await propertyManager.getPropertysByParams(params);
  return res.send({ status: "success", payload: property });
};

const getPropertyById = async (req, res) => {
  const { id } = req.query;
  const property = await propertyManager.getPropertysById(id);
  res.send({ message: "success", payload: property });
};

const getAllProperties = async (req, res) => {
  const propertys = await propertyManager.getPropertys();
  res.send({ status: "success", payload: propertys });
};

const getPropertys = async (req, res) => {
  const { page = 1, perPage } = req.query;
  let limitPages = 6;
  if (perPage) {
    limitPages = perPage;
  }
  const propertys = await propertyManager.getPropertysWithPaginate(
    {},
    {
      page,
      limit: limitPages,
      lean: true,
    }
  );
  res.send({ status: "success", payload: propertys });
};

const addProperty = async (req, res) => {
  const propertyBody = req.body;
  let urlImages = [];

  if (propertyBody.images.length > 0) {
    propertyBody.images.forEach((name) => {
      const imageURL = "property-images/" + name;
      urlImages.push(imageURL);
    });
  }
  const newProperty = {
    features: propertyBody.features,
    position: { lat: propertyBody.lat, lng: propertyBody.lng },
    description: propertyBody.description,
    price: propertyBody.price,
    landSize: propertyBody.landSize,
    coveredGround: propertyBody.coveredGround,
    bathrooms: propertyBody.bathrooms,
    dormitory: propertyBody.dormitory,
    environments: propertyBody.environments,
    type: propertyBody.type,
    zone: propertyBody.zone,
    direction: propertyBody.direction,
    operation: propertyBody.operation,
    images: urlImages,
  };
  const result = await propertyManager.createProperty(newProperty);
  res.send({ status: "success", message: "Property Added" });
};

const getMockPropertys = (req, res) => {
  let propertys = [];
  for (let i = 0; i < 20; i++) {
    propertys.push(generateProperty());
  }

  res.send({ status: "success", payload: propertys });
};

const getPropertyWithFilters = async (req, res) => {
  try {
    const { page = 1, perPage } = req.query;
    const {
      selectedValues,
      superficie = { supMin: null, supMax: null },
      precio = { priceMin: null, priceMax: null },
      selectedSort,
    } = req.body;
    const params = {};
    const sortOptions = {};
    let limitPages = 6;
    if (perPage) {
      limitPages = perPage;
    }
    if (
      !selectedValues.bathroom &&
      !selectedValues.dormitory &&
      !selectedValues.zone &&
      !selectedValues.operation &&
      !selectedValues.typeProperty &&
      !superficie.supMin &&
      !superficie.supMax &&
      !precio.priceMin &&
      !precio.priceMax &&
      !selectedSort.sort
    ) {
      const resultado = await propertyManager.getPropertysWithPaginate(
        {},
        {
          page,
          limit: limitPages,
          lean: true,
        }
      );
      return res.send({ status: "success", payload: resultado });
    }
    if (selectedValues.operation) {
      params.operation = selectedValues.operation;
    }

    if (selectedValues.typeProperty) {
      params.type = selectedValues.typeProperty;
    }

    if (selectedValues.dormitory) {
      params.dormitory = selectedValues.dormitory;
    }

    if (selectedValues.bathroom) {
      params.bathrooms = selectedValues.bathroom;
    }

    if (selectedValues.zone) {
      params.zone = selectedValues.zone;
    }

    if (selectedSort.sort && selectedSort.sort === "Mayor precio") {
      sortOptions["price.price"] = "desc";
    }

    if (selectedSort.sort && selectedSort.sort === "Menor precio") {
      sortOptions["price.price"] = "asc";
    }
    if (superficie) {
      if (
        superficie.supMin &&
        superficie.supMax &&
        superficie.supMin <= superficie.supMax
      ) {
        params.coveredGround = {
          $gte: parseFloat(superficie.supMin),
          $lte: parseFloat(superficie.supMax),
        };
      } else if (superficie.supMin && !superficie.supMax) {
        params.coveredGround = {
          $gte: parseFloat(superficie.supMin),
        };
      } else if (!superficie.supMin && superficie.supMax) {
        params.coveredGround = { $lte: parseFloat(superficie.supMax) };
      }
    }

    if (precio) {
      if (
        precio.priceMin &&
        precio.priceMax &&
        precio.priceMin <= precio.priceMax
      ) {
        params["price.price"] = {
          $gte: parseFloat(precio.priceMin),
          $lte: parseFloat(precio.priceMax),
        };
      } else if (precio.priceMin && !precio.priceMax) {
        params["price.price"] = {
          $gte: parseFloat(precio.priceMin),
        };
      } else if (!precio.priceMin && precio.priceMax) {
        params["price.price"] = { $lte: parseFloat(precio.priceMax) };
      }
    }

    if (Object.keys(params).length == 0 && !sortOptions) {
      return res.send({
        status: "error",
        message: "without search parameters",
      });
    }

    const resultado = await propertyManager.getPropertysWithPaginate(params, {
      page,
      limit: limitPages,
      sort: sortOptions,
      lean: true,
    });

    return res.send({ status: "success", payload: resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la solicitud" });
  }
};

const addMockPropertys = async (req, res) => {
  for (let i = 0; i < 70; i++) {
    await propertyManager.createProperty(generateProperty());
  }

  res.send({ status: "success", message: "propertys added" });
};

const uploadImages = async (req, res) => {
  const files = req.files;
  res.send({ status: "success", payload: files });
};

const deleteImages = async (req, res) => {
  const { imageName } = req.params;
  const imagePath = `${__dirname}/public/property-images/${imageName}`;

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Error al eliminar el archivo" });
    }
    res.status(200).send({ message: "Archivo eliminado exitosamente" });
  });
};

const deleteUpdateImage = async (req, res) => {
  const { imageName } = req.params;

  const imagePath = `${__dirname}/public/property-images/${imageName}`;

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Error al eliminar el archivo" });
    }
  });

  const newSearch = `property-images/${imageName}`;
  const response = await propertyManager.deleteImageFromArray(newSearch);
  res.sendStatus(200);
};

const updateProperty = async (req, res) => {
  const propertyId = req.params.id;
  const newData = req.body;
  const urlImages = [];

  if (newData.imagePrevs.length > 0) {
    newData.imagePrevs.forEach((image) => {
      urlImages.push(image);
    });
  }

  if (newData.images.length > 0) {
    newData.images.forEach((image) => {
      const urlName = `property-images/${image.filename}`;
      urlImages.push(urlName);
    });
  }

  const propertyUpdateData = {
    images: urlImages,
    features: newData.features,
    price: newData.price,
    landSize: newData.landSize,
    coveredGround: newData.coveredGround,
    bathrooms: newData.bathrooms,
    dormitory: newData.dormitory,
    environments: newData.environments,
    type: newData.type,
    zone: newData.zone,
    direction: newData.direction,
    position: { lat: newData.lat, lng: newData.lng },
    operation: newData.operation,
    description: newData.description,
  };

  const response = await propertyManager.updateProperty(
    propertyId,
    propertyUpdateData
  );

  return res.sendStatus(200);
};

const deleteProperty = async (req, res) => {
  const propertyId = req.params.id;
  const response = await propertyManager.deleteProperty(propertyId);
  res.send({ status: "success", message: "property successfully deleted" });
};

export default {
  deleteUpdateImage,
  getPropertyByParams,
  deleteImages,
  uploadImages,
  getPropertyById,
  getMockPropertys,
  getPropertys,
  addProperty,
  getPropertyWithFilters,
  addMockPropertys,
  getAllProperties,
  updateProperty,
  deleteProperty,
};

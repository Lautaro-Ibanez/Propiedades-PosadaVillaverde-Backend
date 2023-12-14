import { Router } from "express";
import propertyController from "../controllers/propertyControllers.js";
import uploader from "../middlewares/upload-multer.js";

const router = Router();

router.get("/", propertyController.getPropertys);

router.get("/getByParams", propertyController.getPropertyByParams);

router.get("/getAll", propertyController.getAllProperties);

router.get("/getBy", propertyController.getPropertyById);

router.get("/mockPropertys", propertyController.getMockPropertys);

router.post("/filter", propertyController.getPropertyWithFilters);

router.post("/", propertyController.addProperty);

router.post("/mockPost", propertyController.addMockPropertys);

router.post(
  "/uploadImages",
  uploader.array("images"),
  propertyController.uploadImages
);

router.put("/updateProperty/:id", propertyController.updateProperty)

router.delete("/deleteImage/:imageName", propertyController.deleteImages);

router.delete("/deleteUpdateImages/:imageName", propertyController.deleteUpdateImage)

router.delete("/deleteProperty/:id", propertyController.deleteProperty)

export default router;

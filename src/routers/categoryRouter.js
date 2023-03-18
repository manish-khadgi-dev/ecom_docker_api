import express from "express";
import {
  newCategoryValidation,
  updateCategoryValidation,
} from "../middleware/joiMiddleware.js";
const router = express.Router();
import {
  createCategory,
  deleteACategory,
  getCategories,
  updateACategory,
} from "../models/category/CategoryModel.js";
import slugify from "slugify";

//add cat
router.post("/", newCategoryValidation, async (req, res, next) => {
  try {
    req.body.slug = slugify(req.body.name, { lower: true, trim: true });

    const { _id } = await createCategory(req.body);
    _id
      ? res.json({
          status: "success",
          message: "New Category has been added.",
        })
      : res.json({
          status: "error",
          message: "Ubable to add New Category.",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      error.message =
        "The category slug already exist, Please change the category name and try again.";
      error.errorCode = 200;
    }
    next(error);
  }
});

//read all cats
router.get("/", async (req, res, next) => {
  try {
    const cats = await getCategories();
    res.json({
      status: "success",
      message: "here is the categories",
      cats,
    });
  } catch (error) {
    next(error);
  }
});

// update cats
router.put("/", updateCategoryValidation, async (req, res, next) => {
  try {
    const { _id } = await updateACategory(req.body);

    if (_id) {
      return res.json({
        status: "success",
        message: "The Category has been updated",
      });
    }

    res.json({
      status: "error",
      message: "Unable to update the category, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

//delete cates
router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const result = await deleteACategory(_id);

    result?._id
      ? res.json({
          status: "success",
          message: "The category has been deleted.",
        })
      : res.json({
          status: "error",
          message: "Unable to delete the category please try gain later.",
        });
  } catch (error) {
    next(error);
  }
});

export default router;

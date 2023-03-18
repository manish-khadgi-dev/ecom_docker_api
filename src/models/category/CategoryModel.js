import CategorySchema from "./CategorySchema.js";

//create new category
export const createCategory = (obj) => {
  return CategorySchema(obj).save();
};

//delete category
export const getCategories = () => {
  return CategorySchema.find();
};

//update category
export const updateACategory = ({ _id, ...updateObj }) => {
  return CategorySchema.findByIdAndUpdate(_id, updateObj, { new: true });
};

//delete category
export const deleteACategory = (_id) => {
  return CategorySchema.findByIdAndDelete(_id);
};

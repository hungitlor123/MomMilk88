import * as yup from "yup";
export const schemaCategory = yup.object().shape({
  name: yup
    .string()
    .required("Category name cannot be empty")
    .min(1, "Category name must be at least 1 character")
    .max(50, "Category name cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]*$/,
      "Category name cannot contain special characters"
    )
    .test(
      "should start with capital letter",
      "The first letter must be capitalized",
      (value) => !!value && value[0] === value[0].toUpperCase()
    ),
  targetAudience: yup.string().required("Target audience is required"),
  ageRange: yup.string().required("Age range is required"),
  milkType: yup.string().required("Milk type is required"),
  icon: yup.string().required("Icon is required"),
});

export const schemaRenameCategory = yup.object().shape({
  id: yup.number().required("ID is required"),
  name: yup
    .string()
    .required("Category name cannot be blank!")
    .min(3, "Category names must have at least 3 characters")
    .max(50, "Category names cannot exceed 50 characters")
    .matches(
      /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]*$/,
      "Category names cannot contain special characters"
    )
    .test(
      "should start with capital letter",
      "The first letter must be capitalized",
      (value) => !!value && value[0] === value[0].toUpperCase()
    ),
});

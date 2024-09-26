import * as yup from "yup";

export const schemaProduct = yup.object().shape({
    name: yup
        .string()
        .required("Product name cannot be empty")
        .min(1, "Product name must be at least 1 character")
        .max(50, "Product name cannot exceed 50 characters")
        .matches(
            /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]*$/,
            "Product name cannot contain special characters"
        )
        .test(
            "should start with capital letter",
            "The first letter must be capitalized",
            (value) => !!value && value[0] === value[0].toUpperCase()
        ),
    origin: yup.string().required("Origin is required"),
    brand: yup.string().required("Brand is required"),
    ingredient: yup.string().required("Ingredient is required"),
    sweetLevel: yup.string().required("Sweet level is required"),
    flavour: yup.string().required("Flavour is required"),
    sample: yup.string().required("Sample is required"),
    capacity: yup.string().required("Capacity is required"),
    description: yup.string().required("Description is required"),
    price: yup.number().required("Price is required"),
    quantity: yup.number().required("Quantity is required"),
    storeId: yup.number().required("Store ID is required"),
    expireAt: yup.date().required("Expire date is required"),
    status: yup.string().required("Status is required"),
});

export const schemaRenameProduct = yup.object().shape({
    id: yup.number().required("ID is required"),
    name: yup
        .string()
        .required("Product name cannot be blank!")
        .min(3, "Product names must have at least 3 characters")
        .max(50, "Product names cannot exceed 50 characters")
        .matches(
            /^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF]*$/,
            "Product names cannot contain special characters"
        )
        .test(
            "should start with capital letter",
            "The first letter must be capitalized",
            (value) => !!value && value[0] === value[0].toUpperCase()
        ),
});
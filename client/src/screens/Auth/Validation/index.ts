import * as Yup from "yup";

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .trim()
    .required("Required")
    .min(6, "Too Short!")
    .max(50, "Too Long!"),
  rememberMe: Yup.boolean().optional(),
});

export const RegisterValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  firstName: Yup.string().trim().required("Required"),
  lastName: Yup.string().trim().required("Required"),
  password: Yup.string().trim().required("Required"),
  repassword: Yup.string()
    .trim()
    .required("Required")
    .oneOf([Yup.ref("password")], "Passwords must match !"),
});

import * as Yup from "yup";

export const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Required")
    .min(8, "Too Short!")
    .max(50, "Too Long!"),
  rememberMe: Yup.boolean().optional(),
});

export const RegisterValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  repassword: Yup.string().required("Required")
});


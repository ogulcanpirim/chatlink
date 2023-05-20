import logo from "../../assets/logo.png";
import darkLogo from "../../assets/dark-mode.svg";
import lightLogo from "../../assets/light-mode.svg";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { setDarkMode } from "../../store/reducers/pageReducer";
import { useForm } from "react-hook-form";
import { RegisterForm } from "./Types";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterValidationSchema } from "./Validation";
import { useCallback, useEffect } from "react";
import { RegisterRequest } from "../../store/actions/userActions";
import { useAppDispatch } from "../../store";
import { clearErrors } from "../../store/reducers/userReducer";

const Register = () => {
  const { darkMode } = useAppSelector((state) => state.page);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(RegisterValidationSchema),
  });

  const { loading, user, error } = useAppSelector((state) => state.user);

  const onSubmit = useCallback(
    (data: RegisterForm) => {
      dispatch(RegisterRequest(data));
    },
    [dispatch]
  );

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className={`${darkMode && "dark"}`}>
      <section className={`h-screen bg-gray-50  dark:bg-gray-900`}>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-12 h-12 mr-2 dark:text-white"
              src={logo}
              alt="logo"
            />
            ChatLink
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div className="flex flex-row justify-between items-center">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create your account
                </h1>
                <img
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch(setDarkMode(!darkMode));
                  }}
                  className="w-8 h-8"
                  src={darkMode ? darkLogo : lightLogo}
                  alt="logo"
                />
              </div>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <div className="mb-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                      </div>
                      <input
                        {...register("email")}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@chatlink.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 ml-2 text-xs text-red-800 dark:text-red-400 font-medium">
                        {"*" + String(errors.email.message)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-between">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        {...register("firstName")}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Robert"
                      />
                      {errors.firstName && (
                        <p className="mt-1 ml-2 text-xs text-red-800 dark:text-red-400 font-medium">
                          {"*" + String(errors.firstName.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="surname"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Surname
                      </label>
                      <input
                        {...register("lastName")}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Junior"
                      />
                      {errors.lastName && (
                        <p className="mt-1 ml-2 text-xs text-red-800 dark:text-red-400 font-medium">
                          {"*" + String(errors.lastName.message)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 64 64"
                      >
                        <path
                          d="M45.863,33.863C47.223,30.852,48,27.52,48,24C48,10.746,37.254,0,24,0S0,10.746,0,24s10.746,24,24,24
	                          c3.52,0,6.852-0.777,9.863-2.137L36,48h8v8h8v8h12V52L45.863,33.863z M24,32c-4.422,0-8-3.578-8-8s3.578-8,8-8s8,3.578,8,8 S28.422,32,24,32z"
                        />
                      </svg>
                    </div>
                    <input
                      {...register("password")}
                      placeholder="••••••••"
                      type="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 ml-2 text-xs text-red-800 dark:text-red-400 font-medium">
                      {"*" + String(errors.password.message)}
                    </p>
                  )}
                  <label
                    htmlFor="repassword"
                    className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Re-enter Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 64 64"
                      >
                        <path
                          d="M45.863,33.863C47.223,30.852,48,27.52,48,24C48,10.746,37.254,0,24,0S0,10.746,0,24s10.746,24,24,24
	                          c3.52,0,6.852-0.777,9.863-2.137L36,48h8v8h8v8h12V52L45.863,33.863z M24,32c-4.422,0-8-3.578-8-8s3.578-8,8-8s8,3.578,8,8 S28.422,32,24,32z"
                        />
                      </svg>
                    </div>
                    <input
                      {...register("repassword")}
                      placeholder="••••••••"
                      type="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pl-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  {errors.repassword && (
                    <p className="mt-1 ml-2 text-xs text-red-800 dark:text-red-400 font-medium">
                      {"*" + String(errors.repassword.message)}
                    </p>
                  )}
                </div>
                {error && (
                  <div
                    className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-900 dark:text-red-400"
                    role="alert"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 inline w-5 h-5 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Info</span>
                    <div>
                      <span className="font-medium">User already exists!</span>
                      {"  "}
                      Please check your credentials and try to login.
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full mt-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {loading ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        fill="none"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Do you have an account?{" "}
                  <a
                    onClick={() => {
                      dispatch(clearErrors());
                      navigate("/login");
                    }}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;

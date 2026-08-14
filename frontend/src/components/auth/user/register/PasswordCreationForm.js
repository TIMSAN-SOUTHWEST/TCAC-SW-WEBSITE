import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Stack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  registerUser,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
} from "../../../../store/slices/auth/user/userAuthSlice";

const PasswordCreationForm = ({ role, values, onPrevious, prevFormValues }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formValues, setFormValues] = useState({
    password: values?.password || "",
    confirmPassword: values?.confirmPassword || "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
  };

  const validate = () => {
    const newErrors = {};
    const { password, confirmPassword } = formValues;

    if (!password) newErrors.password = "Required";
    else if (password.length < 8)
      newErrors.password = "Must be at least 8 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Required";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords must match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Ensure the role is "Super Admin" if the role passed is "super_admin"
    if (role === "user") {
      formValues.role = "User";
    }

    try {
      const mergedValues = { ...values, ...prevFormValues, ...formValues };

      const resultAction = await dispatch(registerUser(mergedValues));

      if (registerUser.fulfilled.match(resultAction)) {
        toast({
          title: "Success!",
          description: "Registration successful. Redirecting to login...",
          status: "success",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
        setFormValues({ password: "", confirmPassword: "" });
        router.push(`/login/${role}`);
      } else if (resultAction.meta.requestStatus === "rejected") {
        // Handle different status codes based on the meta.response object
        const { statusCode, message } = resultAction.payload || {};

        switch (statusCode) {
          case 400:
            toast({
              title: "Bad Request",
              description: "Some required fields are missing or incorrect.",
              status: "error",
              duration: 5000,
              position: "top",
              isClosable: true,
            });
            break;
          case 401:
            toast({
              title: "Unauthorized",
              description: "Unauthorized request. Please check your input.",
              status: "error",
              duration: 5000,
              position: "top",
              isClosable: true,
            });
            break;
          case 403:
            toast({
              title: "Forbidden",
              description: "You do not have permission to perform this action.",
              status: "error",
              duration: 5000,
              position: "top",
              isClosable: true,
            });
            break;
          case 404:
            toast({
              title: "Not Found",
              description: "User not found. Please try again.",
              status: "error",
              duration: 5000,
              position: "top",
              isClosable: true,
            });
            break;
          case 500:
            toast({
              title: "Server Error",
              description: "An unexpected error occurred on the server.",
              status: "error",
              duration: 5000,
              position: "top",
              isClosable: true,
            });
            break;
          default:
            toast({
              title: "Error",
              description:
                message || "An unexpected error occurred. Please try again.",
              status: "error",
              duration: 5000,
              position: "top",
              isClosable: true,
            });
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* Password Field */}
        <FormControl
          id="password"
          isInvalid={!!errors.password && touched.password}
        >
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formValues.password}
              onChange={handleChange}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
              placeholder="Enter your password"
            />
            <InputRightElement>
              <Button
                variant="link"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl
          id="confirmPassword"
          isInvalid={!!errors.confirmPassword && touched.confirmPassword}
        >
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formValues.confirmPassword}
              onChange={handleChange}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, confirmPassword: true }))
              }
              placeholder="Re-enter your password"
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
            />
            <InputRightElement>
              <Button
                variant="link"
                onClick={toggleConfirmPasswordVisibility}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={4} mt={4}>
          <Button
            type="button"
            colorScheme="gray"
            onClick={() => onPrevious(formValues)}
          >
            Back
          </Button>
          <Button
            type="submit"
            colorScheme="green"
            isLoading={loading}
            loadingText="Processing..."
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default PasswordCreationForm;

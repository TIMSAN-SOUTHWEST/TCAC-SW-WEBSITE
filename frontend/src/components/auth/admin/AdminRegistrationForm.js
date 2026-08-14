import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  registerAdmin,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../store/slices/auth/admin/adminAuthSlice";
import {
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminRegistrationForm = ({ role }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setTouched({ ...touched, [name]: true });
  };

  const validateForm = () => {
    const errors = {};
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    } = formValues;

    if (!firstName) {
      errors.firstName = "Required";
    }
    if (!lastName) {
      errors.lastName = "Required";
    }
    if (!email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Required";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords must match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Ensure the role is "Admin" if the role passed is "admin"
    if (role === "admin") {
      formValues.role = "Admin";
    }

    try {
      const resultAction = await dispatch(registerAdmin( formValues ));

      if (registerAdmin.fulfilled.match(resultAction)) {
        toast({
          title: "Success!",
          description: "Registration successful. Redirecting to login...",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        router.push(`/login/${role}`);
        setFormValues({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        }); // Clear form values
      } else {
        toast({
          title: "Error!",
          description:
            resultAction.payload?.message ||
            "An error occurred during registration.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* First Name */}
      <FormControl mb={4} isInvalid={formErrors.firstName && touched.firstName}>
        <FormLabel>First Name</FormLabel>
        <Input
          name="firstName"
          type="text"
          value={formValues.firstName}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, firstName: true })}
          color={"white"}
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "#D9FAD4",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
      </FormControl>

      {/* Last Name */}
      <FormControl mb={4} isInvalid={formErrors.lastName && touched.lastName}>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastName"
          type="text"
          value={formValues.lastName}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, lastName: true })}
          color={"white"}
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "#D9FAD4",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
      </FormControl>

      {/* Email */}
      <FormControl mb={4} isInvalid={formErrors.email && touched.email}>
        <FormLabel>Email Address</FormLabel>
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, email: true })}
          color={"white"}
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "#D9FAD4",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.email}</FormErrorMessage>
      </FormControl>

      {/* Phone Number */}
      <FormControl
        mb={4}
        isInvalid={formErrors.phoneNumber && touched.phoneNumber}
      >
        <FormLabel>
          Phone Number{" "}
          <Box as="span" fontSize="sm" color="black">
            (WhatsApp enabled)
          </Box>
        </FormLabel>
        <Input
          name="phoneNumber"
          type="tel"
          value={formValues.phoneNumber}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, phoneNumber: true })}
          color={"white"}
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "#D9FAD4",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.phoneNumber}</FormErrorMessage>
      </FormControl>

      {/* Password */}
      <FormControl mb={4} isInvalid={formErrors.password && touched.password}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formValues.password}
            onChange={handleChange}
            color={"white"}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "#D9FAD4",
              transition: "border-color 0.3s ease",
            }}
          />
          <InputRightElement>
            <Button
              variant="link"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              color={"white"}  
              _hover={{
                bg: "#D9FAD4",
                color: "gray.800" 
              }}
              _focus={{
                bg: "#D9FAD4",
                color: "gray.800" 
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{formErrors.password}</FormErrorMessage>
      </FormControl>

      {/* Confirm Password */}
      <FormControl
        mb={4}
        isInvalid={formErrors.confirmPassword && touched.confirmPassword}
      >
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formValues.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            _placeholder={{
              color: "white",

            }}
            color={"white"}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "#D9FAD4",
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
              color={"white"}  
              _hover={{
                bg: "#D9FAD4",
                color: "gray.800" 
              }}
              _focus={{
                bg: "#D9FAD4",
                color: "gray.800" 
              }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        w="full"
        isLoading={loading}
        loadingText="Processing..."
        colorScheme="green"
        mt={4}
        bg="#D9FAD4" 
        color={"black"} 
      >
        Register
      </Button>
      
    </form>
  );
};

export default AdminRegistrationForm;

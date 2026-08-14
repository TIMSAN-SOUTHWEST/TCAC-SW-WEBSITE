import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Select as ChakraSelect,
  Stack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const MedicalConditionForm = ({
  role,
  values,
  onValuesChange,
  onNext,
  onPrevious,
  prevFormValues,
}) => {
  // Initialize state with passed values or default values
  const [formValues, setFormValues] = useState({
    medicalCondition: values?.medicalCondition || "",
    conditionDetails: values?.conditionDetails || "",
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    medicalCondition: "",
    conditionDetails: "",
  });

  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Validation logic
    const validationErrors = {
      medicalCondition: "",
      conditionDetails: "",
    };

    if (!formValues.medicalCondition) {
      validationErrors.medicalCondition =
        "Medical condition selection is required";
      isFormValid = false;
    }

    if (formValues.medicalCondition === "yes" && !formValues.conditionDetails) {
      validationErrors.conditionDetails =
        "Condition details are required when medical condition is 'Yes'";
      isFormValid = false;
    }

    if (!isFormValid) {
      setFormErrors(validationErrors);
      toast({
        title: "Error",
        description: "Please correct the errors in the form.",
        status: "error",
        duration: 5000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
      return;
    }

    // Proceed with form submission
    const mergedValues = { role, ...values, ...prevFormValues, ...formValues };
    onValuesChange(mergedValues);
    onNext(mergedValues);

    toast({
      title: "Success",
      description: "Medical condition data updated successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
      icon: <FaCheckCircle />,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* Medical Condition Selector */}
        <FormControl isInvalid={!!formErrors.medicalCondition}>
          <FormLabel>Do you have any medical condition?</FormLabel>
          <ChakraSelect
            name="medicalCondition"
            value={formValues.medicalCondition}
            onChange={(e) => {
              const value = e.target.value;
              handleInputChange(e);
              if (value === "yes") {
                // Ensure conditionDetails is empty if switching to "yes"
                setFormValues((prevValues) => ({
                  ...prevValues,
                  conditionDetails: "",
                }));
              }
            }}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          >
            <option value="" disabled>
              Do you have any medical condition?
            </option>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </ChakraSelect>
          <FormErrorMessage>{formErrors.medicalCondition}</FormErrorMessage>
        </FormControl>

        {/* Conditional Field for Medical Condition Details */}
        {formValues.medicalCondition === "yes" && (
          <FormControl isInvalid={!!formErrors.conditionDetails}>
            <FormLabel>Please specify your medical condition</FormLabel>
            <Textarea
              name="conditionDetails"
              value={formValues.conditionDetails}
              onChange={handleInputChange}
              placeholder="Enter details"
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
            />
            <FormErrorMessage>{formErrors.conditionDetails}</FormErrorMessage>
          </FormControl>
        )}

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={4} mt={4}>
          <Button type="button" colorScheme="gray" onClick={onPrevious}>
            Back
          </Button>
          <Button type="submit" colorScheme="green">
            Next
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default MedicalConditionForm;

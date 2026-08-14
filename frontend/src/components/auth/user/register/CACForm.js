import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import Select from "react-select";
import { FaSchool, FaUser, FaPhoneAlt, FaAddressBook } from "react-icons/fa";
import { AiOutlineFieldNumber } from "react-icons/ai";
import NaijaStates from "naija-state-local-government";

// Load all states from NaijaStates
const allStates = NaijaStates.states();

const CACForm = ({
  role,
  values,
  onValuesChange,
  onNext,
  onPrevious,
  prevFormValues,
}) => {
  const [institutions, setInstitutions] = useState([]);
  const [formValues, setFormValues] = useState({
    userCategory: values?.userCategory || "Student",
    institution: values?.institution || "",
    otherInstitution: values?.otherInstitution || "",
    graduationYear: values?.graduationYear || "",
    state: values?.state || "",
    otherState: values?.otherState || "",
    guardianName: values?.guardianName || "",
    guardianPhone: values?.guardianPhone || "",
    guardianAddress: values?.guardianAddress || "",
    nonTimsaniteInstitution: values?.nonTimsaniteInstitution || "",
    nonTimsaniteState: values?.nonTimsaniteState || "",
    nextOfKinName: values?.nextOfKinName || "",
    nextOfKinPhone: values?.nextOfKinPhone || "",
    nextOfKinAddress: values?.nextOfKinAddress || "",
    isStudent: values?.isStudent || false,
  });
  const [isInstitutionOther, setIsInstitutionOther] = useState(false);
  const [isStateOther, setIsStateOther] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [error, setError] = useState({});
  const toast = useToast();

  useEffect(() => {
    fetch("/institutions.json")
      .then((response) => response.json())
      .then((data) => setInstitutions(data.institutions))
      .catch((error) => console.error("Error fetching institutions:", error));
  }, []);

  // Flatten institutions into react-select options
  const institutionOptions = useMemo(() => {
    if (!institutions) return [];
    const options = [];
    const processCategory = (category, label) => {
      if (!category) return;
      if (Array.isArray(category)) {
        category.forEach((inst) => {
          options.push({ value: inst.name, label: `${inst.name} — ${inst.location}` });
        });
      } else {
        Object.entries(category).forEach(([type, list]) => {
          if (Array.isArray(list)) {
            list.forEach((inst) => {
              options.push({ value: inst.name, label: `${inst.name} — ${inst.location}` });
            });
          }
        });
      }
    };
    processCategory(institutions.universities, "Universities");
    processCategory(institutions.polytechnics, "Polytechnics");
    processCategory(institutions.colleges_of_education, "Colleges of Education");
    processCategory(institutions.others, "Others");
    // Add "Other" option at the end
    options.push({ value: "Other", label: "Other (type manually)" });
    return options;
  }, [institutions]);

  useEffect(() => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...prevFormValues,
    }));
  }, [prevFormValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Capitalize the first letter of each word
    const capitalizeWords = (text) =>
      text.replace(/\b\w/g, (char) => char.toUpperCase());

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: capitalizeWords(value),
    }));
  };

  const handleUserCategoryChange = (e) => {
    const category = e.target.value;
    setFormValues((prevValues) => ({
      ...prevValues,
      userCategory: category,
      institution: "",
      state: "",
      otherInstitution: "",
      otherState: "",
    }));
    setIsInstitutionOther(category === "Other");
    setIsStateOther(category === "Other");
    setIsStudent(false); // Reset isStudent when category changes
  };

  const validateForm = () => {
    const errors = {};
    if (
      formValues.userCategory === "Student" ||
      formValues.userCategory === "Alumnus"
    ) {
      if (!formValues.institution && !formValues.otherInstitution) {
        errors.institution = "Institution is required";
      }
      if (formValues.userCategory === "Alumnus" && !formValues.graduationYear) {
        errors.graduationYear = "Graduation Year is required";
      }
      if (formValues.state === "Other" && !formValues.otherState) {
        errors.otherState = "State is required";
      }
    }
    if (formValues.userCategory === "Child") {
      if (!formValues.guardianName)
        errors.guardianName = "Guardian Name is required";
      if (!formValues.guardianPhone)
        errors.guardianPhone = "Guardian Phone is required";
      if (!formValues.guardianAddress)
        errors.guardianAddress = "Guardian Address is required";
    }
    if (formValues.userCategory === "Non-TIMSANITE") {
      if (formValues.isStudent && !formValues.nonTimsaniteInstitution) {
        errors.nonTimsaniteInstitution = "Institution is required";
      }
      if (formValues.isStudent && !formValues.nonTimsaniteState) {
        errors.nonTimsaniteState = "State is required";
      }
      if (!formValues.nextOfKinName)
        errors.nextOfKinName = "Next of Kin Name is required";
      if (!formValues.nextOfKinPhone)
        errors.nextOfKinPhone = "Next of Kin Phone is required";
      if (!formValues.nextOfKinAddress)
        errors.nextOfKinAddress = "Next of Kin Address is required";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Object.values(error).forEach((err) => {
        toast({
          title: "Validation Error",
          description: err,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
      return;
    }
    const mergedValues = { role, ...values, ...prevFormValues, ...formValues };

    onValuesChange(mergedValues);
    onNext(mergedValues);
    toast({
      title: "Success",
      description: "TCAC data updated successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* User Category Selector */}
        <FormControl id="user-category">
          <FormLabel>Register as</FormLabel>
          <Input
            as="select"
            name="userCategory"
            onChange={handleUserCategoryChange}
            value={formValues.userCategory}
          >
            <option value="Student">Student (TIMSANITE)</option>
            <option value="Alumnus">Alumnus (IOTB)</option>
            <option value="Child">Child</option>
            <option value="Non-TIMSANITE">Non-TIMSANITE</option>
          </Input>
        </FormControl>

        {/* Conditional Fields */}
        {formValues.userCategory === "Student" ||
        formValues.userCategory === "Alumnus" ? (
          <>
            <FormControl isInvalid={!!error.institution}>
              <FormLabel>Institution</FormLabel>
              <Select
                options={institutionOptions}
                placeholder="Search or select institution..."
                isSearchable
                value={institutionOptions.find((opt) => opt.value === formValues.institution) || null}
                onChange={(selected) => {
                  const value = selected ? selected.value : "";
                  setIsInstitutionOther(value === "Other");
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    institution: value,
                    otherInstitution: value === "Other" ? prevValues.otherInstitution : "",
                  }));
                }}
                styles={{
                  control: (base) => ({ ...base, borderColor: error.institution ? "red" : base.borderColor }),
                  menu: (base) => ({ ...base, zIndex: 10 }),
                }}
              />
              {isInstitutionOther && (
                <Input
                  mt={2}
                  name="otherInstitution"
                  placeholder="Enter Institution Name"
                  value={formValues.otherInstitution}
                  onChange={handleInputChange}
                />
              )}
              <FormErrorMessage>{error.institution}</FormErrorMessage>
            </FormControl>

            {formValues.userCategory === "Alumnus" && (
              <FormControl isInvalid={!!error.graduationYear}>
                <FormLabel>Year of Graduation</FormLabel>
                <Input
                  type="number"
                  name="graduationYear"
                  placeholder="Select Year"
                  value={formValues.graduationYear}
                  onChange={handleInputChange}
                  leftIcon={<AiOutlineFieldNumber />}
                />
                <FormErrorMessage>{error.graduationYear}</FormErrorMessage>
              </FormControl>
            )}

            <FormControl isInvalid={!!error.state}>
              <FormLabel>State</FormLabel>
              <Input
                as="select"
                name="state"
                onChange={(e) => {
                  const value = e.target.value;
                  setIsStateOther(value === "Other");
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    state: value,
                  }));
                }}
                value={formValues.state}
              >
                <option value="">Select State</option>
                {allStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
                <option value="Other">Other</option>
              </Input>
              {isStateOther && (
                <Input
                  name="otherState"
                  placeholder="Enter State"
                  value={formValues.otherState}
                  onChange={handleInputChange}
                />
              )}
              <FormErrorMessage>{error.state}</FormErrorMessage>
            </FormControl>
          </>
        ) : formValues.userCategory === "Child" ? (
          <>
            <FormControl isInvalid={!!error.guardianName}>
              <FormLabel>Guardian Name</FormLabel>
              <Input
                name="guardianName"
                placeholder="Enter Guardian Name"
                value={formValues.guardianName}
                onChange={handleInputChange}
                leftIcon={<FaUser />}
              />
              <FormErrorMessage>{error.guardianName}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!error.guardianPhone}>
              <FormLabel>Guardian Phone Number</FormLabel>
              <Input
                name="guardianPhone"
                placeholder="Enter Guardian Phone"
                value={formValues.guardianPhone}
                onChange={handleInputChange}
                leftIcon={<FaPhoneAlt />}
              />
              <FormErrorMessage>{error.guardianPhone}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!error.guardianAddress}>
              <FormLabel>Guardian Address</FormLabel>
              <Input
                name="guardianAddress"
                placeholder="Enter Guardian Address"
                value={formValues.guardianAddress}
                onChange={handleInputChange}
                leftIcon={<FaAddressBook />}
              />
              <FormErrorMessage>{error.guardianAddress}</FormErrorMessage>
            </FormControl>
          </>
        ) : formValues.userCategory === "Non-TIMSANITE" ? (
          <>
            <FormControl>
              <FormLabel>Are you a Student?</FormLabel>
              <Input
                as="select"
                name="isStudent"
                onChange={(e) => {
                  const value = e.target.value === "yes";
                  setIsStudent(value);
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    isStudent: value,
                  }));
                }}
                value={formValues.isStudent ? "yes" : "no"}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </Input>
            </FormControl>
            {isStudent && (
              <>
                <FormControl isInvalid={!!error.nonTimsaniteInstitution}>
                  <FormLabel>Institution</FormLabel>
                  <Input
                    name="nonTimsaniteInstitution"
                    placeholder="Enter Institution"
                    value={formValues.nonTimsaniteInstitution}
                    onChange={handleInputChange}
                    leftIcon={<FaSchool />}
                  />
                  <FormErrorMessage>
                    {error.nonTimsaniteInstitution}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!error.nonTimsaniteState}>
                  <FormLabel>State</FormLabel>
                  <Input
                    name="nonTimsaniteState"
                    placeholder="Enter State"
                    value={formValues.nonTimsaniteState}
                    onChange={handleInputChange}
                  />
                  <FormErrorMessage>{error.nonTimsaniteState}</FormErrorMessage>
                </FormControl>
              </>
            )}
            <FormControl isInvalid={!!error.nextOfKinName}>
              <FormLabel>Next of Kin Name</FormLabel>
              <Input
                name="nextOfKinName"
                placeholder="Enter Next of Kin Name"
                value={formValues.nextOfKinName}
                onChange={handleInputChange}
                leftIcon={<FaUser />}
              />
              <FormErrorMessage>{error.nextOfKinName}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!error.nextOfKinPhone}>
              <FormLabel>Next of Kin Phone</FormLabel>
              <Input
                name="nextOfKinPhone"
                placeholder="Enter Next of Kin Phone"
                value={formValues.nextOfKinPhone}
                onChange={handleInputChange}
                leftIcon={<FaPhoneAlt />}
              />
              <FormErrorMessage>{error.nextOfKinPhone}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!error.nextOfKinAddress}>
              <FormLabel>Next of Kin Address</FormLabel>
              <Input
                name="nextOfKinAddress"
                placeholder="Enter Next of Kin Address"
                value={formValues.nextOfKinAddress}
                onChange={handleInputChange}
                leftIcon={<FaAddressBook />}
              />
              <FormErrorMessage>{error.nextOfKinAddress}</FormErrorMessage>
            </FormControl>
          </>
        ) : null}

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={4} mt={4}>
          <Button type="button" onClick={onPrevious}>
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

export default CACForm;

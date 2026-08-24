import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Input,
  Stack,
  Text,
  IconButton,
  Textarea,
  useToast,
  Select,
  Badge,
} from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";
import api from "@/utils/api";

const PRICES = {
  standard: {
    "Camp Only": { Student: 7000, Alumnus: 10000, Child: 4000 },
    "Conference Only": { Student: 35000, Alumnus: 35000 },
    "Camp + Conference": { Student: 42000, Alumnus: 50000 },
  },
  "early-bird": {
    "Camp Only": { Student: 6000, Alumnus: 8000, Child: 3000 },
    "Conference Only": { Student: 30000, Alumnus: 30000 },
    "Camp + Conference": { Student: 36000, Alumnus: 44000 },
  },
};

// Installment plan definitions
const INSTALLMENT_PLANS = {
  camp_conference_42k: {
    label: "Camp + Conference (₦20,000 + ₦15,000 + ₦7,000)",
    campType: "Camp + Conference",
    amounts: [20000, 15000, 7000],
    total: 42000,
  },
  conference_early_30k: {
    label: "Conference Only (₦10,000 + ₦10,000 + ₦10,000)",
    campType: "Conference Only",
    amounts: [10000, 10000, 10000],
    total: 30000,
  },
  conference_standard_35k: {
    label: "Conference Only (₦10,000 + ₦10,000 + ₦15,000)",
    campType: "Conference Only",
    amounts: [10000, 10000, 15000],
    total: 35000,
  },
};

// Determine pricing tier based on date: early-bird until Aug 31, 2026
const getCurrentPricingTier = () => {
  const now = new Date();
  const earlyBirdDeadline = new Date("2026-08-31T23:59:59");
  return now <= earlyBirdDeadline ? "early-bird" : "standard";
};

// Get installment plans available based on current date
const getAvailableInstallmentPlans = () => {
  const tier = getCurrentPricingTier();
  if (tier === "early-bird") {
    return {
      camp_conference_42k: INSTALLMENT_PLANS.camp_conference_42k,
      conference_early_30k: INSTALLMENT_PLANS.conference_early_30k,
    };
  }
  return {
    camp_conference_42k: INSTALLMENT_PLANS.camp_conference_42k,
    conference_standard_35k: INSTALLMENT_PLANS.conference_standard_35k,
  };
};

const getPrice = (userCategory, campType, pricingType) => {
  const category =
    userCategory === "Child"
      ? "Child"
      : userCategory === "Alumnus"
      ? "Alumnus"
      : "Student";
  const tier = pricingType === "early-bird" ? "early-bird" : "standard";
  return PRICES[tier]?.[campType]?.[category] ?? 0;
};

const formatNaira = (n) => n.toLocaleString();

const PaymentForm = ({
  role,
  values,
  onValuesChange,
  onNext,
  onPrevious,
  prevFormValues,
}) => {
  const [formValues, setFormValues] = useState({
    paymentType: "Full Payment",
    campType: "Camp Only",
    amount: "7000",
    receipt: "",
    paymentNarration: "",
    installmentPlan: "",
  });
  const [minimumAmountRequired, setMinimumAmountRequired] = useState(7000);
  const [formErrors, setFormErrors] = useState({});
  const [blobDetails, setBlobDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const inputFileRef = useRef(null);
  const toast = useToast();

  const bankAccountDetails = {
    accountName: "Timsan southwest",
    accountNumber: "2283452778",
    bank: "UBA",
  };

  const isInstallment = formValues.paymentType === "Installment";

  // Calculate amount based on camp type, user category, and payment mode
  const calculateAmount = (campType, userCategory, paymentType, installmentPlan) => {
    if (paymentType === "Installment") {
      // Return first installment amount for the selected plan
      const plan = INSTALLMENT_PLANS[installmentPlan];
      return plan ? String(plan.amounts[0]) : "";
    }
    const pricingType = getCurrentPricingTier();
    return String(getPrice(userCategory, campType, pricingType));
  };

  // Calculate minimum amount based on camp type, user category, and payment mode
  const calculateMinimumAmount = (campType, userCategory, paymentType, installmentPlan) => {
    if (paymentType === "Installment") {
      const plan = INSTALLMENT_PLANS[installmentPlan];
      return plan ? plan.amounts[0] : 0;
    }
    const pricingType = getCurrentPricingTier();
    return getPrice(userCategory, campType, pricingType);
  };

  // Get available camp types based on user category and payment mode
  const getAvailableCampTypes = (userCategory) => {
    const pricingType = getCurrentPricingTier();

    if (userCategory === "Child") {
      return [
        {
          value: "Camp Only",
          label: `Camp Only - ₦${formatNaira(getPrice(userCategory, "Camp Only", pricingType))}`,
        },
      ];
    }

    return [
      {
        value: "Camp Only",
        label: `Camp Only - ₦${formatNaira(getPrice(userCategory, "Camp Only", pricingType))}`,
      },
      {
        value: "Conference Only",
        label: `Conference Only - ₦${formatNaira(getPrice(userCategory, "Conference Only", pricingType))}`,
      },
      {
        value: "Camp + Conference",
        label: `Camp + Conference - ₦${formatNaira(getPrice(userCategory, "Camp + Conference", pricingType))}`,
      },
    ];
  };

  useEffect(() => {
    if (!isInstallment) {
      const newAmount = calculateAmount(formValues.campType, prevFormValues?.userCategory, formValues.paymentType, formValues.installmentPlan);
      const newMinimum = calculateMinimumAmount(formValues.campType, prevFormValues?.userCategory, formValues.paymentType, formValues.installmentPlan);
      
      setFormValues(prev => ({
        ...prev,
        amount: newAmount
      }));
      setMinimumAmountRequired(newMinimum);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.campType, formValues.paymentType, prevFormValues?.userCategory]);

  // Handle installment plan change
  useEffect(() => {
    if (isInstallment && formValues.installmentPlan) {
      const plan = INSTALLMENT_PLANS[formValues.installmentPlan];
      if (plan) {
        setFormValues(prev => ({
          ...prev,
          campType: plan.campType,
          amount: "",
        }));
        setMinimumAmountRequired(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.installmentPlan]);

  const handleCampTypeChange = (e) => {
    const newCampType = e.target.value;
    const newAmount = calculateAmount(newCampType, prevFormValues?.userCategory, formValues.paymentType, formValues.installmentPlan);
    const newMinimum = calculateMinimumAmount(newCampType, prevFormValues?.userCategory, formValues.paymentType, formValues.installmentPlan);
    
    setFormValues(prev => ({
      ...prev,
      campType: newCampType,
      amount: newAmount
    }));
    setMinimumAmountRequired(newMinimum);
  };

  const handlePaymentTypeChange = (e) => {
    const newPaymentType = e.target.value;
    
    if (newPaymentType === "Installment") {
      // Reset to first installment plan option
      setFormValues(prev => ({
        ...prev,
        paymentType: newPaymentType,
        installmentPlan: "",
        campType: "",
        amount: "",
      }));
      setMinimumAmountRequired(0);
    } else {
      const defaultCampType = "Camp Only";
      const newAmount = calculateAmount(defaultCampType, prevFormValues?.userCategory, newPaymentType, "");
      const newMinimum = calculateMinimumAmount(defaultCampType, prevFormValues?.userCategory, newPaymentType, "");
      
      setFormValues(prev => ({
        ...prev,
        paymentType: newPaymentType,
        installmentPlan: "",
        campType: defaultCampType,
        amount: newAmount,
      }));
      setMinimumAmountRequired(newMinimum);
    }
  };

  const handleInstallmentPlanChange = (e) => {
    const planKey = e.target.value;
    setFormValues(prev => ({
      ...prev,
      installmentPlan: planKey,
    }));
  };

  const handleAmountChange = (e) => {
    setFormValues(prev => ({
      ...prev,
      amount: e.target.value
    }));
  };

  const handleCopyToClipboard = (text, label) => {
    toast({
      title: `${label} copied to clipboard!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formValues.paymentType)
      validationErrors.paymentType = "Payment type is required";
    
    if (isInstallment) {
      if (!formValues.installmentPlan)
        validationErrors.campType = "Please select an installment plan";
      if (!formValues.amount)
        validationErrors.amount = "Please select an amount to pay";
    } else {
      if (!formValues.campType)
        validationErrors.campType = "Camp type is required";
      if (
        !formValues.amount ||
        parseInt(formValues.amount) < minimumAmountRequired
      )
        validationErrors.amount = `Minimum amount is ₦${formatNaira(minimumAmountRequired)}`;
    }
    
    if (!formValues.receipt)
      validationErrors.receipt = "Receipt upload is required";

    setFormErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const file = inputFileRef.current.files[0];
      if (!file) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.put("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const result = response.data;
      const { url } = result;

      setBlobDetails({ url });

      const mergedValues = {
        role,
        ...values,
        ...prevFormValues,
        paymentType: formValues.paymentType,
        campType: formValues.campType,
        amount: parseInt(formValues.amount),
        paymentNarration: formValues.paymentNarration,
        receiptUrl: url,
        pricingType: getCurrentPricingTier(),
        paymentMode: isInstallment ? "installment" : "full",
        installmentPlan: isInstallment ? formValues.installmentPlan : undefined,
      };

      onValuesChange(mergedValues);
      onNext(mergedValues);
      toast({
        title: "Success",
        description: "Payment data updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChooseFileClick = () => {
    inputFileRef.current.click();
  };

  const availableCampTypes = getAvailableCampTypes(prevFormValues?.userCategory);

  return (
    <form onSubmit={handleFormSubmit}>
      <Box display={"flex"} flexDirection={"column"} gap={6}>
        <Flex
          flexDirection={"column"}
          gap={4}
          bg="gray.100"
          p={4}
          borderRadius="md"
        >
          <Text fontWeight="bold" mb={2}>
            Bank Account Details
          </Text>

          <Stack spacing={6}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Account Name:</strong> {bankAccountDetails.accountName}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.accountName}
                onCopy={() =>
                  handleCopyToClipboard(
                    bankAccountDetails.accountName,
                    "Account Name"
                  )
                }
              >
                <IconButton
                  icon={<FaCopy />}
                  size="sm"
                  aria-label="Copy Account Name"
                />
              </CopyToClipboard>
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Account Number:</strong>{" "}
                {bankAccountDetails.accountNumber}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.accountNumber}
                onCopy={() =>
                  handleCopyToClipboard(
                    bankAccountDetails.accountNumber,
                    "Account Number"
                  )
                }
              >
                <IconButton
                  icon={<FaCopy />}
                  size="sm"
                  aria-label="Copy Account Number"
                />
              </CopyToClipboard>
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Bank:</strong> {bankAccountDetails.bank}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.bank}
                onCopy={() =>
                  handleCopyToClipboard(bankAccountDetails.bank, "Bank")
                }
              >
                <IconButton
                  icon={<FaCopy />}
                  size="sm"
                  aria-label="Copy Bank"
                />
              </CopyToClipboard>
            </Box>
          </Stack>
        </Flex>

        <FormControl id="paymentType" isInvalid={!!formErrors.paymentType}>
          <FormLabel display="flex" alignItems="center" gap={2}>
            Mode of Payment
            {getCurrentPricingTier() === "early-bird" && (
              <Badge colorScheme="green" fontSize="xs">Early Bird Active</Badge>
            )}
          </FormLabel>
          <Select
            value={formValues.paymentType}
            onChange={handlePaymentTypeChange}
            placeholder="Select payment type"
          >
            <option value="Full Payment">Full Payment</option>
            {prevFormValues?.userCategory !== "Child" && (
              <option value="Installment">Installment</option>
            )}
          </Select>
          {formErrors.paymentType && (
            <Text color="red.500" fontSize="sm">
              {formErrors.paymentType}
            </Text>
          )}
        </FormControl>

        {/* Show installment plan selector when Installment is chosen */}
        {isInstallment ? (
          <FormControl id="installmentPlan" isInvalid={!!formErrors.campType}>
            <FormLabel>What part of the Camp/Conference?</FormLabel>
            <Select
              value={formValues.installmentPlan}
              onChange={handleInstallmentPlanChange}
              placeholder="Select installment plan"
            >
              {Object.entries(getAvailableInstallmentPlans()).map(([key, plan]) => (
                <option key={key} value={key}>
                  {plan.label}
                </option>
              ))}
            </Select>
            {formErrors.campType && (
              <Text color="red.500" fontSize="sm">
                {formErrors.campType}
              </Text>
            )}
          </FormControl>
        ) : (
          <FormControl id="campType" isInvalid={!!formErrors.campType}>
            <FormLabel>What part of the Camp/Conference?</FormLabel>
            <Select
              value={formValues.campType}
              onChange={handleCampTypeChange}
              placeholder="Select camp type"
            >
              {availableCampTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            {formErrors.campType && (
              <Text color="red.500" fontSize="sm">
                {formErrors.campType}
              </Text>
            )}
          </FormControl>
        )}

        <FormControl id="amount" isInvalid={!!formErrors.amount}>
          <FormLabel>Amount {isInstallment && "(Select Installment)"}</FormLabel>
          {isInstallment && formValues.installmentPlan ? (
            <Select
              value={formValues.amount}
              onChange={handleAmountChange}
              placeholder="Select amount to pay"
            >
              {INSTALLMENT_PLANS[formValues.installmentPlan]?.amounts.map((amt, idx) => (
                <option key={idx} value={String(amt)}>
                  ₦{formatNaira(amt)} — Payment {idx + 1}
                </option>
              ))}
            </Select>
          ) : (
            <Input 
              value={formValues.amount ? `₦${formatNaira(parseInt(formValues.amount) || 0)}` : ""} 
              readOnly={true}
              bg="gray.100"
              placeholder={isInstallment ? "Select a plan above" : "Amount"}
            />
          )}
          {formErrors.amount && (
            <Text color="red.500" fontSize="sm">
              {formErrors.amount}
            </Text>
          )}
        </FormControl>

        <FormControl id="receipt" isInvalid={!!formErrors.receipt}>
          <FormLabel>Upload Payment Receipt</FormLabel>
          <InputGroup>
            <Input
              type="text"
              value={formValues.receipt ? formValues.receipt.name : ""}
              placeholder="No file chosen"
              readOnly
              bg="white"
              cursor="pointer"
            />
            <input
              type="file"
              ref={inputFileRef}
              style={{ display: "none" }}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  receipt: e.target.files[0],
                }))
              }
            />
            <InputRightElement width="auto" pr={2}>
              <Button
                leftIcon={<MdAttachFile />}
                colorScheme="green"
                size="sm"
                onClick={handleChooseFileClick}
                borderRadius="md"
              >
                Choose File
              </Button>
            </InputRightElement>
          </InputGroup>
          {formErrors.receipt && (
            <Text color="red.500" fontSize="sm">
              {formErrors.receipt}
            </Text>
          )}
        </FormControl>

        <FormControl id="paymentNarration">
          <FormLabel>Payment Narration (Optional)</FormLabel>
          <Textarea
            value={formValues.paymentNarration}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                paymentNarration: e.target.value,
              }))
            }
            placeholder="Enter any additional details for this payment"
          />
        </FormControl>

        <Stack direction="row" spacing={4} mt={4}>
          <Button type="button" colorScheme="gray" onClick={onPrevious}>
            Back
          </Button>
          <Button
            type="submit"
            isLoading={loading}
            loadingText="Processing..."
            colorScheme="green"
          >
            Next
          </Button>
        </Stack>
      </Box>
    </form>
  );
};

export default PaymentForm;

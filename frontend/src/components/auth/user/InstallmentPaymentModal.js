import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
  HStack,
  Box,
  Button,
  Alert,
  AlertIcon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  InputGroup,
  Input,
  InputRightElement,
  Spinner,
  useToast,
  Divider,
  Progress,
  Flex,
  Link,
} from "@chakra-ui/react";
import { MdAttachFile } from "react-icons/md";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4500/api";

const INSTALLMENT_PLANS = {
  camp_conference_42k: {
    label: "Camp + Conference",
    amounts: [20000, 15000, 7000],
    total: 42000,
  },
  conference_early_30k: {
    label: "Conference Only (Early Bird)",
    amounts: [10000, 10000, 10000],
    total: 30000,
  },
  conference_standard_35k: {
    label: "Conference Only (Standard)",
    amounts: [10000, 10000, 15000],
    total: 35000,
  },
};

const formatNaira = (n) => `₦${Number(n).toLocaleString()}`;

const statusColor = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
};

const InstallmentPaymentModal = ({ isOpen, onClose, token, installmentData }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [installmentInfo, setInstallmentInfo] = useState({
    installmentStep: installmentData?.installmentStep || 0,
    installmentPlan: installmentData?.installmentPlan || "",
    balance: installmentData?.balance || 0,
  });

  const [formValues, setFormValues] = useState({
    amount: "",
    receipt: null,
    paymentNarration: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const inputFileRef = useRef(null);
  const toast = useToast();

  // Create authenticated axios instance with the token from login
  const authApi = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchHistory = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await authApi.get("/payments/installment/history");
      const data = res.data;
      setPayments(data.payments || []);
      setInstallmentInfo({
        installmentStep: data.installmentStep,
        installmentPlan: data.installmentPlan,
        balance: data.balance,
      });
    } catch (error) {
      console.error("Error fetching installment history:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, token]);

  const plan = INSTALLMENT_PLANS[installmentInfo.installmentPlan];
  const progressPercent = (installmentInfo.installmentStep / 3) * 100;

  // Get available amounts for the next payment based on the plan
  const getAvailableAmounts = () => {
    if (!plan) return [];
    return plan.amounts.map((amt, idx) => ({
      value: String(amt),
      label: `${formatNaira(amt)} — Payment ${idx + 1}`,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.amount) errors.amount = "Please select an amount";
    if (!formValues.receipt) errors.receipt = "Receipt upload is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = async () => {
    const file = inputFileRef.current?.files[0];
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await authApi.put("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const receiptUrl = await handleFileUpload();
      if (!receiptUrl) {
        toast({
          title: "Error",
          description: "Failed to upload receipt. Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setSubmitting(false);
        return;
      }

      await authApi.post("/payments/installment", {
        amount: parseInt(formValues.amount),
        receiptUrl,
        paymentNarration: formValues.paymentNarration || `Installment payment`,
      });

      toast({
        title: "Payment Submitted",
        description: "Your installment payment has been submitted and is pending admin approval.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form and refresh history
      setFormValues({ amount: "", receipt: null, paymentNarration: "" });
      setShowPaymentForm(false);
      fetchHistory();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to submit payment. Please try again.";
      toast({
        title: "Error",
        description: msg,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setSubmitting(false);
  };

  const handleChooseFileClick = () => {
    inputFileRef.current.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxW="600px">
        <ModalHeader color="orange.600">Installment Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={5} align="stretch">
            {/* Status Alert */}
            <Alert status={installmentInfo.installmentStep >= 3 ? "success" : "warning"} borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                {installmentInfo.installmentStep >= 3
                  ? "All payments completed! You can now log in and access your dashboard."
                  : "You can only access your dashboard after completing all 3 installment payments."}
              </Text>
            </Alert>

            {/* Progress Section */}
            <Box bg="gray.50" p={4} borderRadius="md">
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="bold">Payment Progress</Text>
                <Badge colorScheme={installmentInfo.installmentStep >= 3 ? "green" : "orange"}>
                  {installmentInfo.installmentStep} of 3 completed
                </Badge>
              </Flex>
              <Progress
                value={progressPercent}
                colorScheme={installmentInfo.installmentStep >= 3 ? "green" : "orange"}
                borderRadius="full"
                size="sm"
                mb={2}
              />
              <HStack justify="space-between" fontSize="xs" color="gray.600">
                <Text>Plan: {plan?.label || "—"}</Text>
                <Text>Balance: {formatNaira(installmentInfo.balance)}</Text>
              </HStack>
              {plan && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Breakdown: {plan.amounts.map((a, i) => `Payment ${i + 1}: ${formatNaira(a)}`).join(" → ")}
                </Text>
              )}
            </Box>

            <Divider />

            {/* Payment History */}
            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="bold" fontSize="md">Payment History</Text>
                <Button size="xs" variant="outline" onClick={fetchHistory} isLoading={loading}>
                  Refresh
                </Button>
              </Flex>

              {loading ? (
                <Box textAlign="center" py={4}>
                  <Spinner size="md" />
                </Box>
              ) : payments.length === 0 ? (
                <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                  No payments recorded yet.
                </Text>
              ) : (
                <Box overflowX="auto" maxH="200px" overflowY="auto">
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>Amount</Th>
                        <Th>Status</Th>
                        <Th>Receipt</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {payments.map((p, idx) => (
                        <Tr key={p._id || idx}>
                          <Td fontSize="xs">
                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                          </Td>
                          <Td fontSize="xs" fontWeight="bold">
                            {formatNaira(p.amount)}
                          </Td>
                          <Td>
                            <Badge size="sm" colorScheme={statusColor[p.status] || "gray"}>
                              {p.status}
                            </Badge>
                          </Td>
                          <Td>
                            {p.receiptUrl ? (
                              <Link href={p.receiptUrl} target="_blank" color="blue.500" fontSize="xs">
                                View
                              </Link>
                            ) : "—"}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </Box>

            <Divider />

            {/* Make Payment Section */}
            {installmentInfo.installmentStep < 3 && (
              <Box>
                {!showPaymentForm ? (
                  <Button
                    colorScheme="green"
                    width="100%"
                    onClick={() => setShowPaymentForm(true)}
                  >
                    Make Next Payment
                  </Button>
                ) : (
                  <Box bg="green.50" p={4} borderRadius="md">
                    <Text fontWeight="bold" fontSize="sm" mb={3}>
                      Submit Installment Payment
                    </Text>
                    
                    {/* Bank details */}
                    <Box bg="white" p={3} borderRadius="md" mb={4} border="1px solid" borderColor="gray.200">
                      <Text fontSize="xs" fontWeight="bold" mb={1}>Bank Details:</Text>
                      <Text fontSize="xs">Account Name: Timsan southwest</Text>
                      <Text fontSize="xs">Account Number: 2283452778</Text>
                      <Text fontSize="xs">Bank: UBA</Text>
                    </Box>

                    <form onSubmit={handleSubmitPayment}>
                      <VStack spacing={3}>
                        <FormControl isInvalid={!!formErrors.amount}>
                          <FormLabel fontSize="sm">Amount</FormLabel>
                          <Select
                            size="sm"
                            value={formValues.amount}
                            onChange={(e) => setFormValues(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="Select amount"
                          >
                            {getAvailableAmounts().map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Select>
                          {formErrors.amount && (
                            <Text color="red.500" fontSize="xs">{formErrors.amount}</Text>
                          )}
                        </FormControl>

                        <FormControl isInvalid={!!formErrors.receipt}>
                          <FormLabel fontSize="sm">Upload Receipt</FormLabel>
                          <InputGroup size="sm">
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
                              accept="image/*,.pdf"
                              onChange={(e) =>
                                setFormValues(prev => ({ ...prev, receipt: e.target.files[0] }))
                              }
                            />
                            <InputRightElement width="auto" pr={1}>
                              <Button
                                leftIcon={<MdAttachFile />}
                                colorScheme="green"
                                size="xs"
                                onClick={handleChooseFileClick}
                              >
                                Choose
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                          {formErrors.receipt && (
                            <Text color="red.500" fontSize="xs">{formErrors.receipt}</Text>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Narration (Optional)</FormLabel>
                          <Textarea
                            size="sm"
                            value={formValues.paymentNarration}
                            onChange={(e) =>
                              setFormValues(prev => ({ ...prev, paymentNarration: e.target.value }))
                            }
                            placeholder="Any additional details"
                            rows={2}
                          />
                        </FormControl>

                        <HStack width="100%" spacing={3}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowPaymentForm(false)}
                            flex={1}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            type="submit"
                            colorScheme="green"
                            isLoading={submitting}
                            loadingText="Submitting..."
                            flex={1}
                          >
                            Submit Payment
                          </Button>
                        </HStack>
                      </VStack>
                    </form>
                  </Box>
                )}
              </Box>
            )}

            {/* Close button */}
            <Button variant="outline" onClick={onClose} width="100%">
              Close
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InstallmentPaymentModal;

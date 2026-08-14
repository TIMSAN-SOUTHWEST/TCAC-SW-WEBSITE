import Link from "next/link";

import {
  Box,
  Flex,
  Image,
  Stack,
  Text,
  Stepper,
  Step,
  StepIndicator,
  StepIcon,
  StepStatus,
  StepTitle,
  StepSeparator,
  StepNumber,
  Button,
  HStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";

import { FaUser } from "react-icons/fa";
import { FiMenu, FiLock } from "react-icons/fi";
import { GiPayMoney } from "react-icons/gi";
import { MdEvent, MdMedicalServices } from "react-icons/md";
import { useRouter } from "next/router";

const steps = [
  {
    title: "Personal Information",
    description: "Fill in your personal details",
    icon: FaUser,
  },
  {
    title: "CAC",
    description: "Fill the TCAC form",
    icon: MdEvent,
  },
  {
    title: "Medical Condition",
    description: "State your medical/health conditions",
    icon: MdMedicalServices,
  },
  {
    title: "Payment",
    description: "Proceed with the payment",
    icon: GiPayMoney,
  },
  {
    title: "Password Creation",
    description: "Create a secure password",
    icon: FiLock,
  },
];

const RegisterAuthLayout = ({ role, currentStep, setStep, children }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
      {/* Mobile header with hamburger menu */}
      <Flex
        display={{ base: "flex", md: "none" }}
        justify="space-between"
        align="center"
        p={4}
        bg="green.500"
        color="gray.50"
      >
        <Link href="/" passHref>
          <Image
            src="/images/timsan-logo.png"
            alt="Logo"
            className="h-12 mb-6"
          />
        </Link>

        <IconButton
          icon={<FiMenu />}
          aria-label="Open sidebar"
          onClick={onOpen}
          variant="outline"
          color={"gray.50"}
        />
      </Flex>

      {/* Sidebar */}
      <Box
        bg="green.500"
        color="white"
        w={{ base: isOpen ? "full" : "0", md: "40%" }} // Visible automatically on md
        py={8}
        pb={4}
        px={{ base: isOpen ? 4 : 0, md: 4 }} // Add padding for medium and above
        overflow="hidden"
        position={{ base: "absolute", md: "relative" }} // Sidebar is relative on medium
        left={{ base: isOpen ? 0 : "-100%", md: "0" }} // Sidebar is hidden off-screen on base
        transition="all 0.3s ease"
        zIndex={10}
        onClick={onClose}
      >
        <Stack spacing={6} align="start" pl={6}>
          <Link href="/" passHref className="mb-6">
            <Image
              src="/images/timsan-logo.png"
              alt="Logo"
              className="h-12 mb-6"
            />
          </Link>

          <Stepper index={currentStep} orientation="vertical" height="400px">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={step.icon}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <Button
                    variant="link"
                    w="full"
                    color="whiteAlpha"
                    p={2}
                    _hover={{
                      background: "green.600",
                      boxShadow: "md",
                      textDecoration: "none",
                    }}
                    _focus={{
                      background: "green.600",
                      boxShadow: "md",
                      textDecoration: "none",
                    }}
                    boxShadow="none"
                    background="transparent" // No background by default
                    onClick={() => setStep(index)}
                  >
                    <StepTitle>{step.title}</StepTitle>
                  </Button>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Stack>
      </Box>

      {/* Main content */}
      <Box
        flex={1}
        bg="green.50"
        p={{ base: 4, md: 8 }}
        mt={{ base: 16, md: 0 }} // Add margin for mobile top spacing
      >
        {/* Desktop header */}
        <Flex
          display={{ base: "none", md: "flex" }}
          justify="space-between"
          mb={6}
          borderBottom="2px solid"
          borderColor="gray.100"
          py={8}
          px={12}
        >
          <Text as="a" href="/" fontWeight="bold">
            Home
          </Text>

          <HStack spacing={4}>
            <Text display={{ base: "none", md: "block" }} fontWeight="medium">
              Already registered?
            </Text>
            <Button
              variant="outline"
              colorScheme="green"
              p={4}
              borderRadius="xl"
              border="1px solid black"
              boxShadow="2px 2px 0px 0px #000000"
              color="black"
              _hover={{
                color: "white",
                bg: "green.500",
                borderColor: "green.500",
              }}
              onClick={() => router.push(`/login/${role}`)}
            >
              Login
            </Button>
          </HStack>
        </Flex>

        {/* children */}
        <Box bg="white" p={8} borderRadius="lg" shadow="lg">
          {children}
        </Box>

        <Stack spacing={4} mt={8}>
          <Text fontSize="sm" color="gray.600">
            Already have an account?{" "}
            <Link href={`/login/${role}`} passHref>
              <Button
                variant="link"
                colorScheme="green"
                _hover={{
                  color: "white",
                  bg: "green.500",
                  borderColor: "green.500",
                  px: "2",
                  py: "1",
                }}
              >
                Login
              </Button>
            </Link>
          </Text>
          <Text fontSize="sm" color="gray.600">
            Forgot password?{" "}
            <Link href={`/reset-password/${role}`} passHref>
              <Button
                variant="link"
                colorScheme="green"
                _hover={{
                  color: "white",
                  bg: "green.500",
                  borderColor: "green.500",
                  px: "2",
                  py: "1",
                }}
              >
                Reset
              </Button>
            </Link>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
};

export default RegisterAuthLayout;

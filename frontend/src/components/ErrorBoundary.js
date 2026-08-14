import React from "react";
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to an error reporting service in production
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="green.50"
          p={8}
        >
          <VStack spacing={6} textAlign="center" maxW="500px">
            <Heading size="lg" color="gray.700">
              Something went wrong
            </Heading>
            <Text color="gray.600">
              An unexpected error occurred. Please try again.
            </Text>
            <Button
              colorScheme="green"
              onClick={this.handleReset}
              size="lg"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              onClick={() => (window.location.href = "/")}
              size="md"
            >
              Go to Home
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

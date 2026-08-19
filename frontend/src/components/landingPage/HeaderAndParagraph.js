import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const HeroSection = () => {
  return (
    <Box
      as="section"
      py={{ base: 10, md: 16 }}
      px={{ base: 6, md: 12 }}
      textAlign="center"
      bg="white"
    >
      <Heading
        as="h1"
        fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
        fontWeight="bold"
        mb={4}
        color="gray.900"
      >
        TIMSAN Camp and Conference 2026(TCAC &apos;26)
      </Heading>
      <Text
        fontSize={{ base: "sm", md: "md" }}
        maxW="700px"
        mx="auto"
        color="gray.600"
        lineHeight="tall"
      >
        Participate in an extraordinary experience while delving into the heart of
        leadership excellence, creativity, innovation, brotherhood, and exponential
        growth.
      </Text>
    </Box>
  );
};

export default HeroSection;

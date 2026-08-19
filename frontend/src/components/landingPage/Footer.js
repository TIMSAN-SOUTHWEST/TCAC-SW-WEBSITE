import { Box, Flex, Text, Link, Icon, Image, VStack } from "@chakra-ui/react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      as="footer"
      bg="gray.900"
      color="gray.100"
      py={{ base: 8, md: 12 }}
      px={{ base: 4, md: 8 }}
      textAlign="center"
    >
      <VStack spacing={4} maxW="600px" mx="auto">
        <Image
          src="/images/timsan-logo.png"
          alt="TIMSAN Logo"
          boxSize={{ base: "60px", md: "80px" }}
          objectFit="contain"
        />

        <Text fontWeight="bold" fontSize={{ base: "sm", md: "lg" }} color="white">
          TIMSAN CAMP AND CONFERENCE, SOUTHWEST ZONE
        </Text>

        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={{ base: 1, md: 3 }}
          fontSize={{ base: "xs", md: "sm" }}
        >
          <Link href="mailto:timsan.swcampandconference@gmail.com" isExternal color="gray.300" _hover={{ color: "white" }}>
            timsan.swcampandconference@gmail.com
          </Link>
          <Text display={{ base: "none", md: "block" }} color="gray.500">|</Text>
          <Link href="tel:+2348168089260" isExternal color="gray.300" _hover={{ color: "white" }}>
            +2348168089260
          </Link>
        </Flex>

        <Text fontWeight="bold" fontSize="sm" color="white" mt={2}>
          Follow Us
        </Text>

        <Flex gap={3}>
          <Link href="https://facebook.com/timsansouthwest/" isExternal bg="green.500" rounded="full" p={2} color="white" _hover={{ bg: "green.600" }}>
            <Icon as={FaFacebook} boxSize={5} />
          </Link>
          <Link href="https://www.instagram.com/timsansouthwest/" isExternal bg="green.500" rounded="full" p={2} color="white" _hover={{ bg: "green.600" }}>
            <Icon as={FaInstagram} boxSize={5} />
          </Link>
          <Link href="https://x.com/timsan_sw_zone" isExternal bg="green.500" rounded="full" p={2} color="white" _hover={{ bg: "green.600" }}>
            <Icon as={FaTwitter} boxSize={5} />
          </Link>
        </Flex>

        <Text fontSize="xs" color="gray.400" mt={4}>
          © 2026. Powered by TIMSAN Southwest.
          <br />
          All Rights Reserved.
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;

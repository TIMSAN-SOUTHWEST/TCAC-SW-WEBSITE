import React from "react";
import { Box, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import SliderModule from "react-slick";

const Slider = SliderModule.default || SliderModule;

const recaps = [
  {
    id: 1,
    image: "/images/previous-tcac-recap/tcac-2021-ignite.jpg",
    title: "TIMSAN Southwest TCAC 2021 - Ignite the Vision",
    description: "The genesis of faith-driven excellence across Southwest.",
  },
  {
    id: 2,
    image: "/images/previous-tcac-recap/tcac-2021-momentum.jpg",
    title: "TIMSAN Southwest TCAC 2021 - Momentum Unleashed",
    description: "Creativity and service take centre stage in 2021.",
  },
  {
    id: 3,
    image: "/images/previous-tcac-recap/tcac-2022-rise.jpg",
    title: "TIMSAN Southwest TCAC 2022 - Rise Together",
    description: "Innovation and brotherhood took new heights at TCAC 22.",
  },
  {
    id: 4,
    image: "/images/previous-tcac-recap/tcac-2022-accelerate.jpg",
    title: "TIMSAN Southwest TCAC 2022 - Accelerate the Future",
    description: "Turning bold vision into exponential impact in 2022.",
  },
  {
    id: 5,
    image: "/images/previous-tcac-recap/tcac-2023-genesis.jpg",
    title: "TIMSAN Southwest TCAC 2023 - Genesis",
    description: "A new chapter of leadership and community begins.",
  },
  {
    id: 6,
    image: "/images/previous-tcac-recap/tcac-2023-spark.jpg",
    title: "TIMSAN Southwest TCAC 2023 - Spark",
    description: "Igniting the fire of purpose and service.",
  },
  {
    id: 7,
    image: "/images/previous-tcac-recap/tcac-2024-elevate.jpg",
    title: "TIMSAN Southwest TCAC 2024 - Elevate",
    description: "Rising higher in faith, knowledge, and impact.",
  },
  {
    id: 8,
    image: "/images/previous-tcac-recap/tcac-2024-stronger.jpg",
    title: "TIMSAN Southwest TCAC 2024 - Stronger Together",
    description: "Unity and resilience defined the 2024 experience.",
  },
  {
    id: 9,
    image: "/images/previous-tcac-recap/tcac-2025-spirit.jpeg",
    title: "TIMSAN Southwest TCAC 2025 - Spirit",
    description: "Spiritual renewal and brotherhood at its finest.",
  },
  {
    id: 10,
    image: "/images/previous-tcac-recap/tcac-2025-more.jpeg",
    title: "TIMSAN Southwest TCAC 2025 - More",
    description: "Pushing boundaries and achieving more together.",
  },
];

const PrevTCACRecap = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <Box as="section" bg="green.500" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10, lg: 14 }}>
      {/* Section Header */}
      <Box
        display="inline-block"
        mb={{ base: 6, md: 10 }}
        px={5}
        py={3}
        border="2px solid"
        borderColor="black"
        borderRadius="md"
        bg="white"
      >
        <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} color="gray.900" fontWeight="bold">
          Previous TCAC Recap
        </Heading>
      </Box>

      {/* Slider - full width, aligned with title */}
      <Box>
        <Slider {...settings}>
          {recaps.map((recap) => (
            <Box key={recap.id} px={2}>
              <VStack spacing={3} align="start">
                <Image
                  src={recap.image}
                  alt={recap.title}
                  borderRadius="lg"
                  objectFit="cover"
                  w="full"
                  h={{ base: "220px", md: "250px" }}
                  fallbackSrc="https://via.placeholder.com/400x250?text=TCAC+Recap"
                />
                <Text fontWeight="bold" color="white" fontSize={{ base: "sm", md: "md" }} noOfLines={2}>
                  {recap.title}
                </Text>
                <Text color="whiteAlpha.800" fontSize={{ base: "xs", md: "sm" }} noOfLines={2}>
                  {recap.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default PrevTCACRecap;

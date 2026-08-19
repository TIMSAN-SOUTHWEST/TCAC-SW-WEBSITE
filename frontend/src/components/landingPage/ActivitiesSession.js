import React from "react";
import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";
import SliderModule from "react-slick";

const Slider = SliderModule.default || SliderModule;

const activities = [
  { name: "Medical check up", image: "/images/tcac-activities/medical-chekup.jpg" },
  { name: "Spiritual Gathering", image: "/images/tcac-activities/spiritual-gathering.jpg" },
  { name: "Health Awareness", image: "/images/tcac-activities/health-awareness.jpg" },
  { name: "Empowerment", image: "/images/tcac-activities/empowerment.jpg" },
  { name: "Brothers Networking", image: "/images/tcac-activities/brothers-networking.jpg" },
  { name: "Sister's Networking", image: "/images/tcac-activities/sisters-networking.jpg" },
  { name: "Children Islamic class", image: "/images/tcac-activities/children-class.jpg" },
  { name: "Trade fair", image: "/images/tcac-activities/trade-fair.jpg" },
];

const ActivitiesSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <Box as="section" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10, lg: 14 }} bg="#f0fff0">
      {/* Section Header */}
      <Box
        display="inline-block"
        mb={{ base: 6, md: 10 }}
        px={5}
        py={3}
        border="2px solid"
        borderColor="gray.800"
        borderRadius="md"
      >
        <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} color="gray.900" fontWeight="bold">
          TCAC Activities
        </Heading>
      </Box>

      {/* Slider - full width, aligned with title */}
      <Box>
        <Slider {...settings}>
          {activities.map((activity, index) => (
            <Box key={index} px={2}>
              <VStack spacing={3} align="start">
                <Image
                  src={activity.image}
                  alt={activity.name}
                  borderRadius="lg"
                  objectFit="cover"
                  w="full"
                  h={{ base: "220px", md: "250px" }}
                  fallbackSrc="https://via.placeholder.com/400x250?text=Activity"
                />
                <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                  {activity.name}
                </Text>
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default ActivitiesSection;

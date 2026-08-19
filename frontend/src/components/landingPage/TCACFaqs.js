import React from "react";
import { Box, Heading, Image, Text, VStack } from "@chakra-ui/react";
import SliderModule from "react-slick";

const Slider = SliderModule.default || SliderModule;

const faqs = [
  {
    image: "/images/faq/why-timsan.jpg",
    title: "Why TIMSAN",
    description:
      "TIMSAN (The Muslim Students' Association of Nigeria) works to uplift the spiritual life, academic excellence and social service ethic of Tijaaniyyah students in Nigerian tertiary institutions. The camp is its flagship Southwest zone programme for putting those ideals into practice.",
  },
  {
    image: "/images/faq/what-is-timsan.png",
    title: "What is TCAC?",
    description:
      "TCAC (TIMSAN Camp and Conference) is the annual flagship event of TIMSAN Southwest. It brings together hundreds of Muslim students for a multi-day experience of spiritual growth, leadership development, networking, and community building.",
  },
  {
    image: "/images/faq/when-and-where.png",
    title: "When and Where?",
    description:
      "TCAC holds annually during the long vacation period at a designated camp ground within the Southwest zone. Details for each year's edition are announced via official TIMSAN Southwest channels.",
  },
];

const TCACFaqs = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    fade: true,
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
        borderColor="green.500"
        borderRadius="md"
      >
        <Heading as="h2" fontSize={{ base: "xl", md: "2xl" }} color="green.600" fontWeight="bold">
          TCAC F&amp;Qs
        </Heading>
      </Box>

      {/* FAQ Slider - full width, aligned with title */}
      <Box>
        <Slider {...settings}>
          {faqs.map((faq, index) => (
            <Box key={index} px={2} outline="none">
              <VStack spacing={4} align="start">
                <Image
                  src={faq.image}
                  alt={faq.title}
                  borderRadius="lg"
                  objectFit="cover"
                  w="full"
                  h={{ base: "220px", md: "380px" }}
                  fallbackSrc="https://via.placeholder.com/900x400?text=TCAC"
                />
                <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} color="gray.900" fontWeight="bold" fontStyle="italic">
                  {faq.title}
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.700" lineHeight="tall">
                  {faq.description}
                </Text>
              </VStack>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default TCACFaqs;

import Head from "next/head";
import React, { useState } from "react";
import { Box, Image, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import Header from "../components/landingPage/Header";
import HeroSection from "../components/landingPage/HeaderAndParagraph";
import ActivitiesSection from "../components/landingPage/ActivitiesSession";
import PrevTCACRecap from "../components/landingPage/PreviousTCACRecap";
import TCACFaqs from "../components/landingPage/TCACFaqs";
import Footer from "../components/landingPage/Footer";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <>
      <Head>
        <title>TCAC &apos;26</title>
        <meta name="description" content="TIMSAN Camp and Conference 2026 - Leadership, Creativity, Innovation, Brotherhood" />
      </Head>

      {/* Welcome Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered size="xl">
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent bg="transparent" boxShadow="none" maxW={{ base: "90%", md: "500px" }}>
          <ModalCloseButton
            color="white"
            bg="red.500"
            borderRadius="full"
            size="lg"
            top={-3}
            right={-3}
            _hover={{ bg: "red.600" }}
            zIndex={10}
          />
          <ModalBody p={0}>
            <Image
              src="/tcac-2026-modal.jpeg"
              alt="TCAC 2026"
              borderRadius="lg"
              w="full"
              objectFit="contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box>
        <Header />
        <HeroSection />
        <ActivitiesSection />
        <PrevTCACRecap />
        <TCACFaqs />
        <Footer />
      </Box>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 3600,
  };
}

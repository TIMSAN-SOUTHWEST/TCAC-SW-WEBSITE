import { Box, Flex, Button, Image, IconButton, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaBell } from "react-icons/fa";
import { useState, useEffect } from "react";
import BankDetailsModal from "./BankDetailsModal";
import NotificationModal from "./NotificationModal";
import api from "@/utils/api";

const Header = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasViewedNotifications, setHasViewedNotifications] = useState(false);

  const {
    isOpen: isBankModalOpen,
    onOpen: onOpenBankModal,
    onClose: onCloseBankModal,
  } = useDisclosure();
  const {
    isOpen: isNotificationModalOpen,
    onOpen: onOpenNotificationModal,
    onClose: onCloseNotificationModal,
  } = useDisclosure();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get("/notifications");
        const data = response.data;
        if (data.success) {
          setNotifications(data.data);
          const lastViewedTime = localStorage.getItem("lastNotificationView");
          const hasNew = data.data.some((n) =>
            !lastViewedTime ? true : new Date(n.createdAt) > new Date(lastViewedTime)
          );
          setHasViewedNotifications(!hasNew);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleOpenNotificationModal = () => {
    onOpenNotificationModal();
    setHasViewedNotifications(true);
    localStorage.setItem("lastNotificationView", new Date().toISOString());
  };

  const hasActiveNotifications = notifications.filter((n) => n.isActive).length > 0;
  const shouldShowDot = hasActiveNotifications && !hasViewedNotifications;

  return (
    <Box as="header" bg="#d4fcd4" px={{ base: 4, md: 8 }} py={3}>
      <Flex justify="space-between" align="center">
        <Image src="/images/timsan-logo.png" alt="TIMSAN Logo" boxSize={{ base: "45px", md: "55px" }} objectFit="contain" />

        <Flex align="center" gap={{ base: 2, md: 4 }}>
          {/* Notification bell */}
          <Flex align="center" position="relative">
            <IconButton
              aria-label="Notifications"
              icon={<FaBell color="white" />}
              size="md"
              isRound
              bg="green.500"
              _hover={{ bg: "green.600" }}
              onClick={handleOpenNotificationModal}
            />
            {!loading && shouldShowDot && (
              <Box position="absolute" top={0} right={0} w="8px" h="8px" bg="red.500" borderRadius="full" />
            )}
          </Flex>

          <Button
            bg="green.500"
            color="white"
            size="md"
            px={6}
            borderRadius="lg"
            fontWeight="bold"
            border="1px solid"
            borderColor="green.600"
            _hover={{ bg: "green.600" }}
            onClick={onOpenBankModal}
          >
            Donate
          </Button>

          <Button
            bg="green.500"
            color="white"
            size="md"
            px={6}
            borderRadius="lg"
            fontWeight="bold"
            border="1px solid"
            borderColor="green.600"
            _hover={{ bg: "green.600" }}
            onClick={() => router.push("/login/user")}
          >
            Login
          </Button>
        </Flex>
      </Flex>

      <BankDetailsModal isOpen={isBankModalOpen} onClose={onCloseBankModal} />
      <NotificationModal isOpen={isNotificationModalOpen} onClose={onCloseNotificationModal} />
    </Box>
  );
};

export default Header;

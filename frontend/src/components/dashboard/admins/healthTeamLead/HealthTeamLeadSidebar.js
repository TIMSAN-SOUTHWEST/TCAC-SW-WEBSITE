import React from 'react';
import { VStack, Text, Link, Flex } from '@chakra-ui/react';
import { FaHome, FaUserMd, FaRegFileAlt, FaSignOutAlt } from 'react-icons/fa';

const HealthTeamSidebar = ({ onMenuClick }) => {
  return (
    <VStack
      as="nav"
      align="start"
      w="250px"
      p="4"
      bg="blue.200"
      color="gray.700"
      spacing={4}
      className="h-full"
    >
      <Text mb={8} textAlign="center" fontSize="xl">Welcome, Health Team Lead</Text>

      <Link onClick={() => onMenuClick('dashboard')}>
        <Flex align="center">
          <FaHome />
          <Text ml={2}>Dashboard</Text>
        </Flex>
      </Link>

      <Link onClick={() => onMenuClick('medical-records')}>
        <Flex align="center">
          <FaUserMd />
          <Text ml={2}>Medical Records</Text>
        </Flex>
      </Link>

      <Link onClick={() => onMenuClick('reports')}>
        <Flex align="center">
          <FaRegFileAlt />
          <Text ml={2}>Reports</Text>
        </Flex>
      </Link>

      <Link onClick={() => onMenuClick('logout')}>
        <Flex align="center">
          <FaSignOutAlt />
          <Text ml={2}>Logout</Text>
        </Flex>
      </Link>
    </VStack>
  );
};

export default HealthTeamSidebar;

import Link from "next/link";
import {  Button, Flex, Text, Image } from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';

const DashboardHeader = ({ onMenuClick }) => {
  return (
    <Flex
      className="p-4 bg-green-100"
      justify="space-between"
      align="center"
      w="100%"
    >
      {/* Left section: Avatar and Home */}
      <Link href="/" className="flex items-center gap-4">
    <Image
      src="/images/timsan-logo.png"
      alt="Logo"
      className="h-12" 
    />
    <span>Home</span>
  </Link>


      {/* Right section: Log out button */}
      <Button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        _hover={{ bg: 'green.600' }}
        onClick={() => onMenuClick("logout")}
      >
        Log out
      </Button>
    </Flex>
  );
};

export default DashboardHeader;

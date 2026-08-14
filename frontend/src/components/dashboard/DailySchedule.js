// components/DailySchedule.js
import { Box, Select, Text } from "@chakra-ui/react";

const DailySchedule = () => {
  return (
    <Box bg="green.50" p={4} >
      <Text fontWeight="bold" mb={4}>Daily schedule</Text>
      <Select mb={4} placeholder="Day 1">
        <option value="day1">Day 1</option>
        <option value="day2">Day 2</option>
        <option value="day3">Day 3</option>
      </Select>
      <Box p={2} bg="green.200" borderRadius="md" mb={2}>
        <Text>Subuh</Text>
        <Text>5:00 AM</Text>
      </Box>
      <Box p={2} bg="green.200" borderRadius="md" mb={2}>
        <Text>Breakfast</Text>
        <Text>7:00 AM</Text>
      </Box>
      <Box p={2} bg="green.200" borderRadius="md">
        <Text>Dhuhr</Text>
        <Text>12:00 PM</Text>
      </Box>
    </Box>
  );
};

export default DailySchedule;

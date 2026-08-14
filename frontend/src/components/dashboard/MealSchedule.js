// components/MealSchedule.js
import { Box, Select, Text } from "@chakra-ui/react";

const MealSchedule = () => {
  return (
    <Box  p={4} bg="green.50">
      <Text fontWeight="bold" mb={4}>Meal schedule</Text>
      <Select mb={4} placeholder="Day 1">
        <option value="day1">Day 1</option>
        <option value="day2">Day 2</option>
        <option value="day3">Day 3</option>
      </Select>
      <Box p={2} bg="green.100" borderRadius="md" mb={2}>
        <Text>Breakfast</Text>
        <Text>7:00 AM</Text>
      </Box>
      <Box p={2} bg="green.100" borderRadius="md" mb={2}>
        <Text>Lunch</Text>
        <Text>12:00 PM</Text>
      </Box>
      <Box p={2} bg="green.100" borderRadius="md">
        <Text>Dinner</Text>
        <Text>6:00 PM</Text>
      </Box>
    </Box>
  );
};

export default MealSchedule;

import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, Flex } from "@chakra-ui/react";
import UserSidebar from "../../components/dashboard/user/UserSidebar";
import AdminSidebar from "../../components/dashboard/admins/admin/AdminSidebar";
import SuperAdminSidebar from "../../components/dashboard/superAdmin/SuperAdminSidebar";
import RegTeamSidebar from "../../components/dashboard/admins/regTeamLead/RegTeamLeadSidebar";
import HealthTeamSidebar from "../../components/dashboard/admins/healthTeamLead/HealthTeamLeadSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSelectedComponentRenderer from "@/components/dashboard/DBSelectedCompRenderer";

const DashboardLayout = ({ role, accountData, adminFunction, logout }) => {
  const router = useRouter();
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleMenuClick = (component) => {
    if (component === "logout") {
      logout(); // Call the logout function
      // Redirect user to login page based on role
      if (role === "User") {
        router.push("/login/user");
      } else if (role === "Admin") {
        router.push("/login/admin");
      } else if (role === "Super Admin") {
        router.push("/login/super-admin");
      }
    } else {
      setSelectedComponent(component);
    }
  };

  const renderHeader = () => (
    <DashboardHeader accountData={accountData} onMenuClick={handleMenuClick} />
  );

  const renderSidebar = () => {
    if (role === "User")
      return (
        <UserSidebar accountData={accountData} onMenuClick={handleMenuClick} />
      );
    if (role === "Super Admin")
      return <SuperAdminSidebar accountData={accountData} onMenuClick={handleMenuClick} />;
    switch (adminFunction) {
      case "reg_team_lead":
        return <RegTeamSidebar accountData={accountData} onMenuClick={handleMenuClick} />;
      case "health_team_lead":
        return <HealthTeamSidebar accountData={accountData} onMenuClick={handleMenuClick} />;
      default:
        return <AdminSidebar accountData={accountData} onMenuClick={handleMenuClick} />;
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {renderSidebar()}
      <Box flex="1" p={{ base: "4", md: "8" }} bg="white">
        {renderHeader()}
        <Box mt={8}>
          <DashboardSelectedComponentRenderer
            role={role}
            adminFunction={adminFunction}
            selectedComponent={selectedComponent}
            accountData={accountData}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;

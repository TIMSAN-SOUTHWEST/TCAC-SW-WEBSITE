import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Center, Spinner } from "@chakra-ui/react";

// Lazy-load dashboard components for better code splitting
const UserDashboard = dynamic(() => import("./user/UserDashboard"), { ssr: false });
const ActivitiesManagement = dynamic(() => import("./admins/admin/ActivitiesManagement"), { ssr: false });
const MealSchedule = dynamic(() => import("./MealSchedule"), { ssr: false });
const DailySchedule = dynamic(() => import("./DailySchedule"), { ssr: false });
const PaymentHistory = dynamic(() => import("./paymentHistory"), { ssr: false });
const RegisteredAdmins = dynamic(() => import("./superAdmin/RegisteredAdmins"), { ssr: false });
const RegisteredUsers = dynamic(() => import("./RegisteredUsers"), { ssr: false });
const MealManagement = dynamic(() => import("./admins/admin/MealManagement"), { ssr: false });
const DaysManagement = dynamic(() => import("./admins/admin/DaysManagement"), { ssr: false });
const AdminPaymentApprovalTable = dynamic(() => import("./admins/admin/AdminPaymentApprovalTable"), { ssr: false });
const SlipManagement = dynamic(() => import("./admins/admin/SlipManagement"), { ssr: false });
const Settings = dynamic(() => import("./superAdmin/Settings"), { ssr: false });
const PaymentRequestManagement = dynamic(() => import("./superAdmin/PaymentRequestManagement"), { ssr: false });
const PostManagement = dynamic(() => import("./admins/admin/PostManagement"), { ssr: false });
const NotificationManagement = dynamic(() => import("./admins/admin/NotificationManagement"), { ssr: false });

const LoadingFallback = () => (
  <Center py={20}>
    <Spinner size="xl" color="green.500" thickness="4px" />
  </Center>
);

const DashboardSelectedComponentRenderer = ({
  role,
  accountData,
  adminFunction,
  selectedComponent,
}) => {
  const renderComponent = () => {
    if (role === "User") {
      switch (selectedComponent) {
        case "dashboard":
          return <UserDashboard accountData={accountData} />;
        case "payment-history":
          return <PaymentHistory />;
        default:
          return <UserDashboard accountData={accountData} />;
      }
    }

    if (role === "Admin") {
      switch (adminFunction) {
        case "reg_team_lead":
          switch (selectedComponent) {
            case "registered-users":
              return <RegisteredUsers accountData={accountData} />;
            case "meal-schedule":
              return <MealSchedule />;
            default:
              return <RegisteredUsers accountData={accountData} />;
          }
        case "health_team_lead":
          switch (selectedComponent) {
            case "meal-schedule":
              return <MealSchedule />;
            case "daily-schedule":
              return <DailySchedule />;
            default:
              return <DailySchedule />;
          }
        default:
          switch (selectedComponent) {
            case "registered-users":
              return <RegisteredUsers accountData={accountData} />;
            case "daily-schedule":
              return <DailySchedule />;
            case "meal-management":
              return <MealManagement />;
            case "activities-management":
              return <ActivitiesManagement />;
            case "post-management":
              return <PostManagement />;
            case "notification-management":
              return <NotificationManagement />;
            case "days-management":
              return <DaysManagement />;
            case "payment-management":
              return <AdminPaymentApprovalTable />;
            case "slip-management":
              return <SlipManagement />;
            default:
              return <RegisteredUsers accountData={accountData} />;
          }
      }
    }

    if (role === "Super Admin") {
      switch (selectedComponent) {
        case "registered-users":
          return <RegisteredUsers accountData={accountData} />;
        case "registered-admins":
          return <RegisteredAdmins accountData={accountData} />;
        case "activities-management":
          return <ActivitiesManagement />;
        case "meal-management":
          return <MealManagement />;
        case "post-management":
          return <PostManagement />;
        case "notification-management":
          return <NotificationManagement />;
        case "days-management":
          return <DaysManagement />;
        case "payment-management":
          return <AdminPaymentApprovalTable />;
        case "slip-management":
          return <SlipManagement />;
        case "settings":
          return <Settings accountData={accountData} />;
        case "payment-requests":
          return <PaymentRequestManagement />;
        default:
          return <RegisteredUsers accountData={accountData} />;
      }
    }

    return null;
  };

  return <Suspense fallback={<LoadingFallback />}>{renderComponent()}</Suspense>;
};

export default DashboardSelectedComponentRenderer;

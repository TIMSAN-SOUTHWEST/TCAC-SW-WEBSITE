// pages/login/[role].js
import { useRouter } from "next/router";
import AuthLayout from "../../layouts/auth/LoginAuthLayout";
import UserLoginForm from "../../components/auth/user/UserLoginForm";
import AdminLoginForm from "../../components/auth/admin/AdminLoginForm";
import SuperAdminLoginForm from "../../components/auth/superAdmin/SuperAdminLoginForm";

const Login = () => {
  const router = useRouter();
  const { role = "user" } = router.query;

  // Determine which form to render based on the role
  let loginForm;
  let formHeading;

  if (role === "user") {
    loginForm = <UserLoginForm role={role} />;
    formHeading = "User Login";
  } else if (role === "admin") {
    loginForm = <AdminLoginForm role={role} />;
    formHeading = "Admin Login";
  } else if (role === "super-admin") {
    loginForm = <SuperAdminLoginForm role={role} />;
    formHeading = "Super Admin Login";
  } else {
    // Fallback for unknown roles
    loginForm = <UserLoginForm role="user" />;
    formHeading = "User Login";
  }

  return (
    <AuthLayout loginForm={loginForm} formHeading={formHeading} role={role} />
  );
};

export default Login;

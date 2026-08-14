// pages/reset-password/[role].js
import { useRouter } from "next/router";
import ResetPasswordAuthLayout from "../../layouts/auth/ResetPasswordAuthLayout";
import UserResetPasswordForm from "../../components/auth/user/UserResetPasswordForm";
import AdminResetPasswordForm from "../../components/auth/admin/AdminResetPasswordForm";
import SuperAdminResetPasswordForm from "../../components/auth/superAdmin/SuperAdminResetPasswordForm";

const ResetPassword = () => {
  const router = useRouter();
  const { role = "user" } = router.query;

  // Determine the form to render based on the role
  const resetPasswordForm =
    role === "user" ? (
      <UserResetPasswordForm role={role} />
    ) : role === "admin" ? (
      <AdminResetPasswordForm role={role} />
    ) : role === "super-admin" ? (
      <SuperAdminResetPasswordForm role={role} />
    ) : (
      <UserResetPasswordForm role={role} />
    );

  // Form heading
  const formHeading =
    role === "user"
      ? "Reset Password"
      : role === "admin"
      ? "Reset Admin Password"
      : role === "super-admin"
      ? "Reset Super Admin Password"
      : "Reset Password";

  return (
    <ResetPasswordAuthLayout
      resetPasswordForm={resetPasswordForm}
      formHeading={formHeading}
      role={role}
    />
  );
};

export default ResetPassword;

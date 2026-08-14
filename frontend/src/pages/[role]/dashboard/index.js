import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import DashboardLayout from "../../../layouts/dashboard/DashboardLayout";
import withAuth from "../../../components/auth/withAuth";
import {
  selectIsUserAuthenticated,
  selectUserToken,
  selectUser,
  logoutUser,
} from "../../../store/slices/auth/user/userAuthSlice";
import {
  selectIsAdminAuthenticated,
  selectAdminToken,
  selectAdmin,
  logoutAdmin,
} from "../../../store/slices/auth/admin/adminAuthSlice";
import {
  selectIsSuperAdminAuthenticated,
  selectSuperAdminToken,
  selectSuperAdmin,
  logoutSuperAdmin,
} from "../../../store/slices/auth/superAdmin/superAdminAuthSlice";

// Normalize backend role values to display format used by dashboard components
function normalizeRole(role) {
  if (!role) return "User";
  switch (role.toLowerCase().replace(/[_\s]/g, '')) {
    case "superadmin": return "Super Admin";
    case "admin": return "Admin";
    case "user":
    default: return "User";
  }
}

const DashboardPage = () => {
  const router = useRouter();
  const { role } = router.query;
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);

  const selectors = useMemo(() => ({
    user: {
      isAuthenticated: selectIsUserAuthenticated,
      token: selectUserToken,
      accountInfo: selectUser,
      logout: logoutUser,
    },
    admin: {
      isAuthenticated: selectIsAdminAuthenticated,
      token: selectAdminToken,
      accountInfo: selectAdmin,
      logout: logoutAdmin,
    },
    "super-admin": {
      isAuthenticated: selectIsSuperAdminAuthenticated,
      token: selectSuperAdminToken,
      accountInfo: selectSuperAdmin,
      logout: logoutSuperAdmin,
    },
  }), []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentRole = selectors[role] ? role : "user";
  const { accountInfo, logout } = selectors[currentRole];
  const accountData = useSelector(accountInfo);

  if (!isClient) {
    return null;
  }

  return (
    <DashboardLayout
      role={normalizeRole(accountData?.role)}
      adminFunction={currentRole === 'admin' ? accountData?.adminFunction : undefined}
      accountData={accountData}
      logout={() => {
        dispatch(logout());
        sessionStorage.removeItem('userData');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('superAdminToken');
        sessionStorage.removeItem('adminData');
        sessionStorage.removeItem('superAdminData');
        router.push(`/login/${currentRole}`);
      }}
    />
  );
};

export default withAuth(DashboardPage);

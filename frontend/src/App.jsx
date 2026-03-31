import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard.jsx";
import SettlementPage from "./pages/SetttementPage.jsx";

import GroupDetails from "./pages/GroupDetails.jsx";
import Groups from "./pages/groups.jsx";
import Layout from "./components/Layout/Layout.jsx";
import BalanceSummary from "./components/dashboard/BalanceSummary.jsx";
import ActivityPage from "./pages/ActivityPage.jsx";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/balances/all"
          element={
            <ProtectedRoute>
              <BalanceSummary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />
        <Route path="/groups/:groupId" element={<GroupDetails />} />
        <Route
          path="/settlements"
          element={
            <ProtectedRoute>
              <SettlementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <ActivityPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
export default App;

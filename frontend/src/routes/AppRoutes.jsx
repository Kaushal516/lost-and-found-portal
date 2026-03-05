import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import UsersList from "../pages/Dashboard/UsersList";
import SearchFoundItems from "../pages/Search/SearchFoundItems";
import ProtectedRoute from "./guards/ProtectedRoute";
import AdminRoute from "./guards/AdminRoute";
import Register from "../pages/Register/Register";
import { Navigate } from "react-router-dom";
import PostFoundItem from "../pages/PostFoundItem/PostFoundItem";
import PostLostItem from "../pages/PostLostItem/PostLostItem";
import AdminClaims from "../pages/AdminClaims/AdminClaims";
import AdminLostItems from "../pages/AdminLostItems/AdminLostItems";
import AdminDeletionRequests from "../pages/Dashboard/AdminDeletionRequests";
import Chat from "../pages/Chat/Chat";
import Profile from "../pages/Profile/Profile";
import LostPublic from "../pages/LostPublic/LostPublic";
import Home from "../pages/Home/Home";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/found/new"
        element={
          <ProtectedRoute>
            <PostFoundItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lost/new"
        element={
          <ProtectedRoute>
            <PostLostItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lost"
        element={
          <ProtectedRoute>
            <LostPublic />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* User & Admin */}
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchFoundItems />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UsersList />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/claims"
        element={
          <AdminRoute>
            <AdminClaims />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/lost-items"
        element={
          <AdminRoute>
            <AdminLostItems />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/deletion-requests"
        element={
          <AdminRoute>
            <AdminDeletionRequests />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

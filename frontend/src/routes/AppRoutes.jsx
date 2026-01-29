import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Search from "../pages/Search/Search";
import AdminResolve from "../pages/AdminResolve/AdminResolve";
import ProtectedRoute from "./guards/ProtectedRoute";
import AdminRoute from "./guards/AdminRoute";
import Register from "../pages/Register/Register";
import LostNew from "../pages/LostNew/LostNew";
import { Navigate } from "react-router-dom";
import FoundNew from "../pages/FoundNew/FoundNew";
import Chat from "../pages/Chat/Chat";
import MyPosts from "../pages/MyPosts/MyPosts";
import LostPublic from "../pages/LostPublic/LostPublic";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
      path="/found/new"
      element={
        <ProtectedRoute>
           <FoundNew />
        </ProtectedRoute>
    }
      />
      <Route
      path="/lost/new"
      element={
        <ProtectedRoute>
            <LostNew />
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
      path="/my-posts"
      element={
      <ProtectedRoute>
        <MyPosts />
      </ProtectedRoute>
      }
    />
      <Route
  path="/lost-items"
  element={
    <ProtectedRoute>
      <LostPublic />
    </ProtectedRoute>
    }
  />


      {/* User & Admin */}
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
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

      {/* Admin Resolve */}
      <Route
        path="/admin/resolve"
        element={
          <AdminRoute>
            <AdminResolve />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

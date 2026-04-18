import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import LandingPage from "../pages/LandingPage";
import HomeFeedPage from "../pages/HomeFeedPage";
import WatchPage from "../pages/WatchPage";
import SearchPage from "../pages/SearchPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ChannelPage from "../pages/ChannelPage";
import DashboardPage from "../pages/DashboardPage";
import SettingsPage from "../pages/SettingsPage";
import UploadPage from "../pages/UploadPage";
import LikedVideosPage from "../pages/LikedVideosPage";
import SubscriptionsPage from "../pages/SubscriptionsPage";
import HistoryPage from "../pages/HistoryPage";
import NotFoundPage from "../pages/NotFoundPage";
import ContentPage from "../pages/Content";
import TweetsPage from "../pages/Tweets";
import SubscribersPage from "../pages/Subscribers";
import { useAuthStore } from "../store/authStore";

export function AppRouter() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="feed" element={<HomeFeedPage />} />
        <Route path="watch/:videoId" element={<WatchPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="channel/:username" element={<ChannelPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="liked"
          element={
            <ProtectedRoute>
              <LikedVideosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="subscriptions"
          element={
            <ProtectedRoute>
              <SubscriptionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="content"
          element={
            <ProtectedRoute>
              <ContentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="tweets"
          element={
            <ProtectedRoute>
              <TweetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="subscribers"
          element={
            <ProtectedRoute>
              <SubscribersPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/home" element={<Navigate to="/feed" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

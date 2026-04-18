import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Content from '../pages/Content';
import Subscribers from '../pages/Subscribers';
import Settings from '../pages/Settings';
import Watch from '../pages/Watch';
import Channel from '../pages/Channel';
import Tweets from '../pages/Tweets';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public/Hybrid Routes in MainLayout */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="watch/:videoId" element={<Watch />} />
                <Route path="channel/:channelId" element={<Channel />} />
                <Route path="tweets" element={<Tweets />} />

                {/* Protected Routes inside MainLayout */}
                <Route path="dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="content" element={
                    <ProtectedRoute>
                        <Content />
                    </ProtectedRoute>
                } />
                <Route path="subscribers" element={
                    <ProtectedRoute>
                        <Subscribers />
                    </ProtectedRoute>
                } />
                <Route path="settings" element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;

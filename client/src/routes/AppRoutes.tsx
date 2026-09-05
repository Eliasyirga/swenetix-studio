import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StartPage } from '../pages/StartPage';
import { Songs } from '../pages/Songs';
import { Statistics } from '../pages/Statistics';
import { Home } from '../pages/Home';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/songs" element={<Songs />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/overview" element={<Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

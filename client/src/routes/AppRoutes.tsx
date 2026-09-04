import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StartPage } from '../pages/StartPage';
import { Home } from '../pages/Home';
import { Songs } from '../pages/Songs';
import { Statistics } from '../pages/Statistics';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/overview" element={<Home />} />
      <Route path="/songs" element={<Songs />} />
      <Route path="/statistics" element={<Statistics />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

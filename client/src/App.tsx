import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { CustomThemeProvider } from './theme/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { LoadingScreen } from './components/LoadingScreen';
import { AppRoutes } from './routes/AppRoutes';
import { useAppDispatch } from './store/store';
import { fetchSongsRequest } from './store/songsSlice';
import { fetchStatisticsRequest } from './store/statisticsSlice';

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  display: flex;
`;

const MainContentArea = styled.div`
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 28px 32px 48px 32px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 16px 36px 16px;
  }
`;

const MobileNavWrapper = styled.div`
  display: none;
  @media (max-width: 900px) {
    display: block;
  }
`;

const AppInner: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Load initial data
  useEffect(() => {
    dispatch(fetchSongsRequest({ page: 1, limit: 10 }));
    dispatch(fetchStatisticsRequest());
  }, [dispatch]);

  const isStartPage = location.pathname === '/';

  if (isStartPage) {
    return (
      <>
        <LoadingScreen />
        <AppRoutes />
        <Toast />
      </>
    );
  }

  return (
    <AppContainer>
      <LoadingScreen />
      <Sidebar />
      <MainContentArea>
        <MobileNavWrapper>
          <Navbar />
        </MobileNavWrapper>
        <Header />
        <MainContent>
          <AppRoutes />
        </MainContent>
      </MainContentArea>
      <Toast />
    </AppContainer>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <SidebarProvider>
          <AppInner />
        </SidebarProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;

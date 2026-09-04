import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { CustomThemeProvider } from './theme/ThemeContext';
import { AppSplashScreen } from './components/AppSplashScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { PlayerDeck } from './components/PlayerDeck';
import { AppRoutes } from './routes/AppRoutes';
import { useAppDispatch } from './store/store';
import { fetchSongsRequest } from './store/songsSlice';
import { fetchStatisticsRequest } from './store/statisticsSlice';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  display: flex;
`;

const MainContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1380px;
  width: 100%;
  margin: 0 auto;
  padding: 28px 32px 120px 32px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 16px 120px 16px;
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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    dispatch(fetchSongsRequest({ page: 1, limit: 10 }));
    dispatch(fetchStatisticsRequest());
  }, [dispatch]);

  const isHeroLanding = location.pathname === '/';

  return (
    <>
      {!isLoaded && <AppSplashScreen onComplete={() => setIsLoaded(true)} />}

      {isHeroLanding ? (
        // 100vh Full Screen Landing Hero
        <>
          <AppRoutes />
          <Toast />
        </>
      ) : (
        // Pro Studio App Dashboard Shell
        <AppContainer>
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
          <PlayerDeck />
          <Toast />
        </AppContainer>
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <AppInner />
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;

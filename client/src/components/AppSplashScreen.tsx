import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Music2 } from 'lucide-react';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';

const SplashOverlay = styled.div<{ isFading: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: ${(props) => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.isFading ? 0 : 1)};
  visibility: ${(props) => (props.isFading ? 'hidden' : 'visible')};
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.5s ease;
  padding: 24px;
`;

const VinylDisc = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(circle, #1E293B 22%, #0F172A 23%, #1E293B 45%, #0F172A 46%, #1E293B 70%, #0F172A 71%);
  border: 3px solid ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) => props.theme.shadows.lg};
  animation: spinVinyl 3.5s linear infinite;

  @keyframes spinVinyl {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const VinylCenter = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
`;

const ProgressBar = styled.div`
  width: 240px;
  height: 4px;
  background-color: ${(props) => props.theme.colors.surfaceBorder};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 24px;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 2px;
  transition: width 0.1s ease-out;
`;

const WaveBar = styled.span<{ height: number; delay: number }>`
  width: 3px;
  height: ${(props) => `${props.height}px`};
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 2px;
  animation: bounceBar 0.8s ease-in-out infinite alternate;
  animation-delay: ${(props) => `${props.delay}s`};

  @keyframes bounceBar {
    0% { height: 4px; }
    100% { height: 22px; }
  }
`;

const StudioBadge = styled.span`
  font-size: 10px;
  font-weight: 800;
  color: ${(props) => props.theme.colors.secondary};
  background-color: ${(props) => props.theme.colors.secondaryLight};
  padding: 2px 6px;
  border-radius: 4px;
`;

export const AppSplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [statusText, setStatusText] = useState('Initializing Studio Engine...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFading(true);
          setTimeout(onComplete, 500);
          return 100;
        }
        if (prev === 30) setStatusText('Loading Music Library & Sagas...');
        if (prev === 70) setStatusText('Aggregating MongoDB Analytics ($facet)...');
        if (prev === 90) setStatusText('Ready to Launch!');
        return prev + 5;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <SplashOverlay isFading={isFading}>
      <VinylDisc>
        <VinylCenter>
          <Music2 size={16} />
        </VinylCenter>
      </VinylDisc>

      <Box mt={4} textAlign="center">
        <Flex alignItems="center" justifyContent="center" gap={1} mb={1}>
          <Text fontSize={3} fontWeight="bold" color="text" letterSpacing="-0.02em">
            Swenetix
          </Text>
          <StudioBadge>STUDIO</StudioBadge>
        </Flex>

        <Text fontSize={1} color="textSecondary" mb={2}>
          Full-Stack Music Management Engine
        </Text>

        <Flex alignItems="center" justifyContent="center" gap={1} mt={2}>
          {[8, 16, 22, 12, 18, 10, 20, 14].map((h, i) => (
            <WaveBar key={i} height={h} delay={i * 0.1} />
          ))}
        </Flex>
      </Box>

      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>

      <Text fontSize={0} color="textMuted" mt={2} style={{ fontFamily: 'monospace' }}>
        {statusText}
      </Text>
    </SplashOverlay>
  );
};

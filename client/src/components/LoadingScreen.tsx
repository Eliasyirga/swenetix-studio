import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Disc3, Sparkles, Activity } from 'lucide-react';

const pulseGlow = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 35px rgba(217, 28, 46, 0.45), 0 0 70px rgba(184, 21, 36, 0.25);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 55px rgba(217, 28, 46, 0.75), 0 0 100px rgba(229, 43, 60, 0.45);
  }
`;

const rotateDisc = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounceBar = keyframes`
  0%, 100% { height: 10px; opacity: 0.6; }
  50% { height: 46px; opacity: 1; }
`;

const textShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

const Overlay = styled.div<{ isExiting: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: radial-gradient(circle at 50% 35%, rgba(217, 28, 46, 0.12) 0%, #0d0e12 55%, #060709 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  opacity: ${(props) => (props.isExiting ? 0 : 1)};
  transform: ${(props) => (props.isExiting ? 'scale(1.03)' : 'scale(1)')};
  transition: opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1), transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${(props) => (props.isExiting ? 'none' : 'auto')};
`;

const CenterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 460px;
  width: 90%;
  padding: 32px;
`;

const LogoContainer = styled.div`
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 24px;
  background: linear-gradient(135deg, #d91c2e 0%, #b81524 50%, #830e1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 26px;
  animation: ${pulseGlow} 2.4s ease-in-out infinite;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const RotatingIcon = styled(Disc3)`
  color: #ffffff;
  animation: ${rotateDisc} 7s linear infinite;
`;

const MiniBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #d91c2e;
  border: 2px solid #060709;
  border-radius: 999px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(217, 28, 46, 0.8);
`;

const EqualizerWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 50px;
  margin-bottom: 24px;
`;

const EqualizerBar = styled.div<{ delay: string; color: string }>`
  width: 5px;
  border-radius: 999px;
  background: ${(props) => props.color};
  animation: ${bounceBar} 1.1s ease-in-out infinite;
  animation-delay: ${(props) => props.delay};
  box-shadow: 0 0 8px ${(props) => props.color};
`;

const BrandTitle = styled.h1`
  font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 3px;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ffffff 0%, #f87171 25%, #d91c2e 50%, #ffffff 75%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${textShimmer} 3.5s linear infinite;
`;

const Subtitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  margin-bottom: 32px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  margin-bottom: 14px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background: linear-gradient(90deg, #b81524, #d91c2e, #e52b3c, #ff6b7a);
  border-radius: 999px;
  transition: width 0.18s ease-out;
  box-shadow: 0 0 16px rgba(217, 28, 46, 0.9);
`;

const StatusText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: ${fadeInOut} 1.8s ease-in-out infinite;
`;

const Percentage = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #d91c2e;
  margin-left: 6px;
`;

interface LoadingScreenProps {
  onComplete?: () => void;
  minDisplayTimeMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDisplayTimeMs = 1500,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Booting Swenetix Engine...');
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(true);

  useEffect(() => {
    const steps = [
      { p: 15, msg: 'Initializing Audio Drivers & Canvas...' },
      { p: 40, msg: 'Connecting to MongoDB Atlas Cluster...' },
      { p: 70, msg: 'Synchronizing Redux-Saga Library Store...' },
      { p: 90, msg: 'Calibrating Sound Waveform Equalizer...' },
      { p: 100, msg: 'Swenetix Studio Ready' },
    ];

    let currentStepIndex = 0;
    const intervalTime = minDisplayTimeMs / steps.length;

    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        setProgress(step.p);
        setStatusMessage(step.msg);
        currentStepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsMounted(false);
            if (onComplete) onComplete();
          }, 550);
        }, 180);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [minDisplayTimeMs, onComplete]);

  if (!isMounted) return null;

  return (
    <Overlay isExiting={isExiting}>
      <CenterContent>
        <LogoContainer>
          <RotatingIcon size={44} />
          <MiniBadge>
            <Sparkles size={11} color="#ffffff" />
          </MiniBadge>
        </LogoContainer>

        <EqualizerWrapper>
          <EqualizerBar delay="0.0s" color="#d91c2e" />
          <EqualizerBar delay="0.2s" color="#e52b3c" />
          <EqualizerBar delay="0.4s" color="#ff6b7a" />
          <EqualizerBar delay="0.1s" color="#b81524" />
          <EqualizerBar delay="0.3s" color="#d91c2e" />
          <EqualizerBar delay="0.5s" color="#e52b3c" />
        </EqualizerWrapper>

        <BrandTitle>Swenetix Studio</BrandTitle>
        <Subtitle>Audio Management & Analytics Platform</Subtitle>

        <ProgressTrack>
          <ProgressBar progress={progress} />
        </ProgressTrack>

        <StatusText>
          <Activity size={13} color="#d91c2e" />
          <span>{statusMessage}</span>
          <Percentage>{progress}%</Percentage>
        </StatusText>
      </CenterContent>
    </Overlay>
  );
};

export default LoadingScreen;

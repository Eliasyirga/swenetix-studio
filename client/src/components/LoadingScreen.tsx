import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Disc3, Sparkles, Activity } from 'lucide-react';

const pulseGlow = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 35px rgba(239, 68, 68, 0.4), 0 0 70px rgba(99, 102, 241, 0.25);
  }
  50% {
    transform: scale(1.06);
    box-shadow: 0 0 55px rgba(239, 68, 68, 0.65), 0 0 100px rgba(99, 102, 241, 0.45);
  }
`;

const rotateDisc = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounceBar = keyframes`
  0%, 100% { height: 12px; }
  50% { height: 48px; }
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
  background: radial-gradient(circle at 50% 40%, #151828 0%, #0a0b12 70%, #05060a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
  width: 96px;
  height: 96px;
  border-radius: 28px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  animation: ${pulseGlow} 2.4s ease-in-out infinite;
`;

const RotatingIcon = styled(Disc3)`
  color: #ffffff;
  animation: ${rotateDisc} 7s linear infinite;
`;

const MiniBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #10b981;
  border: 2px solid #0a0b12;
  border-radius: 999px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EqualizerWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 52px;
  margin-bottom: 24px;
`;

const EqualizerBar = styled.div<{ delay: string; color: string }>`
  width: 6px;
  border-radius: 999px;
  background: ${(props) => props.color};
  animation: ${bounceBar} 1.1s ease-in-out infinite;
  animation-delay: ${(props) => props.delay};
`;

const BrandTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 3px;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ffffff 0%, #f87171 25%, #c084fc 50%, #ffffff 75%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${textShimmer} 3.5s linear infinite;
`;

const Subtitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 32px;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
  margin-bottom: 14px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${(props) => props.progress}%;
  background: linear-gradient(90deg, #ef4444, #f43f5e, #a855f7, #6366f1);
  border-radius: 999px;
  transition: width 0.18s ease-out;
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.8);
`;

const StatusText = styled.div`
  font-size: 13px;
  color: #cbd5e1;
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
  color: #ef4444;
  margin-left: 6px;
`;

interface LoadingScreenProps {
  onComplete?: () => void;
  minDisplayTimeMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDisplayTimeMs = 1600,
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
          }, 600);
        }, 200);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [minDisplayTimeMs, onComplete]);

  if (!isMounted) return null;

  return (
    <Overlay isExiting={isExiting}>
      <CenterContent>
        <LogoContainer>
          <RotatingIcon size={46} />
          <MiniBadge>
            <Sparkles size={11} color="#ffffff" />
          </MiniBadge>
        </LogoContainer>

        <EqualizerWrapper>
          <EqualizerBar delay="0.0s" color="#ef4444" />
          <EqualizerBar delay="0.2s" color="#f87171" />
          <EqualizerBar delay="0.4s" color="#a855f7" />
          <EqualizerBar delay="0.1s" color="#818cf8" />
          <EqualizerBar delay="0.3s" color="#6366f1" />
          <EqualizerBar delay="0.5s" color="#ef4444" />
        </EqualizerWrapper>

        <BrandTitle>Swenetix Studio</BrandTitle>
        <Subtitle>Audio Management & Analytics Platform</Subtitle>

        <ProgressTrack>
          <ProgressBar progress={progress} />
        </ProgressTrack>

        <StatusText>
          <Activity size={14} color="#ef4444" />
          <span>{statusMessage}</span>
          <Percentage>{progress}%</Percentage>
        </StatusText>
      </CenterContent>
    </Overlay>
  );
};

export default LoadingScreen;

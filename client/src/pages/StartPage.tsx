import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Play,
  Pause,
  ArrowRight,
  Sun,
  Moon,
  Music2,
  Sliders,
  Database,
} from 'lucide-react';
import { useAppTheme } from '../theme/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setSearchFilter, openCreateModal } from '../store/songsSlice';
import { Flex, Box } from '../components/common/Flex';

// 100vh Hero Stage dynamically linked to theme for smooth light/dark switching
const HeroContainer = styled.div<{ isDark: boolean }>`
  min-height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 48px 36px 48px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;

  /* Ambient glowing aura */
  &::before {
    content: '';
    position: absolute;
    top: 15%;
    right: 15%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: ${(props) =>
    props.isDark
      ? 'radial-gradient(circle, rgba(217, 28, 46, 0.22) 0%, rgba(139, 0, 0, 0.08) 45%, transparent 70%)'
      : 'radial-gradient(circle, rgba(217, 28, 46, 0.12) 0%, rgba(217, 28, 46, 0.04) 45%, transparent 70%)'};
    pointer-events: none;
    z-index: 1;
    filter: blur(40px);
    animation: pulseAura 6s ease-in-out infinite alternate;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 5%;
    left: 5%;
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: ${(props) =>
    props.isDark
      ? 'radial-gradient(circle, rgba(184, 21, 36, 0.12) 0%, transparent 60%)'
      : 'radial-gradient(circle, rgba(184, 21, 36, 0.06) 0%, transparent 60%)'};
    pointer-events: none;
    z-index: 1;
    filter: blur(30px);
  }

  @keyframes pulseAura {
    0% { transform: scale(0.9) translate(0, 0); opacity: 0.7; }
    50% { transform: scale(1.1) translate(-20px, 15px); opacity: 1; }
    100% { transform: scale(0.95) translate(10px, -10px); opacity: 0.8; }
  }

  @media (max-width: 900px) {
    padding: 16px 20px 24px 20px;
    min-height: auto;
  }
`;

// Full-bleed Canvas for the animated dynamic red dot-matrix audio equalizer
const CanvasBackground = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  opacity: 0.85;
`;

// Minimalist Top Navigation Header
const TopNav = styled.header`
  position: relative;
  z-index: 20;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  gap: 20px;
  flex-wrap: wrap;
  transition: border-color 0.3s ease;
`;

const NavBrandGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BrandBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: ${(props) => props.theme.colors.primary};
  color: #FFFFFF;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: ${(props) => props.theme.shadows.md};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
    transform: translateY(-1px);
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 280px;

  @media (max-width: 600px) {
    width: 180px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${(props) => props.theme.colors.surfaceLight};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: 9999px;
  padding: 8px 16px 8px 36px;
  color: ${(props) => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props) => props.theme.colors.textMuted};
  }

  &:focus {
    background: ${(props) => props.theme.colors.surface};
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primaryLight};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textMuted};
  display: flex;
  align-items: center;
`;

const NavLinksList = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const NavLinkItem = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease;
  padding: 4px 0;

  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

const AvatarToggle = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primaryLight};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.08);
    background-color: ${(props) => props.theme.colors.primary};
    color: #FFFFFF;
  }
`;

// Hero Content Area
const HeroBody = styled.main`
  position: relative;
  z-index: 10;
  max-width: 1400px;
  width: 100%;
  margin: auto auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  gap: 40px;
  padding: 24px 0;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 620px;
`;

const MainHeading = styled.h1`
  font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(38px, 5.2vw, 64px);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.text};
  margin: 0 0 20px 0;
  transition: color 0.3s ease;
`;

const SubHeading = styled.p`
  font-size: clamp(14px, 1.5vw, 16px);
  line-height: 1.6;
  color: ${(props) => props.theme.colors.textSecondary};
  margin: 0 0 32px 0;
  font-weight: 400;
  max-width: 520px;
  transition: color 0.3s ease;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 52px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

const PrimaryPillBtn = styled.button`
  background: ${(props) => props.theme.colors.primary};
  color: #FFFFFF;
  border: none;
  border-radius: 9999px;
  padding: 13px 32px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${(props) => props.theme.shadows.md};
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${(props) => props.theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryPillBtn = styled.button`
  background: ${(props) => props.theme.colors.primaryLight};
  color: ${(props) => props.theme.colors.text};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  border-radius: 9999px;
  padding: 13px 28px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
    border-color: ${(props) => props.theme.colors.primary};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 3-Column Metrics Row
const StatsStrip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 28px;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 110px;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 48px;
  background: ${(props) => props.theme.colors.surfaceBorder};
  align-self: center;

  @media (max-width: 600px) {
    display: none;
  }
`;

const StatNumber = styled.div`
  font-family: 'Outfit', sans-serif;
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 800;
  color: ${(props) => props.theme.colors.text};
  line-height: 1.1;
  margin-bottom: 4px;
  transition: color 0.3s ease;
`;

const StatLabel = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: ${(props) => props.theme.colors.textMuted};
  max-width: 120px;
  transition: color 0.3s ease;
`;

// Right Visual Area: Isolated Transparent Floating Studio Headphones & Interactive Audio Deck
const HeroRight = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const RealisticHeadphonesShowcase = styled.div`
  position: relative;
  width: 100%;
  max-width: 440px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  animation: floatRealisticHeadphones 5s ease-in-out infinite alternate;

  @keyframes floatRealisticHeadphones {
    0% { transform: translateY(0px) rotate(0deg) scale(1); }
    50% { transform: translateY(-14px) rotate(0.8deg) scale(1.015); }
    100% { transform: translateY(8px) rotate(-0.8deg) scale(0.995); }
  }
`;

const HeadsetCanvas = styled.canvas`
  position: relative;
  z-index: 3;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: transparent;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.45));
`;

const FloatingAudioCard = styled.div<{ isPlaying: boolean }>`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => (props.isPlaying ? props.theme.colors.primary : props.theme.colors.surfaceBorder)};
  border-radius: 14px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 440px;
  box-shadow: ${(props) => props.theme.shadows.lg};
  transition: all 0.2s ease;
  z-index: 10;
  margin-top: -36px;
`;

const PlayIconBtn = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(217, 28, 46, 0.4);

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
    transform: scale(1.08);
  }
`;

const MatrixDotWave = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  flex: 1;
  height: 26px;
`;

const WaveDot = styled.span<{ height: number; active: boolean; delay: number }>`
  width: 3px;
  height: ${(props) => (props.active ? `${props.height}px` : '4px')};
  background-color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.surfaceBorder)};
  border-radius: 2px;
  transition: height 0.2s ease, background-color 0.3s ease;
  animation: ${(props) => (props.active ? `pulseWave 0.9s ease-in-out infinite alternate` : 'none')};
  animation-delay: ${(props) => `${props.delay}s`};

  @keyframes pulseWave {
    0% { height: 4px; }
    100% { height: 24px; }
  }
`;

export const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mode, toggleTheme } = useAppTheme();
  const isDark = mode === 'dark';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headsetCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [query, setQuery] = useState('');

  const { pagination } = useAppSelector((state) => state.songs);
  const { data: stats } = useAppSelector((state) => state.statistics);

  const totalSongs = pagination.total || stats?.overview.totalSongs || 59;
  const totalGenres = stats?.overview.totalGenres || stats?.songsByGenre?.length || 9;

  // Real-time Canvas Animated Soundwave Equalizer Matrix Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let phase = 0;
    const dotSpacing = 16;
    const cols = Math.ceil(width / dotSpacing);
    const rows = Math.ceil(height / dotSpacing);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      phase += isPlaying ? 0.045 : 0.015;

      const centerY = height * 0.52;
      const rightCenterRatio = width > 900 ? 0.65 : 0.5;
      const waveOriginX = width * rightCenterRatio;

      for (let c = 0; c < cols; c++) {
        const x = c * dotSpacing;
        const distFromCenter = (x - waveOriginX) / (width * 0.45);
        const gaussian = Math.exp(-distFromCenter * distFromCenter * 3);

        const wave1 = Math.sin(c * 0.18 + phase) * 70;
        const wave2 = Math.cos(c * 0.32 - phase * 1.4) * 45;
        const wave3 = Math.sin(c * 0.08 + phase * 0.6) * 30;
        const amp = isPlaying ? 1.4 : 0.65;
        const combinedWave = (wave1 + wave2 + wave3) * gaussian * amp;

        for (let r = 0; r < rows; r++) {
          const y = r * dotSpacing;
          const distY = Math.abs(y - (centerY + combinedWave));

          if (distY < 140 * gaussian) {
            const normalizedDist = 1 - distY / (140 * gaussian);
            const alpha = Math.max(0.08, normalizedDist * 0.95);
            const radius = normalizedDist > 0.7 ? 2.4 : 1.6;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);

            if (isDark) {
              if (normalizedDist > 0.65) {
                ctx.fillStyle = `rgba(255, 51, 75, ${alpha})`;
                ctx.shadowColor = 'rgba(217, 28, 46, 0.8)';
                ctx.shadowBlur = 6;
              } else {
                ctx.fillStyle = `rgba(217, 28, 46, ${alpha * 0.6})`;
                ctx.shadowBlur = 0;
              }
            } else {
              if (normalizedDist > 0.65) {
                ctx.fillStyle = `rgba(217, 28, 46, ${alpha * 0.9})`;
                ctx.shadowColor = 'rgba(217, 28, 46, 0.3)';
                ctx.shadowBlur = 4;
              } else {
                ctx.fillStyle = `rgba(217, 28, 46, ${alpha * 0.4})`;
                ctx.shadowBlur = 0;
              }
            }
            ctx.fill();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, isDark]);

  // Process and render the photorealistic headset with transparent background
  useEffect(() => {
    const canvas = headsetCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/realistic_studio_headphones.png';

    img.onload = () => {
      const size = 600;
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const frame = ctx.getImageData(0, 0, size, size);
      const d = frame.data;

      // Mathematical alpha extraction to eliminate solid background
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        const maxVal = Math.max(r, g, b);

        if (maxVal < 14) {
          d[i + 3] = 0;
        } else if (maxVal < 48) {
          d[i + 3] = Math.round(((maxVal - 14) / (48 - 14)) * 255);
        }
      }

      ctx.putImageData(frame, 0, 0);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchFilter(query.trim()));
    }
    navigate('/songs');
  };

  return (
    <HeroContainer isDark={isDark}>
      {/* 1. Code-rendered Animated Soundwave Equalizer Canvas */}
      <CanvasBackground ref={canvasRef} />

      {/* 2. Minimalist Top Navigation Header */}
      <TopNav>
        <NavBrandGroup>
          <BrandBadge onClick={() => navigate('/')}>
            <Music2 size={16} />
            <span>Swenetix Studio</span>
          </BrandBadge>

          <form onSubmit={handleSearchSubmit}>
            <SearchBox>
              <SearchIconWrapper>
                <Search size={14} />
              </SearchIconWrapper>
              <SearchInput
                placeholder="Search tracks, artists..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </SearchBox>
          </form>
        </NavBrandGroup>

        <NavLinksList>
          <NavLinkItem onClick={() => navigate('/songs')}>Songs</NavLinkItem>
          <NavLinkItem onClick={() => navigate('/overview')}>Overview</NavLinkItem>
          <NavLinkItem onClick={() => navigate('/statistics')}>Statistics</NavLinkItem>
          <NavLinkItem onClick={() => dispatch(openCreateModal())}>Add Song</NavLinkItem>

          <AvatarToggle
            onClick={toggleTheme}
            title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Bright Light Mode'}
          >
            {mode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </AvatarToggle>
        </NavLinksList>
      </TopNav>

      {/* 3. Hero Content Centerpiece */}
      <HeroBody>
        <HeroLeft>
          <MainHeading>
            Musical sounds for every taste
          </MainHeading>

          <SubHeading>
            Our resources will help you find the perfect sounds for any music project, regardless of genre or style.
          </SubHeading>

          <ButtonGroup>
            <PrimaryPillBtn onClick={() => navigate('/songs')}>
              <span>Explore Library</span>
              <ArrowRight size={16} />
            </PrimaryPillBtn>

            <SecondaryPillBtn onClick={() => navigate('/statistics')}>
              <Sliders size={16} />
              <span>Studio Analytics</span>
            </SecondaryPillBtn>
          </ButtonGroup>

          {/* 3-Column Metrics Row */}
          <StatsStrip>
            <StatItem>
              <StatNumber>{totalSongs}+</StatNumber>
              <StatLabel>Over {totalSongs} sound files</StatLabel>
            </StatItem>

            <StatDivider />

            <StatItem>
              <StatNumber>1,000</StatNumber>
              <StatLabel>new sounds are added every month</StatLabel>
            </StatItem>

            <StatDivider />

            <StatItem>
              <StatNumber>{totalGenres}</StatNumber>
              <StatLabel>different musical genres and styles</StatLabel>
            </StatItem>
          </StatsStrip>
        </HeroLeft>

        {/* Right Hero: Isolated Transparent Studio Headphones & Interactive Audio Deck */}
        <HeroRight>
          <RealisticHeadphonesShowcase>
            <HeadsetCanvas ref={headsetCanvasRef} />
          </RealisticHeadphonesShowcase>

          {/* Interactive Live Audio Preview Dock */}
          <FloatingAudioCard isPlaying={isPlaying}>
            <PlayIconBtn onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pause Preview' : 'Play Preview'}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
            </PlayIconBtn>

            <Box style={{ flex: 1 }}>
              <Flex alignItems="center" justifyContent="space-between" mb={1}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'inherit' }}>
                  {isPlaying ? 'Live Acoustic Equalizer Stream' : 'Live Equalizer Stream'}
                </span>
                <span style={{ fontSize: '11px', color: '#D91C2E', fontFamily: 'monospace', fontWeight: 600 }}>
                  {isPlaying ? 'ACTIVE' : 'STANDBY'}
                </span>
              </Flex>

              <MatrixDotWave>
                {[6, 14, 22, 10, 18, 24, 14, 22, 8, 16, 20, 12, 18, 24, 16, 10, 22, 14, 8, 16, 20, 12, 18, 10].map((h, i) => (
                  <WaveDot key={i} height={h} active={isPlaying} delay={i * 0.04} />
                ))}
              </MatrixDotWave>
            </Box>
          </FloatingAudioCard>
        </HeroRight>
      </HeroBody>

      {/* Footer Info */}
      <Box style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Flex alignItems="center" gap={2}>
            <Database size={13} color="#D91C2E" />
            <span style={{ fontSize: '12px', color: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.55)' }}>
              Live Animated Equalizer Engine &middot; Redux-Saga &middot; Emotion
            </span>
          </Flex>
          <span style={{ fontSize: '12px', color: isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.55)' }}>
            Swenetix Studio &copy; {new Date().getFullYear()}
          </span>
        </Flex>
      </Box>
    </HeroContainer>
  );
};

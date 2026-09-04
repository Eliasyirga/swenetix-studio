import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  Music2,
  BarChart3,
  PlusCircle,
  Radio,
  Database,
  Layers,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { openCreateModal, seedSongsRequest, setGenreFilter } from '../store/songsSlice';
import { useAppTheme } from '../theme/ThemeContext';
import { AppTheme } from '../theme/theme';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';

const SidebarContainer = styled.aside`
  width: 260px;
  background-color: ${(props) => props.theme.colors.surface};
  border-right: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: calc(100vh - 72px);
  position: sticky;
  top: 0;
  overflow-y: auto;
  user-select: none;
  box-shadow: ${(props) => props.theme.shadows.sm};

  @media (max-width: 900px) {
    display: none;
  }
`;

const BrandSection = styled.div`
  padding: 22px 20px 18px 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
`;

const NavSection = styled.div`
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 12px 6px 12px;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  border-radius: ${(props) => props.theme.radii.sm};
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.surfaceLight};
  }

  &.active {
    color: #FFFFFF;
    background-color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const GenrePill = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 7px 12px;
  border-radius: ${(props) => props.theme.radii.sm};
  background: ${(props) => (props.isActive ? props.theme.colors.primaryLight : 'transparent')};
  color: ${(props) => (props.isActive ? props.theme.colors.primary : props.theme.colors.textSecondary)};
  border: none;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceLight};
    color: ${(props) => props.theme.colors.text};
  }
`;

const CountBadge = styled.span<{ isActive?: boolean }>`
  font-size: 11px;
  font-family: monospace;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${(props) => (props.isActive ? props.theme.colors.primary : props.theme.colors.surfaceLight)};
  color: ${(props) => (props.isActive ? '#FFFFFF' : props.theme.colors.textMuted)};
`;

const BottomStatusBox = styled.div`
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  background-color: ${(props) => props.theme.colors.backgroundAlt};
`;

const PrimaryActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border-radius: ${(props) => props.theme.radii.sm};
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryHover};
  }
`;

const SecondaryActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border-radius: ${(props) => props.theme.radii.sm};
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-top: 6px;

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors.surfaceLight};
    color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BrandIconBox = styled(Box)`
  width: 36px;
  height: 36px;
  border-radius: ${(props) => props.theme.radii.sm};
  background-color: ${(props) => props.theme.colors.primaryLight};
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
`;

const StudioPill = styled.span`
  font-size: 9px;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary};
  background-color: ${(props) => props.theme.colors.primaryLight};
  padding: 1px 5px;
  border-radius: 4px;
  text-transform: uppercase;
`;

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useAppTheme();
  const theme = useTheme() as AppTheme;

  const { pagination, filters, actionLoading } = useAppSelector((state) => state.songs);
  const { data: stats } = useAppSelector((state) => state.statistics);

  const totalSongs = pagination.total || stats?.overview.totalSongs || 0;
  const genreList = stats?.songsByGenre || [];

  const handleGenreClick = (genre: string) => {
    dispatch(setGenreFilter(genre));
    if (location.pathname !== '/songs') {
      navigate('/songs');
    }
  };

  const handleSeed = () => {
    if (window.confirm('Reset and seed database with 28 curated tracks across diverse genres?')) {
      dispatch(seedSongsRequest());
    }
  };

  return (
    <SidebarContainer>
      {/* Brand Header */}
      <BrandSection>
        <Flex alignItems="center" gap={2}>
          <BrandIconBox>
            <Music2 size={20} />
          </BrandIconBox>
          <Box>
            <Flex alignItems="center" gap={1}>
              <Text fontSize={2} fontWeight="bold" color="text" letterSpacing="-0.02em">
                Swenetix
              </Text>
              <StudioPill>STUDIO</StudioPill>
            </Flex>
            <Text fontSize={0} color="textMuted">
              Music Engine & Analytics
            </Text>
          </Box>
        </Flex>
      </BrandSection>

      {/* Main Navigation */}
      <NavSection>
        <SectionTitle>Studio Navigation</SectionTitle>
        <StyledNavLink to="/overview">
          <Flex alignItems="center" gap={2}>
            <LayoutDashboard size={16} />
            <span>Overview Studio</span>
          </Flex>
          <ChevronRight size={14} color={theme.colors.textMuted} />
        </StyledNavLink>

        <StyledNavLink to="/songs">
          <Flex alignItems="center" gap={2}>
            <Layers size={16} />
            <span>Song Library</span>
          </Flex>
          <CountBadge>{totalSongs}</CountBadge>
        </StyledNavLink>

        <StyledNavLink to="/statistics">
          <Flex alignItems="center" gap={2}>
            <BarChart3 size={16} />
            <span>Analytics</span>
          </Flex>
          <ChevronRight size={14} color={theme.colors.textMuted} />
        </StyledNavLink>
      </NavSection>

      {/* Quick Action Studio Tools */}
      <NavSection>
        <SectionTitle>Studio Tools</SectionTitle>
        <PrimaryActionButton onClick={() => dispatch(openCreateModal())}>
          <PlusCircle size={16} />
          <span>New Song Track</span>
        </PrimaryActionButton>

        <SecondaryActionButton onClick={handleSeed} disabled={actionLoading}>
          <Sparkles size={14} color={theme.colors.secondary} />
          <span>{actionLoading ? 'Seeding...' : 'Seed 28 Tracks'}</span>
        </SecondaryActionButton>
      </NavSection>

      {/* Genre Channels */}
      {genreList.length > 0 && (
        <NavSection style={{ flex: 1 }}>
          <SectionTitle>Genre Spectrum</SectionTitle>
          {genreList.slice(0, 6).map((g) => {
            const isSelected = filters.genre === g.genre;
            return (
              <GenrePill
                key={g.genre}
                isActive={isSelected}
                onClick={() => handleGenreClick(g.genre)}
              >
                <Flex alignItems="center" gap={2}>
                  <Radio size={13} color={isSelected ? theme.colors.primary : theme.colors.textMuted} />
                  <span>{g.genre}</span>
                </Flex>
                <CountBadge isActive={isSelected}>{g.count}</CountBadge>
              </GenrePill>
            );
          })}
        </NavSection>
      )}

      {/* System Status Footer */}
      <BottomStatusBox>
        <Flex alignItems="center" justifyContent="space-between" mb={1}>
          <Flex alignItems="center" gap={2}>
            <Database size={13} color={theme.colors.secondary} />
            <Text fontSize={0} fontWeight="semibold" color="text">
              MongoDB 7.0
            </Text>
          </Flex>
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme.colors.primary,
              display: 'flex',
              alignItems: 'center',
            }}
            title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {mode === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </Flex>
        <Text fontSize={0} color="textMuted">
          {totalSongs} songs synced & aggregated
        </Text>
      </BottomStatusBox>
    </SidebarContainer>
  );
};

import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Music2,
  BarChart3,
  PlusCircle,
  Radio,
  Layers,
  ChevronRight,
  Sun,
  Moon,
  LayoutDashboard,
  PanelLeftClose,
  Sparkles,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { openCreateModal, setGenreFilter } from '../store/songsSlice';
import { useAppTheme } from '../theme/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { AppTheme } from '../theme/theme';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';

const BackdropOverlay = styled.div<{ isMobileOpen: boolean }>`
  display: none;

  @media (max-width: 900px) {
    display: ${(props) => (props.isMobileOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 1040;
    opacity: ${(props) => (props.isMobileOpen ? 1 : 0)};
    transition: opacity 0.25s ease;
  }
`;

const SidebarContainer = styled.aside<{ isCollapsed: boolean; isMobileOpen: boolean }>`
  width: ${(props) => (props.isCollapsed ? '76px' : '260px')};
  background-color: ${(props) => props.theme.colors.surface};
  border-right: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  user-select: none;
  box-shadow: ${(props) => props.theme.shadows.sm};
  z-index: 60;
  transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 900px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    z-index: 1050;
    box-shadow: ${(props) => props.theme.shadows.lg};
    transform: ${(props) => (props.isMobileOpen ? 'translateX(0)' : 'translateX(-100%)')};
  }
`;

const BrandSection = styled.div<{ isCollapsed: boolean }>`
  padding: 20px ${(props) => (props.isCollapsed ? '16px' : '20px')};
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.surfaceLight};
  }
`;

const NavSection = styled.div`
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.div<{ isCollapsed: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 12px;
  display: ${(props) => (props.isCollapsed ? 'none' : 'block')};

  @media (max-width: 900px) {
    display: block;
  }
`;

const StyledNavLink = styled(NavLink)<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? 'center' : 'space-between')};
  padding: ${(props) => (props.isCollapsed ? '10px 0' : '10px 14px')};
  border-radius: ${(props) => props.theme.radii.md};
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.15s ease;
  text-decoration: none;

  &:hover {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.surfaceLight};
  }

  &.active {
    color: #FFFFFF;
    background: linear-gradient(135deg, ${(props) => props.theme.colors.primary}, #FF4B5C);
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(217, 28, 46, 0.35);
  }

  @media (max-width: 900px) {
    justify-content: space-between;
    padding: 10px 14px;
  }
`;


const GenrePill = styled.button<{ isActive?: boolean; isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? 'center' : 'space-between')};
  width: 100%;
  padding: ${(props) => (props.isCollapsed ? '8px 0' : '8px 12px')};
  border-radius: ${(props) => props.theme.radii.md};
  background: ${(props) => (props.isActive ? props.theme.colors.primaryLight : 'transparent')};
  color: ${(props) => (props.isActive ? props.theme.colors.primary : props.theme.colors.textSecondary)};
  border: 1px solid ${(props) => (props.isActive ? props.theme.colors.primaryBorder : 'transparent')};
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
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 6px;
  background-color: ${(props) => (props.isActive ? props.theme.colors.primary : props.theme.colors.surfaceLight)};
  color: ${(props) => (props.isActive ? '#FFFFFF' : props.theme.colors.textMuted)};
`;

const BottomFooterBox = styled.div`
  margin-top: auto;
  padding: 14px;
  border-top: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  background-color: ${(props) => props.theme.colors.backgroundAlt};
`;

const PrimaryActionButton = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: ${(props) => (props.isCollapsed ? '10px 0' : '11px 14px')};
  border-radius: ${(props) => props.theme.radii.md};
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary}, #FF4B5C);
  border: none;
  color: #FFFFFF;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(217, 28, 46, 0.35);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(217, 28, 46, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ThemeSwitchBtn = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? 'center' : 'space-between')};
  width: 100%;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.md};
  padding: ${(props) => (props.isCollapsed ? '8px 0' : '8px 12px')};
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  font-size: 13px;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const BrandIconBox = styled(Box)`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(217, 28, 46, 0.25), rgba(217, 28, 46, 0.08));
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
`;

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useAppTheme();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar } = useSidebar();
  const theme = useTheme() as AppTheme;

  const { pagination, filters } = useAppSelector((state) => state.songs);
  const { data: stats } = useAppSelector((state) => state.statistics);

  const totalSongs = pagination.total || stats?.overview.totalSongs || 0;
  const genreList = stats?.songsByGenre || [];

  const handleGenreClick = (genre: string) => {
    closeMobileSidebar();
    dispatch(setGenreFilter(genre));
    if (location.pathname !== '/songs') {
      navigate('/songs');
    }
  };


  const handleAddSong = () => {
    closeMobileSidebar();
    dispatch(openCreateModal());
  };

  return (
    <>
      <BackdropOverlay isMobileOpen={isMobileOpen} onClick={closeMobileSidebar} />
      <SidebarContainer isCollapsed={isCollapsed} isMobileOpen={isMobileOpen}>
        {/* Brand Header with Interactive Pop up / Pop off Logo Toggle */}
        <BrandSection
          isCollapsed={isCollapsed}
          onClick={toggleSidebar}
          title={isCollapsed ? 'Click Logo to Expand Sidebar' : 'Click Logo to Collapse Sidebar'}
        >
          <Flex alignItems="center" justifyContent={isCollapsed ? 'center' : 'space-between'}>
            <Flex alignItems="center" gap={3}>
              <BrandIconBox>
                <Music2 size={22} />
              </BrandIconBox>
              <Box display={isCollapsed ? ['block', 'none'] : 'block'}>
                <Text fontSize={2} fontWeight="bold" color="text" letterSpacing="-0.02em">
                  Swenetix
                </Text>
                <Text fontSize={0} color="textMuted">
                  Studio
                </Text>
              </Box>
            </Flex>

            {/* Desktop collapse icon / Mobile close button */}
            <Box
              color="textMuted"
              onClick={(e) => {
                e.stopPropagation();
                if (window.innerWidth <= 900) {
                  closeMobileSidebar();
                } else {
                  toggleSidebar();
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <Box display={['block', 'none']}>
                <X size={20} />
              </Box>
              <Box display={['none', isCollapsed ? 'none' : 'block']}>
                <PanelLeftClose size={16} />
              </Box>
            </Box>
          </Flex>
        </BrandSection>

        {/* Main Navigation */}
        <NavSection>
          <SectionTitle isCollapsed={isCollapsed}>Menu</SectionTitle>
          <StyledNavLink
            to="/"
            isCollapsed={isCollapsed}
            title="Home / Start Showcase"
            onClick={closeMobileSidebar}
          >
            <Flex alignItems="center" gap={2}>
              <Sparkles size={18} />
              <span className="nav-label">Showcase Home</span>
            </Flex>
            <ChevronRight size={14} color={theme.colors.textMuted} />
          </StyledNavLink>

          <StyledNavLink
            to="/songs"
            end
            isCollapsed={isCollapsed}
            title="Song Library"
            onClick={closeMobileSidebar}
          >
            <Flex alignItems="center" gap={2}>
              <Layers size={18} />
              <span className="nav-label">Song Library</span>
            </Flex>
            <CountBadge>{totalSongs}</CountBadge>
          </StyledNavLink>

          <StyledNavLink
            to="/statistics"
            isCollapsed={isCollapsed}
            title="Statistics"
            onClick={closeMobileSidebar}
          >
            <Flex alignItems="center" gap={2}>
              <BarChart3 size={18} />
              <span className="nav-label">Statistics</span>
            </Flex>
            <ChevronRight size={14} color={theme.colors.textMuted} />
          </StyledNavLink>

          <StyledNavLink
            to="/overview"
            isCollapsed={isCollapsed}
            title="Overview Dashboard"
            onClick={closeMobileSidebar}
          >
            <Flex alignItems="center" gap={2}>
              <LayoutDashboard size={18} />
              <span className="nav-label">Overview</span>
            </Flex>
            <ChevronRight size={14} color={theme.colors.textMuted} />
          </StyledNavLink>
        </NavSection>

        {/* Primary Action Button */}
        <NavSection>
          <PrimaryActionButton
            isCollapsed={isCollapsed}
            onClick={handleAddSong}
            title="Add New Song"
          >
            <PlusCircle size={18} />
            <span>Add New Song</span>
          </PrimaryActionButton>
        </NavSection>

        {/* Genre Filter Channels */}
        {genreList.length > 0 && (
          <NavSection style={{ flex: 1, overflowY: 'auto' }}>
            <SectionTitle isCollapsed={isCollapsed}>Genres</SectionTitle>
            {genreList.map((g) => {
              const isSelected = filters.genre === g.genre;
              return (
                <GenrePill
                  key={g.genre}
                  isActive={isSelected}
                  isCollapsed={isCollapsed}
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

        {/* Clean Theme Toggle Footer */}
        <BottomFooterBox>
          <ThemeSwitchBtn
            isCollapsed={isCollapsed}
            onClick={toggleTheme}
            title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            <Flex alignItems="center" gap={2}>
              {mode === 'light' ? <Moon size={16} color={theme.colors.primary} /> : <Sun size={16} color={theme.colors.primary} />}
              <span>{mode === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </Flex>
          </ThemeSwitchBtn>
        </BottomFooterBox>
      </SidebarContainer>
    </>
  );
};


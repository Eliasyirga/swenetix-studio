import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Music2,
  BarChart3,
  Plus,
  PlusCircle,
  Radio,
  Layers,
  ChevronRight,
  Sun,
  Moon,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
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
  width: ${(props) => (props.isCollapsed ? '72px' : '260px')};
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
  transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  /* Custom subtle scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.surfaceBorder};
    border-radius: 4px;
  }

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
  padding: 16px ${(props) => (props.isCollapsed ? '14px' : '18px')};
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? 'center' : 'space-between')};

  &:hover {
    background-color: ${(props) => props.theme.colors.surfaceLight};
  }
`;

const NavSection = styled.div<{ isCollapsed?: boolean }>`
  padding: ${(props) => (props.isCollapsed ? '12px 10px' : '16px 12px')};
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isCollapsed ? 'center' : 'stretch')};
  gap: ${(props) => (props.isCollapsed ? '10px' : '4px')};
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
  width: ${(props) => (props.isCollapsed ? '46px' : '100%')};
  height: ${(props) => (props.isCollapsed ? '46px' : 'auto')};
  padding: ${(props) => (props.isCollapsed ? '0' : '10px 14px')};
  border-radius: ${(props) => (props.isCollapsed ? '12px' : props.theme.radii.md)};
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.18s ease;
  text-decoration: none;
  position: relative;

  &:hover {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.surfaceLight};
    transform: ${(props) => (props.isCollapsed ? 'scale(1.06)' : 'none')};
  }

  &.active {
    color: #FFFFFF;
    background: linear-gradient(135deg, ${(props) => props.theme.colors.primary}, #FF4B5C);
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(217, 28, 46, 0.35);
  }

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: ${(props) => props.theme.radii.md};
  }
`;

const GenrePill = styled.button<{ isActive?: boolean; isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isCollapsed ? 'center' : 'space-between')};
  width: ${(props) => (props.isCollapsed ? '44px' : '100%')};
  height: ${(props) => (props.isCollapsed ? '44px' : 'auto')};
  padding: ${(props) => (props.isCollapsed ? '0' : '8px 12px')};
  border-radius: ${(props) => (props.isCollapsed ? '10px' : props.theme.radii.md)};
  background: ${(props) => (props.isActive ? props.theme.colors.primaryLight : 'transparent')};
  color: ${(props) => (props.isActive ? props.theme.colors.primary : props.theme.colors.textSecondary)};
  border: 1px solid ${(props) => (props.isActive ? props.theme.colors.primaryBorder : 'transparent')};
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: all 0.18s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceLight};
    color: ${(props) => props.theme.colors.text};
    transform: ${(props) => (props.isCollapsed ? 'scale(1.06)' : 'none')};
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

const MiniBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.primary};
  color: #FFFFFF;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
`;

const BottomFooterBox = styled.div<{ isCollapsed?: boolean }>`
  margin-top: auto;
  padding: ${(props) => (props.isCollapsed ? '14px 10px' : '14px')};
  border-top: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  background-color: ${(props) => props.theme.colors.backgroundAlt};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const PrimaryActionButton = styled.button<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: ${(props) => (props.isCollapsed ? '46px' : '100%')};
  height: ${(props) => (props.isCollapsed ? '46px' : 'auto')};
  padding: ${(props) => (props.isCollapsed ? '0' : '11px 14px')};
  border-radius: ${(props) => (props.isCollapsed ? '12px' : props.theme.radii.md)};
  background: linear-gradient(135deg, ${(props) => props.theme.colors.primary}, #FF4B5C);
  border: none;
  color: #FFFFFF;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(217, 28, 46, 0.35);

  &:hover {
    transform: translateY(-2px) scale(${(props) => (props.isCollapsed ? 1.08 : 1)});
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
  width: ${(props) => (props.isCollapsed ? '46px' : '100%')};
  height: ${(props) => (props.isCollapsed ? '46px' : 'auto')};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => (props.isCollapsed ? '12px' : props.theme.radii.md)};
  padding: ${(props) => (props.isCollapsed ? '0' : '8px 12px')};
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  font-size: 13px;
  transition: all 0.18s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.surfaceHover};
    transform: ${(props) => (props.isCollapsed ? 'scale(1.06)' : 'none')};
  }
`;

const BrandIconBox = styled(Box)`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(217, 28, 46, 0.25), rgba(217, 28, 46, 0.08));
  border: 1px solid ${(props) => props.theme.colors.primaryBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const FloatingTooltip = styled.div<{ top: number; visible: boolean }>`
  position: fixed;
  left: 78px;
  top: ${(props) => props.top}px;
  transform: translateY(-50%) translateX(${(props) => (props.visible ? '0' : '-8px')});
  opacity: ${(props) => (props.visible ? 1 : 0)};
  pointer-events: none;
  background-color: ${(props) => props.theme.colors.surfaceHover};
  color: ${(props) => props.theme.colors.text};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  z-index: 9999;
  transition: opacity 0.15s ease, transform 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent ${(props) => props.theme.colors.surfaceBorder} transparent transparent;
  }
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

  // Floating hover tooltip state for collapsed rail on desktop
  const [tooltip, setTooltip] = useState<{ text: string; top: number; visible: boolean; extra?: string }>({
    text: '',
    top: 0,
    visible: false,
  });

  const showTooltip = (text: string, e: React.MouseEvent, extra?: string) => {
    if (!isCollapsed || window.innerWidth <= 900) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      text,
      top: rect.top + rect.height / 2,
      visible: true,
      extra,
    });
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar on desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const handleGenreClick = (genre: string) => {
    closeMobileSidebar();
    hideTooltip();
    dispatch(setGenreFilter(genre));
    if (location.pathname !== '/songs') {
      navigate('/songs');
    }
  };

  const handleAddSong = () => {
    closeMobileSidebar();
    hideTooltip();
    dispatch(openCreateModal());
  };

  return (
    <>
      <BackdropOverlay isMobileOpen={isMobileOpen} onClick={closeMobileSidebar} />

      {/* Floating tooltip for collapsed rail */}
      {tooltip.visible && isCollapsed && (
        <FloatingTooltip top={tooltip.top} visible={tooltip.visible}>
          <span>{tooltip.text}</span>
          {tooltip.extra && (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: theme.colors.primary,
                color: '#fff',
                fontFamily: 'monospace',
              }}
            >
              {tooltip.extra}
            </span>
          )}
        </FloatingTooltip>
      )}

      <SidebarContainer isCollapsed={isCollapsed} isMobileOpen={isMobileOpen}>
        {/* Brand Header with Interactive Pop up / Pop off Logo Toggle */}
        <BrandSection
          isCollapsed={isCollapsed}
          onClick={toggleSidebar}
          onMouseEnter={(e) => showTooltip(isCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar', e)}
          onMouseLeave={hideTooltip}
        >
          <Flex alignItems="center" gap={3} justifyContent={isCollapsed ? 'center' : 'flex-start'}>
            <BrandIconBox>
              <Music2 size={20} />
            </BrandIconBox>
            {!isCollapsed && (
              <Box>
                <Text fontSize={2} fontWeight="bold" color="text" letterSpacing="-0.02em">
                  Swenetix
                </Text>
                <Text fontSize={0} color="textMuted">
                  Studio
                </Text>
              </Box>
            )}
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
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Mobile close cross */}
            <Box display={['block', 'none']}>
              <X size={20} />
            </Box>
            {/* Desktop expanded close arrow */}
            {!isCollapsed && (
              <Box display={['none', 'block']}>
                <PanelLeftClose size={16} />
              </Box>
            )}
          </Box>
        </BrandSection>

        {/* Collapsed Expand Quick Action Icon */}
        {isCollapsed && (
          <NavSection isCollapsed={isCollapsed} style={{ paddingBottom: '4px' }}>
            <GenrePill
              isCollapsed={isCollapsed}
              onClick={toggleSidebar}
              onMouseEnter={(e) => showTooltip('Expand Sidebar (Ctrl+B)', e)}
              onMouseLeave={hideTooltip}
              style={{ height: '32px', opacity: 0.7 }}
            >
              <PanelLeftOpen size={16} color={theme.colors.textMuted} />
            </GenrePill>
          </NavSection>
        )}

        {/* Main Navigation */}
        <NavSection isCollapsed={isCollapsed}>
          <SectionTitle isCollapsed={isCollapsed}>Menu</SectionTitle>
          <StyledNavLink
            to="/"
            isCollapsed={isCollapsed}
            onClick={() => {
              closeMobileSidebar();
              hideTooltip();
            }}
            onMouseEnter={(e) => showTooltip('Showcase Home', e)}
            onMouseLeave={hideTooltip}
          >
            <Flex alignItems="center" gap={2} justifyContent={isCollapsed ? 'center' : 'flex-start'}>
              <Sparkles size={18} />
              {!isCollapsed && <span className="nav-label">Showcase Home</span>}
            </Flex>
            {!isCollapsed && <ChevronRight size={14} color={theme.colors.textMuted} />}
          </StyledNavLink>

          <StyledNavLink
            to="/songs"
            end
            isCollapsed={isCollapsed}
            onClick={() => {
              closeMobileSidebar();
              hideTooltip();
            }}
            onMouseEnter={(e) => showTooltip('Song Library', e, `${totalSongs}`)}
            onMouseLeave={hideTooltip}
          >
            <Flex alignItems="center" gap={2} justifyContent={isCollapsed ? 'center' : 'flex-start'}>
              <Layers size={18} />
              {!isCollapsed && <span className="nav-label">Song Library</span>}
            </Flex>
            {!isCollapsed && <CountBadge>{totalSongs}</CountBadge>}
            {isCollapsed && totalSongs > 0 && <MiniBadge>{totalSongs > 99 ? '99+' : totalSongs}</MiniBadge>}
          </StyledNavLink>

          <StyledNavLink
            to="/statistics"
            isCollapsed={isCollapsed}
            onClick={() => {
              closeMobileSidebar();
              hideTooltip();
            }}
            onMouseEnter={(e) => showTooltip('Statistics & Analytics', e)}
            onMouseLeave={hideTooltip}
          >
            <Flex alignItems="center" gap={2} justifyContent={isCollapsed ? 'center' : 'flex-start'}>
              <BarChart3 size={18} />
              {!isCollapsed && <span className="nav-label">Statistics</span>}
            </Flex>
            {!isCollapsed && <ChevronRight size={14} color={theme.colors.textMuted} />}
          </StyledNavLink>

          <StyledNavLink
            to="/overview"
            isCollapsed={isCollapsed}
            onClick={() => {
              closeMobileSidebar();
              hideTooltip();
            }}
            onMouseEnter={(e) => showTooltip('Overview Dashboard', e)}
            onMouseLeave={hideTooltip}
          >
            <Flex alignItems="center" gap={2} justifyContent={isCollapsed ? 'center' : 'flex-start'}>
              <LayoutDashboard size={18} />
              {!isCollapsed && <span className="nav-label">Overview</span>}
            </Flex>
            {!isCollapsed && <ChevronRight size={14} color={theme.colors.textMuted} />}
          </StyledNavLink>
        </NavSection>

        {/* Primary Action Button */}
        <NavSection isCollapsed={isCollapsed}>
          <PrimaryActionButton
            isCollapsed={isCollapsed}
            onClick={handleAddSong}
            onMouseEnter={(e) => showTooltip('Add New Song', e)}
            onMouseLeave={hideTooltip}
          >
            {isCollapsed ? <Plus size={20} /> : (
              <>
                <PlusCircle size={18} />
                <span>Add New Song</span>
              </>
            )}
          </PrimaryActionButton>
        </NavSection>

        {/* Genre Filter Channels (shown when expanded) */}
        {!isCollapsed && genreList.length > 0 && (
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

        {/* Collapsed genre shortcuts */}
        {isCollapsed && genreList.length > 0 && (
          <NavSection isCollapsed={isCollapsed} style={{ flex: 1, overflowY: 'auto' }}>
            {genreList.slice(0, 6).map((g) => {
              const isSelected = filters.genre === g.genre;
              return (
                <GenrePill
                  key={g.genre}
                  isActive={isSelected}
                  isCollapsed={isCollapsed}
                  onClick={() => handleGenreClick(g.genre)}
                  onMouseEnter={(e) => showTooltip(g.genre, e, `${g.count}`)}
                  onMouseLeave={hideTooltip}
                >
                  <Radio size={15} color={isSelected ? theme.colors.primary : theme.colors.textMuted} />
                </GenrePill>
              );
            })}
          </NavSection>
        )}

        {/* Clean Theme Toggle Footer */}
        <BottomFooterBox isCollapsed={isCollapsed}>
          <ThemeSwitchBtn
            isCollapsed={isCollapsed}
            onClick={toggleTheme}
            onMouseEnter={(e) => showTooltip(mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode', e)}
            onMouseLeave={hideTooltip}
          >
            <Flex alignItems="center" gap={2} justifyContent={isCollapsed ? 'center' : 'flex-start'}>
              {mode === 'light' ? <Moon size={16} color={theme.colors.primary} /> : <Sun size={16} color={theme.colors.primary} />}
              {!isCollapsed && <span>{mode === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
            </Flex>
          </ThemeSwitchBtn>
        </BottomFooterBox>
      </SidebarContainer>
    </>
  );
};


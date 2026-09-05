import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Sun, Moon, PanelLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { openCreateModal, setSearchFilter } from '../store/songsSlice';
import { useAppTheme } from '../theme/ThemeContext';
import { useSidebar } from '../context/SidebarContext';
import { AppTheme } from '../theme/theme';
import { Flex, Box } from './common/Flex';
import { Text } from './common/Text';
import { Button } from './Button';

const HeaderContainer = styled.header`
  height: 64px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  box-shadow: ${(props) => props.theme.shadows.sm};
`;

const SearchBarWrapper = styled.div`
  position: relative;
  width: 360px;

  @media (max-width: 768px) {
    width: 180px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 14px 8px 36px;
  background-color: ${(props) => props.theme.colors.surfaceLight};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.md};
  color: ${(props) => props.theme.colors.text};
  font-size: 13px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    background-color: ${(props) => props.theme.colors.surface};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.textMuted};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const IconButton = styled.button`
  background: ${(props) => props.theme.colors.surfaceLight};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  color: ${(props) => props.theme.colors.text};
  width: 36px;
  height: 36px;
  border-radius: ${(props) => props.theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
    border-color: ${(props) => props.theme.colors.primary};
    transform: scale(1.05);
  }
`;

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useAppTheme();
  const { toggleSidebar } = useSidebar();
  const theme = useTheme() as AppTheme;

  const { filters } = useAppSelector((state) => state.songs);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  useEffect(() => {
    setSearchTerm(filters.search || '');
  }, [filters.search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    dispatch(setSearchFilter(val));
    if (location.pathname !== '/songs' && val.trim().length > 0) {
      navigate('/songs');
    }
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/songs':
        return 'Song Library';
      case '/statistics':
        return 'Statistics & Analytics';
      case '/overview':
        return 'Overview Dashboard';
      default:
        return 'Swenetix Studio';
    }
  };

  return (
    <HeaderContainer>
      {/* Left: Sidebar Pop Toggle & Page Title */}
      <Flex alignItems="center" gap={3}>
        <IconButton onClick={toggleSidebar} title="Toggle Sidebar (Pop-out / Pop-in)">
          <PanelLeft size={17} color={theme.colors.primary} />
        </IconButton>
        <Box>
          <Text fontSize={2} fontWeight="bold" color="text">
            {getPageTitle()}
          </Text>
        </Box>
      </Flex>

      {/* Center: Universal Search */}
      <SearchBarWrapper>
        <SearchIcon>
          <Search size={15} />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search by title, artist, or album..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchBarWrapper>

      {/* Right: Theme Switcher & Add Song Action */}
      <Flex alignItems="center" gap={2}>
        <IconButton
          onClick={toggleTheme}
          title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {mode === 'light' ? (
            <Moon size={16} color={theme.colors.primary} />
          ) : (
            <Sun size={16} color={theme.colors.primary} />
          )}
        </IconButton>

        <Button
          variant="primary"
          buttonSize="sm"
          onClick={() => dispatch(openCreateModal())}
          style={{ padding: '7px 14px', fontSize: '13px' }}
        >
          <Plus size={15} />
          <span>Add Song</span>
        </Button>
      </Flex>
    </HeaderContainer>
  );
};

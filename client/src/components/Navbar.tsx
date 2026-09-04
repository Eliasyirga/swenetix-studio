import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Music, Plus, Sparkles, Home, ListMusic, BarChart2 } from 'lucide-react';
import { Flex, Box } from './common/Flex';
import { Heading, Text } from './common/Text';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAppDispatch, useAppSelector } from '../store/store';
import { openCreateModal, seedSongsRequest } from '../store/songsSlice';
import { AppTheme } from '../theme/theme';

const HeaderWrapper = styled.header`
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 24px;
`;

const LogoIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${(props) => props.theme.radii.md};
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
`;

const StyledNavLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 14px;
  border-radius: ${(props) => props.theme.radii.md};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.textSecondary};
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.surfaceHover};
  }

  &.active {
    background: ${(props) => props.theme.colors.primary};
    color: #FFFFFF;
    font-weight: 600;
  }
`;

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme() as AppTheme;
  const totalSongs = useAppSelector((state) => state.songs.pagination.total);
  const loading = useAppSelector((state) => state.songs.loading);

  return (
    <HeaderWrapper>
      <Flex
        maxWidth="1300px"
        margin="0 auto"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={3}
      >
        {/* Brand */}
        <Flex
          alignItems="center"
          gap={3}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <LogoIcon>
            <Music size={18} />
          </LogoIcon>
          <Box>
            <Flex alignItems="center" gap={2}>
              <Heading as="h1" fontSize={3} fontWeight="bold" color="text">
                Swenetix
              </Heading>
              <Badge variant="primary">v1.0</Badge>
            </Flex>
            <Text fontSize={0} color="textSecondary">
              Song Management & Analytics
            </Text>
          </Box>
        </Flex>

        {/* Central React Router Navigation Links */}
        <Flex
          alignItems="center"
          gap={1}
          bg="background"
          p="3px"
          borderRadius="md"
          border="1px solid"
          borderColor="surfaceBorder"
        >
          <StyledNavLink to="/" end>
            <Home size={15} /> Home
          </StyledNavLink>

          <StyledNavLink to="/songs">
            <ListMusic size={15} /> Songs
            {totalSongs > 0 && (
              <Badge variant="neutral" style={{ padding: '1px 5px', fontSize: '11px' }}>
                {totalSongs}
              </Badge>
            )}
          </StyledNavLink>

          <StyledNavLink to="/statistics">
            <BarChart2 size={15} /> Statistics
          </StyledNavLink>
        </Flex>

        {/* Right Actions */}
        <Flex alignItems="center" gap={2}>
          <Button
            variant="outline"
            buttonSize="sm"
            onClick={() => dispatch(seedSongsRequest())}
            title="Seed 28 sample tracks"
            disabled={loading}
          >
            <Sparkles size={14} color={theme.colors.secondary} />
            <Box as="span" display={['none', 'inline']}>
              Seed Data
            </Box>
          </Button>

          <Button
            variant="primary"
            buttonSize="sm"
            onClick={() => dispatch(openCreateModal())}
          >
            <Plus size={15} /> Add Song
          </Button>
        </Flex>
      </Flex>
    </HeaderWrapper>
  );
};

import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Music,
  Mic,
  Disc,
  Radio,
  ArrowRight,
  Sparkles,
  BarChart2,
  Plus,
} from 'lucide-react';
import { Box, Flex, Grid } from '../components/common/Flex';
import { Heading, Text } from '../components/common/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchStatisticsRequest } from '../store/statisticsSlice';
import { fetchSongsRequest, openCreateModal, setGenreFilter } from '../store/songsSlice';
import { AppTheme } from '../theme/theme';

const HeroBanner = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.lg};
  padding: 36px 32px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.sm};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    background: radial-gradient(circle at 80% 50%, ${(props) => props.theme.colors.primaryLight}, transparent 70%);
    pointer-events: none;
  }
`;

const SoundwaveBar = styled.span<{ height: number; delay: number }>`
  width: 4px;
  height: ${(props) => `${props.height}px`};
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 2px;
  animation: pulsewave 1.2s ease-in-out infinite alternate;
  animation-delay: ${(props) => `${props.delay}s`};

  @keyframes pulsewave {
    0% { height: 6px; }
    50% { height: 28px; }
    100% { height: 12px; }
  }
`;

const ModuleCard = styled(Card)`
  padding: 22px;
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.lg};
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: ${(props) => props.theme.shadows.sm};
`;

const InteractiveRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${(props) => props.theme.colors.surfaceLight};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.md};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
    border-color: ${(props) => props.theme.colors.primary};
    transform: translateX(2px);
  }
`;

const RankBadge = styled.div<{ rank: number }>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: ${(props) => (props.rank === 1 ? props.theme.colors.primary : props.theme.colors.surfaceBorder)};
  color: ${(props) => (props.rank === 1 ? '#FFFFFF' : props.theme.colors.textSecondary)};
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  flex-shrink: 0;
`;

const ProgressBarContainer = styled.div`
  height: 6px;
  background: ${(props) => props.theme.colors.surfaceBorder};
  border-radius: 3px;
  overflow: hidden;
  margin-top: 6px;
`;

const ProgressBarFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${(props) => Math.min(100, Math.max(6, props.percent))}%;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 3px;
  transition: width 0.3s ease;
`;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme() as AppTheme;
  const { data: stats } = useAppSelector((state) => state.statistics);
  const { pagination } = useAppSelector((state) => state.songs);

  useEffect(() => {
    dispatch(fetchStatisticsRequest());
    dispatch(fetchSongsRequest({ page: 1, limit: 10 }));
  }, [dispatch]);

  const overview = stats?.overview || {
    totalSongs: pagination.total || 0,
    totalArtists: 0,
    totalAlbums: 0,
    totalGenres: 0,
  };

  const topArtists = stats?.artists?.slice(0, 5) || [];
  const songsByGenre = stats?.songsByGenre?.slice(0, 5) || [];
  const largestAlbums = stats?.albums?.slice(0, 5) || [];

  const handleGenreSelect = (genre: string) => {
    dispatch(setGenreFilter(genre));
    navigate('/songs');
  };

  return (
    <Box>
      {/* Hero Studio Banner */}
      <HeroBanner>
        <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
          <Box maxWidth="680px">
            <Flex alignItems="center" gap={2} mb={2}>
              <Badge variant="primary">
                <Sparkles size={12} /> Studio Engine v2.0
              </Badge>
              <Badge variant="neutral">MongoDB Aggregation Active</Badge>
            </Flex>

            <Heading as="h1" fontSize={[5, 6]} fontWeight="bold" mb={2} color="text">
              Your Music Catalog, Mastered.
            </Heading>

            <Text fontSize={2} color="textSecondary" mb={4} lineHeight="relaxed">
              Explore tracks, perform real-time catalog analytics, and manage releases with strict full-stack precision.
            </Text>

            <Flex gap={2} flexWrap="wrap">
              <Button
                variant="primary"
                buttonSize="md"
                onClick={() => navigate('/songs')}
              >
                <Compass size={16} /> Open Song Catalog
              </Button>
              <Button
                variant="secondary"
                buttonSize="md"
                onClick={() => navigate('/statistics')}
              >
                <BarChart2 size={16} /> Deep Analytics
              </Button>
              <Button
                variant="outline"
                buttonSize="md"
                onClick={() => dispatch(openCreateModal())}
              >
                <Plus size={16} /> Add Track
              </Button>
            </Flex>
          </Box>

          {/* Soundwave graphic */}
          <Flex alignItems="center" gap={1} style={{ padding: '16px' }}>
            {[10, 18, 28, 14, 22, 32, 16, 24, 12, 20, 30, 14].map((h, i) => (
              <SoundwaveBar key={i} height={h} delay={i * 0.1} />
            ))}
          </Flex>
        </Flex>
      </HeroBanner>

      {/* KPI Stats Strip */}
      <Grid
        gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
        gap={3}
        mb={4}
      >
        <StatCard
          title="Catalog Tracks"
          value={overview.totalSongs}
          subtitle="Total songs in library"
          icon={<Music size={20} />}
          onClick={() => navigate('/songs')}
        />
        <StatCard
          title="Unique Artists"
          value={overview.totalArtists}
          subtitle="Featured performers"
          icon={<Mic size={20} />}
          onClick={() => navigate('/statistics')}
        />
        <StatCard
          title="Distinct Albums"
          value={overview.totalAlbums}
          subtitle="Recorded collections"
          icon={<Disc size={20} />}
          onClick={() => navigate('/statistics')}
        />
        <StatCard
          title="Active Genres"
          value={overview.totalGenres}
          subtitle="Musical genres"
          icon={<Radio size={20} />}
          onClick={() => navigate('/statistics')}
        />
      </Grid>

      {/* 3 Core Studio Modules */}
      <Grid
        gridTemplateColumns={['1fr', '1fr', 'repeat(3, 1fr)']}
        gap={3}
        mb={4}
      >
        {/* Module 1: Top Performing Artists */}
        <ModuleCard>
          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Flex alignItems="center" gap={2}>
              <Mic size={18} color={theme.colors.primary} />
              <Heading as="h3" fontSize={2} fontWeight="bold" color="text">
                Top Artists
              </Heading>
            </Flex>
            <Button
              variant="ghost"
              buttonSize="sm"
              onClick={() => navigate('/statistics')}
              style={{ padding: '2px 8px', fontSize: '12px' }}
            >
              All <ArrowRight size={12} />
            </Button>
          </Flex>

          {topArtists.length === 0 ? (
            <Text fontSize={1} color="textMuted">No artist records found.</Text>
          ) : (
            <Flex flexDirection="column" gap={2}>
              {topArtists.map((artist, idx) => (
                <InteractiveRow
                  key={artist.artist}
                  onClick={() => navigate('/songs')}
                >
                  <Flex alignItems="center" gap={2}>
                    <RankBadge rank={idx + 1}>#{idx + 1}</RankBadge>
                    <Box>
                      <Text fontSize={1} fontWeight="semibold" color="text">
                        {artist.artist}
                      </Text>
                      <Text fontSize={0} color="textSecondary">
                        {artist.totalAlbums} {artist.totalAlbums === 1 ? 'album' : 'albums'}
                      </Text>
                    </Box>
                  </Flex>
                  <Badge variant="primary">{artist.totalSongs} tracks</Badge>
                </InteractiveRow>
              ))}
            </Flex>
          )}
        </ModuleCard>

        {/* Module 2: Genre Spectrum Breakdown */}
        <ModuleCard>
          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Flex alignItems="center" gap={2}>
              <Radio size={18} color={theme.colors.secondary} />
              <Heading as="h3" fontSize={2} fontWeight="bold" color="text">
                Genre Distribution
              </Heading>
            </Flex>
            <Button
              variant="ghost"
              buttonSize="sm"
              onClick={() => navigate('/songs')}
              style={{ padding: '2px 8px', fontSize: '12px' }}
            >
              Filter <ArrowRight size={12} />
            </Button>
          </Flex>

          {songsByGenre.length === 0 ? (
            <Text fontSize={1} color="textMuted">No genre records found.</Text>
          ) : (
            <Flex flexDirection="column" gap={2}>
              {songsByGenre.map((genre) => (
                <InteractiveRow
                  key={genre.genre}
                  onClick={() => handleGenreSelect(genre.genre)}
                >
                  <Box style={{ width: '100%' }}>
                    <Flex justifyContent="space-between" alignItems="center" mb={1}>
                      <Text fontSize={1} fontWeight="medium" color="text">
                        {genre.genre}
                      </Text>
                      <Text fontSize={0} color="textSecondary" style={{ fontFamily: 'monospace' }}>
                        {genre.count} songs ({genre.percentage || 0}%)
                      </Text>
                    </Flex>
                    <ProgressBarContainer>
                      <ProgressBarFill percent={genre.percentage || 0} />
                    </ProgressBarContainer>
                  </Box>
                </InteractiveRow>
              ))}
            </Flex>
          )}
        </ModuleCard>

        {/* Module 3: Largest Albums */}
        <ModuleCard>
          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Flex alignItems="center" gap={2}>
              <Disc size={18} color={theme.colors.primary} />
              <Heading as="h3" fontSize={2} fontWeight="bold" color="text">
                Largest Albums
              </Heading>
            </Flex>
            <Button
              variant="ghost"
              buttonSize="sm"
              onClick={() => navigate('/statistics')}
              style={{ padding: '2px 8px', fontSize: '12px' }}
            >
              All <ArrowRight size={12} />
            </Button>
          </Flex>

          {largestAlbums.length === 0 ? (
            <Text fontSize={1} color="textMuted">No album records found.</Text>
          ) : (
            <Flex flexDirection="column" gap={2}>
              {largestAlbums.map((album, idx) => (
                <InteractiveRow
                  key={`${album.album}-${album.artist}`}
                  onClick={() => navigate('/songs')}
                >
                  <Flex alignItems="center" gap={2} style={{ overflow: 'hidden', paddingRight: '6px' }}>
                    <RankBadge rank={idx + 1}>#{idx + 1}</RankBadge>
                    <Box overflow="hidden">
                      <Text fontSize={1} fontWeight="semibold" color="text" truncate title={album.album}>
                        {album.album}
                      </Text>
                      <Text fontSize={0} color="textSecondary" truncate>
                        {album.artist}
                      </Text>
                    </Box>
                  </Flex>
                  <Badge variant="secondary">{album.totalSongs} tracks</Badge>
                </InteractiveRow>
              ))}
            </Flex>
          )}
        </ModuleCard>
      </Grid>
    </Box>
  );
};

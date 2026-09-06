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
  TrendingUp,
  Heart,
  Clock,
} from 'lucide-react';
import { Box, Flex, Grid } from '../components/common/Flex';
import { Heading, Text } from '../components/common/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchStatisticsRequest } from '../store/statisticsSlice';
import { fetchSongsRequest, openCreateModal, setGenreFilter, setFavoriteFilter } from '../store/songsSlice';
import { AppTheme } from '../theme/theme';

const HeroBanner = styled.div`
  background: linear-gradient(135deg, ${(props) => props.theme.colors.surface} 0%, ${(props) => props.theme.colors.backgroundAlt} 100%);
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.lg};
  padding: 32px 28px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.card};

  @media (max-width: 768px) {
    padding: 18px 16px;
    margin-bottom: 20px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 320px;
    height: 100%;
    background: radial-gradient(circle at 80% 50%, rgba(217, 28, 46, 0.12), transparent 70%);
    pointer-events: none;
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
  box-shadow: ${(props) => props.theme.shadows.card};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.theme.colors.primaryBorder};
    box-shadow: ${(props) => props.theme.shadows.md};
  }
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
  background: linear-gradient(90deg, ${(props) => props.theme.colors.primary}, #FF4B5C);
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
    totalFavorites: 0,
    favoritePercentage: 0,
  };

  const durationMetrics = stats?.durationMetrics || {
    averageDuration: 210,
    formattedAverage: '3:30',
    totalCatalogHours: 0,
    longestSong: null,
    shortestSong: null,
  };

  const topArtists = stats?.artists?.slice(0, 5) || [];
  const songsByGenre = stats?.songsByGenre?.slice(0, 5) || [];
  const largestAlbums = stats?.albums?.slice(0, 5) || [];

  const handleGenreSelect = (genre: string) => {
    dispatch(setFavoriteFilter(undefined));
    dispatch(setGenreFilter(genre));
    navigate('/songs');
  };

  const handleFavoritesClick = () => {
    dispatch(setFavoriteFilter(true));
    navigate('/songs');
  };

  return (
    <Box>
      {/* Overview Hero Banner */}
      <HeroBanner>
        <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={4}>
          <Box maxWidth="640px">
            <Flex alignItems="center" gap={2} mb={2}>
              <Badge variant="primary">
                <Sparkles size={12} /> Live Dashboard
              </Badge>
              <Badge variant="neutral">Full-Stack MERN Precision</Badge>
            </Flex>

            <Heading as="h1" fontSize={[5, 6]} fontWeight="bold" mb={2} color="text">
              Song Management Hub
            </Heading>

            <Text fontSize={2} color="textSecondary" mb={4} lineHeight="relaxed">
              Real-time catalog oversight, instant CRUD modifications, and multi-facet analytical metrics.
            </Text>

            <Flex gap={2} flexWrap="wrap">
              <Button
                variant="primary"
                buttonSize="md"
                onClick={() => navigate('/songs')}
              >
                <Compass size={16} /> Explore Library
              </Button>
              <Button
                variant="secondary"
                buttonSize="md"
                onClick={() => navigate('/statistics')}
              >
                <BarChart2 size={16} /> View Statistics
              </Button>
              <Button
                variant="outline"
                buttonSize="md"
                onClick={() => dispatch(openCreateModal())}
              >
                <Plus size={16} /> Add New Song
              </Button>
            </Flex>
          </Box>

          <Box p={3} bg="surfaceLight" borderRadius="lg" border="1px solid" borderColor="surfaceBorder">
            <Flex flexDirection="column" gap={2}>
              <Flex alignItems="center" gap={2}>
                <TrendingUp size={16} color={theme.colors.primary} />
                <Text fontSize={1} fontWeight="semibold" color="text">
                  Catalog Status
                </Text>
              </Flex>
              <Text fontSize={0} color="textSecondary">
                {overview.totalSongs} Tracks across {overview.totalGenres} Genres
              </Text>
              <Text fontSize={0} color="textMuted">
                {overview.totalArtists} Artists &middot; {overview.totalAlbums} Albums
              </Text>
            </Flex>
          </Box>
        </Flex>
      </HeroBanner>

      {/* KPI Stats Strip (6 Columns on Large Screens) */}
      <Grid
        gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(6, 1fr)']}
        gap={3}
        mb={4}
      >
        <StatCard
          title="Catalog Tracks"
          value={overview.totalSongs}
          subtitle="Total songs in database"
          icon={<Music size={20} />}
          onClick={() => navigate('/songs')}
        />
        <StatCard
          title="Featured Artists"
          value={overview.totalArtists}
          subtitle="Distinct musicians"
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
          subtitle="Music categories"
          icon={<Radio size={20} />}
          onClick={() => navigate('/statistics')}
        />
        <StatCard
          title="Favorites"
          value={overview.totalFavorites || 0}
          subtitle={`${overview.favoritePercentage || 0}% of catalog`}
          icon={<Heart size={20} fill="#FF4B5C" color="#FF4B5C" />}
          onClick={handleFavoritesClick}
        />
        <StatCard
          title="Avg Length"
          value={durationMetrics.formattedAverage || '3:30'}
          subtitle={`${durationMetrics.totalCatalogHours || 0} hrs total`}
          icon={<Clock size={20} />}
        />
      </Grid>

      {/* 3 Core Dashboard Widgets */}
      <Grid
        gridTemplateColumns={['1fr', '1fr', 'repeat(3, 1fr)']}
        gap={3}
        mb={4}
      >
        {/* Module 1: Top Artists */}
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
              View All <ArrowRight size={12} />
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
                  <Badge variant="primary">{artist.totalSongs} songs</Badge>
                </InteractiveRow>
              ))}
            </Flex>
          )}
        </ModuleCard>

        {/* Module 2: Genre Breakdown */}
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
                        {genre.count} ({genre.percentage || 0}%)
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
              View All <ArrowRight size={12} />
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
                  <Badge variant="secondary">{album.totalSongs} songs</Badge>
                </InteractiveRow>
              ))}
            </Flex>
          )}
        </ModuleCard>
      </Grid>
    </Box>
  );
};

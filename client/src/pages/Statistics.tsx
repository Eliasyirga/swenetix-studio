import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Music,
  Mic,
  Disc,
  Radio,
  Award,
  Flame,
  Layers,
  Heart,
  Clock,
  Zap,
} from 'lucide-react';
import { Box, Flex, Grid } from '../components/common/Flex';
import { Heading, Text } from '../components/common/Text';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchStatisticsRequest } from '../store/statisticsSlice';
import { setGenreFilter, setArtistFilter, setAlbumFilter, setFavoriteFilter } from '../store/songsSlice';
import { AppTheme } from '../theme/theme';

const BarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: ${(props) => props.theme.colors.surfaceLight};
  border-radius: ${(props) => props.theme.radii.full};
  overflow: hidden;
  margin-top: 6px;
`;

const BarFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${(props) => Math.min(100, Math.max(3, props.percent))}%;
  border-radius: ${(props) => props.theme.radii.full};
  background: ${(props) => props.theme.colors.primary};
  transition: width 0.3s ease;
`;

const InteractiveRow = styled.div`
  padding: 10px 12px;
  border-radius: ${(props) => props.theme.radii.md};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.surfaceHover};
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme() as AppTheme;
  const { data: stats, loading, error } = useAppSelector((state) => state.statistics);

  useEffect(() => {
    dispatch(fetchStatisticsRequest());
  }, [dispatch]);

  if (loading && !stats) {
    return <LoadingState message="Loading statistics..." />;
  }

  if (error && !stats) {
    return (
      <ErrorState
        title="Failed to load statistics"
        message={error}
        onRetry={() => dispatch(fetchStatisticsRequest())}
      />
    );
  }

  const overview = stats?.overview || {
    totalSongs: 0,
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

  const songsByGenre = stats?.songsByGenre || [];
  const artists = stats?.artists || [];
  const albums = stats?.albums || [];
  const highlights = stats?.highlights || {
    mostProlificArtist: null,
    mostCommonGenre: null,
    largestAlbum: null,
    mostFavoritedGenre: null,
  };

  const handleGenreClick = (genre: string) => {
    dispatch(setFavoriteFilter(undefined));
    dispatch(setGenreFilter(genre));
    navigate('/songs');
  };

  const handleArtistClick = (artist: string) => {
    dispatch(setFavoriteFilter(undefined));
    dispatch(setArtistFilter(artist));
    navigate('/songs');
  };

  const handleAlbumClick = (album: string) => {
    dispatch(setFavoriteFilter(undefined));
    dispatch(setAlbumFilter(album));
    navigate('/songs');
  };

  const handleFavoritesClick = () => {
    dispatch(setFavoriteFilter(true));
    navigate('/songs');
  };

  return (
    <Box>
      {/* Header */}
      <Flex alignItems="center" gap={2} mb={4}>
        <BarChart2 size={24} />
        <Box>
          <Heading as="h1" fontSize={5} fontWeight="bold" color="text">
            Statistics & Analytics
          </Heading>
          <Text fontSize={1} color="textSecondary" mt="2px">
            Real-time breakdown of songs, artists, albums, favorites, and duration metrics.
          </Text>
        </Box>
      </Flex>

      {/* 1. Overview KPIs (6 Columns on Large Screens) */}
      <Grid
        gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(6, 1fr)']}
        gap={3}
        mb={4}
      >
        <StatCard
          title="Total Songs"
          value={overview.totalSongs}
          subtitle="Catalog tracks"
          icon={<Music size={20} />}
          onClick={() => navigate('/songs')}
        />
        <StatCard
          title="Total Artists"
          value={overview.totalArtists}
          subtitle="Distinct musicians"
          icon={<Mic size={20} />}
        />
        <StatCard
          title="Total Albums"
          value={overview.totalAlbums}
          subtitle="Recorded collections"
          icon={<Disc size={20} />}
        />
        <StatCard
          title="Total Genres"
          value={overview.totalGenres}
          subtitle="Musical categories"
          icon={<Radio size={20} />}
        />
        <StatCard
          title="Starred Tracks"
          value={overview.totalFavorites || 0}
          subtitle={`${overview.favoritePercentage || 0}% of catalog`}
          icon={<Heart size={20} fill="#FF4B5C" color="#FF4B5C" />}
          onClick={handleFavoritesClick}
        />
        <StatCard
          title="Avg Duration"
          value={durationMetrics.formattedAverage || '3:30'}
          subtitle={`${durationMetrics.totalCatalogHours || 0} hrs total`}
          icon={<Clock size={20} />}
        />
      </Grid>

      {/* 2. Key Highlights Strip */}
      <Grid
        gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
        gap={3}
        mb={4}
      >
        <Card>
          <Flex alignItems="center" gap={3}>
            <Box p={2} bg="primaryLight" borderRadius="md" color="primary" flexShrink={0}>
              <Award size={22} />
            </Box>
            <Box overflow="hidden">
              <Text fontSize={0} color="textSecondary" textTransform="uppercase" letterSpacing="0.04em">
                Most Prolific Artist
              </Text>
              <Heading as="h4" fontSize={2} fontWeight="bold" color="text" truncate title={highlights.mostProlificArtist?.artist || 'None'}>
                {highlights.mostProlificArtist?.artist || 'None'}
              </Heading>
              <Text fontSize={0} color="textMuted">
                {highlights.mostProlificArtist?.songCount || 0} catalog songs
              </Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex alignItems="center" gap={3}>
            <Box p={2} bg="secondaryLight" borderRadius="md" color="secondary" flexShrink={0}>
              <Flame size={22} />
            </Box>
            <Box overflow="hidden">
              <Text fontSize={0} color="textSecondary" textTransform="uppercase" letterSpacing="0.04em">
                Most Common Genre
              </Text>
              <Heading as="h4" fontSize={2} fontWeight="bold" color="text" truncate title={highlights.mostCommonGenre?.genre || 'None'}>
                {highlights.mostCommonGenre?.genre || 'None'}
              </Heading>
              <Text fontSize={0} color="textMuted">
                {highlights.mostCommonGenre?.songCount || 0} songs classified
              </Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex alignItems="center" gap={3}>
            <Box p={2} bg="successLight" borderRadius="md" color="success" flexShrink={0}>
              <Layers size={22} />
            </Box>
            <Box overflow="hidden">
              <Text fontSize={0} color="textSecondary" textTransform="uppercase" letterSpacing="0.04em">
                Album with Most Songs
              </Text>
              <Heading as="h4" fontSize={2} fontWeight="bold" color="text" truncate title={highlights.largestAlbum?.album || 'None'}>
                {highlights.largestAlbum?.album || 'None'}
              </Heading>
              <Text fontSize={0} color="textMuted">
                {highlights.largestAlbum?.songCount || 0} songs recorded
              </Text>
            </Box>
          </Flex>
        </Card>

        <Card>
          <Flex alignItems="center" gap={3}>
            <Box p={2} bg="primaryLight" borderRadius="md" color="#FF4B5C" flexShrink={0}>
              <Zap size={22} />
            </Box>
            <Box overflow="hidden">
              <Text fontSize={0} color="textSecondary" textTransform="uppercase" letterSpacing="0.04em">
                Longest Catalog Track
              </Text>
              <Heading as="h4" fontSize={2} fontWeight="bold" color="text" truncate title={durationMetrics.longestSong?.title || 'None'}>
                {durationMetrics.longestSong?.title || 'None'}
              </Heading>
              <Text fontSize={0} color="textMuted">
                {durationMetrics.longestSong?.formatted || '0:00'} min ({durationMetrics.longestSong?.artist || 'Unknown'})
              </Text>
            </Box>
          </Flex>
        </Card>
      </Grid>

      {/* 3. Detailed Aggregation Panels */}
      <Grid
        gridTemplateColumns={['1fr', '1fr', 'repeat(3, 1fr)']}
        gap={3}
        mb={4}
      >
        {/* Songs By Genre Visual Bar Chart */}
        <Card>
          <Flex alignItems="center" gap={2} mb={3}>
            <Radio size={18} color={theme.colors.secondary} />
            <Heading as="h3" fontSize={2} fontWeight="bold" color="text">
              Songs by Genre
            </Heading>
          </Flex>

          {songsByGenre.length === 0 ? (
            <Text fontSize={1} color="textMuted">No genres to display.</Text>
          ) : (
            <Flex flexDirection="column" gap={2}>
              {songsByGenre.map((g) => (
                <InteractiveRow key={g.genre} onClick={() => handleGenreClick(g.genre)}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize={1} fontWeight="semibold" color="text">
                      {g.genre}
                    </Text>
                    <Text fontSize={0} color="textSecondary">
                      {g.count} ({g.percentage || 0}%)
                    </Text>
                  </Flex>
                  <BarTrack>
                    <BarFill percent={g.percentage || 0} />
                  </BarTrack>
                </InteractiveRow>
              ))}
            </Flex>
          )}
        </Card>

        {/* Artists Breakdown: Artist Name, Total Songs, Total Albums */}
        <Card>
          <Flex alignItems="center" gap={2} mb={3}>
            <Mic size={18} color={theme.colors.primary} />
            <Heading as="h3" fontSize={2} fontWeight="bold" color="text">
              Artist Catalogs
            </Heading>
          </Flex>

          {artists.length === 0 ? (
            <Text fontSize={1} color="textMuted">No artists to display.</Text>
          ) : (
            <Flex flexDirection="column" gap={2} style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {artists.map((a) => (
                <InteractiveRow key={a.artist} onClick={() => handleArtistClick(a.artist)}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Text fontSize={1} fontWeight="semibold" color="text">
                        {a.artist}
                      </Text>
                      <Text fontSize={0} color="textSecondary">
                        {a.totalAlbums} {a.totalAlbums === 1 ? 'album' : 'albums'}
                      </Text>
                    </Box>
                    <Badge variant="primary">{a.totalSongs} songs</Badge>
                  </Flex>
                </InteractiveRow>
              ))}
            </Flex>
          )}
        </Card>

        {/* Albums Breakdown: Album Name, Artist, Total Songs */}
        <Card>
          <Flex alignItems="center" gap={2} mb={3}>
            <Disc size={18} color={theme.colors.primary} />
            <Heading as="h3" fontSize={2} fontWeight="bold" color="text">
              Album Collections
            </Heading>
          </Flex>

          {albums.length === 0 ? (
            <Text fontSize={1} color="textMuted">No albums to display.</Text>
          ) : (
            <Flex flexDirection="column" gap={2} style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {albums.map((al) => (
                <InteractiveRow
                  key={`${al.album}-${al.artist}`}
                  onClick={() => handleAlbumClick(al.album)}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box overflow="hidden" pr={2}>
                      <Text fontSize={1} fontWeight="semibold" color="text" truncate title={al.album}>
                        {al.album}
                      </Text>
                      <Text fontSize={0} color="textSecondary" truncate>
                        {al.artist}
                      </Text>
                    </Box>
                    <Badge variant="secondary">{al.totalSongs} songs</Badge>
                  </Flex>
                </InteractiveRow>
              ))}
            </Flex>
          )}
        </Card>
      </Grid>
    </Box>
  );
};

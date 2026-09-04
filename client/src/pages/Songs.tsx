import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  Plus,
  Search,
  RotateCcw,
  Music,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { Box, Flex, Grid } from '../components/common/Flex';
import { Heading, Text } from '../components/common/Text';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { SongTable } from '../components/SongTable';
import { SongCard } from '../components/SongCard';
import { SongForm } from '../components/SongForm';
import { DeleteModal } from '../components/DeleteModal';
import { Pagination } from '../components/Pagination';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { useAppDispatch, useAppSelector } from '../store/store';
import {
  fetchSongsRequest,
  setSearchFilter,
  setGenreFilter,
  setArtistFilter,
  setAlbumFilter,
  setPage,
  resetFilters,
  createSongRequest,
  updateSongRequest,
  deleteSongRequest,
  openCreateModal,
  openEditModal,
  closeFormModal,
  openDeleteModal,
  closeDeleteModal,
} from '../store/songsSlice';

const FilterBar = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.lg};
  padding: 16px 20px;
  margin-bottom: 24px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 220px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const Songs: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: songs,
    pagination,
    filterOptions,
    filters,
    loading,
    actionLoading,
    error,
    selectedSong,
    isFormModalOpen,
    deletingSong,
  } = useAppSelector((state) => state.songs);

  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Fetch songs whenever filters/page change
  useEffect(() => {
    dispatch(fetchSongsRequest(filters));
  }, [dispatch, filters.genre, filters.artist, filters.album, filters.page, filters.search]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setSearchFilter(localSearch));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, filters.search, dispatch]);

  // Synchronize local search state
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  const handleFormSubmit = (formData: { title: string; artist: string; album: string; genre: string }) => {
    if (selectedSong) {
      dispatch(updateSongRequest({ id: selectedSong.id, data: formData }));
    } else {
      dispatch(createSongRequest(formData));
    }
  };

  const handleDeleteConfirm = (songId: string) => {
    dispatch(deleteSongRequest(songId));
  };

  const isFiltered =
    (filters.search && filters.search.trim() !== '') ||
    filters.genre !== 'All' ||
    filters.artist !== 'All' ||
    filters.album !== 'All';

  return (
    <Box>
      {/* Header Section */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={3}
        mb={4}
      >
        <Box>
          <Flex alignItems="center" gap={2}>
            <Music size={22} />
            <Heading as="h1" fontSize={5} fontWeight="bold">
              Song Library
            </Heading>
          </Flex>
          <Text fontSize={1} color="textSecondary" mt="2px">
            Manage and organize your music collection.
          </Text>
        </Box>

        <Flex alignItems="center" gap={2}>
          {/* View toggle */}
          <Flex
            bg="surface"
            p="3px"
            borderRadius="md"
            border="1px solid"
            borderColor="surfaceBorder"
          >
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              buttonSize="sm"
              onClick={() => setViewMode('table')}
              style={{ padding: '4px 8px' }}
              title="Table View"
            >
              <TableIcon size={14} />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
              buttonSize="sm"
              onClick={() => setViewMode('cards')}
              style={{ padding: '4px 8px' }}
              title="Cards View"
            >
              <LayoutGrid size={14} />
            </Button>
          </Flex>

          <Button
            variant="primary"
            buttonSize="md"
            onClick={() => dispatch(openCreateModal())}
          >
            <Plus size={16} /> + Add Song
          </Button>
        </Flex>
      </Flex>

      {/* Search & Filters Bar */}
      <FilterBar>
        <Grid
          gridTemplateColumns={['1fr', '1fr', '2fr 1fr 1fr 1fr auto']}
          gap={2}
          alignItems="center"
        >
          {/* Search Input */}
          <SearchInputWrapper>
            <SearchIcon>
              <Search size={15} />
            </SearchIcon>
            <Input
              placeholder="Search by title, artist, or album..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </SearchInputWrapper>

          {/* Genre Filter */}
          <Select
            value={filters.genre || 'All'}
            onChange={(e) => dispatch(setGenreFilter(e.target.value))}
            aria-label="Filter by genre"
          >
            <option value="All">All Genres</option>
            {filterOptions.genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>

          {/* Artist Filter */}
          <Select
            value={filters.artist || 'All'}
            onChange={(e) => dispatch(setArtistFilter(e.target.value))}
            aria-label="Filter by artist"
          >
            <option value="All">All Artists</option>
            {filterOptions.artists.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>

          {/* Album Filter */}
          <Select
            value={filters.album || 'All'}
            onChange={(e) => dispatch(setAlbumFilter(e.target.value))}
            aria-label="Filter by album"
          >
            <option value="All">All Albums</option>
            {filterOptions.albums.map((al) => (
              <option key={al} value={al}>
                {al}
              </option>
            ))}
          </Select>

          {/* Clear Filters Button */}
          {isFiltered && (
            <Button
              variant="ghost"
              buttonSize="sm"
              onClick={() => {
                setLocalSearch('');
                dispatch(resetFilters());
              }}
              title="Clear all active search and filters"
            >
              <RotateCcw size={13} /> Reset
            </Button>
          )}
        </Grid>

        {/* Active Filter Pills Sub-bar */}
        {isFiltered && (
          <Flex alignItems="center" gap={2} mt={3} pt={3} borderTop="1px solid" borderColor="surfaceBorder" flexWrap="wrap">
            <Text fontSize={0} color="textMuted">Active Filters:</Text>
            {filters.search && (
              <Badge variant="primary">
                Search: "{filters.search}"
              </Badge>
            )}
            {filters.genre && filters.genre !== 'All' && (
              <Badge variant="secondary">
                Genre: {filters.genre}
              </Badge>
            )}
            {filters.artist && filters.artist !== 'All' && (
              <Badge variant="primary">
                Artist: {filters.artist}
              </Badge>
            )}
            {filters.album && filters.album !== 'All' && (
              <Badge variant="secondary">
                Album: {filters.album}
              </Badge>
            )}
          </Flex>
        )}
      </FilterBar>

      {/* Content States */}
      {loading && songs.length === 0 ? (
        <LoadingState message="Fetching songs from database..." />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchSongsRequest(filters))}
        />
      ) : songs.length === 0 ? (
        <EmptyState
          isFiltered={!!isFiltered}
          onAddSong={() => dispatch(openCreateModal())}
          onClearFilters={() => {
            setLocalSearch('');
            dispatch(resetFilters());
          }}
        />
      ) : (
        <>
          {viewMode === 'table' ? (
            <SongTable
              songs={songs}
              onEdit={(song) => dispatch(openEditModal(song))}
              onDelete={(song) => dispatch(openDeleteModal(song))}
            />
          ) : (
            <Grid
              gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
              gap={3}
            >
              {songs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onEdit={(s) => dispatch(openEditModal(s))}
                  onDelete={(s) => dispatch(openDeleteModal(s))}
                />
              ))}
            </Grid>
          )}

          {/* Pagination Controls */}
          <Pagination
            meta={pagination}
            onPageChange={(p) => dispatch(setPage(p))}
          />
        </>
      )}

      {/* Reusable Form Modal */}
      <SongForm
        isOpen={isFormModalOpen}
        onClose={() => dispatch(closeFormModal())}
        onSubmit={handleFormSubmit}
        initialData={selectedSong}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deletingSong}
        song={deletingSong}
        onClose={() => dispatch(closeDeleteModal())}
        onConfirm={handleDeleteConfirm}
        isLoading={actionLoading}
      />
    </Box>
  );
};

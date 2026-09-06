import React from 'react';
import { Music, Search, Plus, RotateCcw, Heart } from 'lucide-react';
import { Flex, Box } from './common/Flex';
import { Heading, Text } from './common/Text';
import { Button } from './Button';

export interface EmptyStateProps {
  isFiltered?: boolean;
  isFavoriteFilter?: boolean;
  onAddSong?: () => void;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered = false,
  isFavoriteFilter = false,
  onAddSong,
  onClearFilters,
}) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={6}
      px={4}
      bg="surface"
      borderRadius="lg"
      border="1px dashed"
      borderColor="surfaceBorder"
      textAlign="center"
    >
      <Box
        p={3}
        bg={isFavoriteFilter ? 'rgba(255, 75, 92, 0.12)' : 'rgba(59, 130, 246, 0.12)'}
        borderRadius="md"
        color={isFavoriteFilter ? '#FF4B5C' : 'primary'}
        mb={3}
      >
        {isFavoriteFilter ? (
          <Heart size={28} fill="#FF4B5C" color="#FF4B5C" />
        ) : isFiltered ? (
          <Search size={28} />
        ) : (
          <Music size={28} />
        )}
      </Box>

      <Heading as="h3" fontSize={3} fontWeight="bold" mb={2}>
        {isFavoriteFilter
          ? 'No favorite songs starred yet.'
          : isFiltered
          ? 'No songs match your current filters.'
          : 'No songs found.'}
      </Heading>

      <Text fontSize={1} color="textSecondary" maxWidth="400px" mb={4}>
        {isFavoriteFilter
          ? 'Click the heart icon on any song in the catalog to bookmark it into your favorites.'
          : isFiltered
          ? 'Try adjusting your keyword search or resetting genre, artist, or album filters.'
          : 'Start building your music library by adding your first song.'}
      </Text>

      <Flex gap={2}>
        {isFiltered || isFavoriteFilter ? (
          <Button variant="secondary" buttonSize="sm" onClick={onClearFilters}>
            <RotateCcw size={14} /> {isFavoriteFilter ? 'View All Songs' : 'Clear Filters'}
          </Button>
        ) : (
          <Button variant="primary" buttonSize="sm" onClick={onAddSong}>
            <Plus size={14} /> + Add Song
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

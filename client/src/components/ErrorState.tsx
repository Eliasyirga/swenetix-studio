import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Flex, Box } from './common/Flex';
import { Heading, Text } from './common/Text';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load songs.',
  message = 'Please check your connection and try again.',
  onRetry,
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
      border="1px solid"
      borderColor="dangerBorder"
      textAlign="center"
    >
      <Box
        p={3}
        bg="rgba(239, 68, 68, 0.12)"
        borderRadius="md"
        color="danger"
        mb={3}
      >
        <AlertCircle size={28} />
      </Box>

      <Heading as="h3" fontSize={3} fontWeight="bold" mb={2}>
        {title}
      </Heading>

      <Text fontSize={1} color="textSecondary" maxWidth="400px" mb={4}>
        {message}
      </Text>

      {onRetry && (
        <Button variant="secondary" buttonSize="sm" onClick={onRetry}>
          <RefreshCw size={14} /> Retry
        </Button>
      )}
    </Flex>
  );
};

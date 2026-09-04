import React from 'react';
import styled from '@emotion/styled';
import { Loader2 } from 'lucide-react';
import { Flex } from './common/Flex';
import { Text } from './common/Text';

const SpinnerIcon = styled(Loader2)`
  animation: spin 0.8s linear infinite;
  color: ${(props) => props.theme.colors.primary};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading songs...',
}) => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={6}
      px={3}
      gap={3}
    >
      <SpinnerIcon size={28} />
      <Text fontSize={1} color="textSecondary">
        {message}
      </Text>
    </Flex>
  );
};

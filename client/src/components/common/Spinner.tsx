import React from 'react';
import styled from '@emotion/styled';
import { Loader2 } from 'lucide-react';
import { Flex } from './Flex';
import { Text } from './Text';

const SpinIcon = styled(Loader2)<{ size: number; color?: string }>`
  animation: spin 1s linear infinite;
  color: ${(props) => props.color || props.theme.colors.primary};

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export interface SpinnerProps {
  size?: number;
  color?: string;
  message?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color,
  message,
}) => {
  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" py={4} gap={3}>
      <SpinIcon size={size} color={color} />
      {message && (
        <Text fontSize={1} color="textSecondary">
          {message}
        </Text>
      )}
    </Flex>
  );
};

import React from 'react';
import styled from '@emotion/styled';
import { Card } from './Card';
import { Flex, Box } from './common/Flex';
import { Heading, Text } from './common/Text';

const IconWrapper = styled.div<{ bg?: string; color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${(props) => props.theme.radii.md};
  background: ${(props) => props.bg || props.theme.colors.primaryLight};
  color: ${(props) => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  onClick,
}) => {
  return (
    <Card interactive={!!onClick} onClick={onClick} style={{ height: '100%' }}>
      <Flex justifyContent="space-between" alignItems="flex-start" gap={3}>
        <Box>
          <Text
            fontSize={0}
            fontWeight="semibold"
            color="textSecondary"
            textTransform="uppercase"
            letterSpacing="0.04em"
            mb={1}
          >
            {title}
          </Text>
          <Heading as="h3" fontSize={5} fontWeight="extrabold" color="text" mb={1}>
            {value}
          </Heading>
          {subtitle && (
            <Text fontSize={0} color="textMuted">
              {subtitle}
            </Text>
          )}
        </Box>
        <IconWrapper bg={iconBg} color={iconColor}>
          {icon}
        </IconWrapper>
      </Flex>
    </Card>
  );
};

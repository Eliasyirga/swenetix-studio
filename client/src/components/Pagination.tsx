import React from 'react';
import styled from '@emotion/styled';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Flex } from './common/Flex';
import { Text } from './common/Text';
import { Button } from './Button';
import { PaginationMeta } from '../types/song';

const PageButton = styled.button<{ isActive?: boolean }>`
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border-radius: ${(props) => props.theme.radii.sm};
  font-family: ${(props) => props.theme.fonts.heading};
  font-size: 13px;
  font-weight: ${(props) => (props.isActive ? 600 : 500)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  outline: none;
  user-select: none;

  ${(props) =>
    props.isActive
      ? `
        background: ${props.theme.colors.primary};
        color: #FFFFFF;
        border: 1px solid ${props.theme.colors.primary};
      `
      : `
        background: ${props.theme.colors.surface};
        color: ${props.theme.colors.text};
        border: 1px solid ${props.theme.colors.surfaceBorder};
        &:hover {
          background: ${props.theme.colors.surfaceLight};
          border-color: ${props.theme.colors.primary};
        }
      `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = meta;

  if (total === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={3}
      pt={3}
      borderTop="1px solid"
      borderColor="surfaceBorder"
      mt={3}
    >
      <Text fontSize={1} color="textSecondary">
        Showing <strong style={{ color: 'inherit' }}>{startItem}–{endItem}</strong> of <strong style={{ color: 'inherit' }}>{total}</strong>
      </Text>

      <Flex alignItems="center" gap={1}>
        <Button
          variant="secondary"
          buttonSize="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} /> Previous
        </Button>

        {pages.map((p) => (
          <PageButton
            key={p}
            isActive={p === page}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PageButton>
        ))}

        <Button
          variant="secondary"
          buttonSize="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          Next <ChevronRight size={14} />
        </Button>
      </Flex>
    </Flex>
  );
};

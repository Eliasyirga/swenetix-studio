import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { clearToast } from '../store/songsSlice';
import { Flex } from './common/Flex';
import { Text } from './common/Text';
import { Button } from './Button';
import { AppTheme } from '../theme/theme';

const ToastWrapper = styled.div<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2000;
  min-width: 280px;
  max-width: 420px;
  padding: 12px 16px;
  border-radius: ${(props) => props.theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: ${(props) => props.theme.shadows.lg};
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid
    ${(props) => {
      switch (props.type) {
        case 'success':
          return props.theme.colors.successBorder;
        case 'error':
          return props.theme.colors.dangerBorder;
        default:
          return props.theme.colors.primaryBorder;
      }
    }};
`;

export const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme() as AppTheme;
  const toast = useAppSelector((state) => state.songs.toast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color={theme.colors.success} />;
      case 'error':
        return <AlertCircle size={18} color={theme.colors.danger} />;
      default:
        return <Info size={18} color={theme.colors.primary} />;
    }
  };

  return (
    <ToastWrapper type={toast.type}>
      <Flex alignItems="center" gap={2}>
        {getIcon()}
        <Text fontSize={1} color="text" fontWeight="medium">
          {toast.message}
        </Text>
      </Flex>
      <Button
        variant="ghost"
        buttonSize="sm"
        onClick={() => dispatch(clearToast())}
        style={{ padding: '2px 4px', borderRadius: '4px' }}
        aria-label="Close notification"
      >
        <X size={14} />
      </Button>
    </ToastWrapper>
  );
};

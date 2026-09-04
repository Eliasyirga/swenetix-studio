import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { Heading } from '../components/common/Text';
import { Button } from './Button';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transition: all 0.15s ease;
  padding: 16px;
`;

const ModalContainer = styled.div<{ isOpen: boolean; maxWidth?: string }>`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.lg};
  box-shadow: ${(props) => props.theme.shadows.lg};
  width: 100%;
  max-width: ${(props) => props.maxWidth || '480px'};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: ${(props) => (props.isOpen ? 'scale(1)' : 'scale(0.97)')};
  transition: all 0.15s ease;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
`;

const ModalBody = styled.div`
  padding: 20px;
`;

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer isOpen={isOpen} maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Heading as="h3" fontSize={3} fontWeight="semibold">
            {title}
          </Heading>
          <Button
            variant="ghost"
            buttonSize="sm"
            onClick={onClose}
            style={{ padding: '4px', borderRadius: '4px' }}
            aria-label="Close modal"
          >
            <X size={16} />
          </Button>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

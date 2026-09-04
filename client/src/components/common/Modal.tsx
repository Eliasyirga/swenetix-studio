import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { Heading } from './Text';
import { Button } from './Button';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  transition: all 0.25s ease-in-out;
  padding: 16px;
`;

const ModalContainer = styled.div<{ isOpen: boolean; maxWidth?: string }>`
  background: ${(props) => props.theme.colors.surface};
  border: 1px solid ${(props) => props.theme.colors.surfaceBorder};
  border-radius: ${(props) => props.theme.radii.xl};
  box-shadow: ${(props) => props.theme.shadows.lg}, 0 0 40px rgba(0, 0, 0, 0.6);
  width: 100%;
  max-width: ${(props) => props.maxWidth || '520px'};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: ${(props) => (props.isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)')};
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${(props) => props.theme.colors.surfaceBorder};
`;

const ModalBody = styled.div`
  padding: 24px;
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
          <Heading as="h3" fontSize={4} fontWeight="bold">
            {title}
          </Heading>
          <Button
            variant="ghost"
            buttonSize="sm"
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '50%' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </Button>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

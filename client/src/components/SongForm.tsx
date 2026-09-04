import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Song } from '../types/song';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Flex } from './common/Flex';

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${(props) => props.theme.colors.textSecondary};
  margin-bottom: 6px;
`;

const ErrorMessage = styled.span`
  color: ${(props) => props.theme.colors.danger};
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

export interface SongFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { title: string; artist: string; album: string; genre: string }) => void;
  initialData?: Song | null;
  isLoading?: boolean;
}

export const SongForm: React.FC<SongFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        artist: initialData.artist,
        album: initialData.album,
        genre: initialData.genre,
      });
    } else {
      setFormData({
        title: '',
        artist: '',
        album: '',
        genre: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 120) {
      newErrors.title = 'Title cannot exceed 120 characters';
    }

    if (!formData.artist || !formData.artist.trim()) {
      newErrors.artist = 'Artist is required';
    } else if (formData.artist.length > 120) {
      newErrors.artist = 'Artist cannot exceed 120 characters';
    }

    if (!formData.album || !formData.album.trim()) {
      newErrors.album = 'Album is required';
    } else if (formData.album.length > 120) {
      newErrors.album = 'Album cannot exceed 120 characters';
    }

    if (!formData.genre || !formData.genre.trim()) {
      newErrors.genre = 'Genre is required';
    } else if (formData.genre.length > 60) {
      newErrors.genre = 'Genre cannot exceed 60 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      artist: formData.artist.trim(),
      album: formData.album.trim(),
      genre: formData.genre.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Song' : 'Add New Song'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormGroup>
          <Label htmlFor="song-title">Title *</Label>
          <Input
            id="song-title"
            placeholder="e.g. Blinding Lights"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            hasError={!!errors.title}
            disabled={isLoading}
            maxLength={120}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="song-artist">Artist *</Label>
          <Input
            id="song-artist"
            placeholder="e.g. The Weeknd"
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            hasError={!!errors.artist}
            disabled={isLoading}
            maxLength={120}
          />
          {errors.artist && <ErrorMessage>{errors.artist}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="song-album">Album *</Label>
          <Input
            id="song-album"
            placeholder="e.g. After Hours"
            value={formData.album}
            onChange={(e) => setFormData({ ...formData, album: e.target.value })}
            hasError={!!errors.album}
            disabled={isLoading}
            maxLength={120}
          />
          {errors.album && <ErrorMessage>{errors.album}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="song-genre">Genre *</Label>
          <Input
            id="song-genre"
            placeholder="e.g. Synth-pop"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            hasError={!!errors.genre}
            disabled={isLoading}
            maxLength={60}
          />
          {errors.genre && <ErrorMessage>{errors.genre}</ErrorMessage>}
        </FormGroup>

        <Flex justifyContent="flex-end" gap={2} mt={4}>
          <Button variant="ghost" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : isEditing ? 'Update Song' : 'Save Song'}
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

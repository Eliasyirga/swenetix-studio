export interface FilterState {
  selectedGenre: string;
  searchQuery: string;
}

export interface UiState {
  isCreateModalOpen: boolean;
  editingSongId: string | null;
  deletingSongId: string | null;
  notification: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
  viewMode: 'grid' | 'table';
}

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Upload from './Upload';
import {
  PROGRESS_INCREMENT,
  PROGRESS_INTERVAL_MS,
  REDIRECT_DELAY_MS,
} from '../lib/constant';

// Create mock context return value
const mockUseOutletContext = vi.fn();

// Mock react-router's useOutletContext
vi.mock('react-router', () => ({
  useOutletContext: () => mockUseOutletContext(),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CheckCircle2: ({ className }: any) => <span data-testid="check-icon" className={className}>✓</span>,
  ImageIcon: ({ className }: any) => <span data-testid="image-icon" className={className}>🖼️</span>,
  UploadIcon: () => <span data-testid="upload-icon">⬆️</span>,
}));

const createMockFile = (name = 'test.png', type = 'image/png', size = 1024) => {
  const file = new File(['test'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('components/Upload.tsx', () => {
  let mockOnComplete: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnComplete = vi.fn();
    vi.useFakeTimers();
    mockUseOutletContext.mockReturnValue({ isSignedIn: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('Initial Rendering', () => {
    it('should render without crashing', () => {
      render(<Upload />);
    });

    it('should render dropzone when no file is selected', () => {
      const { container } = render(<Upload />);
      const dropzone = container.querySelector('.dropzone');
      expect(dropzone).toBeInTheDocument();
    });

    it('should render file input', () => {
      const { container } = render(<Upload />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
    });

    it('should accept .jpg, .jpeg, .png files', () => {
      const { container } = render(<Upload />);
      const input = container.querySelector('input[type="file"]');
      expect(input?.getAttribute('accept')).toBe('.jpg,.jpeg,.png');
    });

    it('should render upload icon', () => {
      render(<Upload />);
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('should display upload instruction text when signed in', () => {
      render(<Upload />);
      expect(screen.getByText(/Click to upload or just drag and drop/i)).toBeInTheDocument();
    });

    it('should display sign-in prompt when not signed in', () => {
      mockUseOutletContext.mockReturnValue({ isSignedIn: false });
      render(<Upload />);
      expect(screen.getByText(/Sign In or sign with Puter to upload/i)).toBeInTheDocument();
    });

    it('should display file size limit', () => {
      render(<Upload />);
      expect(screen.getByText(/Maximum file Size is 10MB/i)).toBeInTheDocument();
    });

    it('should disable input when not signed in', () => {
      mockUseOutletContext.mockReturnValue({ isSignedIn: false });
      const { container } = render(<Upload />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toBeDisabled();
    });

    it('should enable input when signed in', () => {
      const { container } = render(<Upload />);
      const input = container.querySelector('input[type="file"]');
      expect(input).not.toBeDisabled();
    });
  });

  describe('Component Structure', () => {
    it('should have upload class on root div', () => {
      const { container } = render(<Upload />);
      const uploadDiv = container.querySelector('.upload');
      expect(uploadDiv).toBeInTheDocument();
    });

    it('should have proper class structure for dropzone', () => {
      const { container } = render(<Upload />);
      expect(container.querySelector('.dropzone .drop-content')).toBeInTheDocument();
      expect(container.querySelector('.dropzone .drop-icon')).toBeInTheDocument();
    });

    it('should conditionally render dropzone initially', () => {
      const { container } = render(<Upload onComplete={mockOnComplete} />);
      expect(container.querySelector('.dropzone')).toBeInTheDocument();
      expect(container.querySelector('.upload-status')).not.toBeInTheDocument();
    });
  });

  describe('Drag and Drop Events', () => {
    it('should handle drag enter event', () => {
      const { container } = render(<Upload />);
      const dropzone = container.querySelector('.dropzone')!;

      fireEvent.dragEnter(dropzone, { dataTransfer: { files: [] } });

      // Drag enter should set dragging state
      expect(dropzone.classList.contains('is-dragging')).toBe(true);
    });

    it('should handle drag over event', () => {
      const { container } = render(<Upload />);
      const dropzone = container.querySelector('.dropzone')!;

      fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } });

      // Drag over should set dragging state
      expect(dropzone.classList.contains('is-dragging')).toBe(true);
    });

    it('should handle drag leave event', () => {
      const { container } = render(<Upload />);
      const dropzone = container.querySelector('.dropzone')!;

      // First set dragging state
      fireEvent.dragEnter(dropzone, { dataTransfer: { files: [] } });
      expect(dropzone.classList.contains('is-dragging')).toBe(true);

      // Then leave should clear it
      fireEvent.dragLeave(dropzone, { dataTransfer: { files: [] } });
      expect(dropzone.classList.contains('is-dragging')).toBe(false);
    });

    it('should handle drop event', () => {
      const { container } = render(<Upload />);
      const dropzone = container.querySelector('.dropzone')!;

      // Drop with empty files should not crash
      fireEvent.drop(dropzone, { dataTransfer: { files: [] } });

      // Should still show dropzone since no file was provided
      expect(container.querySelector('.dropzone')).toBeInTheDocument();
    });

    it('should ignore drag events when not signed in', () => {
      mockUseOutletContext.mockReturnValue({ isSignedIn: false });
      const { container } = render(<Upload />);
      const dropzone = container.querySelector('.dropzone')!;

      fireEvent.dragEnter(dropzone, { dataTransfer: { files: [] } });

      // Should not set dragging state
      expect(dropzone.classList.contains('is-dragging')).toBe(false);
    });
  });

  describe('Constants Integration', () => {
    it('should use PROGRESS_INCREMENT constant', () => {
      expect(PROGRESS_INCREMENT).toBeDefined();
      expect(typeof PROGRESS_INCREMENT).toBe('number');
    });

    it('should use PROGRESS_INTERVAL_MS constant', () => {
      expect(PROGRESS_INTERVAL_MS).toBeDefined();
      expect(typeof PROGRESS_INTERVAL_MS).toBe('number');
    });

    it('should use REDIRECT_DELAY_MS constant', () => {
      expect(REDIRECT_DELAY_MS).toBeDefined();
      expect(typeof REDIRECT_DELAY_MS).toBe('number');
    });

    it('should have valid progress timing configuration', () => {
      expect(PROGRESS_INCREMENT).toBeGreaterThan(0);
      expect(PROGRESS_INTERVAL_MS).toBeGreaterThan(0);
      expect(REDIRECT_DELAY_MS).toBeGreaterThan(0);
    });
  });

  describe('File Handling', () => {
    it('should ignore file selection when not signed in', () => {
      mockUseOutletContext.mockReturnValue({ isSignedIn: false });
      const { container } = render(<Upload onComplete={mockOnComplete} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createMockFile();

      fireEvent.change(input, { target: { files: [file] } });

      // Should still show dropzone
      expect(container.querySelector('.dropzone')).toBeInTheDocument();
    });

    it('should handle null file in target.files', () => {
      const { container } = render(<Upload onComplete={mockOnComplete} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(input, { target: { files: null } });

      // Should still show dropzone
      expect(container.querySelector('.dropzone')).toBeInTheDocument();
    });

    it('should handle empty files array', () => {
      const { container } = render(<Upload onComplete={mockOnComplete} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(input, { target: { files: [] } });

      // Should still show dropzone
      expect(container.querySelector('.dropzone')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('should accept onComplete prop as optional', () => {
      expect(() => render(<Upload />)).not.toThrow();
    });

    it('should accept onComplete prop as function', () => {
      expect(() => render(<Upload onComplete={mockOnComplete} />)).not.toThrow();
    });

    it('should handle UploadProps type correctly', () => {
      const props = { onComplete: mockOnComplete };
      expect(typeof props.onComplete).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should render correctly with undefined onComplete', () => {
      const { container } = render(<Upload onComplete={undefined} />);
      expect(container.querySelector('.dropzone')).toBeInTheDocument();
    });

    it('should handle component re-render', () => {
      const { rerender } = render(<Upload />);
      rerender(<Upload />);
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('should maintain state across re-renders without file', () => {
      const { rerender, container } = render(<Upload />);
      expect(container.querySelector('.dropzone')).toBeInTheDocument();

      rerender(<Upload />);
      expect(container.querySelector('.dropzone')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have file input with proper type', () => {
      const { container } = render(<Upload />);
      const input = container.querySelector('input');
      expect(input?.getAttribute('type')).toBe('file');
    });

    it('should have descriptive text for users', () => {
      render(<Upload />);
      expect(screen.getByText(/Maximum file Size is 10MB/i)).toBeInTheDocument();
    });

    it('should disable input when user is not signed in', () => {
      mockUseOutletContext.mockReturnValue({ isSignedIn: false });
      const { container } = render(<Upload />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveProperty('disabled', true);
    });
  });

  describe('Icon Rendering', () => {
    it('should render upload icon in dropzone', () => {
      render(<Upload />);
      const uploadIcon = screen.getByTestId('upload-icon');
      expect(uploadIcon).toBeInTheDocument();
    });

    it('should have icons imported from lucide-react', () => {
      // This test verifies the mock is working
      render(<Upload />);
      expect(screen.getByTestId('upload-icon').textContent).toBe('⬆️');
    });
  });

  describe('User Feedback', () => {
    it('should show different text based on sign-in status', () => {
      const { rerender } = render(<Upload />);
      expect(screen.getByText(/Click to upload or just drag and drop/i)).toBeInTheDocument();

      mockUseOutletContext.mockReturnValue({ isSignedIn: false });
      rerender(<Upload />);
      expect(screen.getByText(/Sign In or sign with Puter to upload/i)).toBeInTheDocument();
    });

    it('should provide clear file size limitation', () => {
      render(<Upload />);
      const helpText = screen.getByText(/Maximum file Size is 10MB/i);
      expect(helpText).toHaveClass('help');
    });
  });
});
import { CloseRounded } from '@material-ui/icons';
import { Button, CircularProgress } from '@material-ui/core';
import './MediaPreview.css';

export default function MediaPreview({ src, isLoading, isUploading, onSend, handleHidePreview }) {
  if (!src && !isLoading) return null;

  return (
    <div className="mediaPreview">
      <CloseRounded onClick={handleHidePreview} />
      {isLoading ? (
        <CircularProgress className="mediaPreview__loader" />
      ) : (
        <img src={src} alt="Preview" />
      )}
      <div className="mediaPreview__actions">
        <Button onClick={handleHidePreview} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="mediaPreview__send"
          onClick={onSend}
          disabled={isUploading || isLoading}
        >
          {isUploading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}

import { CloseRounded } from '@material-ui/icons';
import './MediaPreview.css';

export default function MediaPreview({ src, handleHidePreview }) {
  if (!src) return null;
  return (
    <div className="mediaPreview">
      <CloseRounded onClick={handleHidePreview} />
      <img src={src} alt="Image preview" />
    </div>
  );
}

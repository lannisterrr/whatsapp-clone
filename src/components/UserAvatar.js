import { memo } from 'react';
import { Avatar } from '@material-ui/core';
import { getAvatarColor, getInitial, resolvePhotoUrl } from '../utils/avatar';

function UserAvatar({ src, photo, photoURL, name, id, style, className }) {
  const imageSrc = resolvePhotoUrl(src, photoURL, photo);

  if (imageSrc) {
    return <Avatar src={imageSrc} style={style} className={className} />;
  }

  const initial = getInitial(name, id);
  const bg = getAvatarColor(name || id);

  return (
    <Avatar
      style={{ backgroundColor: bg, color: '#fff', ...style }}
      className={className}
    >
      {initial}
    </Avatar>
  );
}

export default memo(UserAvatar);

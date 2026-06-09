export function getInitial(name, id) {
  const label = (name || id || '?').trim();
  return label.charAt(0).toUpperCase();
}

export function getAvatarColor(seed) {
  const colors = ['#06d755', '#128c7e', '#25d366', '#075e54', '#34b7f1', '#7c4dff'];
  let hash = 0;
  const str = seed || '?';
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function resolvePhotoUrl(...sources) {
  return sources.find(src => typeof src === 'string' && src.length > 0) || null;
}

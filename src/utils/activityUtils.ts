export const formatTimeAgo = (date?: Date): string => {
  if (!date) return 'just now';
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

export const getAvatar = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('taofik')) return '👨‍💼';
  if (lower.includes('sarah')) return '👩‍💻';
  if (lower.includes('mike')) return '👨‍🔧';
  if (lower.includes('alex')) return '👨‍🎨';
  return '👤';
};
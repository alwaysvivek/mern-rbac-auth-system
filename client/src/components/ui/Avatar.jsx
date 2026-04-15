import React from 'react';

const Avatar = ({ name, className = '' }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  const backgroundColor = name ? stringToColor(name) : '#CBD5E1';
  
  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-medium shrink-0 ${className}`}
      style={{ backgroundColor, textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;

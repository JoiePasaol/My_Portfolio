import { memo, useEffect, useState } from 'react';

const Loading = memo(() => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen w-full transition-colors duration-300"
       style={{ backgroundColor: isDark ? '#000000' : '#ffffff' }}
    >
      <div className={`loader-text ${isDark ? 'loader-text-dark' : 'loader-text-light'}`}>
        <span>&lt;</span>
        <span>LOADING</span>
        <span>/&gt;</span>
      </div>
    </div>
  );
});

Loading.displayName = 'Loading';
export default Loading;
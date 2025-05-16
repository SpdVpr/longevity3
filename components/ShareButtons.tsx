'use client';

interface ShareButtonsProps {
  title: string;
  description?: string;
  className?: string;
}

export default function ShareButtons({ title, description, className }: ShareButtonsProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareOnTwitter = () => {
    const text = `${title}${description ? ` - ${description}` : ''}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`flex space-x-2 ${className || ''}`}>
      <button
        onClick={shareOnTwitter}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="Share on Twitter"
      >
        Twitter
      </button>
      <button
        onClick={shareOnFacebook}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="Share on Facebook"
      >
        Facebook
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        aria-label="Share on LinkedIn"
      >
        LinkedIn
      </button>
    </div>
  );
}

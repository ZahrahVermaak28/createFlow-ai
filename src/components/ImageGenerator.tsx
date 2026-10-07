import React, { useState } from 'react';
import { Download, RefreshCw, Share2, Sparkles, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { ImageStyle } from '../types';
import { TikTokIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from './SocialIcons';

interface ImageGeneratorProps {
  onSuccess: (prompt: string, result: string, metadata: { style: ImageStyle }) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onSuccess, showToast }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ImageStyle>('Digital Art');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const examplePrompt = 'A futuristic city at sunset with flying cars.';

  const handleGenerate = async (customPrompt?: string) => {
    const promptToSubmit = (customPrompt || prompt).trim();
    if (!promptToSubmit) {
      setError('Please describe the image you want to create.');
      return;
    }

    setError(null);
    setLoading(true);
    setShowShareMenu(false);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSubmit,
          style,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create image.');
      }

      setGeneratedImage(data.imageUrl);
      onSuccess(promptToSubmit, data.imageUrl, { style });
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(err.message || 'Something went wrong while creating your image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadImageHelper = () => {
    if (!generatedImage) return false;
    try {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `CreateFlow-Image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
      return true;
    } catch {
      return false;
    }
  };

  const handleDownload = () => {
    const success = downloadImageHelper();
    if (success) {
      showToast('Image downloaded successfully!', 'success');
    } else {
      showToast('Failed to download image.', 'error');
    }
  };

  // Social Sharing Handlers for Images
  // As required: Where direct image sharing is not supported, allow the image to be downloaded and open the selected social platform. Do not fake successful uploads.
  const handlePlatformShare = (platform: 'instagram' | 'tiktok' | 'facebook' | 'whatsapp') => {
    if (!generatedImage) return;

    downloadImageHelper();

    if (platform === 'whatsapp') {
      showToast('Image downloaded! Opening WhatsApp to share with your friends.', 'info');
      // For WhatsApp, we open WhatsApp web/app
      const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this image I created with CreateFlow AI: "${prompt}"`)}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } else if (platform === 'facebook') {
      showToast('Image downloaded! Opening Facebook to upload your photo.', 'info');
      window.open('https://www.facebook.com/', '_blank', 'noopener,noreferrer');
    } else if (platform === 'instagram') {
      showToast('Image downloaded! Opening Instagram so you can post your photo.', 'info');
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    } else if (platform === 'tiktok') {
      showToast('Image downloaded! Opening TikTok so you can post your visual creation.', 'info');
      window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer');
    }

    setShowShareMenu(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Input Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1F1F2E] flex items-center gap-2">
              <span className="text-2xl">🖼️</span> AI Image Generator
            </h2>
            <p className="text-sm text-[#1F1F2E]/60 mt-1">
              Transform your ideas into high quality visual art and realistic designs.
            </p>
          </div>
        </div>

        {/* Prompt Box */}
        <div className="space-y-2 mb-5">
          <label htmlFor="image-prompt" className="block text-sm font-semibold text-[#1F1F2E]">
            Describe the image you want to create.
          </label>
          <div className="relative">
            <textarea
              id="image-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A futuristic city at sunset with flying cars."
              className="w-full px-4 py-3 text-base rounded-xl border border-[#8B6FE8]/25 focus:outline-none focus:ring-2 focus:ring-[#8B6FE8] focus:bg-white focus:border-transparent transition-all bg-[#F8F7FC] text-[#1F1F2E] placeholder:text-slate-400 resize-y min-h-[95px]"
            />
          </div>

          {/* Example prompt chip */}
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold text-[#5B3FD6]">Example:</span>
            <button
              type="button"
              onClick={() => setPrompt(examplePrompt)}
              className="text-left text-slate-600 hover:text-[#5B3FD6] hover:underline cursor-pointer italic transition-colors truncate"
              title="Click to use this example"
            >
              &ldquo;{examplePrompt}&rdquo;
            </button>
          </div>
        </div>

        {/* Style Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1F1F2E] mb-2">
            Visual Style
          </label>
          <div className="relative">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as ImageStyle)}
              className="w-full appearance-none px-4 py-2.5 rounded-xl border border-[#8B6FE8]/25 bg-[#F8F7FC] font-medium text-sm text-[#1F1F2E] focus:outline-none focus:ring-2 focus:ring-[#8B6FE8] focus:bg-white focus:border-transparent cursor-pointer shadow-2xs"
            >
              <option value="Realistic">Realistic</option>
              <option value="Digital Art">Digital Art</option>
              <option value="Cartoon">Cartoon</option>
              <option value="Illustration">Illustration</option>
              <option value="Minimalist">Minimalist</option>
              <option value="3D">3D</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-white text-base shadow-md shadow-[#5B3FD6]/20 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 gradient-brand gradient-brand-hover ${
            loading ? 'opacity-80 cursor-wait' : 'hover:shadow-lg hover:shadow-[#5B3FD6]/30 active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating your image…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#F5A889]" />
              <span>🎨 Generate Image</span>
            </>
          )}
        </button>
      </div>

      {/* Loading state banner */}
      {loading && (
        <div className="bg-white rounded-3xl p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center gradient-brand text-white shadow-lg shadow-[#5B3FD6]/25 animate-pulse">
            <Sparkles className="w-10 h-10 text-[#F5A889] animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1F1F2E]">Creating your image…</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Synthesizing colors, lighting, and textures based on &ldquo;{prompt || examplePrompt}&rdquo; in {style} style.
            </p>
          </div>
        </div>
      )}

      {/* Generated Image Result Card */}
      {generatedImage && !loading && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Image</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E76F8A]/15 text-[#E76F8A] font-bold">
                {style}
              </span>
            </div>

            {/* Action buttons: Download, Generate Again */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Download full resolution image"
              >
                {downloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
                <span>{downloaded ? 'Downloaded!' : 'Download Image'}</span>
              </button>

              <button
                onClick={() => handleGenerate()}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Generate another version"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Generate Again</span>
              </button>
            </div>
          </div>

          {/* Visual Display Container */}
          <div className="relative group overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 flex items-center justify-center aspect-square max-w-lg mx-auto shadow-inner">
            <img
              src={generatedImage}
              alt={prompt || 'AI Generated Image'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>

          {/* Share Section directly underneath */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span>Share your image</span>
              </h4>
              <span className="text-xs text-slate-400">Downloads image &amp; opens platform</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* TikTok */}
              <button
                type="button"
                onClick={() => handlePlatformShare('tiktok')}
                className="flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-semibold text-sm text-white bg-black hover:bg-neutral-800 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok</span>
              </button>

              {/* Instagram */}
              <button
                type="button"
                onClick={() => handlePlatformShare('instagram')}
                className="flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                }}
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handlePlatformShare('facebook')}
                className="flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-semibold text-sm text-white bg-[#1877F2] hover:bg-[#166FE5] transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>Facebook</span>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => handlePlatformShare('whatsapp')}
                className="flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-semibold text-sm text-white bg-[#25D366] hover:bg-[#20BD5A] transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

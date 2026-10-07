import React, { useState } from 'react';
import { Copy, RefreshCw, Download, Sparkles, AlertCircle, Check } from 'lucide-react';
import { TextTone, TextLength } from '../types';
import { TikTokIcon, InstagramIcon, FacebookIcon, WhatsAppIcon } from './SocialIcons';

interface TextGeneratorProps {
  onSuccess: (prompt: string, result: string, metadata: { tone: TextTone; length: TextLength }) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const TextGenerator: React.FC<TextGeneratorProps> = ({ onSuccess, showToast }) => {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<TextTone>('Friendly');
  const [length, setLength] = useState<TextLength>('Medium');
  const [loading, setLoading] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const examplePrompt = 'Create an Instagram post promoting a new coffee shop.';

  const handleGenerate = async (customPrompt?: string) => {
    const textToSubmit = (customPrompt || prompt).trim();
    if (!textToSubmit) {
      setError('Please enter what you would like to write.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSubmit,
          tone,
          length,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate text.');
      }

      setGeneratedText(data.text);
      onSuccess(textToSubmit, data.text, { tone, length });
    } catch (err: any) {
      console.error('Error generating text:', err);
      setError(err.message || 'Something went wrong while generating text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleDownload = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CreateFlow-Text-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded text file!', 'success');
  };

  // Social Media Sharing Handlers
  const handleWhatsAppShare = () => {
    if (!generatedText) return;
    const encodedText = encodeURIComponent(generatedText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    if (!generatedText) return;
    const quote = encodeURIComponent(generatedText);
    // Facebook sharer with quote parameter
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${quote}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleInstagramShare = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      showToast('Content copied! Paste it into Instagram.', 'info');
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    } catch {
      showToast('Could not auto-copy. Please use Copy button then open Instagram.', 'error');
    }
  };

  const handleTikTokShare = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      showToast('Content copied! Paste it into TikTok.', 'info');
      window.open('https://www.tiktok.com/', '_blank', 'noopener,noreferrer');
    } catch {
      showToast('Could not auto-copy. Please use Copy button then open TikTok.', 'error');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Input Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1F1F2E] flex items-center gap-2">
              <span className="text-2xl">📝</span> AI Text Generator
            </h2>
            <p className="text-sm text-[#1F1F2E]/60 mt-1">
              Create engaging captions, articles, social posts, and creative stories.
            </p>
          </div>
        </div>

        {/* Prompt Box */}
        <div className="space-y-2 mb-5">
          <label htmlFor="text-prompt" className="block text-sm font-semibold text-[#1F1F2E]">
            What would you like to write?
          </label>
          <div className="relative">
            <textarea
              id="text-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create an Instagram post promoting a new coffee shop."
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

        {/* Options: Tone & Length */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-[#1F1F2E] mb-2">
              Tone
            </label>
            <div className="relative">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as TextTone)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl border border-[#8B6FE8]/25 bg-[#F8F7FC] font-medium text-sm text-[#1F1F2E] focus:outline-none focus:ring-2 focus:ring-[#8B6FE8] focus:bg-white focus:border-transparent cursor-pointer shadow-2xs"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
                <option value="Casual">Casual</option>
                <option value="Creative">Creative</option>
                <option value="Educational">Educational</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1F1F2E] mb-2">
              Length
            </label>
            <div className="relative">
              <select
                value={length}
                onChange={(e) => setLength(e.target.value as TextLength)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl border border-[#8B6FE8]/25 bg-[#F8F7FC] font-medium text-sm text-[#1F1F2E] focus:outline-none focus:ring-2 focus:ring-[#8B6FE8] focus:bg-white focus:border-transparent cursor-pointer shadow-2xs"
              >
                <option value="Short">Short (~50 - 100 words)</option>
                <option value="Medium">Medium (~150 - 250 words)</option>
                <option value="Long">Long (~350 - 500 words)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
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
              <span>Generating your text…</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#F5A889]" />
              <span>✨ Generate Text</span>
            </>
          )}
        </button>
      </div>

      {/* Loading Banner when generating */}
      {loading && !generatedText && (
        <div className="bg-white rounded-3xl p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5 text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center gradient-brand text-white shadow-lg shadow-[#5B3FD6]/25">
            <Sparkles className="w-8 h-8 text-[#F5A889] animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F1F2E]">Generating your text…</h3>
            <p className="text-sm text-slate-500 mt-1">Crafting your tailored response...</p>
          </div>
          <div className="h-4 bg-[#F8F7FC] rounded w-3/4 mx-auto animate-pulse" />
          <div className="h-4 bg-[#F8F7FC] rounded w-1/2 mx-auto animate-pulse" />
        </div>
      )}

      {/* Result Display Card */}
      {generatedText && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Text</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8B6FE8]/15 text-[#5B3FD6] font-semibold">
                {tone} &bull; {length}
              </span>
            </div>

            {/* Action buttons: Copy, Regenerate, Download */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={() => handleGenerate()}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Regenerate text"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Download as text file"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Generated Text Content */}
          <div className="p-5 rounded-2xl bg-[#F8F7FC] border border-[#8B6FE8]/15 text-[#1F1F2E] text-base leading-relaxed whitespace-pre-wrap font-normal select-text">
            {generatedText}
          </div>

          {/* Share to Social Media Section */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <span>Share your content</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* TikTok */}
              <button
                type="button"
                onClick={handleTikTokShare}
                className="flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-semibold text-sm text-white bg-black hover:bg-neutral-800 transition-all shadow-sm cursor-pointer active:scale-95"
                title="Copy content and open TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
                <span>TikTok</span>
              </button>

              {/* Instagram */}
              <button
                type="button"
                onClick={handleInstagramShare}
                className="flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-semibold text-sm text-white shadow-sm transition-all cursor-pointer active:scale-95"
                style={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                }}
                title="Copy content and open Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Instagram</span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleFacebookShare}
                className="flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-semibold text-sm text-white bg-[#1877F2] hover:bg-[#166FE5] transition-all shadow-sm cursor-pointer active:scale-95"
                title="Share to Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>Facebook</span>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-semibold text-sm text-white bg-[#25D366] hover:bg-[#20BD5A] transition-all shadow-sm cursor-pointer active:scale-95"
                title="Share directly via WhatsApp"
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

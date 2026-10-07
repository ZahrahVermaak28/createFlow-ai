import React, { useState } from 'react';
import { Copy, RefreshCw, Download, Sparkles, AlertCircle, Check, Terminal, Code2 } from 'lucide-react';
import { CodeLanguage } from '../types';

interface CodeGeneratorProps {
  onSuccess: (prompt: string, result: string, metadata: { language: CodeLanguage }) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const fileExtensions: Record<CodeLanguage, string> = {
  Java: 'java',
  Python: 'py',
  JavaScript: 'js',
  'HTML/CSS': 'html',
  React: 'tsx',
  SQL: 'sql',
  'C#': 'cs',
  Other: 'txt',
};

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ onSuccess, showToast }) => {
  const [language, setLanguage] = useState<CodeLanguage>('Java');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const examplePrompt = 'Create a Java method that calculates the average of three numbers.';

  const handleGenerate = async (customPrompt?: string) => {
    const promptToSubmit = (customPrompt || prompt).trim();
    if (!promptToSubmit) {
      setError('Please specify what the code should do.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSubmit,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate code.');
      }

      setGeneratedCode(data.code);
      onSuccess(promptToSubmit, data.code, { language });
    } catch (err: any) {
      console.error('Error generating code:', err);
      setError(err.message || 'Something went wrong while generating code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      showToast('Code copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy code.', 'error');
    }
  };

  const handleDownload = () => {
    if (!generatedCode) return;
    const ext = fileExtensions[language] || 'txt';
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CreateFlow-Solution.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded as .${ext} file!`, 'success');
  };

  // Format code lines for line numbers
  const codeLines = generatedCode ? generatedCode.split('\n') : [];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Input Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1F1F2E] flex items-center gap-2">
              <span className="text-2xl">💻</span> AI Code Generator
            </h2>
            <p className="text-sm text-[#1F1F2E]/60 mt-1">
              Generate clean, structured code and algorithms with inline explanations.
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#1F1F2E] mb-2">
            Programming Language
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
              className="w-full appearance-none px-4 py-2.5 rounded-xl border border-[#8B6FE8]/25 bg-[#F8F7FC] font-medium text-sm text-[#1F1F2E] focus:outline-none focus:ring-2 focus:ring-[#8B6FE8] focus:bg-white focus:border-transparent cursor-pointer shadow-2xs"
            >
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="HTML/CSS">HTML/CSS</option>
              <option value="React">React</option>
              <option value="SQL">SQL</option>
              <option value="C#">C#</option>
              <option value="Other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Prompt Box */}
        <div className="space-y-2 mb-6">
          <label htmlFor="code-prompt" className="block text-sm font-semibold text-[#1F1F2E]">
            What should the code do?
          </label>
          <div className="relative">
            <textarea
              id="code-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a Java method that calculates the average of three numbers."
              className="w-full px-4 py-3 text-base rounded-xl border border-[#8B6FE8]/25 focus:outline-none focus:ring-2 focus:ring-[#8B6FE8] focus:bg-white focus:border-transparent transition-all bg-[#F8F7FC] text-[#1F1F2E] placeholder:text-slate-400 resize-y min-h-[95px]"
            />
          </div>

          {/* Example prompt chip */}
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold text-[#5B3FD6]">Example:</span>
            <button
              type="button"
              onClick={() => {
                setPrompt(examplePrompt);
                setLanguage('Java');
              }}
              className="text-left text-slate-600 hover:text-[#5B3FD6] hover:underline cursor-pointer italic transition-colors truncate"
              title="Click to use this example"
            >
              &ldquo;{examplePrompt}&rdquo;
            </button>
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
              <span>Generating your code…</span>
            </>
          ) : (
            <>
              <Code2 className="w-5 h-5 text-[#F5A889]" />
              <span>💻 Generate Code</span>
            </>
          )}
        </button>
      </div>

      {/* Loading state banner */}
      {loading && !generatedCode && (
        <div className="bg-white rounded-3xl p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5 text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center gradient-brand text-white shadow-lg shadow-[#5B3FD6]/25">
            <Terminal className="w-8 h-8 text-[#F5A889] animate-bounce" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1F1F2E]">Generating your code…</h3>
            <p className="text-sm text-slate-500 mt-1">Writing optimized, commented {language} code.</p>
          </div>
          <div className="h-4 bg-[#F8F7FC] rounded w-3/4 mx-auto animate-pulse" />
          <div className="h-4 bg-[#F8F7FC] rounded w-1/2 mx-auto animate-pulse" />
        </div>
      )}

      {/* Result Display: Dark Formatted Code Block */}
      {generatedCode && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#8B6FE8]/20 shadow-xl shadow-[#5B3FD6]/5 space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Code</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#5B3FD6]/15 text-[#5B3FD6] font-bold">
                {language}
              </span>
            </div>

            {/* Action buttons: Copy Code, Regenerate, Download Code */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Copy code to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => handleGenerate()}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Regenerate code"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Download code file"
              >
                <Download className="w-4 h-4" />
                <span>Download Code</span>
              </button>
            </div>
          </div>

          {/* Dark Formatted Code Block with Header and Line Numbers */}
          <div className="rounded-xl overflow-hidden bg-[#1E1E2E] border border-slate-800 shadow-lg">
            {/* Code Block Header */}
            <div className="px-4 py-2.5 bg-[#181825] border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="ml-2 font-mono text-slate-300 font-medium">
                  solution.{fileExtensions[language] || 'txt'}
                </span>
              </div>
              <span className="font-mono text-slate-400 text-[11px] uppercase tracking-wider">
                {language}
              </span>
            </div>

            {/* Code Content Area */}
            <div className="p-4 sm:p-5 overflow-x-auto text-sm font-mono text-slate-200 leading-relaxed max-h-[500px] overflow-y-auto">
              <table className="border-collapse w-full">
                <tbody>
                  {codeLines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="pr-4 py-0.5 text-right text-slate-600 select-none text-xs font-mono w-10">
                        {idx + 1}
                      </td>
                      <td className="py-0.5 pl-2 font-mono whitespace-pre text-[#E0E0FF]">
                        {line || ' '}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Note: NO social media buttons on code generator as explicitly instructed */}
        </div>
      )}
    </div>
  );
};

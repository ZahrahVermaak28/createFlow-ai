export type GeneratorTab = 'text' | 'image' | 'code';

export type TextTone = 'Professional' | 'Friendly' | 'Casual' | 'Creative' | 'Educational';
export type TextLength = 'Short' | 'Medium' | 'Long';

export type ImageStyle = 'Realistic' | 'Digital Art' | 'Cartoon' | 'Illustration' | 'Minimalist' | '3D';

export type CodeLanguage = 'Java' | 'Python' | 'JavaScript' | 'HTML/CSS' | 'React' | 'SQL' | 'C#' | 'Other';

export interface RecentItem {
  id: string;
  type: GeneratorTab;
  prompt: string;
  timestamp: number;
  result?: string;
  metadata?: {
    tone?: TextTone;
    length?: TextLength;
    style?: ImageStyle;
    language?: CodeLanguage;
  };
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

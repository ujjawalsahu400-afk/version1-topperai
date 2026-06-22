export type NoteType = 'Short' | 'Detailed' | 'Revision' | 'Exam' | 'Bullet';
export type NoteSource = 'Topic' | 'Text' | 'PDF' | 'Image';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: NoteType;
  source: NoteSource;
  sourceUri?: string; // Link to PDF or Image in Storage
  createdAt: string;
  updatedAt: string;
}

export interface NoteGenerationParams {
  input: string;
  type: NoteType;
  source: NoteSource;
  imageUri?: string;
  pdfUri?: string;
}

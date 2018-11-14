import { RedditSubmission } from '@models';

const normalizeSubmissions = (
  submissions: RedditSubmission[]
): { [key: string]: RedditSubmission } => {
  return submissions.reduce((acc, current: RedditSubmission) => {
    acc[current.data.id] = {
      ...current,
      restoredFromFile: true,
    };
    return acc;
  }, Object.create(null));
};

export const generateJsonFileContents = (
  submissions: RedditSubmission[]
): string => {
  const exportData = {
    version: '1.0',
    submissions: normalizeSubmissions(submissions),
  };

  return JSON.stringify(exportData);
};

export const parseJsonFileContents = (contents: string) => {
  const parsed = JSON.parse(contents);

  if (parsed.version !== '1.0') {
    console.error('invalid file');
    return;
  }

  return parsed;
};
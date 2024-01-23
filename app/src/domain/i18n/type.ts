export type I18NErrorType = {
  kind: 'error' | 'success';
  title: string;
  message: string;
  solution: string;
};

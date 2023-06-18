export type JoiValidationError = {
  message: string;
  path: string[];
  type: string;
  context: {
    label: string;
    key: string;
  };
};

export const generateMessage = (
  template: string,
  data: Record<string, string>
) => {
  let message = template;
  for (const key in data) {
    message = message.replace(`{${key}}`, data[key]);
  }
  return message;
};

export type HandlerType = (
  payload?: any,
  tools?: { aborted: () => boolean },
) => void | Promise<any>;

export const mockReturnObjectValue = <T extends (...args: any[]) => any>(
  fn: T,
  returnValue: Partial<ReturnType<T>>
): void => {
  const mockedFn = jest.mocked(fn);
  mockedFn.mockReturnValue(returnValue);
};

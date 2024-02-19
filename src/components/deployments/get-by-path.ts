export function getByPath<T>(
  obj: T, 
  path: string, 
): T | undefined {
  const keys = path.split('.');
  let result: unknown = obj;
  for (let key of keys) {
    result = (result as any)?.[key];
    if (result === undefined) return undefined;
  }
  return result as T;
}

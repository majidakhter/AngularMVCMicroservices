
export interface IDictionary<T> {
  [key: string]: T;
}

export class Dictionary<T> implements IDictionary<T>{
  [key: string]: T

  public static generateKey(...keyParts: string[]) {
    return keyParts.join('+');
  }
}

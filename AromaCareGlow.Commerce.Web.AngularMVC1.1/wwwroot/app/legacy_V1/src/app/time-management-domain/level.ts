export interface ILevel {
  id: number;
  code: string;
  name: string;
  number?: number;
  links: Array<string>;
}

export class Level implements ILevel {
  public id: number;
  public code: string;
  public name: string;
  public number?: number;
  public links: Array<string>;
}

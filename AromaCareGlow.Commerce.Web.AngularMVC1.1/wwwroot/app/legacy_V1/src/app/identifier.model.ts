

export class Identifier {
  id: string;
  code: string;
  name: string;
  number?: string;

  constructor(identifier) {
    this.id = identifier.id;
    this.code = identifier.code;
    this.name = identifier.name;
    this.number = identifier.number;
  }
}

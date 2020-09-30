

export interface IToastOptions {
  severity: string;
  message: string | string[];
  title: string;
}

export class ToastOptions implements IToastOptions {
  constructor(
    public severity: string,
    public title: string = '',
    public message: string | string[] = ''
  ) { }
}

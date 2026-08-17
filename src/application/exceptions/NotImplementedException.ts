export class NotImplementedException extends Error {
  constructor(message = 'Not implemented') {
    super(message);
    this.name = 'NotImplementedException';
  }
}

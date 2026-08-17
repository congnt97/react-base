export class NetworkException extends Error {
  constructor(message = 'Network error') {
    super(message);
    this.name = 'NetworkException';
  }
}

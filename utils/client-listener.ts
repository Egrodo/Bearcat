export default abstract class ClientListeners {
  public event: string;

  constructor(eventType: string) {
    this.event = eventType;
  }

  abstract handler(any): Promise<void>;
}

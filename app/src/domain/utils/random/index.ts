export class RandomUtil {
  public generateRandomNumber(length: number): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length);
    return String(Math.floor(Math.random() * (max - min) + min));
  }
}

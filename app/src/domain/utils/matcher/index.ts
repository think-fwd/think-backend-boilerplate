export class MatcherUtil {
  public isFileOnRoot(filePath: string): boolean {
    // Get the last directory separator index
    const lastSeparatorIndex = filePath.lastIndexOf('/');
    // If there's no directory separator, the file is at the root
    if (lastSeparatorIndex === -1) return true;
    // Get the substring up to the last directory separator
    const directoryPath = filePath.substring(0, lastSeparatorIndex);
    // If the directory path is empty, the file is at the root
    return directoryPath === '';
  }

  public validExtensionFile(filePath: string, extensions: string[]): boolean {
    const extension = filePath.split('.').pop();
    if (!extension) return false;
    return extensions.includes(extension);
  }
}

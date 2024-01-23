export class AWSProvider {
  public region;

  constructor() {
    this.region = process.env.AWS_FORCE_REGION || 'us-west-2';
  }

  public buildConfig() {
    // return local development iam credentials if running on local machine
    if (
      process.env.LOCAL_AWS_API_KEY &&
      process.env.LOCAL_AWS_SECRET_KEY &&
      process.env.LOCAL_AWS_REGION
    ) {
      return {
        region: process.env.LOCAL_AWS_REGION!,
        credentials: {
          accessKeyId: process.env.LOCAL_AWS_API_KEY!,
          secretAccessKey: process.env.LOCAL_AWS_SECRET_KEY!,
        },
      };
    }
    // otherwise if it is running on aws server, it will inherit role function
    return { region: this.region };
  }
}

export type EmailProps = {
  to: string;
  from?: string;
  subject: string;
  templateId?: string;
  dynamicTemplateData?:
    | {
        [key: string]: unknown;
      }
    | undefined;
};

export interface IEmailRepository {
  send(props: EmailProps): Promise<boolean>;
}

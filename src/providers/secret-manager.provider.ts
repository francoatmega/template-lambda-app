import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { environment } from '../config/environment';

export interface ISecretsManagerProvider {
  getSecretValue(secretsName: string): Promise<string>;
}

export class SecretsManagerProvider implements ISecretsManagerProvider {
  private readonly client: SecretsManagerClient;

  constructor() {
    this.client = new SecretsManagerClient({ region: environment.REGION });
  }

  public async getSecretValue(secretsName: string): Promise<string> {
    const data = await this.client.send(
      new GetSecretValueCommand({
        SecretId: secretsName,
      }),
    );

    return data.SecretString;
  }
}

export interface DeploymentProvider {
  name: string;
  deploy(config: DeploymentConfig): Promise<DeploymentResult>;
}

export interface DeploymentConfig {
  projectName: string;
  region: string;
  environment: string;
}

export interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class AWSProvider implements DeploymentProvider {
  name = 'AWS';

  async deploy(config: DeploymentConfig): Promise<DeploymentResult> {
    return {
      success: true,
      url: `https://${config.projectName}.lambda.${config.region}.amazonaws.com`,
    };
  }
}

export class GCPProvider implements DeploymentProvider {
  name = 'GCP';

  async deploy(config: DeploymentConfig): Promise<DeploymentResult> {
    return {
      success: true,
      url: `https://${config.region}-${config.projectName}.cloudfunctions.net`,
    };
  }
}

export class VercelProvider implements DeploymentProvider {
  name = 'Vercel';

  async deploy(config: DeploymentConfig): Promise<DeploymentResult> {
    return {
      success: true,
      url: `https://${config.projectName}.vercel.app`,
    };
  }
}

export class DeploymentProviderFactory {
  static getProvider(name: string): DeploymentProvider {
    switch (name.toLowerCase()) {
      case 'aws':
        return new AWSProvider();
      case 'gcp':
        return new GCPProvider();
      case 'vercel':
        return new VercelProvider();
      default:
        return new AWSProvider();
    }
  }
}

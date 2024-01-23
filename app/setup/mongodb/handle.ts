import axios from 'axios';
import shell from 'shelljs';

type MongoAppServiceType = {
  _id: string;
  client_app_id: string;
  name: string;
  location: 'BR-SP';
  provider_region: 'aws-sa-east-1';
  deployment_model: 'LOCAL' | 'GLOBAL';
  domain_id: string;
  group_id: string;
  last_used: number;
  last_modified: number;
  product: 'standard' | 'atlas' | 'data-api';
  environment: '' | 'development' | 'testing' | 'qa' | 'production';
};

export class MongodbSetup {
  async handle() {
    try {
      // create axios client
      const http = axios.create({
        baseURL: 'https://realm.mongodb.com/api/admin/v3.0',
      });

      // authenticate mongodb user
      const response = await http.post('/auth/providers/mongodb-cloud/login', {
        username: process.env.MONGODB_API_KEY!,
        apiKey: process.env.MONGODB_API_SECRET!,
      });

      // retrieve access token
      const { access_token } = response.data;

      // get mongodb service apps
      const res_service_apps = await http.get<MongoAppServiceType[]>(
        `/groups/${process.env.MONGODB_GROUP_ID!}/apps`,
        { headers: { Authorization: `Bearer ${access_token}` } },
      );

      // retrieve listed apps
      const service_apps = res_service_apps.data;

      // retrieve payment service from service-apps list
      let thinkcrm_service_app = service_apps.find(service_app => {
        return (
          service_app.environment === process.env.MONGODB_ENV! &&
          service_app.name === 'thinkcrm_service'
        );
      });

      // create payment service if not exists
      if (!thinkcrm_service_app) {
        const res_created_thinkcrm_service =
          await http.post<MongoAppServiceType>(
            `/groups/${process.env.MONGODB_GROUP_ID!}/apps`,
            {
              template_id: '',
              location: 'BR-SP',
              name: 'thinkcrm_service',
              deployment_model: 'LOCAL',
              provider_region: 'aws-sa-east-1',
              environment: process.env.MONGODB_ENV!,
              data_source: {
                name: 'mongodb-atlas',
                type: 'mongodb-atlas',
                config: { clusterName: process.env.MONGODB_CLUSTER_NAME! },
              },
            },
            { headers: { Authorization: `Bearer ${access_token}` } },
          );
        // override undefined thinkcrm_service_app with api result
        thinkcrm_service_app = res_created_thinkcrm_service.data;
      }

      // throw an error if was not possible to manage service app on mongodb
      if (!thinkcrm_service_app) {
        throw new Error(
          'Was not possibel to retrieve neither create payment service app',
        );
      }

      // export app id to .output to be used on ci/cd pipeline
      const MONGODB_APP_ID = `export MONGODB_APP_ID=${thinkcrm_service_app._id}`;
      shell.exec(`echo "${MONGODB_APP_ID}" >> .output`);

      console.log('handle setup mongodb migration');
    } catch (error: any) {
      console.log('failed to migrate mongodb', error);
    }
  }
}

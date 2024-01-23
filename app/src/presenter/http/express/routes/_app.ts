import { isAllowedPolicy } from './__policy';
import { appInfoFactory } from '../modules/app::info/app::info_factory';
import { appDatesFactory } from '../modules/app:dates/app::dates_factory';
import { appUploadFactory } from '../modules/app:upload/app::upload_factory';
import { appLocationsFactory } from '../modules/app:locations/app::locations_factory';

export default function (routes) {
  routes.get('/', (req, res) => appInfoFactory().handle(req, res));
  routes.get('/date', (req, res) => appDatesFactory().handle(req, res));
  routes.get('/locations', (req, res) =>
    appLocationsFactory().handle(req, res),
  );
  routes.post(
    '/uploads',
    isAllowedPolicy({}),
    async (req, res) => await appUploadFactory().handle(req, res),
  );
}

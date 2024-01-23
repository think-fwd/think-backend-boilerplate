import { DateUtil } from '@domain/utils/date';
import { AppLocationsController } from './app::locations_controller';

export const appLocationsFactory = () => {
  return new AppLocationsController(new DateUtil());
};

import { DateUtil } from '@domain/utils/date';
import { AppDatesController } from './app::dates_controller';

export const appDatesFactory = () => {
  return new AppDatesController(new DateUtil());
};

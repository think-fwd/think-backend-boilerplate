import { AppInfoController } from './app::info_controller';

export const appInfoFactory = () => {
  return new AppInfoController();
};

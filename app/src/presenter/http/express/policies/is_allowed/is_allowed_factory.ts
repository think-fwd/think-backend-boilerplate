import { IPolicy } from '../../interfaces/policy_interface';
import { IsAllowedPolicyDto } from './is_allowed_dto';
import { IsAllowedPolicyUsecase } from './is_allowed_usecase';

export const isAllowedPolicyFactory = (config: IsAllowedPolicyDto): IPolicy => {
  return new IsAllowedPolicyUsecase(config);
};

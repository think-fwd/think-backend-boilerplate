import { IsAllowedPolicyDto } from '../policies/is_allowed/is_allowed_dto';
import { isAllowedPolicyFactory } from '../policies/is_allowed/is_allowed_factory';
import { isAuthenticatedFactory } from '../policies/is_authenticated/is_authenticated_factory';

export const isAllowedPolicy = (config: IsAllowedPolicyDto) => [
  isAuthenticatedFactory().handle,
  isAllowedPolicyFactory(config).handle,
];

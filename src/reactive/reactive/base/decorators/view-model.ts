import type { ModuleIdentifier } from '../../../core';
import { module } from '../../../core';
import type { ViewModel } from '../interfaces/ViewModel';

/**
 * Auto connect a view model class to the container when import the class
 */
export function viewModel(id: ModuleIdentifier) {
  return function (target: new (...args: any[]) => any) {
    module<ViewModel>(id, { type: 'singleton' })(target);
  };
}

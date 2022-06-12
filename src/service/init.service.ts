export interface InitService {
  init: (isMultiTenant: boolean, tenantId?: string) => Promise<void>;
}

import { getMockReq, getMockRes } from '@jest-mock/express';
import { hasTenantId } from './is-multi-tenant-route.middleware';

describe('Verify tenant ID', () => {
  const { res, next, mockClear } = getMockRes();
  beforeEach(() => {
    mockClear();
  });
  it('should call next when tenant ID is truthy', () => {
    hasTenantId(getMockReq({
      headers: {
        'x-tenant-id': 'tenant-id'
      }
    }), res, next);

    expect(next).toBeCalled();
  });

  it('should respond with 401 when tenant ID is falsy', () => {
    hasTenantId(getMockReq(), res, next);
    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({ error: 'Tenant ID is required' });
    expect(next).not.toBeCalled();
  });
});

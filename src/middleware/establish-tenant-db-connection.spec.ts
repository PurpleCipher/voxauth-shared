import { DB } from '../utility';
import { setDbConnection } from './establish-tenant-db-connection';
import { getMockReq, getMockRes } from '@jest-mock/express';

describe('Set up tenant database connection', () => {
  let middleWare;
  let db: DB;
  let spy: any;
  const { res, next, mockClear } = getMockRes();
  beforeEach(() => {
    db = {
      openConnection: jest.fn(),
    } as any as DB;
    mockClear();
    spy = jest.spyOn(db, 'openConnection');
  });

  describe('single tenant', () => {
    it('should call db with default tenant id when multi-tenancy is set to false', () => {
      middleWare = setDbConnection(false, db);
      middleWare(getMockReq(), res, next);
      expect(spy).toBeCalledWith('default');
      expect(next).toBeCalled();
    });

    it('should call db with default tenant id tenant id is falsy', () => {
      const req = getMockReq({
        headers: {
          'x-tenant-id': undefined
        }
      });
      middleWare = setDbConnection(true, db);
      middleWare(req, res, next);
      expect(spy).toBeCalledWith('default');
      expect(next).toBeCalled();
    });

    it('should error out gracefully when db connection fails', () => {
      const resStatusSpy = jest.spyOn(res, 'status');
      const resJsonSpy = jest.spyOn(res, 'json');
      db = {
        openConnection: jest.fn().mockImplementation(() => {
          throw new Error();
        })
      } as any as DB;

      middleWare = setDbConnection(true, db);
      middleWare(getMockReq(), res, next);
      expect(resStatusSpy).toBeCalledWith(500);
      expect(resJsonSpy).toBeCalledWith({ error: 'Failed to open database connection' });
    })
  })

  describe('multi tenant', () => {

    it('should call db with tenant id when multi-tenancy is set to true', () => {
      const req = getMockReq({
        headers: {
          'x-tenant-id': 'tenant-id'
        }
      });

      middleWare = setDbConnection(true, db);
      middleWare(req, res, next);
      expect(spy).toBeCalledWith('tenant-id');
      expect(next).toBeCalled();
    });

  });
});

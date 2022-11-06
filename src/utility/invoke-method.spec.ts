/** @format */

import axios from 'axios';
import { invokeServiceMethodFromDapr } from './invoke-method';

jest.mock('axios');

describe('Invoke method', () => {
	let thenFn = jest.fn();
	let catchFn = jest.fn();

	beforeEach(() => {
		console.error = jest.fn();
		console.log = jest.fn();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.clearAllMocks();
	});

	describe('invoke payload', () => {
		describe('no payload payload', () => {
			beforeEach(async () => {
				axios.post = jest.fn().mockRejectedValue(new Error());
				await invokeServiceMethodFromDapr
					.invokeMethod({
						serviceName: 'test',
						port: 5000,
						method: 'test',
					})
					.then(thenFn)
					.catch(catchFn);
			});
			it('should call dapr invoke api', () => {
				expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/v1.0/invoke/test/method/test', {});
			});
		});

		describe('no payload provided', () => {
			beforeEach(async () => {
				axios.post = jest.fn().mockRejectedValue(new Error());
				await invokeServiceMethodFromDapr
					.invokeMethod({
						serviceName: 'test',
						port: 5000,
						method: 'test',
						payload: {
							test: 'test123',
						},
					})
					.then(thenFn)
					.catch(catchFn);
			});
			it('should call dapr invoke api', () => {
				expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/v1.0/invoke/test/method/test', {
					test: 'test123',
				});
			});
		});
	});

	describe('when invoke call fails', () => {
		beforeEach(async () => {
			axios.post = jest.fn().mockRejectedValue(new Error());
			await invokeServiceMethodFromDapr
				.invokeMethod({
					serviceName: 'test',
					port: 5000,
					method: 'test',
				})
				.then(thenFn)
				.catch(catchFn);
		});
		it('should not call the then fn', () => {
			expect(thenFn).not.toBeCalled();
		});
		it('should throw error', () => {
			expect(catchFn).toBeCalled();
		});
	});
	describe('when invoke succeeds', () => {
		beforeEach(async () => {
			const res = {
				data: {
					test: 'test',
				},
			};
			axios.post = jest.fn().mockResolvedValue(res);
			await invokeServiceMethodFromDapr
				.invokeMethod({
					serviceName: 'test',
					port: 5000,
					method: 'test',
				})
				.then(thenFn)
				.catch(catchFn);
		});

		it('should not call the then fn', () => {
			expect(thenFn).toBeCalledWith({ test: 'test' });
		});

		it('should throw error', () => {
			expect(catchFn).not.toBeCalled();
		});
	});
});

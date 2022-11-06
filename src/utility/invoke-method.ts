/** @format */

import axios from 'axios';

export interface InvokeMethodConfig<T> {
	serviceName: string;
	port: number;
	method: string;
	payload?: T;
}

const invokeMethod = async <T>(config: InvokeMethodConfig<T>) => {
	try {
		const { data } = await axios.post(
			`http://localhost:${config.port}/v1.0/invoke/${config.serviceName}/method/${config.method}`,
			config.payload ? config.payload : {},
		);
		return data;
	} catch (e) {
		console.error(e);
		throw e;
	}
};

export const invokeServiceMethodFromDapr = {
	invokeMethod,
};

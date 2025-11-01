import { json } from '@sveltejs/kit';
import { fetchModels, type Provider } from '$lib/server/featherless';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const provider = (url.searchParams.get('provider') || 'featherless') as Provider;
	const models = await fetchModels(provider);
	return json(models);
};

import { json } from '@sveltejs/kit';
import { fetchModels } from '$lib/server/featherless';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const models = await fetchModels();
	return json(models);
};

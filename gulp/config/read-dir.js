import { readdir } from 'node:fs/promises';
import { extname } from 'node:path';

export const readDir = async (directoryPath) => {
	const result = {};
	try {
		const files = await readdir(directoryPath);
		// Filtering .js files
		const jsFiles = files.filter(file => extname(file) === '.js');
		// Output of found .js files
		console.log('JS files in the directory: ', jsFiles);

		jsFiles.forEach((file) => {
			const [name] = file.split('.');
			result[name] = `./${file}`;
		});

		return result;
	}
	catch (err) {
		console.error('Error reading directory:', err);
	}
};
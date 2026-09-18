import gulp from 'gulp';

import { plugins } from '../config/plugins.js';
import { filePaths } from '../config/paths.js';
import { logger } from '../config/logger.js';

export const copyRootFiles = () => {
	const config = {
		dot: true,
		allowEmpty: true,
	};

	/** Add files needed in the project root */
	const files = ['favicon.ico', '.htaccess'];

	return gulp.src(plugins.concat(filePaths.srcFolder, files), config)
		.pipe(logger.handleError('COPY ROOT FILES'))
		.pipe(gulp.dest(filePaths.buildFolder));
};
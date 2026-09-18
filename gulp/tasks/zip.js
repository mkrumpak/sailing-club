import gulp from 'gulp';
import del from 'del';
import zipPlugin from 'gulp-zip';

import { filePaths } from '../config/paths.js';
import { logger } from '../config/logger.js';

export const zip = () => {
	del(`./${filePaths.projectDirName}.zip`)
		.then(() => logger.warning('Previous ZIP archive successfully deleted'));

	return gulp.src(`${filePaths.buildFolder}/**/*.*`, { encoding: false })
		.pipe(logger.handleError('ZIP'))
		.pipe(zipPlugin(`${filePaths.projectDirName}.zip`))
		.pipe(gulp.dest('./'));
};
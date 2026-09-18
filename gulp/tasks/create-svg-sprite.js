import gulp from 'gulp';
import svgSprite from 'gulp-svg-sprite';

import { filePaths } from '../config/paths.js';
import { logger } from '../config/logger.js';

export const createSvgSprite = () => {
	return gulp.src(filePaths.src.svgIcons, {})
		.pipe(logger.handleError('COPY ROOT FILES'))
		.pipe(
			svgSprite({
				mode: {
					symbol: {
						sprite: '../sprite.svg',

						/** Create a page with a list of icons */
						example: true,
					},
				},
			}),
		)
		.pipe(gulp.dest(filePaths.srcFolder + '/images'));
};
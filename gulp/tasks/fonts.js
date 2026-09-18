import gulp from 'gulp';
import { existsSync, promises } from 'node:fs';
import fonter from 'gulp-fonter-fix';
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from 'gulp-ttf2woff2';

import { filePaths } from '../config/paths.js';
import { logger } from '../config/logger.js';

const { fontFacesFile } = filePaths.src;
const italicRegex = /italic/i;
const cleanSeparator = /(?:_|__|-|\s)?(italic)/i;

const fontWeights = {
	thin: 100,
	hairline: 100,
	extralight: 200,
	ultralight: 200,
	light: 300,
	regular: 400,
	medium: 500,
	semibold: 600,
	demibold: 600,
	bold: 700,
	extrabold: 800,
	ultrabold: 800,
	black: 900,
	heavy: 900,
	extrablack: 950,
	ultrablack: 950,
};

const fontFaceTemplate = (name, file, weight, style) => `@font-face {
	font-family: ${name};
	font-display: swap;
	src: url("../fonts/${file}.woff2") format("woff2"), url("../fonts/${file}.woff") format("woff");
	font-weight: ${weight};
	font-style: ${style};
}\n\n`;

export const otfToTtf = (done) => {
	if (existsSync(fontFacesFile)) return done();
	/** Search for .otf fonts */
	return gulp.src(`${filePaths.src.fonts}/*.otf`, {encoding: false})
		// .pipe(logger.handleError('FONTS [otfToTtf]'))
		//
		// /** Convert to .ttf */
		// .pipe(fonter({ formats: ['ttf'] }))

		/** Output to the source folder */
		.pipe(gulp.dest(filePaths.src.fonts));
};

export const ttfToWoff = () => {
	if (existsSync(fontFacesFile)) {
		return gulp.src(`${filePaths.src.fonts}/*.woff2`, {encoding: false})
			.pipe(logger.handleError('FONTS [ttfToWoff]'))
			.pipe(gulp.dest(filePaths.build.fonts));
	}
	/** Search for [.ttf] fonts and convert to [.woff2] */
	return gulp.src(`${filePaths.src.fonts}/*.ttf`, {})
		// .pipe(logger.handleError('FONTS [ttfToWoff]'))
		// .pipe(ttf2woff2())
		// .pipe(gulp.dest(filePaths.src.fonts))
		//
		// /** Uncomment if needed. Convert to [.woff] */
		// .pipe(gulp.src(`${filePaths.src.fonts}/*.ttf`))
		// .pipe(fonter({ formats: ['woff'] }))
		// .pipe(gulp.dest(filePaths.build.fonts))

		/** Search for [.woff, .woff2] fonts and output to the final folder */
		.pipe(gulp.src(`${filePaths.src.fonts}/*.{woff,woff2}`))
		.pipe(gulp.dest(filePaths.build.fonts));
};

export const fontStyle = async () => {
	try {
		if (existsSync(fontFacesFile)) {
			logger.warning('The scss/config/_fonts.scss file already exists.\nTo update the file, it must be deleted!');
			return;
		}

		const fontFiles = await promises.readdir(filePaths.build.fonts);

		if (!fontFiles) {
			logger.error('No converted fonts');
			return;
		}

		await promises.writeFile(fontFacesFile, '');
		let newFileOnly;

		for (const file of fontFiles) {
			const [fileName] = file.split('.');

			if (newFileOnly !== fileName) {
				const [name, weight = 'regular'] = fileName.split('-');
				const weightString = fontWeights[weight.replace(cleanSeparator, '').toLowerCase()];
				const fontStyle = italicRegex.test(fileName) ? 'italic' : 'normal';

				await promises.appendFile(fontFacesFile, fontFaceTemplate(name, fileName, weightString, fontStyle));
				newFileOnly = fileName;
			}
		}
	}
	catch (err) {
		logger.error('Error while processing fonts:\n', err);
	}
};
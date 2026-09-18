// Search and replace
import replace from 'gulp-replace';
// Local server for development
import browserSync from 'browser-sync';
// Update check
import newer from 'gulp-newer';

import ifPlugin from 'gulp-if';

const concatPathAndFileName = (path, files) => {
	return files.map((file) => `${path}/${file}`);
};

export const plugins = {
	if: ifPlugin,
	replace,
	browserSync,
	newer,
	concat: concatPathAndFileName,
};
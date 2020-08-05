const { series, dest, watch } = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const electron = require('electron-connect').server.create();

const webpackConfig = require('./webpack.config');

const pack = (cb) => {
  return webpackStream(webpackConfig, webpack)
    .pipe(dest("dist"));
};

const dev = (cb) => {
  electron.start();

  watch('src/**/*', pack);
  watch('*.js', restart);
  watch('dist/**/*', restart);
  cb();
};

const restart = (cb) => {
	electron.restart( '--enable-logging', (state) => {
		if ( state === 'restarted' || state === 'restarting' ) {
			cb(null);
		} else {
			cb('Unexpected state while restarting electron-connect server. State ' + state);
		}
	});
};

const reload = (cb) => {
  electron.reload();
  cb(null);
};

exports.pack = pack;
exports.dev = series(pack, dev);
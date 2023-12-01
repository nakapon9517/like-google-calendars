module.exports = function (api) {
  const babelEnv = api.env();
  api.cache(true);
  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: { '@': './src' },
      },
    ],
  ];

  if (babelEnv !== 'development') {
    plugins.push('transform-remove-console');
  }
  return {
    presets: ['babel-preset-expo'],
    plugins: plugins,
  };
};

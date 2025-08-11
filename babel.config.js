module.exports = {
    plugins: [
        [['babel-plugin-react-compiler', {
            compilationMode: 'annotation',
        }],],
        [['babel-plugin-react-compiler', {
            gating: {
                source: 'ReactCompilerFeatureFlags',
                importSpecifierName: 'isCompilerEnabled',
            },
        }],]
    ],
};
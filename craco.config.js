const CracoAntDesignPlugin = require('craco-antd');

module.exports = {
    plugins: [
        {
            plugin: CracoAntDesignPlugin,
            options: {
                customizeTheme: {
                    'primary-dark':'#001529'
                },
            },
        },
    ],
};
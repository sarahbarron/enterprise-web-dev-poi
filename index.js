'use strict';

const Hapi = require('@hapi/hapi');

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.bind({
    users: {},
    donations: [],
});
async function init() {
    // Register plugins
    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/cookie'));


    // setup the paths to views, layouts and partials &
    // set the templating engine to handlebars
    server.views({
        engines: {
            hbs: require('handlebars'),
        },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layouts',
        partialsPath: './app/views/partials',
        layout: true,
        isCached: false,
    });

    // Initialize the cookie plugin
    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: 'poi',
            password: 'password-should-be-32-characters',
            isSecure: false
        },
    });
    // Set up the session as the default strategy for all routes
    server.auth.default('session');

    // Initialize routes
    server.route(require('./routes'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();
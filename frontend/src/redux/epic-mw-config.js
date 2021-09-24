import * as backendServices from './backend/addressbook-services';

let configuration = { dependencies: { backendServices: backendServices }};

export const epicMiddlewareConfiguration = {
    setBackendServices: (newBackendServices) => {
        configuration.dependencies.backendServices = newBackendServices;
    },
    getConfiguration: () => {
        return configuration;
    }
};
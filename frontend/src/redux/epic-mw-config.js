import { actualBackend } from './backend/backend-services';

let configuration = { dependencies: { backendSvc: actualBackend }};

export const epicMiddlewareConfiguration = {
    setBackendServices: (newBackendSvc) => {
        configuration.dependencies.backendSvc = newBackendSvc;
    },
    getConfiguration: () => {
        return configuration;
    }
};

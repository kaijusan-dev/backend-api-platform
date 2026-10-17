import { generateOpenApi } from '@ts-rest/open-api';
import { apiContract } from '../api.contract.js';

export const openApiDocument = generateOpenApi(
    apiContract,
    {
        info: {
            title: 'Backend API Platform',
            version: '1.0.0',
        },
    }
);
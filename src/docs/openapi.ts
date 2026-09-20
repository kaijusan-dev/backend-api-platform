import { generateOpenApi } from '@ts-rest/open-api';
import { usersContract } from '../modules/users/users.contract.js';

export const openApiDocument = generateOpenApi(
    usersContract,
    {
        info: {
            title: 'Backend API Platform',
            version: '1.0.0',
        },
    }
);
import { generateOpenApi } from '@ts-rest/open-api';
import { type Express } from 'express';
import { type AppRouter } from '@ts-rest/core';
import { apiReference } from '@scalar/express-api-reference';

export const setupDocs = (app: Express, contract: AppRouter) => {
    const openApiDocument = generateOpenApi(contract, {
        info: {
            title: 'Backend API Platform',
            version: '1.0.0',
        },
    });

    app.use('/docs', apiReference({
        spec: {
            content: openApiDocument
        }
    }));
};
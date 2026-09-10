import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';

describe('endpoints /users', () => {

    let userId: number | null = null;

    beforeEach(async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'test',
                email: 'test@gmail.com'
            })
            .expect(201);
        
        userId = response.body.id;
    });

    afterEach(async () => {
        if (userId !== null) {
            await request(app)
                .delete(`/users/${userId}`)
                .expect(204);
            userId = null;
        }
    });

    test('GET /users', async () => {
        const response = await request(app)
            .get('/users')
            .expect(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('GET /users/:id', async () => {
        const response = await request(app)
            .get(`/users/${userId}`)
            .expect(200);

        expect(response.body.username).toBe('test');
        expect(response.body.email).toBe('test@gmail.com');
    });

    test('GET /users/:id - user not found', async () => {
        await request(app)
            .get('/users/99999999')
            .expect(404);
    });

    test('GET /users/:id - invalid id', async () => {
        const response = await request(app)
            .get('/users/invalid')
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });

    test('POST /users', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'test1',
                email: 'test1@gmail.com'
            })
            .expect(201);

        expect(response.body.username).toBe('test1');
        expect(response.body.email).toBe('test1@gmail.com');

        await request(app)
            .delete(`/users/${response.body.id}`)
            .expect(204);
    });

    test('POST /users - invalid body', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 123,
                email: 'not email'
            })
            .expect(400);

        expect(response.body).toHaveProperty('message');
    });

    test('POST /users - conflict', async () => {

        const response = await request(app)
            .post('/users')
            .send({
                username: 'test',
                email: 'test@gmail.com'
            })
            .expect(409);

        expect(response.body).toHaveProperty('message');
    });

    test('DELETE /users/:id', async () => {
        await request(app)
            .delete(`/users/${userId}`)
            .expect(204);
        userId = null;
    });

    test('DELETE /users:id - user not found', async () => {

        const response = await request(app)
            .delete(`/users/9999999`)
            .expect(404);
    });
})
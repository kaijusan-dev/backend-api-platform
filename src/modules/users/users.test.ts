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

    test('POST /users - empty body', async () => {
        const response = await request(app)
            .post('/users')
            .send({})
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

    test('PATCH /users/:id - all fields', async () => {
        const response = await request(app)
            .patch(`/users/${userId}`)
            .send({
                username: 'testUpdated',
                email: 'testUpdated@gmail.com'
            })
            .expect(200);

        expect(response.body.username).toBe('testUpdated');
        expect(response.body.email).toBe('testUpdated@gmail.com');
    });

    test('PATCH /users/:id - one field', async () => {
        const response = await request(app)
            .patch(`/users/${userId}`)
            .send({
                username: 'testUpdated',
            })
            .expect(200);

        expect(response.body.username).toBe('testUpdated');
        expect(response.body.email).toBe('test@gmail.com');
    });

    test('PATCH /users/:id - user not found', async () => {
        await request(app)
            .patch(`/users/9999999`)
            .send({
                username: 'testUpdated',
                email: 'testUpdated@gmail.com'
            })
            .expect(404);
    });

    test('PATCH /users/:id - invalid id', async () => {
        await request(app)
            .patch(`/users/invalid`)
            .send({
                username: 'testUpdated',
                email: 'testUpdated@gmail.com'
            })
            .expect(400);
    });

    test('PATCH /users/:id - invalid body', async () => {
        await request(app)
            .patch(`/users/${userId}`)
            .send({
                username: 123,
                email: 'not email'
            })
            .expect(400);
    });

    test('PATCH /users/:id - empty body', async () => {
        await request(app)
            .patch(`/users/${userId}`)
            .send({})
            .expect(400);
    });

    test('PATCH /users/:id - conflict', async () => {

        const user2 = await request(app)
            .post('/users')
            .send({
                username: 'test2',
                email: 'test2@gmail.com'
            })
            .expect(201);

        await request(app)
            .patch(`/users/${userId}`)
            .send({
                username: 'test2',
                email: 'test2@gmail.com'
            })
            .expect(409);

        await request(app)
            .delete(`/users/${user2.body.id}`)
            .expect(204);
    });

    test('DELETE /users/:id', async () => {
        await request(app)
            .delete(`/users/${userId}`)
            .expect(204);
        userId = null;
    });

    test('DELETE /users/:id - user not found', async () => {

        await request(app)
            .delete(`/users/9999999`)
            .expect(404);
    });
})
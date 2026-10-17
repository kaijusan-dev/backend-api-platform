import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import prisma from '../../shared/database/prisma.js';
import * as bcrypt from 'bcrypt';

const createTestUser = async (count: number) => {
    const createdUsers = [];

    const passwordHash = await bcrypt.hash('testPassword', 1);

    for (let i = 0; i < count; i++ ) {
        const response = await request(app)
            .post('/users')
            .send({
                username: `test${i}`,
                email: `test${i}@gmail.com`,
                passwordHash
            })
            .expect(201);
        createdUsers.push(response.body);
    };

    return createdUsers;
};

describe('endpoints /users', () => {

    let userId: number | null = null;

    beforeEach(async () => {
        await prisma.user.deleteMany();

        const response = await createTestUser(25);

        userId = response[0]?.id;
    });

    test('GET /users', async () => {
        const response = await request(app)
            .get('/users')
            .expect(200);
        expect(response.body.data).toBeInstanceOf(Array);
        for (const user of response.body.data) {
            expect(user).not.toHaveProperty('passwordHash');
        };
    });

    test('GET /users - pagination', async () => {
        const response = await request(app)
            .get('/users?page=2&limit=10')
            .expect(200);

        expect(response.body.data[0].username).toBe('test10');        
    });

    test('GET /users - username filter', async () => {
        const response = await request(app)
            .get('/users?username=tESt3')
            .expect(200);
        expect(response.body.data[0].username).toBe('test3');
    });

    test('GET /users - total', async () => {
        const response1 = await request(app)
            .get('/users?username=tESt3')
            .expect(200);
        expect(response1.body.data[0].username).toBe('test3');
        
        expect(response1.body.meta.total).toBe(1);
        expect(response1.body.meta.totalPages).toBe(1);

        const response2 = await request(app)
            .get('/users')
            .expect(200);

        // default limit = 10
        expect(response2.body.meta.totalPages).toBe(3);        
    });

    test('GET /users - asc / desc order', async () => {
        const response1 = await request(app)
            .get('/users?sortBy=id&orderBy=asc')
            .expect(200);
    
        expect(response1.body.data[0].username).toBe('test0');

        const response2 = await request(app)
            .get('/users?sortBy=id&orderBy=desc')
            .expect(200);

        expect(response2.body.data[0].username).toBe('test24');
    });

    test('GET /users - pagination & sort & username filter', async () => {
        const response = await request(app)
            .get('/users?page=2&limit=10&sortBy=id&orderBy=desc&username=test')
            .expect(200);

        expect(response.body.data[0].username).toBe('test14');  
        expect(response.body.meta.total).toBe(25);  
        expect(response.body.meta.totalPages).toBe(3);     
    });

    test('GET /users - empty data', async () => {
        const response = await request(app)
            .get('/users?username=unknown')
            .expect(200);
        expect(response.body.data).toEqual([]);
        expect(response.body.meta.total).toBe(0);
        expect(response.body.meta.totalPages).toBe(0);
    });

    test('GET /users - invalid sortBy / orderBy', async () => {
        await request(app)
            .get('/users?sortBy=unknown')
            .expect(400);
        await request(app)
            .get('/users?sortBy=id&orderBy=unknown')
            .expect(400);
    });

    test('GET /users/:id', async () => {
        const response = await request(app)
            .get(`/users/${userId}`)
            .expect(200);

        expect(response.body.username).toBe('test0');
        expect(response.body.email).toBe('test0@gmail.com');
    });

    test('GET /users/:id - user not found', async () => {
        await request(app)
            .get('/users/99999999')
            .expect(404);
    });

    test('GET /users/:id - invalid id', async () => {
        await request(app)
            .get('/users/invalid')
            .expect(400);
    });

    test('POST /users', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'test123',
                email: 'test123@gmail.com',
                passwordHash: 'testPassword'
            })
            .expect(201);

        expect(response.body.username).toBe('test123');
        expect(response.body.email).toBe('test123@gmail.com');

        await request(app)
            .delete(`/users/${response.body.id}`)
            .expect(204);
    });

    test('POST /users - invalid body', async () => {
        await request(app)
            .post('/users')
            .send({
                username: 123,
                email: 'not email',
                passwordHash: 'not password'
            })
            .expect(400);
    });

    test('POST /users - empty body', async () => {
        await request(app)
            .post('/users')
            .send({})
            .expect(400);
    });

    test('POST /users - conflict', async () => {

        await request(app)
            .post('/users')
            .send({
                username: 'test123',
                email: 'test123@gmail.com',
                passwordHash: 'testPassword'
            })
            .expect(201);

        await request(app)
            .post('/users')
            .send({
                username: 'test123',
                email: 'test123@gmail.com',
                passwordHash: 'testPassword'
            })
            .expect(409);
    });

    test('PATCH /users/:id - all fields', async () => {
        const response = await request(app)
            .patch(`/users/${userId}`)
            .send({
                username: 'testUpdated',
                email: 'testUpdated@gmail.com',
                passwordHash: 'testPassword'
            })
            .expect(200);

        expect(response.body.username).toBe('testUpdated');
        expect(response.body.email).toBe('testUpdated@gmail.com');
    });

    test('PATCH /users/:id - one field', async () => {
        const response = await request(app)
            .patch(`/users/${userId}`)
            .send({
                username: 'testPatched',
            })
            .expect(200);

        expect(response.body.username).toBe('testPatched');
        expect(response.body.email).toBe('test0@gmail.com');
    });

    test('PATCH /users/:id - user not found', async () => {
        await request(app)
            .patch(`/users/9999999`)
            .send({
                username: 'testUpdated',
                email: 'testUpdated@gmail.com',
                passwordHash: 'testUpdated'
            })
            .expect(404);
    });

    test('PATCH /users/:id - invalid id', async () => {
        await request(app)
            .patch(`/users/invalid`)
            .send({
                username: 'testUpdated',
                email: 'testUpdated@gmail.com',
                passwordHash: 'testUpdated'
            })
            .expect(400);
    });

    test('PATCH /users/:id - invalid body', async () => {
        await request(app)
            .patch(`/users/${userId}`)
            .send({
                username: 123,
                email: 'not email',
                passwordHash: 123
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
                username: 'test123',
                email: 'test123@gmail.com',
                passwordHash: 'testPassword'
            })
            .expect(201);

        await request(app)
            .patch(`/users/${userId}`)
            .send({
                username: 'test123',
                email: 'test123@gmail.com',
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
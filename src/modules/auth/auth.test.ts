import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import prisma from '../../database/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

describe('Auth & Users endpoints', () => {

    let userId: number | null = null;

    beforeEach(async () => {

        await prisma.user.deleteMany();

        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'test',
                email: 'test@gmail.com',
                password: 'testPassword'
            })
            .expect(201);
        
        userId = response.body.user.id;
    });

    test('POST /auth/register', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                username: 'registerTest',
                email: 'registerTest@gmail.com',
                password: 'testPassword'
            })
            .expect(201);

        expect(response.body.user.username).toBe('registerTest');
        expect(response.body.user.email).toBe('registerTest@gmail.com');
        expect(response.body.user.passwordHash).toBeUndefined();
        expect(response.body).toHaveProperty('accessToken');

        await request(app)
            .delete(`/users/${response.body.user.id}`)
            .expect(204);
    });

    test('POST /auth/register - conflict', async () => {

        await request(app)
            .post('/auth/register')
            .send({
                username: 'test',
                email: 'test@gmail.com',
                password: 'testPassword'
            })
            .expect(409);
    });

    test('POST /auth/register - invalid body', async () => {
        await request(app)
            .post('/auth/register')
            .send({
                username: 123,
                email: 123,
                password: 123
            })
            .expect(400);
    });

    test('POST /auth/login', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                username: 'test',
                password: 'testPassword'
            })
            .expect(200); 

        expect(response.body.user.username).toBe('test');
        expect(response.body.user.email).toBe('test@gmail.com');
        expect(response.body.user.passwordHash).toBeUndefined();
        expect(response.body).toHaveProperty('accessToken');
    });

    test('POST /auth/login - wrong password', async () => {

        await request(app)
            .post('/auth/login')
            .send({
                username: 'test',
                password: 'wrongPassword'
            })
            .expect(401);
    });

    test('POST /auth/login - unknown username', async () => {

        await request(app)
            .post('/auth/login')
            .send({
                username: 'unknown',
                password: 'testPassword'
            })
            .expect(404);
    });

    test('GET /users/me', async () => {

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                username: 'test',
                password: 'testPassword'
            })
            .expect(200);
            
        const token = loginResponse.body.accessToken;

        const response = await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body.username).toBe('test');
        expect(response.body.email).toBe('test@gmail.com');
        expect(response.body.passwordHash).toBeUndefined();
    });

    test('GET /users/me - no Authorization', async () => {
        await request(app)
            .get('/users/me')
            .expect(401);
    });

    test('GET /users/me - invalid token', async () => {
        await request(app)
            .get('/users/me')
            .set('Authorization', 'Bearer some-invalid-token')
            .expect(401);
    });

    test('GET /users/me - expired token', async () => {
        const expiredToken = jwt.sign(
            { userId },
            env.JWT_SECRET,
            { expiresIn: -1 }
        );

        await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${expiredToken}`)
            .expect(401);
    });
})
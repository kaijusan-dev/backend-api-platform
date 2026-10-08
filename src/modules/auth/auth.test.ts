import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import prisma from '../../database/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import bcrypt from 'bcrypt';

describe('Auth & Users endpoints', () => {

    let userId: number | null = null;

    beforeEach(async () => {

        await prisma.refreshToken.deleteMany();
        await prisma.user.deleteMany();

        const passwordHash = await bcrypt.hash('testPassword', 10);

        const user = await prisma.user.create({
            data: {
                username: 'test',
                email: 'test@gmail.com',
                passwordHash
            }
        });
        
        userId = user.id;
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

    test('POST /auth/refresh', async () => {

        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                username: 'test',
                password: 'testPassword'
            })
            .expect(200);
            
        const refreshToken = loginResponse.body.refreshToken;

        const response = await request(app)
            .post('/auth/refresh')
            .send({
                refreshToken
            })
            .expect(200);

        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });

    test('POST /auth/refresh - deleted token', async () => {
        const loginResponse1 = await request(app)
            .post('/auth/login')
            .send({
                username: 'test',
                password: 'testPassword'
            })
            .expect(200);
            
        const refreshToken1 = loginResponse1.body.refreshToken;

        await prisma.refreshToken.delete({
            where: { token: refreshToken1 }
        });

        const response = await request(app)
            .post('/auth/refresh')
            .send({
                refreshToken: refreshToken1
            })
            .expect(401);

        expect(response.body.message).toBe('token_expired'); 
    });

    test('POST /auth/refresh - invalid token', async () => {
        await request(app)
            .post('/auth/refresh')
            .send({
                refreshToken: 'some invalid token'
            })
            .expect(401);
    });

    test('POST /auth/refresh - expired token', async () => {
        const expiredToken = jwt.sign(
            { userId },
            env.JWT_SECRET,
            { expiresIn: -1 }
        );

        await request(app)
            .post('/auth/refresh')
            .send({
                refreshToken: expiredToken
            })
            .expect(401);
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
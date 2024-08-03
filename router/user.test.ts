import request from 'supertest';
import app from '../apps'; // Update this path according to your project structure
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/user'; // Update this path according to your project structure
import jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let userToken: string;
let testUserId: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    // Create an admin and a regular user for testing
    const admin = await User.create({ email: 'admin@example.com', password: 'admin123', role: 'admin' });
    const user = await User.create({ email: 'user@example.com', password: 'user123', role: 'user' });
    testUserId = user._id.toString();

    // Generate tokens
    adminToken = jwt.sign({ userId: admin._id, role: 'admin' }, 'your_jwt_secret', { expiresIn: '1h' });
    userToken = jwt.sign({ userId: user._id, role: 'user' }, 'your_jwt_secret', { expiresIn: '1h' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User API Endpoints', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/register')
            .send({
                email: 'newuser@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('newuser@example.com');
    });

    it('should update a user', async () => {
        const response = await request(app)
            .post('/updateuser')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                email: 'updateduser@example.com'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('updateduser@example.com');
    });

    it('should get a user by ID', async () => {
        const response = await request(app)
            .get('/getuserbyid')
            .set('Authorization', `Bearer ${userToken}`)
            .query({ userId: testUserId });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('user@example.com');
    });

    it('should return 403 for unauthorized access to get users page', async () => {
        const response = await request(app)
            .get('/getuserspage')
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403);
    });

    it('should delete a user', async () => {
        const response = await request(app)
            .post('/deleteuser')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ userId: testUserId });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User deleted successfully');
    });

    it('should get all users as admin', async () => {
        const response = await request(app)
            .get('/admin/getallusers')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('users');
        expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should delete a user as admin', async () => {
        const user = await User.create({ email: 'todelete@example.com', password: 'password123', role: 'user' });
        const userId = user._id.toString();

        const response = await request(app)
            .post('/admin/deleteuser')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ userId });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User deleted successfully');
    });
});

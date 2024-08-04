import request from 'supertest';
import express from 'express';
import authRouter from './auth'; 

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
  it('should authenticate a user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'abenezergetachew1990@gmail.com',
        password: '0923931869',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data).toHaveProperty('firstName');
    expect(response.body.data).toHaveProperty('lastName');
    expect(response.body.data).toHaveProperty('role');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('authenticated');
    expect(response.body.data).toHaveProperty('wallet');
    expect(response.body.code).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return 400 for missing email or password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email and password are required');
    expect(response.body.code).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('should return 401 for invalid email or password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
    expect(response.body.code).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

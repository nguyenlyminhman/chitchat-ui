'use client'

import { useEffect, useState } from 'react'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice'
import { fetchUsers, ae } from '@/store/slices/usersSlice';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.auth)
  const { data } = useAppSelector((state) => state.users)
  const { login } = useAuth()
  const router = useRouter()


  console.log('fetchUsers', data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginStart())


    try {
      await login(email, password)
      const userData = {
        id: '1',
        username: email.split('@')[0],
        email: email
      }
      dispatch(loginSuccess(userData))
      router.push('/chat')
    } catch (error) {
      dispatch(loginFailure('Invalid email or password'))
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-primary bg-gradient">
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <Card className="shadow-lg border-0 rounded-lg">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue to ChitChat</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-4"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Don&apos;t have an account?{' '}
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => router.push('/register')}
                      >
                        Create Account
                      </Button>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
} 
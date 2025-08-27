'use client'

import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerUser } from '@/store/slices/usersSlice'

const validRegistrationFormSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').min(3, 'Must be at least 3 characters'),
  email: Yup.string().required('Email is required').email('Invalid email'),
  password: Yup.string().required('Password is required').min(3, 'Must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const { registerLoading, registerError } = useAppSelector((state) => state.users)
  const router = useRouter()

  const formik = useFormik({ 
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validRegistrationFormSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { confirmPassword, ...userData } = values
        await dispatch(registerUser(userData)).unwrap()
        router.push('/login')
      } catch (e) {
        console.error('Registration failed:', e)
      } finally {
        setSubmitting(false)
      }
    }
  });

  return (
    <div className="min-vh-100 d-flex align-items-center bg-primary bg-gradient">
      <Container className="py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <Card className="shadow-lg border-0 rounded-lg">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">Create Account</h2>
                  <p className="text-muted">Join ChitChat today</p>
                </div>

                {registerError && (
                  <Alert variant="danger" className="mb-4">
                    {registerError}
                  </Alert>
                )}

                <Form onSubmit={formik.handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.username && !!formik.errors.username}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.username as string}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.email && !!formik.errors.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email as string}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Create a password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.password && !!formik.errors.password}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password as string}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmPassword as string}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 mb-4"
                    disabled={formik.isSubmitting || registerLoading}
                  >
                    {(formik.isSubmitting || registerLoading) ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Already have an account?{' '}
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={() => router.push('/login')}
                      >
                        Sign In
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
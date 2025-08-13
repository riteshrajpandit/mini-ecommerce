import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Alert,
  Group,
  Anchor,
  Divider,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import { IconMail, IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, getUserProfile, clearError } from '../store/slices/authSlice';
import { setAuthenticationStatus } from '../store/slices/cartSlice';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ opened, onClose }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showDemo, setShowDemo] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(loginUser(formData));
      
      if (loginUser.fulfilled.match(result)) {
        // Set authentication status in cart
        dispatch(setAuthenticationStatus(true));
        
        // Get user profile
        await dispatch(getUserProfile());
        
        // Close modal and reset form
        onClose();
        setFormData({ email: '', password: '' });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'john@mail.com',
      password: 'changeme',
    });
    setShowDemo(false);
  };

  const handleClose = () => {
    onClose();
    setFormData({ email: '', password: '' });
    dispatch(clearError());
    setShowDemo(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Sign In"
      size="md"
      centered
      styles={{
        title: {
          fontWeight: 600,
          fontSize: '1.25rem',
          color: '#212529',
        },
      }}
    >
      <Box pos="relative">
        <LoadingOverlay visible={isLoading} />
        
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
                styles={{
                  root: {
                    backgroundColor: '#fff5f5',
                    border: '1px solid #fed7d7',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {showDemo && (
              <Alert
                color="blue"
                variant="light"
                styles={{
                  root: {
                    backgroundColor: '#ebf8ff',
                    border: '1px solid #bee3f8',
                  },
                }}
              >
                <Text size="sm" mb="xs" fw={500}>Demo Credentials:</Text>
                <Text size="sm">Email: john@mail.com</Text>
                <Text size="sm">Password: changeme</Text>
                <Button
                  size="xs"
                  variant="light"
                  color="blue"
                  mt="xs"
                  onClick={handleDemoLogin}
                >
                  Use Demo Credentials
                </Button>
              </Alert>
            )}

            <TextInput
              label="Email"
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              leftSection={<IconMail size={16} />}
              styles={{
                label: {
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                },
                input: {
                  borderColor: '#e9ecef',
                  '&:focus': {
                    borderColor: '#495057',
                  },
                },
              }}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              leftSection={<IconLock size={16} />}
              styles={{
                label: {
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                },
                input: {
                  borderColor: '#e9ecef',
                  '&:focus': {
                    borderColor: '#495057',
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              size="md"
              variant="filled"
              color="dark"
              radius="md"
              loading={isLoading}
              style={{
                backgroundColor: '#212529',
                fontWeight: 500,
                marginTop: '0.5rem',
              }}
            >
              Sign In
            </Button>

            <Divider 
              label="Demo Account" 
              labelPosition="center" 
              styles={{
                label: {
                  color: '#6c757d',
                  fontSize: '0.875rem',
                },
              }}
            />

            <Group justify="center">
              <Anchor
                size="sm"
                onClick={() => setShowDemo(!showDemo)}
                style={{
                  color: '#495057',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                {showDemo ? 'Hide demo credentials' : 'Need demo credentials?'}
              </Anchor>
            </Group>

            <Text size="xs" c="dimmed" ta="center" mt="md">
              This is a demo application. Use the demo credentials above to test the authentication flow.
            </Text>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default LoginModal;

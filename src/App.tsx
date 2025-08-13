
import React, { useEffect, useState } from 'react';
import { 
  AppShell, 
  Title, 
  Container, 
  Group, 
  ActionIcon,
  Indicator,
  Popover,
  Button,
} from '@mantine/core';
import { IconShoppingCart, IconLogin } from '@tabler/icons-react';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import LoginModal from './components/LoginModal';
import UserProfile from './components/UserProfile';
import DashboardModal from './components/DashboardModal';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { restoreTokensFromCookies, getUserProfile } from './store/slices/authSlice';
import { setAuthenticationStatus } from './store/slices/cartSlice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => 
    state.cart.isAuthenticated ? state.cart.items : state.cart.guestCart
  );
  
  const [cartOpened, setCartOpened] = useState(false);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const [dashboardModalOpened, setDashboardModalOpened] = useState(false);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Initialize authentication state on app load
  useEffect(() => {
    dispatch(restoreTokensFromCookies());
    dispatch(setAuthenticationStatus(isAuthenticated));
    
    if (isAuthenticated && !user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  // Update cart authentication status when auth state changes
  useEffect(() => {
    dispatch(setAuthenticationStatus(isAuthenticated));
  }, [dispatch, isAuthenticated]);

  return (
    <ModalsProvider>
      <Notifications position="top-right" />
      <AppShell
        header={{ height: 70 }}
        padding="md"
        styles={{
          main: {
            backgroundColor: '#fafafa',
            minHeight: '100vh',
          },
        }}
      >
        <AppShell.Header 
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e9ecef',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Container size="xl" h="100%">
            <Group justify="space-between" h="100%" px="md">
              <Title 
                order={1} 
                size="h2"
                style={{
                  color: '#212529',
                  fontWeight: 600,
                  letterSpacing: '-0.025em',
                }}
              >
                Store
              </Title>
              
              <Group gap="sm">
                {/* Authentication Section */}
                {isAuthenticated ? (
                  <UserProfile onDashboardOpen={() => setDashboardModalOpened(true)} />
                ) : (
                  <Button
                    leftSection={<IconLogin size={16} />}
                    variant="light"
                    color="gray"
                    size="sm"
                    radius="md"
                    onClick={() => setLoginModalOpened(true)}
                    style={{
                      border: '1px solid #e9ecef',
                      backgroundColor: '#ffffff',
                      color: '#495057',
                      fontWeight: 500,
                    }}
                  >
                    Sign In
                  </Button>
                )}

                {/* Cart Section */}
                <Popover
                  width={400}
                  position="bottom-end"
                  withArrow
                  shadow="md"
                  opened={cartOpened}
                  onChange={setCartOpened}
                >
                  <Popover.Target>
                    <Indicator
                      inline
                      label={itemCount > 0 ? itemCount : null}
                      size={16}
                      offset={7}
                      position="top-end"
                      color="red"
                      disabled={itemCount === 0}
                    >
                      <ActionIcon
                        variant="light"
                        size="lg"
                        radius="md"
                        color="gray"
                        onClick={() => setCartOpened(!cartOpened)}
                        style={{
                          border: '1px solid #e9ecef',
                          backgroundColor: '#ffffff',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <IconShoppingCart size={20} />
                      </ActionIcon>
                    </Indicator>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Cart onClose={() => setCartOpened(false)} />
                  </Popover.Dropdown>
                </Popover>
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main>
          <Container size="xl">
            <ProductList />
          </Container>
        </AppShell.Main>
      </AppShell>

      {/* Modals */}
      <LoginModal 
        opened={loginModalOpened} 
        onClose={() => setLoginModalOpened(false)} 
      />
      <DashboardModal 
        opened={dashboardModalOpened} 
        onClose={() => setDashboardModalOpened(false)} 
      />
    </ModalsProvider>
  );
};

export default App;
import React, { useMemo, useCallback } from 'react';
import {
  Card,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Image,
  Divider,
  NumberFormatter,
  ActionIcon,
  Box,
  ScrollArea,
  Badge,
} from '@mantine/core';
import { IconTrash, IconMinus, IconPlus, IconShoppingCart, IconUser } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

interface CartProps {
  onClose?: () => void;
}

const Cart: React.FC<CartProps> = React.memo(({ onClose }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items, guestCart } = useAppSelector((state) => state.cart);
  
  // Use appropriate cart based on authentication status
  const cart = isAuthenticated ? items : guestCart;

  const totalPrice = useMemo(() => 
    cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const handleUpdateQuantity = useCallback((id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(id));
      notifications.show({
        title: 'Item Removed',
        message: 'Item has been removed from your cart',
        color: 'blue',
      });
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  }, [dispatch]);

  const handleRemoveItem = useCallback((id: number, title: string) => {
    dispatch(removeFromCart(id));
    notifications.show({
      title: 'Item Removed',
      message: `${title} has been removed from your cart`,
      color: 'blue',
    });
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    if (!isAuthenticated) {
      notifications.show({
        title: 'Guest Checkout',
        message: 'Proceeding with guest checkout. Sign in to save your cart!',
        color: 'orange',
      });
    } else {
      notifications.show({
        title: 'Checkout',
        message: 'Redirecting to secure checkout...',
        color: 'blue',
      });
    }
    onClose?.();
  }, [isAuthenticated, onClose]);

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
    notifications.show({
      title: 'Cart Cleared',
      message: 'All items have been removed from your cart',
      color: 'blue',
    });
  }, [dispatch]);

  return (
    <Box style={{ width: '100%' }}>
      <Group justify="space-between" mb="md">
        <Group gap="sm">
          <IconShoppingCart size={18} color="#495057" />
          <Title order={4} size="h5" c="#212529">
            Cart
          </Title>
          {cart.length > 0 && (
            <Text size="sm" c="dimmed">
              ({cart.reduce((total, item) => total + item.quantity, 0)} items)
            </Text>
          )}
        </Group>
        {!isAuthenticated && cart.length > 0 && (
          <Badge 
            size="xs" 
            variant="light" 
            color="orange"
            leftSection={<IconUser size={10} />}
          >
            Guest
          </Badge>
        )}
      </Group>

      {cart.length === 0 ? (
        <Box ta="center" py="md">
          <IconShoppingCart size={40} color="#ced4da" style={{ margin: '0 auto 0.5rem' }} />
          <Text c="dimmed" size="sm" mb="xs">
            Your cart is empty
          </Text>
          <Text c="dimmed" size="xs">
            {isAuthenticated 
              ? 'Add some products to get started' 
              : 'Sign in to save items or continue as guest'
            }
          </Text>
        </Box>
      ) : (
        <>
          <ScrollArea h={300} type="auto">
            <Stack gap="sm">
              {cart.map((item) => (
                <Card
                  key={item.id}
                  padding="xs"
                  radius="sm"
                  withBorder
                  style={{
                    border: '1px solid #f1f3f4',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Group gap="xs" align="start">
                    <Image
                      src={item.image}
                      alt={item.title}
                      w={40}
                      h={40}
                      fit="contain"
                      radius="sm"
                      style={{
                        backgroundColor: '#ffffff',
                        padding: '0.25rem',
                      }}
                    />
                    
                    <Stack gap="xs" flex={1}>
                      <Text size="xs" fw={500} lineClamp={1}>
                        {item.title}
                      </Text>
                      
                      <Group justify="space-between" align="center">
                        <NumberFormatter
                          value={item.price}
                          prefix="$"
                          decimalScale={2}
                          style={{
                            fontWeight: 500,
                            color: '#212529',
                            fontSize: '0.75rem',
                          }}
                        />
                        
                        <Group gap="xs" align="center">
                          <ActionIcon
                            variant="light"
                            color="gray"
                            size="xs"
                            radius="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <IconMinus size={10} />
                          </ActionIcon>
                          
                          <Text fw={500} style={{ minWidth: '1rem', textAlign: 'center' }} size="xs">
                            {item.quantity}
                          </Text>
                          
                          <ActionIcon
                            variant="light"
                            color="gray"
                            size="xs"
                            radius="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <IconPlus size={10} />
                          </ActionIcon>
                          
                          <ActionIcon
                            variant="light"
                            color="red"
                            size="xs"
                            radius="sm"
                            onClick={() => handleRemoveItem(item.id, item.title)}
                          >
                            <IconTrash size={10} />
                          </ActionIcon>
                        </Group>
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>
          </ScrollArea>

          <Divider my="sm" />

          {!isAuthenticated && (
            <Text size="xs" c="orange" ta="center" mb="xs">
              ⚠️ Cart will be cleared when you leave. Sign in to save items!
            </Text>
          )}

          <Group justify="space-between" align="center" mb="sm">
            <Text size="md" fw={600}>
              Total:
            </Text>
            <Text
              size="md"
              fw={600}
              c="#212529"
            >
              <NumberFormatter
                value={totalPrice}
                prefix="$"
                decimalScale={2}
              />
            </Text>
          </Group>

          <Stack gap="xs">
            <Button
              fullWidth
              size="sm"
              variant="filled"
              color="dark"
              radius="md"
              style={{
                fontWeight: 500,
              }}
              onClick={handleCheckout}
            >
              {isAuthenticated ? 'Checkout' : 'Checkout as Guest'}
            </Button>
            
            {cart.length > 1 && (
              <Button
                fullWidth
                size="xs"
                variant="light"
                color="red"
                radius="md"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
});

export default Cart;
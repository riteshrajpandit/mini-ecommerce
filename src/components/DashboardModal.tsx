import React from 'react';
import {
  Modal,
  Text,
  Stack,
  Group,
  Avatar,
  Card,
  Badge,
  SimpleGrid,
  ThemeIcon,
  Box,
  Divider,
  Title,
} from '@mantine/core';
import { 
  IconShoppingBag, 
  IconHeart, 
  IconStar,
  IconCalendar,
  IconMail,
  IconMapPin,
} from '@tabler/icons-react';
import { useAppSelector } from '../store/hooks';

interface DashboardModalProps {
  opened: boolean;
  onClose: () => void;
}

const DashboardModal: React.FC<DashboardModalProps> = ({ opened, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  if (!user) return null;

  const totalCartValue = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const stats = [
    {
      title: 'Cart Items',
      value: items.length.toString(),
      icon: IconShoppingBag,
      color: 'blue',
    },
    {
      title: 'Cart Value',
      value: `$${totalCartValue.toFixed(2)}`,
      icon: IconStar,
      color: 'green',
    },
    {
      title: 'Wishlist',
      value: '0',
      icon: IconHeart,
      color: 'red',
    },
    {
      title: 'Orders',
      value: '0',
      icon: IconCalendar,
      color: 'orange',
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Dashboard"
      size="lg"
      centered
      styles={{
        title: {
          fontWeight: 600,
          fontSize: '1.5rem',
          color: '#212529',
        },
      }}
    >
      <Stack gap="lg">
        {/* User Info Card */}
        <Card
          padding="lg"
          radius="md"
          withBorder
          style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
          }}
        >
          <Group>
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="xl"
              radius="xl"
              style={{
                border: '3px solid #ffffff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Stack gap="xs" flex={1}>
              <Group>
                <Title order={3} size="h4" c="#212529">
                  {user.name}
                </Title>
                <Badge
                  variant="light"
                  color="blue"
                  size="md"
                  style={{ textTransform: 'capitalize' }}
                >
                  {user.role}
                </Badge>
              </Group>
              <Group gap="lg">
                <Group gap="xs">
                  <ThemeIcon variant="light" color="gray" size="sm">
                    <IconMail size={14} />
                  </ThemeIcon>
                  <Text size="sm" c="dimmed">
                    {user.email}
                  </Text>
                </Group>
                <Group gap="xs">
                  <ThemeIcon variant="light" color="gray" size="sm">
                    <IconMapPin size={14} />
                  </ThemeIcon>
                  <Text size="sm" c="dimmed">
                    Customer
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Group>
        </Card>

        {/* Stats Grid */}
        <div>
          <Title order={4} size="h5" mb="md" c="#212529">
            Account Overview
          </Title>
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
            {stats.map((stat) => (
              <Card
                key={stat.title}
                padding="md"
                radius="md"
                withBorder
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e9ecef',
                  textAlign: 'center',
                }}
              >
                <ThemeIcon
                  variant="light"
                  color={stat.color}
                  size="lg"
                  radius="xl"
                  mx="auto"
                  mb="xs"
                >
                  <stat.icon size={20} />
                </ThemeIcon>
                <Text size="xl" fw={600} c="#212529">
                  {stat.value}
                </Text>
                <Text size="sm" c="dimmed">
                  {stat.title}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </div>

        {/* Recent Activity */}
        <div>
          <Title order={4} size="h5" mb="md" c="#212529">
            Recent Activity
          </Title>
          <Card
            padding="lg"
            radius="md"
            withBorder
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e9ecef',
            }}
          >
            <Stack gap="md">
              {items.length > 0 ? (
                items.slice(0, 3).map((item) => (
                  <Box key={item.id}>
                    <Group justify="space-between">
                      <Group gap="sm">
                        <ThemeIcon variant="light" color="blue" size="sm">
                          <IconShoppingBag size={14} />
                        </ThemeIcon>
                        <div>
                          <Text size="sm" fw={500} lineClamp={1}>
                            Added {item.title} to cart
                          </Text>
                          <Text size="xs" c="dimmed">
                            Quantity: {item.quantity}
                          </Text>
                        </div>
                      </Group>
                      <Text size="sm" fw={500} c="#212529">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </Group>
                    {items.indexOf(item) < Math.min(items.length - 1, 2) && (
                      <Divider mt="md" />
                    )}
                  </Box>
                ))
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  No recent activity. Start shopping to see your activity here!
                </Text>
              )}
            </Stack>
          </Card>
        </div>
      </Stack>
    </Modal>
  );
};

export default DashboardModal;

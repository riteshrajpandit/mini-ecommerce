import React from 'react';
import {
  Avatar,
  Text,
  Stack,
  Group,
  Badge,
  ActionIcon,
  Menu,
} from '@mantine/core';
import { 
  IconUser, 
  IconLogout, 
  IconSettings, 
  IconChevronDown,
  IconShoppingBag,
} from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';
import { setAuthenticationStatus } from '../store/slices/cartSlice';

interface UserProfileProps {
  onDashboardOpen: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onDashboardOpen }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const handleLogout = async () => {
    dispatch(setAuthenticationStatus(false));
    await dispatch(logoutUser());
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Menu shadow="md" width={250} position="bottom-end" withArrow>
      <Menu.Target>
        <Group gap="xs" style={{ cursor: 'pointer' }}>
          <Avatar
            src={user.avatar}
            alt={user.name}
            size="sm"
            radius="xl"
            style={{
              border: '2px solid #e9ecef',
              transition: 'all 0.2s ease',
            }}
          />
          <Group gap={4} visibleFrom="sm">
            <Text 
              size="sm" 
              fw={500} 
              c="#212529"
              style={{ maxWidth: '120px' }}
              truncate
            >
              {user.name}
            </Text>
            <ActionIcon variant="transparent" size="xs" c="gray">
              <IconChevronDown size={12} />
            </ActionIcon>
          </Group>
        </Group>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '0.5rem',
        }}
      >
        <Menu.Label>
          <Group gap="sm" mb="xs">
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="md"
              radius="xl"
            />
            <Stack gap={2}>
              <Text size="sm" fw={500} c="#212529">
                {user.name}
              </Text>
              <Text size="xs" c="dimmed">
                {user.email}
              </Text>
              <Badge
                size="xs"
                variant="light"
                color="blue"
                style={{ textTransform: 'capitalize' }}
              >
                {user.role}
              </Badge>
            </Stack>
          </Group>
        </Menu.Label>

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconUser size={16} />}
          onClick={onDashboardOpen}
          style={{
            borderRadius: '6px',
            padding: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          Dashboard
        </Menu.Item>

        <Menu.Item
          leftSection={<IconShoppingBag size={16} />}
          style={{
            borderRadius: '6px',
            padding: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          Order History
        </Menu.Item>

        <Menu.Item
          leftSection={<IconSettings size={16} />}
          style={{
            borderRadius: '6px',
            padding: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          Settings
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
          color="red"
          style={{
            borderRadius: '6px',
            padding: '0.5rem',
            fontSize: '0.875rem',
          }}
        >
          Sign Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserProfile;

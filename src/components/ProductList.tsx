import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Grid,
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Title,
  Loader,
  Center,
  Box,
  NumberFormatter,
  Stack,
  Rating,
  Modal,
  Flex,
  Divider,
  Pagination,
} from '@mantine/core';
import { IconShoppingCartPlus, IconStarFilled } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { Product } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';

const ProductList: React.FC = React.memo(() => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 8; // Show 8 products per page

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load products. Please try again.',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setModalOpened(true);
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    dispatch(addToCart(product));
    notifications.show({
      title: 'Added to Cart',
      message: `${product.title} has been added to your cart${!isAuthenticated ? ' (as guest)' : ''}`,
      color: 'green',
    });
  }, [dispatch, isAuthenticated]);

  // Pagination logic
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(products.length / itemsPerPage);
  }, [products.length, itemsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="md">
          <Loader size="lg" color="gray" />
          <Text size="lg" c="dimmed">Loading products...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box>
      <Title 
        order={2} 
        size="h1" 
        mb="xl" 
        ta="center"
        style={{
          color: '#212529',
          fontWeight: 600,
          marginBottom: '2rem',
        }}
      >
        Products
      </Title>
      
      <Grid gutter="lg">
        {paginatedProducts.map((product) => (
          <Grid.Col key={product.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                height: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #e9ecef',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => handleProductClick(product)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <Card.Section>
                <Box
                  style={{
                    height: 200,
                    background: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    position: 'relative',
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fit="contain"
                    h={160}
                  />
                  <Badge
                    variant="light"
                    color="gray"
                    size="sm"
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      textTransform: 'capitalize',
                    }}
                  >
                    {product.category}
                  </Badge>
                </Box>
              </Card.Section>

              <Stack gap="sm" mt="md" style={{ height: 'calc(100% - 220px)' }}>
                <Text 
                  fw={500} 
                  size="sm" 
                  lineClamp={2}
                  style={{ minHeight: '2.5rem', flex: 1 }}
                >
                  {product.title}
                </Text>

                <Group justify="space-between" align="center">
                  <NumberFormatter
                    value={product.price}
                    prefix="$"
                    decimalScale={2}
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#212529',
                    }}
                  />
                  <Group gap={4} align="center">
                    <IconStarFilled size={14} color="#ffd43b" />
                    <Text size="sm" c="dimmed">
                      {product.rating.rate}
                    </Text>
                  </Group>
                </Group>

                <Button
                  fullWidth
                  leftSection={<IconShoppingCartPlus size={18} />}
                  variant="filled"
                  color="dark"
                  radius="md"
                  size="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  style={{
                    marginTop: 'auto',
                    fontWeight: 500,
                  }}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Center mt="xl" mb="lg">
          <Pagination
            value={currentPage}
            onChange={handlePageChange}
            total={totalPages}
            size="md"
            radius="md"
            withEdges
            style={{ marginTop: '2rem' }}
          />
        </Center>
      )}

      {/* Product Details Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Product Details"
        size="lg"
        centered
        styles={{
          title: {
            fontWeight: 600,
            fontSize: '1.25rem',
          },
        }}
      >
        {selectedProduct && (
          <Stack gap="lg">
            <Flex gap="xl" direction={{ base: 'column', sm: 'row' }}>
              <Box style={{ flex: '0 0 300px' }}>
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  fit="contain"
                  h={300}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}
                />
              </Box>
              
              <Stack gap="md" style={{ flex: 1 }}>
                <div>
                  <Badge 
                    variant="light" 
                    color="gray" 
                    size="sm" 
                    mb="xs"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {selectedProduct.category}
                  </Badge>
                  <Title order={3} mb="sm" style={{ fontWeight: 600 }}>
                    {selectedProduct.title}
                  </Title>
                </div>

                <Group gap="md">
                  <NumberFormatter
                    value={selectedProduct.price}
                    prefix="$"
                    decimalScale={2}
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: '#212529',
                    }}
                  />
                  <Group gap={4}>
                    <Rating value={selectedProduct.rating.rate} fractions={2} readOnly />
                    <Text size="sm" c="dimmed">
                      ({selectedProduct.rating.count} reviews)
                    </Text>
                  </Group>
                </Group>

                <Divider />

                <Text size="sm" style={{ lineHeight: 1.6 }}>
                  {selectedProduct.description}
                </Text>

                <Button
                  leftSection={<IconShoppingCartPlus size={18} />}
                  variant="filled"
                  color="dark"
                  size="md"
                  radius="md"
                  style={{ marginTop: 'auto', fontWeight: 500 }}
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setModalOpened(false);
                  }}
                >
                  Add to Cart
                </Button>
              </Stack>
            </Flex>
          </Stack>
        )}
      </Modal>
    </Box>
  );
});

export default ProductList;
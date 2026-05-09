import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore, Receipt } from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const statusColors = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    enabled: !!localStorage.getItem('token'),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Orders
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Track your order status and history
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Receipt color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Order #{order.id}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={statusColors[order.status]}
                      size="small"
                    />
                  </Box>
                  <Typography variant="h5" color="primary.main" fontWeight="bold">
                    ${order.total.toFixed(2)}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>View Order Details ({order.items.length} items)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {order.items.map((item) => (
                      <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #e0e0e0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {item.product.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                            />
                          )}
                          <Box>
                            <Typography variant="body1">{item.product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body1" fontWeight="bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {orders.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No orders yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Start shopping to see your orders here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import { Token, TrendingUp, TrendingDown, SwapHoriz } from '@mui/icons-material';

export const TokenBalance = () => {
  const [balance] = useState(2847.5);

  const recentTransactions = [
    {
      id: '1',
      type: 'earned',
      amount: 25.5,
      description: 'Pattern contribution',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'spent',
      amount: 10.0,
      description: 'Compute grid usage',
      timestamp: '1 day ago',
    },
    {
      id: '3',
      type: 'earned',
      amount: 15.2,
      description: 'Code review reward',
      timestamp: '3 days ago',
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp color="success" />;
      case 'spent':
        return <TrendingDown color="error" />;
      default:
        return <SwapHoriz color="info" />;
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Token sx={{ mr: 1, color: '#8b5cf6' }} />
          <Typography variant="h6">ZTH Balance</Typography>
        </Box>
        
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          {balance.toLocaleString()} ZTH
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          ≈ ${(balance * 0.15).toFixed(2)} USD
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button variant="contained" size="small" fullWidth>
            Claim Rewards
          </Button>
          <Button variant="outlined" size="small" fullWidth>
            Transfer
          </Button>
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Transactions
        </Typography>

        <List sx={{ p: 0 }}>
          {recentTransactions.map((tx) => (
            <ListItem key={tx.id} sx={{ px: 0, py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getTransactionIcon(tx.type)}
              </ListItemIcon>
              <ListItemText
                primary={tx.description}
                secondary={tx.timestamp}
                sx={{ flex: 1 }}
              />
              <Chip
                label={`${tx.type === 'earned' ? '+' : '-'}${tx.amount} ZTH`}
                size="small"
                color={tx.type === 'earned' ? 'success' : 'error'}
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}; 
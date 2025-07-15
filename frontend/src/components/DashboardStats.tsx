'use client';

import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { Code, Token, TrendingUp, Storage } from '@mui/icons-material';
import { motion } from 'framer-motion';

const stats = [
  {
    title: 'Patterns Contributed',
    value: '1,247',
    icon: <Code />,
    color: '#6366f1',
    change: '+12%',
  },
  {
    title: 'ZTH Tokens Earned',
    value: '2,847.5',
    icon: <Token />,
    color: '#8b5cf6',
    change: '+8%',
  },
  {
    title: 'Global Rank',
    value: '#1,234',
    icon: <TrendingUp />,
    color: '#10b981',
    change: '+5',
  },
  {
    title: 'Compute Hours',
    value: '156.7',
    icon: <Storage />,
    color: '#f59e0b',
    change: '+23%',
  },
];

export const DashboardStats = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                border: `1px solid ${stat.color}30`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      color: stat.color,
                      mr: 1,
                      p: 1,
                      borderRadius: 2,
                      background: `${stat.color}20`,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" component="div">
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {stat.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: stat.color,
                    fontWeight: 'bold',
                  }}
                >
                  {stat.change} this week
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}; 
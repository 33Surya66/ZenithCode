'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Code,
  Psychology,
  Token,
  Storage,
  TrendingUp,
  Security,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { DashboardStats } from '@/components/DashboardStats';
import { PatternInsights } from '@/components/PatternInsights';
import { TokenBalance } from '@/components/TokenBalance';
import { CodeSuggestions } from '@/components/CodeSuggestions';

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [zthBalance, setZthBalance] = useState(0);

  const features = [
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: 'Federated Code Intelligence',
      description: 'Train global AI models with anonymized patterns',
      color: '#6366f1',
    },
    {
      icon: <Token sx={{ fontSize: 40 }} />,
      title: 'Cosmic Rewards',
      description: 'Earn ZTH tokens for unique contributions',
      color: '#8b5cf6',
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Hyper-Contextual Assistance',
      description: 'Real-time, domain-specific code suggestions',
      color: '#06b6d4',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Cross-Galactic Insights',
      description: 'Leverage patterns from millions of projects',
      color: '#10b981',
    },
    {
      icon: <Storage sx={{ fontSize: 40 }} />,
      title: 'Decentralized Compute Grid',
      description: 'Access GPU clusters with ZTH tokens',
      color: '#f59e0b',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Privacy-First',
      description: 'Zero-knowledge proofs ensure code privacy',
      color: '#ef4444',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        pt: 2,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              🌌 ZenithCode
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              The decentralized programming revolution that obliterates boundaries
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
              }}
            >
              Connect Wallet
            </Button>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    🚀 Features
                  </Typography>
                  <Grid container spacing={2}>
                    {features.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card
                            sx={{
                              background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                              border: `1px solid ${feature.color}30`,
                              height: '100%',
                            }}
                          >
                            <CardContent sx={{ textAlign: 'center' }}>
                              <Box sx={{ color: feature.color, mb: 1 }}>
                                {feature.icon}
                              </Box>
                              <Typography variant="h6" sx={{ mb: 1 }}>
                                {feature.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {feature.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <CodeSuggestions />
            </motion.div>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <TokenBalance />
              <PatternInsights />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 
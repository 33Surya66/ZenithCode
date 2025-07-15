'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import { TrendingUp, Code, Psychology } from '@mui/icons-material';

export const PatternInsights = () => {
  const insights = [
    {
      title: 'Most Popular Pattern',
      pattern: 'React Hooks Optimization',
      usage: 85,
      language: 'JavaScript',
    },
    {
      title: 'Trending Up',
      pattern: 'Rust Async Patterns',
      usage: 67,
      language: 'Rust',
    },
    {
      title: 'Emerging',
      pattern: 'Quantum Computing',
      usage: 23,
      language: 'Python',
    },
  ];

  const languages = [
    { name: 'JavaScript', percentage: 45 },
    { name: 'Python', percentage: 30 },
    { name: 'Rust', percentage: 15 },
    { name: 'Others', percentage: 10 },
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Psychology sx={{ mr: 1, color: '#06b6d4' }} />
          <Typography variant="h6">Pattern Insights</Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          {insights.map((insight, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {insight.title}
                </Typography>
                <Chip label={insight.language} size="small" />
              </Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {insight.pattern}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={insight.usage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {insight.usage}% adoption
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Language Distribution
        </Typography>

        {languages.map((lang, index) => (
          <Box key={index} sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">{lang.name}</Typography>
              <Typography variant="body2">{lang.percentage}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={lang.percentage}
              sx={{
                height: 4,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #10b981, #06b6d4)',
                },
              }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}; 
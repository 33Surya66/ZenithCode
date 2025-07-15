'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { Lightbulb, Code, ContentCopy, Check } from '@mui/icons-material';
import { useState } from 'react';

export const CodeSuggestions = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const suggestions = [
    {
      id: '1',
      title: 'Optimize React Component',
      description: 'Use React.memo for performance optimization',
      code: `const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>
});`,
      language: 'JavaScript',
      tags: ['React', 'Performance'],
    },
    {
      id: '2',
      title: 'Rust Error Handling',
      description: 'Implement proper error handling with Result type',
      code: `fn process_data(data: &str) -> Result<String, Box<dyn Error>> {
  let result = data.parse::<i32>()?;
  Ok(result.to_string())
}`,
      language: 'Rust',
      tags: ['Error Handling', 'Best Practices'],
    },
    {
      id: '3',
      title: 'Python Async Pattern',
      description: 'Use asyncio for concurrent operations',
      code: `async def fetch_data(urls: List[str]):
  async with aiohttp.ClientSession() as session:
    tasks = [fetch_url(session, url) for url in urls]
    return await asyncio.gather(*tasks)`,
      language: 'Python',
      tags: ['Async', 'Concurrency'],
    },
  ];

  const handleCopy = (index: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Lightbulb sx={{ mr: 1, color: '#f59e0b' }} />
          <Typography variant="h6">AI Code Suggestions</Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Describe what you're trying to build..."
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
        />

        <List sx={{ p: 0 }}>
          {suggestions.map((suggestion, index) => (
            <ListItem
              key={suggestion.id}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 0,
                mb: 3,
                pb: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, width: '100%' }}>
                <Code sx={{ mr: 1, color: '#6366f1' }} />
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {suggestion.title}
                </Typography>
                <Chip label={suggestion.language} size="small" sx={{ mr: 1 }} />
                <Button
                  size="small"
                  startIcon={copiedIndex === index ? <Check /> : <ContentCopy />}
                  onClick={() => handleCopy(index, suggestion.code)}
                  variant="outlined"
                >
                  {copiedIndex === index ? 'Copied!' : 'Copy'}
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {suggestion.description}
              </Typography>

              <Box sx={{ mb: 1 }}>
                {suggestion.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>

              <Box
                sx={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  p: 2,
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  overflow: 'auto',
                }}
              >
                <pre style={{ margin: 0, color: '#e5e7eb' }}>
                  {suggestion.code}
                </pre>
              </Box>
            </ListItem>
          ))}
        </List>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="outlined" fullWidth>
            Load More Suggestions
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}; 
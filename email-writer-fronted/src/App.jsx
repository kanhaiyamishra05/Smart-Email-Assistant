import { 
  Box, 
  Button, 
  CircularProgress, 
  Container, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Paper,
  Divider,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

// API configuration (Vite reads environment variables starting with VITE_)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// SVG Icons
const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L14.05 8.95L20 11L14.05 13.05L12 19L9.95 13.05L4 11L9.95 8.95L12 3Z" fill="url(#sparkleGrad)" />
    <path d="M5 4L5.68 5.95L7.5 6.5L5.68 7.05L5 9L4.32 7.05L2.5 6.5L4.32 5.95L5 4Z" fill="url(#sparkleGrad)" />
    <path d="M19 15L19.68 16.95L21.5 17.5L19.68 18.05L19 20L18.32 18.05L16.5 17.5L18.32 16.95L19 15Z" fill="url(#sparkleGrad)" />
    <defs>
      <linearGradient id="sparkleGrad" x1="2.5" y1="3" x2="21.5" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818cf8" />
        <stop offset="1" stopColor="#c084fc" />
      </linearGradient>
    </defs>
  </svg>
);

const ChromeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.4c4.2 0 7.6 3.4 7.6 7.6H12v-2.2c0-.5-.4-.9-.9-.9H5c.4-2.5 2.5-4.5 5.5-4.5 1.5 0 2.8.5 3.9 1.4.3.3.8.3 1.1 0l1.2-1.2c.3-.3.3-.8 0-1.1C15 2.1 13 1.4 12 1.4 6.7 1.4 2.4 5.2 1.6 10.3c.7-3.4 3.7-5.9 7.3-5.9c1.6 0 3 .5 4.1 1.4zm6.6 8H12v6.6c2.4-.2 4.5-1.5 5.6-3.5.7-1.1 1-2.1 1-3.1zm-8.8 6.6C5.6 18.8 2.8 14.8 2.6 10.2l3.4 5.9c1 1.7 2.3 2.9 3.8 2.9z"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  async function handleSubmit() {
    setLoading(true);
    setGeneratedReply('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/email/generate`, {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
      setToast({ open: true, message: 'AI reply generated successfully!', severity: 'success' });
    } catch (error) {
      console.error(error);
      setToast({ 
        open: true, 
        message: error.response?.data || 'Failed to connect to backend. Make sure Spring Boot is running!', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!generatedReply) return;
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 4, md: 8 } }}>
      
      {/* Background glow effects */}
      <div className="glow-bg"></div>
      <div className="glow-bg-secondary"></div>

      {/* Hero / Header Section */}
      <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1, borderRadius: '50px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', mb: 3 }}>
          <SparklesIcon />
          <Typography variant="subtitle2" sx={{ color: '#a5b4fc', fontWeight: 600, letterSpacing: '0.5px', fontFamily: 'Inter' }}>
            Next-Gen Email Productivity
          </Typography>
        </Box>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontFamily: 'Outfit', 
            fontWeight: 800, 
            mb: 2, 
            background: 'linear-gradient(to right, #ffffff, #c7d2fe, #f472b6)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            letterSpacing: '-1px'
          }}
        >
          Smart Email Assistant
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#94a3b8', 
            maxWidth: '700px', 
            mx: 'auto', 
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}
        >
          Generate context-aware, intelligent email replies instantly. Use the interactive playground below or integrate directly inside Gmail with our Chrome Extension.
        </Typography>
      </Box>

      {/* Main Two-Column Layout */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '5.5fr 6.5fr' }, 
        gap: { xs: 4, md: 6 }, 
        alignItems: 'start'
      }}>
        
        {/* Left Column: Extension Info & Steps */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '24px', 
            background: 'rgba(15, 23, 42, 0.4)', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
          }}>
            <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: '#f8fafc' }}>
              ⚡ Chrome Extension Guide
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4, lineHeight: 1.6 }}>
              Unlock the full power of Smart Email Assistant by injecting it directly into your Gmail Compose toolbar. Reply to incoming emails with one click!
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {[
                { 
                  num: '01', 
                  title: 'Load the Extension', 
                  desc: 'Navigate to chrome://extensions/, enable Developer Mode, and click "Load unpacked". Select the Email-Writer-Ext folder.' 
                },
                { 
                  num: '02', 
                  title: 'Configure Your Backend', 
                  desc: 'Ensure your Spring Boot backend is active and reachable. (Tip: Update host_permissions in manifest.json if deploying to cloud).' 
                },
                { 
                  num: '03', 
                  title: 'Instantly Generate inside Gmail', 
                  desc: 'Open any email thread on Gmail, hit the injected "AI Reply" button, and watch your compose field populate automatically.' 
                }
              ].map((step, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2.5 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minWidth: '40px', 
                    height: '40px', 
                    borderRadius: '12px', 
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)', 
                    border: '1px solid rgba(129, 140, 248, 0.3)'
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#c084fc', fontFamily: 'Outfit' }}>
                      {step.num}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#f1f5f9', mb: 0.5, fontFamily: 'Inter' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5 }}>
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Extension Quick Actions / Features */}
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '24px', 
            background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(236,72,153,0.05) 100%)', 
            border: '1px solid rgba(99, 102, 241, 0.1)',
            boxShadow: 'none'
          }}>
            <Typography variant="subtitle1" sx={{ color: '#e2e8f0', fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              💡 Features Overview
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
              {['Gmail UI Injection', 'Custom Tone Selector', 'Gemini AI Model', 'Secure API Keys'].map((feat, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#a855f7' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>{feat}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

        </Box>

        {/* Right Column: AI Reply Generator Playground */}
        <Card elevation={0} sx={{ 
          borderRadius: '28px', 
          background: 'rgba(15, 23, 42, 0.45)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          overflow: 'visible'
        }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f8fafc' }}>
                🚀 AI Reply Playground
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: loading ? '#f59e0b' : '#10b981', animation: loading ? 'pulseGlow 1s infinite' : 'none' }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                  {loading ? 'Generating...' : 'System Ready'}
                </Typography>
              </Box>
            </Box>

            {/* Form Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              
              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                label="Original Email Content"
                placeholder="Paste the email you received here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f8fafc',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(2, 6, 23, 0.4)',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                    '&:hover fieldset': { borderColor: 'rgba(99, 102, 241, 0.4)' },
                    '&.Mui-focused fieldset': { borderColor: '#818cf8', boxShadow: '0 0 12px rgba(129, 140, 248, 0.25)' },
                  },
                  '& .MuiInputLabel-root': { color: '#64748b' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' },
                }}
              />

              <FormControl fullWidth>
                <InputLabel id="tone-select-label" sx={{ color: '#64748b', '&.Mui-focused': { color: '#818cf8' } }}>Tone (Optional)</InputLabel>
                <Select
                  labelId="tone-select-label"
                  value={tone}
                  label="Tone (Optional)"
                  onChange={(e) => setTone(e.target.value)}
                  sx={{
                    color: '#f8fafc',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(2, 6, 23, 0.4)',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.08)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(99, 102, 241, 0.4)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#818cf8' },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        '& .MuiMenuItem-root': {
                          color: '#e2e8f0',
                          '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.12)' },
                          '&.Mui-selected': { bgcolor: 'rgba(99, 102, 241, 0.25)' },
                          '&.Mui-selected:hover': { bgcolor: 'rgba(99, 102, 241, 0.35)' },
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value=""><em>None (Standard)</em></MenuItem>
                  <MenuItem value="Professional">💼 Professional</MenuItem>
                  <MenuItem value="Casual">☕ Casual</MenuItem>
                  <MenuItem value="Friendly">👋 Friendly</MenuItem>
                </Select>
              </FormControl>

              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={!emailContent || loading}
                sx={{
                  py: 1.8,
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  fontFamily: 'Outfit',
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                    boxShadow: '0 6px 24px rgba(99, 102, 241, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.3)',
                    boxShadow: 'none',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : "Generate AI Reply"}
              </Button>

              {/* Generated Reply Area */}
              {generatedReply && (
                <Box sx={{ mt: 2, animation: 'fadeIn 0.5s ease-in-out' }}>
                  <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 3 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ color: '#818cf8', fontWeight: 600, fontFamily: 'Outfit' }}>
                      Suggested Reply
                    </Typography>
                    
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={handleCopy}
                        startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                        sx={{
                          borderRadius: '10px',
                          textTransform: 'none',
                          color: copied ? '#4ade80' : '#94a3b8',
                          borderColor: copied ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          backgroundColor: copied ? 'rgba(74, 222, 128, 0.05)' : 'transparent',
                          '&:hover': {
                            borderColor: copied ? 'rgba(74, 222, 128, 0.5)' : 'rgba(255, 255, 255, 0.25)',
                            backgroundColor: copied ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                          }
                        }}
                      >
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </Tooltip>
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    value={generatedReply}
                    slotProps={{
                      htmlInput: {
                        readOnly: true,
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#f8fafc',
                        borderRadius: '16px',
                        backgroundColor: 'rgba(2, 6, 23, 0.5)',
                        border: '1px solid rgba(129, 140, 248, 0.2)',
                        '& fieldset': { border: 'none' },
                      }
                    }}
                  />
                </Box>
              )}

            </Box>
          </CardContent>
        </Card>

      </Box>

      {/* Snackbar Alert */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToast(prev => ({ ...prev, open: false }))} 
          severity={toast.severity} 
          variant="filled"
          sx={{ 
            borderRadius: '12px', 
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)' 
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default App;

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
  Paper,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Simple Copy Icon
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // Update body background color when theme changes
  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#09090b' : '#f4f4f5';
    document.body.style.color = isDarkMode ? '#f4f4f5' : '#09090b';
  }, [isDarkMode]);

  async function handleSubmit() {
    setLoading(true);
    setGeneratedReply('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/email/generate`, {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
      setToast({ 
        open: true, 
        message: error.response?.data || 'Failed to connect to backend. Verify Spring Boot is running.', 
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
    <Container maxWidth="md" sx={{ py: 6, display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
      
      {/* Header/Navbar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4, 
        pb: 2, 
        borderBottom: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}` 
      }}>
        <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: isDarkMode ? '#f4f4f5' : '#09090b', letterSpacing: '-0.5px' }}>
          Smart Email Assistant
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, val) => setActiveTab(val)}
            textColor="inherit"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: isDarkMode ? '#f4f4f5' : '#09090b' },
              '& .MuiTab-root': { 
                textTransform: 'none', 
                fontWeight: 500, 
                color: isDarkMode ? '#a1a1aa' : '#71717a',
                fontSize: '0.9rem',
                minWidth: 'auto',
                px: 2,
                '&.Mui-selected': { color: isDarkMode ? '#f4f4f5' : '#09090b' }
              }
            }}
          >
            <Tab label="Playground" />
            <Tab label="Extension Guide" />
          </Tabs>

          <Button 
            size="small"
            onClick={() => setIsDarkMode(!isDarkMode)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              color: isDarkMode ? '#a1a1aa' : '#71717a',
              borderColor: isDarkMode ? '#27272a' : '#e4e4e7',
              border: '1px solid',
              borderRadius: '8px',
              px: 2,
              '&:hover': {
                color: isDarkMode ? '#f4f4f5' : '#09090b',
                backgroundColor: isDarkMode ? '#27272a' : '#e4e4e7',
                borderColor: isDarkMode ? '#3f3f46' : '#d4d4d8',
              }
            }}
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </Box>
      </Box>

      {/* Main Container */}
      <Paper elevation={0} sx={{ 
        p: { xs: 3, md: 5 }, 
        borderRadius: '12px', 
        backgroundColor: isDarkMode ? '#18181b' : '#ffffff', 
        border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
        boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        
        {activeTab === 0 ? (
          /* PLAYGROUND TAB */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Box>
              <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: isDarkMode ? '#f4f4f5' : '#09090b', mb: 1 }}>
                Email Generator
              </Typography>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                Paste the email content below and choose a reply tone.
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              placeholder="Paste email here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? '#f4f4f5' : '#09090b',
                  borderRadius: '8px',
                  backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
                  '& fieldset': { borderColor: isDarkMode ? '#27272a' : '#e4e4e7' },
                  '&:hover fieldset': { borderColor: isDarkMode ? '#3f3f46' : '#d4d4d8' },
                  '&.Mui-focused fieldset': { borderColor: isDarkMode ? '#52525b' : '#a1a1aa' },
                },
                '& .MuiInputLabel-root': { color: isDarkMode ? '#71717a' : '#a1a1aa' },
                '& .MuiInputLabel-root.Mui-focused': { color: isDarkMode ? '#a1a1aa' : '#71717a' },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl sx={{ minWidth: 200, flexGrow: { xs: 1, sm: 0 } }}>
                <InputLabel id="tone-select-label" sx={{ color: isDarkMode ? '#71717a' : '#a1a1aa', '&.Mui-focused': { color: isDarkMode ? '#a1a1aa' : '#71717a' } }}>Tone (Optional)</InputLabel>
                <Select
                  labelId="tone-select-label"
                  value={tone}
                  label="Tone (Optional)"
                  onChange={(e) => setTone(e.target.value)}
                  sx={{
                    color: isDarkMode ? '#f4f4f5' : '#09090b',
                    borderRadius: '8px',
                    backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#27272a' : '#e4e4e7' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#3f3f46' : '#d4d4d8' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: isDarkMode ? '#52525b' : '#a1a1aa' },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: isDarkMode ? '#18181b' : '#ffffff',
                        border: `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}`,
                        borderRadius: '8px',
                        '& .MuiMenuItem-root': {
                          color: isDarkMode ? '#e4e4e7' : '#09090b',
                          '&:hover': { bgcolor: isDarkMode ? '#27272a' : '#f4f4f5' },
                          '&.Mui-selected': { bgcolor: isDarkMode ? '#3f3f46' : '#e4e4e7' },
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value=""><em>None (Standard)</em></MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Casual">Casual</MenuItem>
                  <MenuItem value="Friendly">Friendly</MenuItem>
                </Select>
              </FormControl>

              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={!emailContent || loading}
                sx={{
                  flexGrow: 1,
                  py: 1.5,
                  borderRadius: '8px',
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: isDarkMode ? '#f4f4f5' : '#09090b',
                  color: isDarkMode ? '#09090b' : '#f4f4f5',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#e4e4e7' : '#18181b',
                  },
                  '&:disabled': {
                    backgroundColor: isDarkMode ? '#27272a' : '#e4e4e7',
                    color: isDarkMode ? '#52525b' : '#a1a1aa',
                  }
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: isDarkMode ? '#09090b' : '#f4f4f5' }} /> : "Generate Reply"}
              </Button>
            </Box>

            {/* Generated Reply Area */}
            {generatedReply && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Divider sx={{ borderColor: isDarkMode ? '#27272a' : '#e4e4e7', my: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', fontWeight: 600 }}>
                    AI Generated Response:
                  </Typography>
                  
                  <Button 
                    size="small" 
                    variant="text"
                    onClick={handleCopy}
                    startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                    sx={{
                      textTransform: 'none',
                      color: copied ? '#4ade80' : (isDarkMode ? '#a1a1aa' : '#71717a'),
                      '&:hover': { color: isDarkMode ? '#f4f4f5' : '#09090b' }
                    }}
                  >
                    {copied ? "Copied" : "Copy to Clipboard"}
                  </Button>
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
                      color: isDarkMode ? '#f4f4f5' : '#09090b',
                      borderRadius: '8px',
                      backgroundColor: isDarkMode ? '#09090b' : '#f4f4f5',
                      '& fieldset': { borderColor: isDarkMode ? '#27272a' : '#e4e4e7' },
                    }
                  }}
                />
              </Box>
            )}

          </Box>
        ) : (
          /* EXTENSION GUIDE TAB */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: isDarkMode ? '#f4f4f5' : '#09090b', mb: 1 }}>
                Chrome Extension Installation
              </Typography>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a' }}>
                Follow these simple steps to load the assistant directly into Gmail.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { 
                  step: "Step 1", 
                  title: "Open Extension Settings", 
                  desc: "Open Google Chrome, type chrome://extensions/ in the address bar, and press Enter." 
                },
                { 
                  step: "Step 2", 
                  title: "Enable Developer Mode", 
                  desc: "Toggle the Developer Mode switch in the top right corner of the extension settings page." 
                },
                { 
                  step: "Step 3", 
                  title: "Load Unpacked Folder", 
                  desc: 'Click on the "Load unpacked" button in the top left and select the Email-Writer-Ext directory from this project.' 
                },
                { 
                  step: "Step 4", 
                  title: "Test in Gmail", 
                  desc: "Open Gmail and click on Compose or Reply. You will see a new 'AI Reply' button next to the Send button." 
                }
              ].map((item, idx) => (
                <Box key={idx} sx={{ pb: idx !== 3 ? 2 : 0, borderBottom: idx !== 3 ? `1px solid ${isDarkMode ? '#27272a' : '#e4e4e7'}` : 'none' }}>
                  <Typography variant="caption" sx={{ color: isDarkMode ? '#71717a' : '#a1a1aa', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.step}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: isDarkMode ? '#e4e4e7' : '#27272a', mt: 0.5, mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#a1a1aa' : '#71717a', lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: isDarkMode ? '#52525b' : '#a1a1aa' }}>
          Smart Email Assistant • Designed with simplicity
        </Typography>
      </Box>

      {/* Toast Alert */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={5000} 
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToast(prev => ({ ...prev, open: false }))} 
          severity={toast.severity} 
          variant="filled"
          sx={{ borderRadius: '8px', fontWeight: 500 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </Container>
  );
}

export default App;

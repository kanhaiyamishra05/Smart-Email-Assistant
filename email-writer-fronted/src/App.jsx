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
  Alert
} from '@mui/material';
import './App.css';
import { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState(0);
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, pb: 2, borderBottom: '1px solid #27272a' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f4f4f5', letterSpacing: '-0.5px' }}>
          Smart Email Assistant
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={(e, val) => setActiveTab(val)}
          textColor="inherit"
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#3f3f46' },
            '& .MuiTab-root': { 
              textTransform: 'none', 
              fontWeight: 500, 
              color: '#a1a1aa',
              fontSize: '0.9rem',
              minWidth: 'auto',
              px: 2,
              '&.Mui-selected': { color: '#f4f4f5' }
            }
          }}
        >
          <Tab label="Playground" />
          <Tab label="Extension Guide" />
        </Tabs>
      </Box>

      {/* Main Container */}
      <Paper elevation={0} sx={{ 
        p: { xs: 3, md: 5 }, 
        borderRadius: '12px', 
        backgroundColor: '#18181b', 
        border: '1px solid #27272a'
      }}>
        
        {activeTab === 0 ? (
          /* PLAYGROUND TAB */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Box>
              <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#f4f4f5', mb: 1 }}>
                Email Generator
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
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
                  color: '#f4f4f5',
                  borderRadius: '8px',
                  backgroundColor: '#09090b',
                  '& fieldset': { borderColor: '#27272a' },
                  '&:hover fieldset': { borderColor: '#3f3f46' },
                  '&.Mui-focused fieldset': { borderColor: '#52525b' },
                },
                '& .MuiInputLabel-root': { color: '#71717a' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#a1a1aa' },
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl sx={{ minWidth: 200, flexGrow: { xs: 1, sm: 0 } }}>
                <InputLabel id="tone-select-label" sx={{ color: '#71717a', '&.Mui-focused': { color: '#a1a1aa' } }}>Tone (Optional)</InputLabel>
                <Select
                  labelId="tone-select-label"
                  value={tone}
                  label="Tone (Optional)"
                  onChange={(e) => setTone(e.target.value)}
                  sx={{
                    color: '#f4f4f5',
                    borderRadius: '8px',
                    backgroundColor: '#09090b',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#27272a' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3f3f46' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#52525b' },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: '#18181b',
                        border: '1px solid #27272a',
                        borderRadius: '8px',
                        '& .MuiMenuItem-root': {
                          color: '#e4e4e7',
                          '&:hover': { bgcolor: '#27272a' },
                          '&.Mui-selected': { bgcolor: '#3f3f46' },
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
                  backgroundColor: '#f4f4f5',
                  color: '#09090b',
                  '&:hover': {
                    backgroundColor: '#e4e4e7',
                  },
                  '&:disabled': {
                    backgroundColor: '#27272a',
                    color: '#52525b',
                  }
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: '#09090b' }} /> : "Generate Reply"}
              </Button>
            </Box>

            {/* Generated Reply Area */}
            {generatedReply && (
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Divider sx={{ borderColor: '#27272a', my: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ color: '#a1a1aa', fontWeight: 600 }}>
                    AI Generated Response:
                  </Typography>
                  
                  <Button 
                    size="small" 
                    variant="text"
                    onClick={handleCopy}
                    startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                    sx={{
                      textTransform: 'none',
                      color: copied ? '#4ade80' : '#a1a1aa',
                      '&:hover': { color: '#f4f4f5' }
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
                      color: '#f4f4f5',
                      borderRadius: '8px',
                      backgroundColor: '#09090b',
                      '& fieldset': { borderColor: '#27272a' },
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
              <Typography variant="h5" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#f4f4f5', mb: 1 }}>
                Chrome Extension Installation
              </Typography>
              <Typography variant="body2" sx={{ color: '#a1a1aa' }}>
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
                <Box key={idx} sx={{ pb: idx !== 3 ? 2 : 0, borderBottom: idx !== 3 ? '1px solid #27272a' : 'none' }}>
                  <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.step}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#e4e4e7', mt: 0.5, mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#a1a1aa', lineHeight: 1.6 }}>
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
        <Typography variant="caption" sx={{ color: '#52525b' }}>
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

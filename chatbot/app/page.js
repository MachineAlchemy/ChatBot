'use client'

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Ask your question, traveler. Wisdom doesn't wait—and neither do I.",
    },
  ]);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    setMessage(''); // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message }, // Add the user's message to the chat
      { role: 'assistant', content: '' }, // Add a placeholder for the assistant's response
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        result += text;

        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]; // Get the last message (assistant's placeholder)
          let otherMessages = messages.slice(0, messages.length - 1); // Get all other messages
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text }, // Append the decoded text to the assistant's message
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5" // Light background color
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        bgcolor="white" // Chatbox background color
        border="1px solid black"
        borderRadius={4}
        p={2}
        spacing={3}
        boxShadow={3} // Add some shadow for better visibility
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            sx={{
              bgcolor: 'white',
              '& .MuiInputBase-root': {
                color: 'black',
              },
            }} // Ensure the text box has a white background
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

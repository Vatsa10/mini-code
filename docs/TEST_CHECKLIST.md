# MiniCode Test Checklist

## Pre-flight Checks ✅

- [x] TypeScript compilation successful
- [x] All dependencies installed
- [x] Project structure complete
- [x] Configuration files in place
- [x] Example files created

## Manual Testing Guide

### 1. Start MiniCode
```bash
npm run dev
```

**Expected**: 
- "🚀 Starting MiniCode..." message
- MiniCode UI appears with cyan header
- Input prompt ready

### 2. Test Basic Chat
```
> What is React?
```

**Expected**:
- Streaming response appears in real-time
- Response is coherent and helpful
- Message saved to conversation history

### 3. Test File Reading
```
> /read examples/hello.js
```

**Expected**:
- File content displayed
- Syntax highlighting applied
- No errors

### 4. Test Code Execution (JavaScript)
```
> /run examples/hello.js
```

**Expected**:
- "Execution result:" header
- Stdout shows: "Hello from MiniCode!"
- Current timestamp displayed
- "Hello, Developer!" message
- Exit code: 0

### 5. Test Code Execution (Python)
```
> /run examples/test.py
```

**Expected** (if Python installed):
- Fibonacci sequence output
- Exit code: 0

**Expected** (if Python not installed):
- Error message about Python not found
- Graceful error handling

### 6. Test Context Awareness
```
> /read examples/hello.js
> What does this file do?
```

**Expected**:
- AI references the file content
- Explains the greet function
- Shows understanding of context

### 7. Test Error Handling
Create a broken file:
```
> /run nonexistent.js
```

**Expected**:
- Error message about file not found
- Graceful error handling
- No crash

### 8. Test Multi-turn Conversation
```
> How do I use promises in JavaScript?
> Can you show me an example?
> What about async/await?
```

**Expected**:
- Each response builds on previous context
- Conversation flows naturally
- History maintained

### 9. Test Write Command
```
> /write test.txt
```

**Expected**:
- Prompt to provide content
- Instructions displayed

### 10. Exit Test
```
Press Ctrl+C
```

**Expected**:
- Clean exit
- No hanging processes
- Transcript saved to .minicode/transcripts/

## Automated Checks

### Build Test
```bash
npm run build
```
**Expected**: No TypeScript errors

### File Structure Test
```bash
ls -la src/
ls -la dist/
```
**Expected**: All source and compiled files present

### Config Test
```bash
cat .env
```
**Expected**: OPENROUTER_API_KEY present

## Known Limitations

1. **Code Execution**: Requires runtime installed (Node.js, Python, etc.)
2. **Streaming**: Requires stable internet connection
3. **API Limits**: Subject to OpenRouter rate limits
4. **Terminal Size**: Best with at least 80x24 terminal

## Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install`

### Issue: "API request failed"
**Solution**: Check .env file and API key

### Issue: "Command not found" when running code
**Solution**: Install required runtime (node, python, etc.)

### Issue: UI looks broken
**Solution**: Ensure terminal supports UTF-8 and colors

## Performance Benchmarks

- **Startup Time**: < 2 seconds
- **First Response**: 1-3 seconds (network dependent)
- **Streaming Latency**: Real-time (< 100ms chunks)
- **File Read**: < 50ms for typical files
- **Code Execution**: Depends on code complexity

## Success Criteria

✅ All core features work
✅ No crashes or hangs
✅ Streaming is smooth
✅ Error handling is graceful
✅ UI is readable and responsive
✅ Context is maintained
✅ Transcripts are saved

## Next Steps After Testing

1. Try with your own code files
2. Ask complex coding questions
3. Test with different languages
4. Explore multi-file workflows
5. Customize configuration in src/config.ts

## Feedback & Improvements

After testing, consider:
- What features would you add?
- What UI improvements would help?
- What commands are missing?
- What error messages need improvement?

---

**Ready to test!** Run `npm run dev` and start exploring MiniCode! 🚀

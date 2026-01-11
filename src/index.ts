import app from './api';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Tech Verdict server running on port ${PORT}`);
});

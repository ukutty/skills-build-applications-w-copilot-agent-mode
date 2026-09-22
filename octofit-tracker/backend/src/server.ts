import express from 'express';
import { connectDatabase } from './config/database.ts';
import { createCollectionRouter } from './routes/collection.ts';
import { Activity, Leaderboard, Team, User, Workout } from './models.ts';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', apiBaseUrl });
});

app.use('/api/users', createCollectionRouter(User));
app.use('/api/teams', createCollectionRouter(Team));
app.use('/api/activities', createCollectionRouter(Activity));
app.use('/api/leaderboard', createCollectionRouter(Leaderboard));
app.use('/api/workouts', createCollectionRouter(Workout));

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`OctoFit API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to octofit_db:', error);
    process.exit(1);
  });

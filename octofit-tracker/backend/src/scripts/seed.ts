import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.ts';
import { Activity, Leaderboard, Team, User, Workout } from '../models.ts';

/**
 * Seed the octofit_db database with test data.
 */
async function seedDatabase() {
  try {
    await connectDatabase();
    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      User.deleteMany({}),
      Team.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [trailblazers, weekendWarriors] = await Team.insertMany([
      {
        name: 'Trailblazers',
        description: 'A team focused on steady progress and outdoor movement.',
      },
      {
        name: 'Weekend Warriors',
        description: 'A friendly team turning weekend energy into healthy habits.',
      },
    ]);

    const users = await User.insertMany([
      {
        username: 'maya.runner',
        email: 'maya.runner@mergington.edu',
        firstName: 'Maya',
        lastName: 'Rivera',
        fitnessLevel: 'intermediate',
        team: trailblazers._id,
      },
      {
        username: 'noah.moves',
        email: 'noah.moves@mergington.edu',
        firstName: 'Noah',
        lastName: 'Williams',
        fitnessLevel: 'beginner',
        team: trailblazers._id,
      },
      {
        username: 'sophia.strong',
        email: 'sophia.strong@mergington.edu',
        firstName: 'Sophia',
        lastName: 'Chen',
        fitnessLevel: 'advanced',
        team: weekendWarriors._id,
      },
    ]);

    await Team.findByIdAndUpdate(trailblazers._id, { members: users.slice(0, 2).map((user) => user._id) });
    await Team.findByIdAndUpdate(weekendWarriors._id, { members: [users[2]._id] });

    await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'running',
        durationMinutes: 35,
        distanceKilometers: 5.2,
        points: 52,
        completedAt: new Date('2026-09-18T16:30:00Z'),
      },
      {
        user: users[1]._id,
        type: 'walking',
        durationMinutes: 30,
        distanceKilometers: 2.4,
        points: 24,
        completedAt: new Date('2026-09-19T10:00:00Z'),
      },
      {
        user: users[2]._id,
        type: 'strength',
        durationMinutes: 45,
        points: 60,
        completedAt: new Date('2026-09-20T14:00:00Z'),
      },
    ]);

    await Leaderboard.insertMany([
      { user: users[0]._id, team: trailblazers._id, points: 152, rank: 1 },
      { user: users[2]._id, team: weekendWarriors._id, points: 140, rank: 2 },
      { user: users[1]._id, team: trailblazers._id, points: 98, rank: 3 },
    ]);

    await Workout.insertMany([
      {
        name: 'Couch-to-5K Starter',
        description: 'Alternate easy jogging and walking to build running confidence.',
        difficulty: 'beginner',
        durationMinutes: 25,
        target: 'Cardio endurance',
      },
      {
        name: 'Full Body Fundamentals',
        description: 'A balanced circuit using bodyweight movements and controlled tempo.',
        difficulty: 'intermediate',
        durationMinutes: 35,
        target: 'Strength and mobility',
      },
      {
        name: 'Power Intervals',
        description: 'Short, challenging intervals for experienced athletes.',
        difficulty: 'advanced',
        durationMinutes: 30,
        target: 'Speed and power',
      },
    ]);

    console.log('Seed the octofit_db database with test data');
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();

import { IssuePriority, IssueStatus, IssueType } from 'constants/issues';
import { ProjectCategory } from 'constants/projects';
import { Comment, Issue, Project, User } from 'entities';
import { lorem, random } from 'faker';
import { createEntity } from 'utils/typeorm';

const seedUsers = (): Promise<User[]> => {
  const users = [
    createEntity(User, {
      email: 'rick@jira.guest',
      name: 'Pickle Rick',
      avatarUrl: 'https://i.ibb.co/7JM1P2r/picke-rick.jpg',
    }),
    createEntity(User, {
      email: 'yoda@jira.guest',
      name: 'Baby Yoda',
      avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg',
    }),
    createEntity(User, {
      email: 'gaben@jira.guest',
      name: 'Lord Gaben',
      avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
    }),
  ];
  return Promise.all(users);
};

const seedProject = (users: User[]): Promise<Project> =>
  createEntity(Project, {
    name: 'singularity 1.0',
    url: 'https://www.atlassian.com/software/jira',
    description:
      'Plan, track, and manage your agile and software development projects in Jira. Customize your workflow, collaborate, and release great software.',
    category: ProjectCategory.SOFTWARE,
    users,
  });

const issuesPriorities = Object.values(IssuePriority);
const issuesStatus = Object.values(IssueStatus);
const issuesTypes = Object.values(IssueType);

const createIssue = (project: Project, user: User) =>
  createEntity(Issue, {
    title: random.words(5),
    type: random.arrayElement(issuesTypes),
    status: random.arrayElement(issuesStatus),
    priority: random.arrayElement(issuesPriorities),
    listPosition: random.number(10),
    description: lorem.paragraphs(2),
    estimate: random.number(10),
    timeSpent: random.number(10),
    reporterId: random.arrayElement(project.users).id,
    project,
    users: [user],
  });

const seedIssues = (project: Project): Promise<Issue[]> => {
  const { users } = project;

  const createUserIssue = (user: User) => createIssue(project, user);

  const ISSUES_PER_USER = 75;

  const issues = users
    .map(user =>
      Array(ISSUES_PER_USER)
        .fill(null)
        .map(_ => createUserIssue(user)),
    )
    .flat();

  return Promise.all(issues);
};

const seedComments = (issues: Issue[], users: User[]): Promise<Comment[]> => {
  const comments = [
    createEntity(Comment, {
      body: 'An old silent pond...\nA frog jumps into the pond,\nsplash! Silence again.',
      issueId: issues[0].id,
      userId: users[2].id,
    }),
    createEntity(Comment, {
      body: 'Autumn moonlight-\na worm digs silently\ninto the chestnut.',
      issueId: issues[1].id,
      userId: users[2].id,
    }),
    createEntity(Comment, {
      body: 'In the twilight rain\nthese brilliant-hued hibiscus -\nA lovely sunset.',
      issueId: issues[2].id,
      userId: users[2].id,
    }),
    createEntity(Comment, {
      body: 'A summer river being crossed\nhow pleasing\nwith sandals in my hands!',
      issueId: issues[3].id,
      userId: users[2].id,
    }),
    createEntity(Comment, {
      body: "Light of the moon\nMoves west, flowers' shadows\nCreep eastward.",
      issueId: issues[4].id,
      userId: users[2].id,
    }),
    createEntity(Comment, {
      body: 'In the moonlight,\nThe color and scent of the wisteria\nSeems far away.',
      issueId: issues[5].id,
      userId: users[2].id,
    }),
    createEntity(Comment, {
      body: 'O snail\nClimb Mount Fuji,\nBut slowly, slowly!',
      issueId: issues[6].id,
      userId: users[2].id,
    }),
    createEntity(Comment, {
      body: 'Everything I touch\nwith tenderness, alas,\npricks like a bramble.',
      issueId: issues[7].id,
      userId: users[2].id,
    }),
  ];
  return Promise.all(comments);
};

const createGuestAccount = async (): Promise<User> => {
  const users = await seedUsers();
  const project = await seedProject(users);
  const issues = await seedIssues(project);
  await seedComments(issues, project.users);
  return users[2];
};

export default createGuestAccount;

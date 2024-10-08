import { beforeEach, describe, expect, test } from '@jest/globals';
import {
  parseAndValidateMatches,
  parseNewUserForm,
  parseTeams,
  points,
  sortTable,
  totalAlternateMatchPoints,
  totalMatchPoints,
  validateTeams,
} from './utils';
import { Table, TeamDetails } from './definitions';
import { Team } from '@prisma/client';

describe('totalMatchPoints', () => {
  const team: TeamDetails = {
    regdate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    groupno: 1,
    name: '',
  };
  beforeEach(() => {
    team.wins = 0;
    team.draws = 0;
    team.losses = 0;
  });
  test('should sum up wins correctly', () => {
    team.wins = 4;
    expect(totalMatchPoints(team)).toBe(4 * points.normal.win);
  });
  test('should sum up draws correctly', () => {
    team.draws = 3;
    expect(totalMatchPoints(team)).toBe(3 * points.normal.draw);
  });
  test('should sum up losses correctly', () => {
    team.losses = 6;
    expect(totalMatchPoints(team)).toBe(6 * points.normal.loss);
  });
  test('should sum up points correctly', () => {
    team.wins = 7;
    team.draws = 2;
    team.losses = 3;
    expect(totalMatchPoints(team)).toBe(
      7 * points.normal.win + 2 * points.normal.draw + 3 * points.normal.loss
    );
  });
});

describe('totalAlternateMatchPoints', () => {
  const team: TeamDetails = {
    regdate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    groupno: 1,
    name: '',
  };
  beforeEach(() => {
    team.wins = 0;
    team.draws = 0;
    team.losses = 0;
  });
  test('should sum up wins correctly', () => {
    team.wins = 4;
    expect(totalAlternateMatchPoints(team)).toBe(4 * points.alternate.win);
  });
  test('should sum up draws correctly', () => {
    team.draws = 3;
    expect(totalAlternateMatchPoints(team)).toBe(3 * points.alternate.draw);
  });
  test('should sum up losses correctly', () => {
    team.losses = 6;
    expect(totalAlternateMatchPoints(team)).toBe(6 * points.alternate.loss);
  });
  test('should sum up points correctly', () => {
    team.wins = 7;
    team.draws = 2;
    team.losses = 3;
    expect(totalAlternateMatchPoints(team)).toBe(
      7 * points.alternate.win +
        2 * points.alternate.draw +
        3 * points.alternate.loss
    );
  });
});

describe('sortTable', () => {
  const teamA: TeamDetails = {
    regdate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    groupno: 1,
    name: '',
  };
  const teamB: TeamDetails = {
    regdate: new Date(),
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    groupno: 1,
    name: '',
  };
  const table: Table = [teamA, teamB];
  beforeEach(() => {
    teamA.wins = 0;
    teamA.draws = 0;
    teamA.losses = 0;
    teamA.goals = 0;
    teamA.regdate = new Date();
    teamA.regdate.setMonth(1, 1);
    teamB.wins = 0;
    teamB.draws = 0;
    teamB.losses = 0;
    teamB.goals = 0;
    teamB.regdate = new Date();
    teamB.regdate.setMonth(1, 1);
  });
  test('should sort by total points first', () => {
    teamA.wins = 4;
    teamB.wins = 9;
    teamA.goals = 10;
    teamB.goals = 2;
    teamA.regdate.setMonth(1, 1);
    teamB.regdate.setMonth(11, 11);
    expect(sortTable(table)).toStrictEqual([teamB, teamA]);
  });
  test('should sort by total goals second', () => {
    teamA.wins = 1;
    teamB.draws = 3;
    teamA.goals = 9;
    teamB.goals = 11;
    teamA.regdate.setMonth(1, 1);
    teamB.regdate.setMonth(11, 11);
    expect(sortTable(table)).toStrictEqual([teamB, teamA]);
  });
  test('should sort by alternative match points third', () => {
    teamA.wins = 1;
    teamB.draws = 3;
    teamA.goals = 10;
    teamB.goals = 10;
    teamA.regdate.setMonth(1, 1);
    teamB.regdate.setMonth(11, 11);
    expect(sortTable(table)).toStrictEqual([teamB, teamA]);
  });
  test('should sort by earliest registration date finally', () => {
    teamA.regdate.setMonth(11, 11);
    teamB.regdate.setMonth(1, 1);
    expect(sortTable(table)).toStrictEqual([teamB, teamA]);
  });
});

describe('parseTeams', () => {
  const form: FormData = new FormData();
  beforeEach(() => {
    form.delete('teams');
    form.delete('matches');
  });

  test('should return an error message on blank input', () => {
    form.append('teams', '');
    expect(() => parseTeams(form)).toThrowError('Please fill in the teams.');
  });

  test('should return an error message if a team group is not 1 or 2', () => {
    form.append('teams', 'teamA 01/04 2\r\nteamB 01/04 3');
    expect(() => parseTeams(form)).toThrowError(
      'For line 2: Invalid group number "3", expected 1 or 2.'
    );
  });
  test('should return an error message if a team registration date is wrongly formatted', () => {
    form.append('teams', 'teamA 01/04 1\r\nteamB 01/024 2');
    expect(() => parseTeams(form)).toThrowError('Invalid date');
    form.set('teams', 'teamA 01/04 1\r\nteamB 00/20 2');
    expect(() => parseTeams(form)).toThrowError('Invalid date');
    form.set('teams', 'teamA 01/04 1\r\nteamB 0020 2');
    expect(() => parseTeams(form)).toThrowError('Invalid date');
  });
});

const teamA: Team = {
  name: 'teamA',
  regdate: new Date('01/01'),
  groupno: 1,
};
const teamB: Team = {
  name: 'teamB',
  regdate: new Date('01/01'),
  groupno: 1,
};
const teamC: Team = {
  name: 'teamC',
  regdate: new Date('01/01'),
  groupno: 1,
};
const teamD: Team = {
  name: 'teamD',
  regdate: new Date('01/01'),
  groupno: 2,
};
const teamE: Team = {
  name: 'teamE',
  regdate: new Date('01/01'),
  groupno: 2,
};
const teamF: Team = {
  name: 'teamE',
  regdate: new Date('01/01'),
  groupno: 2,
};
describe('parseTeams', () => {
  let teams: Team[] = [];
  beforeEach(() => {
    teams = [];
  });

  test('should return an error message if there are fewer teams in any group than specified', () => {
    teams = [teamA, teamB];

    expect(() => validateTeams(teams, 2)).toThrowError(
      'Group 2 has 0 team(s) instead of 2'
    );
    teams = [teamD, teamE];
    expect(() => validateTeams(teams, 2)).toThrowError(
      'Group 1 has 0 team(s) instead of 2'
    );
  });
  test('should return an error message if there are more teams in any group than specified', () => {
    teams = [teamA, teamB, teamC, teamD, teamE];
    expect(() => validateTeams(teams, 2)).toThrowError(
      'Group 1 has 3 team(s) instead of 2'
    );
    teams = [teamA, teamB, teamD, teamE, teamF];
    expect(() => validateTeams(teams, 2)).toThrowError(
      'Group 2 has 3 team(s) instead of 2'
    );
  });
});

describe('parseAndValidateMatches', () => {
  const form: FormData = new FormData();
  beforeEach(() => {
    form.delete('matches');
  });

  test('should return an error message on blank input', () => {
    form.append('matches', '');
    expect(() => parseAndValidateMatches([], form)).toThrowError(
      'Please fill in the matches played.'
    );
  });

  test('should return an error message if a match consist of a non-existing team', () => {
    form.append('matches', 'teamA teamE 0 0');
    expect(() => parseAndValidateMatches([teamA], form)).toThrowError(
      'For line 1: Invalid team name, team "teamE" does not exist. Did you mean "teamA"?'
    );

    form.append('matches', 'teamB teamA 0 0');
    expect(() => parseAndValidateMatches([teamA], form)).toThrowError(
      'For line 1: Invalid team name, team "teamE" does not exist. Did you mean "teamA"?'
    );
  });

  test('should return an error message on malformatted goals', () => {
    form.append('matches', 'teamA teamB hello world');
    expect(() => parseAndValidateMatches([teamA, teamB], form)).toThrowError(
      'For line 1: Invalid number of goals "hello" for the first team. Invalid number of goals "world" for the second team.'
    );
  });

  test('should return an error message if a match is between teams of different groups', () => {
    form.append('matches', 'teamA teamD 0 0');

    expect(() => parseAndValidateMatches([teamA, teamD], form)).toThrowError(
      'For line 0: teamA in group 1 cannot play against teamD in group 2.'
    );
  });

  test('should return an error message if more than one match between two teams', () => {
    form.append(
      'matches',
      'teamA teamB 0 0\r\nteamD teamE 0 0\r\nteamB teamA 0 0'
    );

    expect(() =>
      parseAndValidateMatches([teamA, teamB, teamD, teamE], form)
    ).toThrowError('Each team can only play another team once.');
  });

  test('should return an error message if there are wrong number of matches', () => {
    form.append('matches', 'teamA teamB 0 0');
    expect(() =>
      parseAndValidateMatches([teamA, teamB, teamD, teamE], form, 2)
    ).toThrowError('teamD only played 0 out of 1 game(s).');
  });
});

describe('parseNewUserForm', () => {
  const form: FormData = new FormData();
  beforeEach(() => {
    form.delete('email');
    form.delete('role');
  });

  test('should return an error message on blank input', () => {
    form.append('email', '');
    form.append('role', 'user');
    expect(() => parseNewUserForm(form)).toThrowError(
      "Please fill in user's email."
    );
  });

  test('should return an error message if the email is not valid', () => {
    form.append('email', 'blahblah');
    form.append('role', 'user');
    expect(() => parseNewUserForm(form)).toThrowError('Invalid email.');
  });
  test('should return an error message if the role is not valid', () => {
    form.append('email', 'blah@gmail.com');
    form.append('role', 'blah');
    expect(() => parseNewUserForm(form)).toThrowError('Invalid role.');
  });
});

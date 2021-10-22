import { Store } from "pullstate";

/*

Axie table scheme:

  {
    name: 'name_1',
    team: 'team_1',
    formation: 'formation_1',
    slp: 100,
    slpDailyLimit: 100,
    slpPerDay: 100,
    slpManager: 10,
    slpManagerPerc: 10,
    nextClaim: (new Date()).toISOString().slice(0,10),
    qualityTracker: 0
  }

*/

export const UIStore = new Store({
  axieTable: [  {
    name: 'name_1',
    team: 'team_1',
    formation: 'formation_1',
    slp: 100,
    slpDailyLimit: 100,
    slpPerDay: 100,
    slpManager: 10,
    slpManagerPerc: 10,
    nextClaim: (new Date()).toISOString().slice(0,10),
    qualityTracker: 0,
    telegram: '@hello'
  },
  {
    name: 'name_2',
    team: 'team_2',
    formation: 'formation_2',
    slp: 150,
    slpDailyLimit: 1100,
    slpPerDay: 1200,
    slpManager: 120,
    slpManagerPerc: 9,
    nextClaim: (new Date()).toISOString().slice(0,10),
    qualityTracker: 1,
    telegram: '@dear'
  },
  {
    name: 'name_3',
    team: 'team_3',
    formation: 'formation_3',
    slp: 101,
    slpDailyLimit: 140,
    slpPerDay: 150,
    slpManager: 101,
    slpManagerPerc: 109,
    nextClaim: (new Date()).toISOString().slice(0,10),
    qualityTracker: 2,
    telegram: '@world'
  }]
});
import { Store } from "pullstate";
import { add } from 'date-fns';

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

const UIStore = new Store({
  // axieTable: [  {
  //   name: 'Einstein',
  //   team: 'team_1',
  //   formation: 'formation_1',
  //   slp: 100,
  //   slpDailyLimit: 100,
  //   slpPerDay: 100,
  //   slpManager: 10,
  //   slpManagerPerc: 10,
  //   nextClaim: new Date(),
  //   qualityTracker: 0,
  //   telegram: '@OliCryptoBCH',
  //   notifies: '1,1,1,1',
  //   ronin: 'bb28ec1e0ef8a07d02a4e9e495532ce337bb6b36',
  //   axies: {},
  //   axieAvatar: '',
  //   axiesLoaded: 0,
  // },
  // {
  //   name: 'Newton',
  //   team: 'team_2',
  //   formation: 'formation_2',
  //   slp: 150,
  //   slpDailyLimit: 1100,
  //   slpPerDay: 1200,
  //   slpManager: 120,
  //   slpManagerPerc: 9,
  //   nextClaim: add(new Date(), {days: 1}),
  //   qualityTracker: 1,
  //   telegram: '@torw101',
  //   notifies: '1,1,1,1',
  //   ronin: 'edbc6bd7161364b747926c22a864ceff814510bd',
  //   axies: {},
  //   axieAvatar: '',
  //   axiesLoaded: 0,
  // },
  // {
  //   name: 'Kopernik',
  //   team: 'team_3',
  //   formation: 'formation_3',
  //   slp: 101,
  //   slpDailyLimit: 140,
  //   slpPerDay: 150,
  //   slpManager: 101,
  //   slpManagerPerc: 109,
  //   nextClaim: add(new Date(), {days: 3}),
  //   qualityTracker: 2,
  //   telegram: '@RampMS',
  //   notifies: '1,1,1,1',
  //   ronin: '21bde0b8180a956fbbf8f8031653b02e2b25c5d9',
  //   axies: {},
  //   axieAvatar: '',
  //   axiesLoaded: 0,
  // },
  // {
  //   name: 'Astronaut',
  //   team: 'team_1',
  //   formation: 'formation_4',
  //   slp: 101,
  //   slpDailyLimit: 140,
  //   slpPerDay: 150,
  //   slpManager: 101,
  //   slpManagerPerc: 109,
  //   nextClaim: add(new Date(), {days: 3}),
  //   qualityTracker: 3,
  //   telegram: '@RampMS',
  //   notifies: '1,1,1,1',
  //   ronin: '21bde0b8180a956fbbf8f8031653b02e2b25c5d9',
  //   axies: {},
  //   axieAvatar: '',
  //   axiesLoaded: 0,
  // },
  // {
  //   name: 'Earth',
  //   team: 'team_4',
  //   formation: 'formation_4',
  //   slp: 101,
  //   slpDailyLimit: 140,
  //   slpPerDay: 150,
  //   slpManager: 101,
  //   slpManagerPerc: 109,
  //   nextClaim: add(new Date(), {days: 3}),
  //   qualityTracker: 1,
  //   telegram: '@RampMS',
  //   notifies: '1,1,1,1',
  //   ronin: '21bde0b8180a956fbbf8f8031653b02e2b25c5d9',
  //   axies: {},
  //   axieAvatar: '',
  //   axiesLoaded: 0,
  // }],
  axieTable: [],
  teams: [],
  formations: [],
  roninCache: {},
  selectedPlayer: -1,
  selectedButton: 0,
  slpToDollar: '0.00000',
  getPlayerInfo: ()=>{},
  fetchingPlayerInfo: {p: false, a: false},
  qualityTracker: {settings: {period: 0, calcType: 0, slpInterval: '0-0', slpPercInterval: '0-0'}, data:{},},
});

const AnalyticsStore = new Store({

  usersTable: {},
  uniqueRonins: [],

});

export { UIStore, AnalyticsStore };
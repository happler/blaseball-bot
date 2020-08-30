import moment from "moment";

class ChannelSubscription {
  constructor(teamName, channel, duration) {
    duration = duration ? duration : 60;
    this.teamName = teamName;
    this.channel = channel;
    this.endTime = moment().add(duration, "minutes");
    this.gameData = {
      id: "",
      basesOccupied: [],
      baseRunners: [],
      inning: 0,
      awayScore: 0,
      homeScore: 0,
      halfInningOuts: 0,
    };
  }

  sendGameUpdates = (data) => {
    const game = findGame();
    if (gameHadNotableChange()) {
      this.channel.send(game.lastUpdate);
    }
  };

  findGame = () =>
    data.schedule.find(
      (x) =>
        x.awayTeamName === this.teamName || x.homeTeamName === this.teamName
    );

  gameHadNotableChange = () => {
    Object.keys(this.gameData).some((key) => {
      this.gameData[key] !== game[key];
    });
  };

  active = () => {
    this.endTime > moment();
  };
}

export default ChannelSubscription;

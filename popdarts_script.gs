// =============================================================================
// POPDARTS v5.5 - GOOGLE APPS SCRIPT WITH LIVE GAME SYNC
// =============================================================================
// Deploy: Extensions > Apps Script > Deploy as Web App
// Execute as: Me, Access: Anyone
// =============================================================================

const SHEET_ID = ''; // ADD YOUR SHEET ID HERE

function doGet(e) {
  const action = e.parameter.action || 'status';
  let result;
  
  try {
    switch(action) {
      case 'players': result = getPlayers(); break;
      case 'draw': result = getDraw(); break;
      case 'stats': result = getStats(); break;
      case 'liveGame': result = getLiveGame(); break;
      case 'status': result = { status: 'ok', version: '5.5' }; break;
      default: result = { error: 'Unknown action' };
    }
  } catch(err) {
    result = { error: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: !result.error, data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let result;
  
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'addPlayer': result = addPlayer(data.playerName); break;
      case 'submitGame': result = submitGame(data); break;
      case 'generateDraw': result = generateDraw(); break;
      case 'newEvent': result = newEvent(); break;
      case 'updateLiveGame': result = updateLiveGame(data); break;
      case 'clearLiveGame': result = clearLiveGame(); break;
      default: result = { error: 'Unknown action' };
    }
  } catch(err) {
    result = { error: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify({ success: !result.error, data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

// =============================================================================
// SHEET HELPERS
// =============================================================================

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    initSheet(sheet, name);
  }
  return sheet;
}

function initSheet(sheet, name) {
  switch(name) {
    case 'Players':
      sheet.appendRow(['Name', 'Added']);
      break;
    case 'Draw':
      sheet.appendRow(['GameNum', 'Player1', 'Player2', 'Score1', 'Score2', 'Winner', 'Timestamp']);
      break;
    case 'Stats':
      sheet.appendRow(['Name', 'GamesPlayed', 'Wins', 'Losses', 'PointsFor', 'PointsAgainst', 'PointsDiff', 'Championships']);
      break;
    case 'Config':
      sheet.appendRow(['Key', 'Value']);
      sheet.appendRow(['TargetScore', '21']);
      sheet.appendRow(['EventName', 'PopDarts Championship']);
      break;
    case 'LiveGame':
      sheet.appendRow(['Key', 'Value']);
      sheet.appendRow(['Active', 'false']);
      sheet.appendRow(['GameId', '']);
      sheet.appendRow(['Player1', '']);
      sheet.appendRow(['Player2', '']);
      sheet.appendRow(['Score1', '0']);
      sheet.appendRow(['Score2', '0']);
      sheet.appendRow(['Color1', '']);
      sheet.appendRow(['Color2', '']);
      sheet.appendRow(['Target', '21']);
      sheet.appendRow(['IsChamp', 'false']);
      sheet.appendRow(['IsGF', 'false']);
      sheet.appendRow(['LastUpdate', '']);
      break;
  }
}

// =============================================================================
// PLAYERS
// =============================================================================

function getPlayers() {
  const sheet = getSheet('Players');
  const data = sheet.getDataRange().getValues();
  const players = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) players.push(data[i][0]);
  }
  return { players };
}

function addPlayer(name) {
  if (!name || !name.trim()) return { error: 'Invalid name' };
  const sheet = getSheet('Players');
  const data = sheet.getDataRange().getValues();
  
  // Check duplicate
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toLowerCase() === name.trim().toLowerCase()) {
      return { error: 'Player exists' };
    }
  }
  
  sheet.appendRow([name.trim(), new Date()]);
  
  // Also add to stats
  const statsSheet = getSheet('Stats');
  statsSheet.appendRow([name.trim(), 0, 0, 0, 0, 0, 0, 0]);
  
  return { added: name.trim() };
}

// =============================================================================
// DRAW
// =============================================================================

function getDraw() {
  const sheet = getSheet('Draw');
  const data = sheet.getDataRange().getValues();
  const games = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] && data[i][2]) {
      games.push({
        id: i,
        gameNum: data[i][0],
        player1: data[i][1],
        player2: data[i][2],
        score1: data[i][3] || null,
        score2: data[i][4] || null,
        winner: data[i][5] || null
      });
    }
  }
  
  // Get config
  const configSheet = getSheet('Config');
  const config = configSheet.getDataRange().getValues();
  let targetScore = 21;
  for (let i = 1; i < config.length; i++) {
    if (config[i][0] === 'TargetScore') targetScore = parseInt(config[i][1]) || 21;
  }
  
  // Check for grand final
  let grandFinal = null;
  const gfGame = games.find(g => g.gameNum === 'GF');
  if (gfGame) {
    grandFinal = gfGame;
  }
  
  return { games: games.filter(g => g.gameNum !== 'GF'), grandFinal, targetScore };
}

function generateDraw() {
  const playersData = getPlayers();
  const players = playersData.players;
  
  if (players.length < 2) return { error: 'Need 2+ players' };
  
  // Clear existing draw
  const sheet = getSheet('Draw');
  sheet.clear();
  sheet.appendRow(['GameNum', 'Player1', 'Player2', 'Score1', 'Score2', 'Winner', 'Timestamp']);
  
  // Generate round robin
  const pairs = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      pairs.push([players[i], players[j]]);
    }
  }
  
  // Shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  
  // Add to sheet
  pairs.forEach((pair, i) => {
    sheet.appendRow([i + 1, pair[0], pair[1], '', '', '', '']);
  });
  
  return { gamesCreated: pairs.length };
}

function submitGame(data) {
  const sheet = getSheet('Draw');
  const rows = sheet.getDataRange().getValues();
  
  // Find the game row
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == data.gameId || (rows[i][1] === data.player1 && rows[i][2] === data.player2)) {
      // Update scores and winner
      const winner = data.score1 > data.score2 ? data.player1 : data.player2;
      sheet.getRange(i + 1, 4).setValue(data.score1);
      sheet.getRange(i + 1, 5).setValue(data.score2);
      sheet.getRange(i + 1, 6).setValue(winner);
      sheet.getRange(i + 1, 7).setValue(new Date());
      
      // Update stats
      updatePlayerStats(data.player1, data.player2, winner, data.score1, data.score2);
      
      // Clear live game
      clearLiveGame();
      
      // Check for grand final
      checkAndCreateGrandFinal();
      
      return { saved: true, winner };
    }
  }
  
  return { error: 'Game not found' };
}

function checkAndCreateGrandFinal() {
  const sheet = getSheet('Draw');
  const rows = sheet.getDataRange().getValues();
  
  // Check if all regular games are complete
  let allComplete = true;
  let hasGF = false;
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === 'GF') {
      hasGF = true;
    } else if (!rows[i][5]) { // No winner
      allComplete = false;
    }
  }
  
  if (allComplete && !hasGF && rows.length > 1) {
    // Get top 2 from standings
    const stats = getStats().stats;
    const sorted = stats.sort((a, b) => b.wins - a.wins || b.pointsDiff - a.pointsDiff);
    
    if (sorted.length >= 2) {
      sheet.appendRow(['GF', sorted[0].name, sorted[1].name, '', '', '', '']);
    }
  }
}

// =============================================================================
// STATS
// =============================================================================

function getStats() {
  const sheet = getSheet('Stats');
  const data = sheet.getDataRange().getValues();
  const stats = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      stats.push({
        name: data[i][0],
        gamesPlayed: data[i][1] || 0,
        wins: data[i][2] || 0,
        losses: data[i][3] || 0,
        pointsFor: data[i][4] || 0,
        pointsAgainst: data[i][5] || 0,
        pointsDiff: data[i][6] || 0,
        championships: data[i][7] || 0
      });
    }
  }
  
  return { stats };
}

function updatePlayerStats(p1, p2, winner, s1, s2) {
  const sheet = getSheet('Stats');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const name = data[i][0];
    if (name === p1 || name === p2) {
      const isP1 = name === p1;
      const myScore = isP1 ? s1 : s2;
      const theirScore = isP1 ? s2 : s1;
      const won = name === winner;
      
      sheet.getRange(i + 1, 2).setValue((data[i][1] || 0) + 1); // GP
      sheet.getRange(i + 1, 3).setValue((data[i][2] || 0) + (won ? 1 : 0)); // Wins
      sheet.getRange(i + 1, 4).setValue((data[i][3] || 0) + (won ? 0 : 1)); // Losses
      sheet.getRange(i + 1, 5).setValue((data[i][4] || 0) + myScore); // PF
      sheet.getRange(i + 1, 6).setValue((data[i][5] || 0) + theirScore); // PA
      sheet.getRange(i + 1, 7).setValue((data[i][6] || 0) + myScore - theirScore); // Diff
    }
  }
}

// =============================================================================
// LIVE GAME - Multi-device sync!
// =============================================================================

function getLiveGame() {
  const sheet = getSheet('LiveGame');
  const data = sheet.getDataRange().getValues();
  const live = {};
  
  for (let i = 1; i < data.length; i++) {
    live[data[i][0].toLowerCase().replace(/\s/g, '')] = data[i][1];
  }
  
  return {
    active: live.active === 'true',
    gameId: live.gameid,
    player1: live.player1,
    player2: live.player2,
    score1: parseInt(live.score1) || 0,
    score2: parseInt(live.score2) || 0,
    color1: live.color1,
    color2: live.color2,
    target: parseInt(live.target) || 21,
    isChamp: live.ischamp === 'true',
    isGF: live.isgf === 'true',
    lastUpdate: live.lastupdate
  };
}

function updateLiveGame(data) {
  const sheet = getSheet('LiveGame');
  
  // Update all values
  const updates = [
    ['Active', data.active ? 'true' : 'false'],
    ['GameId', data.gameId || ''],
    ['Player1', data.player1 || ''],
    ['Player2', data.player2 || ''],
    ['Score1', (data.score1 || 0).toString()],
    ['Score2', (data.score2 || 0).toString()],
    ['Color1', data.color1 || ''],
    ['Color2', data.color2 || ''],
    ['Target', (data.target || 21).toString()],
    ['IsChamp', data.isChamp ? 'true' : 'false'],
    ['IsGF', data.isGF ? 'true' : 'false'],
    ['LastUpdate', new Date().toISOString()]
  ];
  
  const rows = sheet.getDataRange().getValues();
  updates.forEach(([key, value]) => {
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(value);
        break;
      }
    }
  });
  
  return { updated: true, timestamp: new Date().toISOString() };
}

function clearLiveGame() {
  const sheet = getSheet('LiveGame');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === 'Active') {
      sheet.getRange(i + 1, 2).setValue('false');
    }
  }
  
  return { cleared: true };
}

// =============================================================================
// EVENT MANAGEMENT
// =============================================================================

function newEvent() {
  // Clear draw
  const drawSheet = getSheet('Draw');
  drawSheet.clear();
  drawSheet.appendRow(['GameNum', 'Player1', 'Player2', 'Score1', 'Score2', 'Winner', 'Timestamp']);
  
  // Clear live game
  clearLiveGame();
  
  return { cleared: true };
}

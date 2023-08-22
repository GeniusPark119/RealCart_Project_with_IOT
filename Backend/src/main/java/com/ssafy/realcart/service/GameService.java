package com.ssafy.realcart.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import com.ssafy.realcart.data.dto.BetDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.realcart.data.dao.inter.IGameDAO;
import com.ssafy.realcart.data.dao.inter.IPlayDAO;
import com.ssafy.realcart.data.dao.inter.IRecordDAO;
import com.ssafy.realcart.data.dao.inter.IUserDAO;
import com.ssafy.realcart.data.dto.GameDto;
import com.ssafy.realcart.data.dto.PlayDto;
import com.ssafy.realcart.data.dto.PlayResponseDto;
import com.ssafy.realcart.data.entity.Game;
import com.ssafy.realcart.data.entity.Play;
import com.ssafy.realcart.data.entity.Record;
import com.ssafy.realcart.data.entity.User;
import com.ssafy.realcart.service.inter.IGameService;

import io.netty.util.internal.ConcurrentSet;
@Service
public class GameService implements IGameService{

	private final ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<String>();
	private final ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<String, Integer>();
	private String[] currentUsers = {"admin", "admin"};
	private String[] waitingUsers = new String[2];
	private long timeLimit = -1;
	private int recent = -1;
	private int red = 0;
	private int blue = 0;
	
	private IUserDAO userDAO;
	private IGameDAO gameDAO;
	private IPlayDAO playDAO;
	private IRecordDAO recordDAO;
	private final Logger LOGGER = LoggerFactory.getLogger(GameService.class);
	
	@Autowired
    public GameService(IUserDAO userDAO, IGameDAO gameDAO, IPlayDAO playDAO, IRecordDAO recordDAO){
        this.userDAO = userDAO;
        this.gameDAO = gameDAO;
        this.playDAO = playDAO;
        this.recordDAO = recordDAO;
    }

	@Override
	public synchronized int participateGame(String nickname) {
		if(timeLimit != -1) { // 미리 예약된 유저가 있을 수 있다. (있다면 시간 내에 들어와야한다.)
			Long currentTime = System.currentTimeMillis();
			if(currentTime - timeLimit > 30000) { // 제한 시간이 지나버렸다면 더 이상 우선 순위자가 아님
				Arrays.fill(waitingUsers, null);
				int index = 0;
				int num = 1;
				for (int i = 0; i < currentUsers.length; i++) {
					if(currentUsers[i] != null) num--;
				}
				int size = queue.size();
				while(size-- > 0) {
					if(index > num) break;
					waitingUsers[index++] = queue.poll();
					timeLimit = System.currentTimeMillis(); // 시간제한이 다시 생김
				}
			}
		}
		//CurrentUsers에 있는 이용자라면 -100을 리턴
		for (String string : currentUsers) {
			if(nickname.equals(string)) return -100;
		}
		
		//존재하지 않는 닉네임의 이용자라면 -100을 리턴
		if(map.getOrDefault(nickname, 0) == 0) {
			User user = userDAO.checkNickname(nickname);
			if(user == null) return -100;
			else {
				map.put(nickname, 1);
			}
		}
		
		//Queue에 있는 이용자라면 자신의 앞에 몇 명 있는지 체크해서 보내 줌 
		int index = 0;
		for (String string : queue) {
			if(nickname.equals(string)) {
				for (int i = 0; i < waitingUsers.length; i++) {
					if(waitingUsers[i] != null) index++;
				}
				return index;
			}
			index++;
		}
		
		//CurrentUsers가 0명이라면
		if(currentUsers[0] == null && currentUsers[1] == null) {
			//WaitingUsers가 0명이라면
			if(waitingUsers[0] == null && waitingUsers[1] == null) {
				currentUsers[0] = nickname;
				return -1;
			}
			//WaitingUsers가 1명이라면
			else if(waitingUsers[0] != null && waitingUsers[1] == null) {
				if(waitingUsers[0].equals(nickname)) {
					waitingUsers[0] = null;
				}
				currentUsers[0] = nickname;
				return -1;
			}
			//WaitingUsers가 1명이라면
			else if(waitingUsers[0] == null && waitingUsers[1] != null) {
				if(waitingUsers[1].equals(nickname)) {
					waitingUsers[1] = null;
				}
				currentUsers[0] = nickname;
				return -1;
			}
			//WaitingUsers가 2명이라면
			else {
				if(waitingUsers[0].equals(nickname)) {
					waitingUsers[0] = null;
					currentUsers[0] = nickname;
					return -1;
				}
				else if(waitingUsers[1].equals(nickname)) {
					waitingUsers[1] = null;
					currentUsers[0] = nickname;
					return -1;
				}
				else {
					queue.add(nickname);
					return queue.size() + 1;
				}
			}
		}
		//CurrentUsers가 1명이라면
		if(currentUsers[0] != null && currentUsers[1] == null) {
			//WaitingUsers가 0명이라면
			if(waitingUsers[0] == null && waitingUsers[1] == null) {
				currentUsers[1] = nickname;
				return -2;
			}
			//WaitingUsers가 1명이라면
			else if(waitingUsers[0] != null && waitingUsers[1] == null) {
				if(waitingUsers[0].equals(nickname)) {
					waitingUsers[0] = null;
					currentUsers[1] = nickname;
					return -2;
				}
				else {
					queue.add(nickname);
					return queue.size();
				}
			}
			//WaitingUsers가 1명이라면
			else if(waitingUsers[0] == null && waitingUsers[1] != null) {
				if(waitingUsers[1].equals(nickname)) {
					waitingUsers[1] = null;
					currentUsers[1] = nickname;
					return -2;
				}
				else {
					queue.add(nickname);
					return queue.size();
				}
			}
			//WaitingUsers가 2명이라면
			else {
				if(waitingUsers[0].equals(nickname)) {
					waitingUsers[0] = null;
					currentUsers[1] = nickname;
					return -2;
				}
				else if(waitingUsers[1].equals(nickname)) {
					waitingUsers[1] = null;
					currentUsers[1] = nickname;
					return -2;
				}
				else {
					queue.add(nickname);
					return queue.size() + 1;
				}
			}
		}
		//CurrentUsers가 1명이라면
		if(currentUsers[0] == null && currentUsers[1] != null) {
			//WaitingUsers가 0명이라면
			if(waitingUsers[0] == null && waitingUsers[1] == null) {
				currentUsers[0] = nickname;
				return -2;
			}
			//WaitingUsers가 1명이라면
			else if(waitingUsers[0] != null && waitingUsers[1] == null) {
				if(waitingUsers[0].equals(nickname)) {
					waitingUsers[0] = null;
					currentUsers[0] = nickname;
					return -2;
				}
				else {
					queue.add(nickname);
					return queue.size();
				}
			}
			//WaitingUsers가 1명이라면
			else if(waitingUsers[0] == null && waitingUsers[1] != null) {
				if(waitingUsers[1].equals(nickname)) {
					waitingUsers[1] = null;
					currentUsers[0] = nickname;
					return -2;
				}
				else {
					queue.add(nickname);
					return queue.size();
				}
			}
			//WaitingUsers가 2명이라면
			else {
				if(waitingUsers[0].equals(nickname)) {
					waitingUsers[0] = null;
					currentUsers[0] = nickname;
					return -2;
				}
				else if(waitingUsers[1].equals(nickname)) {
					waitingUsers[1] = null;
					currentUsers[0] = nickname;
					return -2;
				}
				else {
					queue.add(nickname);
					return queue.size() + 1;
				}
			}
		}
		//CurrentUsers가 2명이라면
		else {
			queue.add(nickname);
			return queue.size() - 1;
			
		}

	}

	@Override
	public void startGame() {
		
		Game game = gameDAO.getGame(recent);
		Play play1 = new Play();
		User user1 = userDAO.checkNickname(currentUsers[0]);
		play1.setUser(user1);
		play1.setGame(game);
		playDAO.createPlay(play1);
		Play play2 = new Play();
		User user2 = userDAO.checkNickname(currentUsers[1]);
		play2.setUser(user2);
		play2.setGame(game);
		playDAO.createPlay(play2);
		
	}

	@Override
	public String checkQueue() {
		StringBuilder sb = new StringBuilder();
		for (String string : waitingUsers) {
			if(string != null) {
				sb.append(string).append(",");
			}
		}
		for (String string : queue) {
			sb.append(string).append(",");
		}
		return sb.toString();
	}

	@Override
	public boolean endGame(PlayDto playDto) {
		if(currentUsers[0] == null || currentUsers[1] == null) {
			return false;
		}
		startGame();
		Game game = gameDAO.getGame(recent);
		List<Play> list = playDAO.getPlay(game.getId());
		for (Play play : list) {
			String nickName = play.getUser().getNickname();
			LOGGER.info(nickName);
			if(nickName.equals(playDto.getNickname1())) {
				play.setLapTime(playDto.getLaptime1());
				Record record = recordDAO.getRecord(play.getUser().getUserId());
				if(record == null) {
					record = new Record();
					record.setUser(play.getUser());
					record.setLapTime(play.getLapTime());
					recordDAO.saveRecord(record);
				}
				else if(record.getLapTime() > play.getLapTime()) {
					record.setLapTime(play.getLapTime());
					recordDAO.saveRecord(record);
				}
				byte isWin = playDto.getLaptime1() < playDto.getLaptime2() ? (byte) 1 : (byte) 0;
				play.setIsWin(isWin);
			}
			else {
				play.setLapTime(playDto.getLaptime2());
				Record record = recordDAO.getRecord(play.getUser().getUserId());
				if(record == null) {
					record = new Record();
					record.setUser(play.getUser());
					record.setLapTime(play.getLapTime());
					recordDAO.saveRecord(record);
				}
				else if(record.getLapTime() > play.getLapTime()) {
					record.setLapTime(play.getLapTime());
					recordDAO.saveRecord(record);
				}
				byte isWin = playDto.getLaptime1() < playDto.getLaptime2() ? (byte) 0 : (byte) 1;
				play.setIsWin(isWin);
			}
			playDAO.createPlay(play);
		}
		currentUsers[0] = "admin";
		currentUsers[1] = "admin";
		return true;
		
	}

	@Override
	public boolean createGame() {
		Game game = gameDAO.createGame();
		recent = game.getId();
		red = 0;
		blue = 0;
		Arrays.fill(currentUsers, null);
		int size = queue.size();
		int index = 0;
		while(size-- > 0) {
			if(index > 1) break;
			if(waitingUsers[index] == null) {
				waitingUsers[index++] = queue.poll();
			}
			timeLimit = System.currentTimeMillis(); // 시간제한이 다시 생김
		}
		return true;
	}

	@Override
	public GameDto getGame() {
		GameDto gameDto = new GameDto();
		gameDto.setId(recent);
		gameDto.setPlayer1("admin".equals(currentUsers[0]) || currentUsers[0] == null?"":currentUsers[0]);
		gameDto.setPlayer2("admin".equals(currentUsers[1]) || currentUsers[1] == null?"":currentUsers[1]);
		return gameDto;
	}

	@Override
	public GameDto getGame(int id) {
		GameDto gameDto = new GameDto();
		List<Play> list = playDAO.getPlay(id);
		if(list == null) {
			return null;
		}
		gameDto.setId(id);
		int index = 0;
		SimpleDateFormat sdf = new SimpleDateFormat("mm:ss.SSS");
		for (Play play : list) {
			if(index++ == 0) {
				gameDto.setPlayer1(play.getUser().getNickname());
				if(play.getLapTime() == Long.MAX_VALUE) {
					gameDto.setLapTime1("기권");
				}
				else {
					gameDto.setLapTime1(sdf.format(new Date(play.getLapTime())));
				}
			}
			else {
				gameDto.setPlayer2(play.getUser().getNickname());
				if(play.getLapTime() == Long.MAX_VALUE) {
					gameDto.setLapTime2("기권");
				}
				else {
					gameDto.setLapTime2(sdf.format(new Date(play.getLapTime())));
				}
			}
		}
		return gameDto;
	}

	@Override
	public boolean up(int teamId) {
		if(teamId == 1){
			red++;
		}
		else if(teamId == 2){
			blue++;
		}
		else{
			return false;
		}
		return true;
	}

	@Override
	public BetDto getBet() {
		BetDto betDto = new BetDto().builder().red(red).blue(blue).build();
		return betDto;
	}

}

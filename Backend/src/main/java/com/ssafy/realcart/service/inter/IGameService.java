package com.ssafy.realcart.service.inter;

import com.ssafy.realcart.data.dto.BetDto;
import org.springframework.stereotype.Service;

import com.ssafy.realcart.data.dto.GameDto;
import com.ssafy.realcart.data.dto.PlayDto;

@Service
public interface IGameService {

	int participateGame(String nickname);
	void startGame();
	String checkQueue();
	boolean endGame(PlayDto playDto);
	boolean createGame();
	GameDto getGame();
	GameDto getGame(int id);

	boolean up(int teamId);

	BetDto getBet();
}

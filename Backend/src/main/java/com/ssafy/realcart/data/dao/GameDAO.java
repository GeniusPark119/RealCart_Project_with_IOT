package com.ssafy.realcart.data.dao;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ssafy.realcart.data.dao.inter.IGameDAO;
import com.ssafy.realcart.data.entity.Game;
import com.ssafy.realcart.data.repository.IGameRepository;
@Component
public class GameDAO implements IGameDAO {

	IGameRepository gameRepository;
	private final Logger LOGGER = LoggerFactory.getLogger(GameDAO.class);
	
	@Autowired
	public GameDAO(IGameRepository gameRepository) {
		this.gameRepository = gameRepository;
	}
	@Override
	public Game createGame() {
		Game game = new Game();
		return gameRepository.save(game);
	}
	@Override
	public Game getGame(int id) {
		Optional<Game> gameSelected = gameRepository.findById(id);
		if(gameSelected != null) {
			Game game = gameSelected.get();
			return game;
		}
		return null;
	}

}

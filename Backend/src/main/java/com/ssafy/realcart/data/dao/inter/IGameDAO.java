package com.ssafy.realcart.data.dao.inter;

import com.ssafy.realcart.data.entity.Game;

public interface IGameDAO {
	Game createGame();
	Game getGame(int id);
}

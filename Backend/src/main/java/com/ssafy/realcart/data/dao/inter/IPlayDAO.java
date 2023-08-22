package com.ssafy.realcart.data.dao.inter;

import java.util.List;

import com.ssafy.realcart.data.entity.Play;

public interface IPlayDAO {

	boolean createPlay(Play play);

	List<Play> getPlay(int id);

	List<Play> getAllPlay(int userId);
}

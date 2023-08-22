package com.ssafy.realcart.data.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ssafy.realcart.data.dao.inter.IPlayDAO;
import com.ssafy.realcart.data.entity.Play;
import com.ssafy.realcart.data.repository.IPlayRepository;
import com.ssafy.realcart.data.repository.IUserRepository;
@Component
public class PlayDAO implements IPlayDAO {
	
	IPlayRepository playRepository;
	private final Logger LOGGER = LoggerFactory.getLogger(PlayDAO.class);

	@Autowired
    public PlayDAO(IPlayRepository playRepository) {
        this.playRepository = playRepository;
    }

	@Override
	public boolean createPlay(Play play) {
		if(playRepository.save(play) != null) {
			return true;
		}
		return false;
	}

	@Override
	public List<Play> getPlay(int id) {
		return playRepository.findByGAME_FK(id);
	}

	@Override
	public List<Play> getAllPlay(int userId) {
		return playRepository.findByUSER_FK(userId);
	}

}

package com.ssafy.realcart.data.dao;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ssafy.realcart.data.dao.inter.IBoardNoticeDAO;
import com.ssafy.realcart.data.entity.BoardNotice;
import com.ssafy.realcart.data.repository.IBoardNoticeRepository;
@Component
public class BoardNoticeDAO implements IBoardNoticeDAO {
	
	private IBoardNoticeRepository boardNoticeRepository;
    private final Logger LOGGER = LoggerFactory.getLogger(BoardNoticeDAO.class);


    @Autowired
    public BoardNoticeDAO(IBoardNoticeRepository boardNoticeRepository) {
        this.boardNoticeRepository = boardNoticeRepository;
    }

	@Override
	public boolean saveNotice(BoardNotice boardNotice) {
		if(boardNoticeRepository.save(boardNotice) != null) {
			return true;
		}
		return false;
	}

	@Override
	public List<BoardNotice> getBoardNoticeAll() {
		return boardNoticeRepository.findAll();
	}

	@Override
	public BoardNotice getBoardNotice(int id) {
		Optional<BoardNotice> selectedBoardNotice = boardNoticeRepository.findById(id);
		
		if(selectedBoardNotice.isPresent()) {
			BoardNotice boardNotice = selectedBoardNotice.get();
			
			return boardNotice;
		}
		return null;
	}


	@Override
	public boolean deleteNotice(int id) {
		Optional<BoardNotice> selectedBoardNotice = boardNoticeRepository.findById(id);
		
		if(selectedBoardNotice.isPresent()) {
			BoardNotice boardNotice = selectedBoardNotice.get();
			boardNoticeRepository.delete(boardNotice);
			return true;
		}
		return false;
	}

}

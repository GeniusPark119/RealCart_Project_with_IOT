package com.ssafy.realcart.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.realcart.data.dao.inter.IBoardNoticeDAO;
import com.ssafy.realcart.data.dto.BoardDto;
import com.ssafy.realcart.data.dto.BoardNoticeDto;
import com.ssafy.realcart.data.entity.BoardNotice;
import com.ssafy.realcart.service.inter.IBoardNoticeService;
@Service
public class BoardNoticeService implements IBoardNoticeService {
	
	private IBoardNoticeDAO boardNoticeDAO;
    private final Logger LOGGER = LoggerFactory.getLogger(BoardNoticeService.class);

    @Autowired
    public BoardNoticeService(IBoardNoticeDAO boardNoticeDAO){
        this.boardNoticeDAO = boardNoticeDAO;
    }

	@Override
	@Transactional
	public boolean createNotice(BoardDto boardDto) {
		BoardNotice boardNotice = new BoardNotice();
		boardNotice.setContent(boardDto.getContent());
		boardNotice.setTitle(boardDto.getTitle());
		if(boardNoticeDAO.saveNotice(boardNotice)) {
			return true;
		}
		return false;
	}

	@Override
	@Transactional(readOnly = true)
	public List<BoardNoticeDto> getBoardNoticeAll() {
		List<BoardNotice> boardNotices = boardNoticeDAO.getBoardNoticeAll();
		List<BoardNoticeDto> boardNoticeDtos = new ArrayList<BoardNoticeDto>();
		for (int i = boardNotices.size() - 1; i >= 0; i--) {
			BoardNotice boardNotice = boardNotices.get(i);
			BoardNoticeDto boardNoticeDto = new BoardNoticeDto();
			boardNoticeDto.setContent(boardNotice.getContent());
			boardNoticeDto.setCreatedTime(boardNotice.getCreatedDate());
			boardNoticeDto.setId(boardNotice.getId());
			boardNoticeDto.setModifiedTime(boardNotice.getModifiedDate());
			boardNoticeDto.setTitle(boardNotice.getTitle());
			boardNoticeDto.setHit(boardNotice.getHit());
			boardNoticeDtos.add(boardNoticeDto);
		}
		return boardNoticeDtos;
	}

	@Override
	@Transactional
	public BoardNoticeDto getBoardNotice(int id) {
		BoardNotice boardNotice = boardNoticeDAO.getBoardNotice(id);
		if(boardNotice == null) return null;
		boardNotice.setHit(boardNotice.getHit() + 1);
		boardNoticeDAO.saveNotice(boardNotice);
		BoardNoticeDto boardNoticeDto = new BoardNoticeDto();
		boardNoticeDto.setContent(boardNotice.getContent());
		boardNoticeDto.setCreatedTime(boardNotice.getCreatedDate());
		boardNoticeDto.setId(boardNotice.getId());
		boardNoticeDto.setModifiedTime(boardNotice.getModifiedDate());
		boardNoticeDto.setTitle(boardNotice.getTitle());
		boardNoticeDto.setHit(boardNotice.getHit()+1);
		return boardNoticeDto;
	}

	@Override
	@Transactional
	public boolean changeNotice(int id, BoardDto boardDto) {
		BoardNotice boardNotice = boardNoticeDAO.getBoardNotice(id);
		if(boardNotice != null) {
			boardNotice.setContent(boardDto.getContent());
			boardNotice.setTitle(boardDto.getTitle());
			return boardNoticeDAO.saveNotice(boardNotice);
		}
		return false;
	}

	@Override
	@Transactional
	public boolean deleteNotice(int id) {

		return boardNoticeDAO.deleteNotice(id);
	}

}

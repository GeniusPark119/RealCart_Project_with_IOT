package com.ssafy.realcart.service.inter;

import java.util.List;

import com.ssafy.realcart.data.dto.BoardDto;
import com.ssafy.realcart.data.dto.BoardNoticeDto;

public interface IBoardNoticeService {
	boolean createNotice(BoardDto boardDto);
    List<BoardNoticeDto> getBoardNoticeAll();
    BoardNoticeDto getBoardNotice(int id);
	boolean changeNotice(int id, BoardDto boardDto);
	boolean deleteNotice(int id);
}

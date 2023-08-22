package com.ssafy.realcart.data.dao.inter;

import java.util.List;

import com.ssafy.realcart.data.entity.BoardNotice;

public interface IBoardNoticeDAO {
	boolean saveNotice(BoardNotice boardNotice);
    List<BoardNotice> getBoardNoticeAll();
    BoardNotice getBoardNotice(int id);

	boolean deleteNotice(int id);
}

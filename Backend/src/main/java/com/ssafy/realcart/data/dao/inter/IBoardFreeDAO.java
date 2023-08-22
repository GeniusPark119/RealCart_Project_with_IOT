package com.ssafy.realcart.data.dao.inter;

import java.util.List;

import com.ssafy.realcart.data.entity.BoardFree;
import com.ssafy.realcart.data.entity.Comment;

public interface IBoardFreeDAO {
    boolean saveFree(BoardFree boardFree);
    List<BoardFree> getBoardFreeAll();
    BoardFree getBoardFree(int id);
    List<Comment> getCommentByBoardId(int id);

    boolean saveFreeComment(Comment comment);
	boolean deleteFree(int id);
	Comment getComment(int commentId);
	boolean deleteComment(int commentId);
}

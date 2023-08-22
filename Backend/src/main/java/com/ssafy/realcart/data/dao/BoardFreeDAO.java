package com.ssafy.realcart.data.dao;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ssafy.realcart.data.dao.inter.IBoardFreeDAO;
import com.ssafy.realcart.data.entity.BoardFree;
import com.ssafy.realcart.data.entity.Comment;
import com.ssafy.realcart.data.repository.IBoardFreeRepository;
import com.ssafy.realcart.data.repository.ICommentRepository;

@Component
public class BoardFreeDAO implements IBoardFreeDAO {

    private IBoardFreeRepository boardFreeRepository;
    private ICommentRepository commentRepository;
    private final Logger LOGGER = LoggerFactory.getLogger(BoardFreeDAO.class);


    @Autowired
    public BoardFreeDAO(IBoardFreeRepository boardFreeRepository, ICommentRepository commentRepository) {
        this.boardFreeRepository = boardFreeRepository;
        this.commentRepository = commentRepository;
    }


    @Override
    public boolean saveFree(BoardFree boardFree) {
    	LOGGER.info("createFree 메세드를 BoardFreeDAO에서 진입");
        boardFreeRepository.save(boardFree);
        return true;
    }

    @Override
    public List<BoardFree> getBoardFreeAll() {
        return boardFreeRepository.findAll();
    }

    @Override
    public BoardFree getBoardFree(int id) {
        Optional<BoardFree> article = boardFreeRepository.findById(id);
        if(article.isPresent()){
            BoardFree boardFree = article.get();
            return boardFree;
        }
        return null;
    }

    @Override
    public List<Comment> getCommentByBoardId(int id) {
        return commentRepository.findByBOARD_FK(id);
    }

    @Override
    public boolean saveFreeComment(Comment comment) {
        if(commentRepository.save(comment) != null){
            return true;
        }
        return false;
    }


	@Override
	public boolean deleteFree(int id) {
		Optional<BoardFree> boardFree = boardFreeRepository.findById(id);
		
		if(boardFree.isPresent()) {
			BoardFree board = boardFree.get();
			boardFreeRepository.delete(board);
			return true;
		}
		return false;
		
	}


	@Override
	public Comment getComment(int commentId) {
		Optional<Comment> selectedComment = commentRepository.findById(commentId);
		
		if(selectedComment.isPresent()) {
			Comment comment = selectedComment.get();
			return comment;
		}
		return null;
	}


	@Override
	public boolean deleteComment(int commentId) {
		Optional<Comment> selectedComment = commentRepository.findById(commentId);
		
		if(selectedComment.isPresent()) {
			Comment comment = selectedComment.get();
			commentRepository.delete(comment);
			return true;
		}
		return false;
	}
}

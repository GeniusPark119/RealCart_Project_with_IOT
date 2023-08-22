package com.ssafy.realcart.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.realcart.data.dao.inter.IBoardFreeDAO;
import com.ssafy.realcart.data.dao.inter.IUserDAO;
import com.ssafy.realcart.data.dto.BoardDto;
import com.ssafy.realcart.data.dto.BoardFreeDto;
import com.ssafy.realcart.data.dto.CommentDto;
import com.ssafy.realcart.data.entity.BoardFree;
import com.ssafy.realcart.data.entity.Comment;
import com.ssafy.realcart.data.entity.User;
import com.ssafy.realcart.service.inter.IBoardFreeService;

@Service
public class BoardFreeService implements IBoardFreeService {

    private IBoardFreeDAO boardFreeDAO;
    private IUserDAO userDAO;
    private final Logger LOGGER = LoggerFactory.getLogger(BoardFreeService.class);

    @Autowired
    public BoardFreeService(IBoardFreeDAO boardFreeDAO, IUserDAO userDAO){
        this.boardFreeDAO = boardFreeDAO;
        this.userDAO = userDAO;
    }


    @Override
    @Transactional
    public boolean createFree(BoardDto boardDto) {
        LOGGER.info("BoardFreeService CreateFree 메세드 접속");
        BoardFree boardFree = new BoardFree();
        String nickname = boardDto.getNickname();
        LOGGER.info(nickname);
        try{
            User user = userDAO.checkNickname(nickname);
            if(user != null){
                boardFree.setContent(boardDto.getContent());
                boardFree.setTitle(boardDto.getTitle());
                boardFree.setUser(user);
                boardFree.setHit(0);
                return boardFreeDAO.saveFree(boardFree);
            }
        }catch(Exception e){
            LOGGER.info("회원정보가 없음");
            e.printStackTrace();
        }
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BoardFreeDto> getBoardFreeAll() {
        List<BoardFree> list = boardFreeDAO.getBoardFreeAll();
        List<BoardFreeDto> boardDtos = new ArrayList<BoardFreeDto>();
        for (int i = list.size()-1; i >= 0; i--
             ) {
        	BoardFree free = list.get(i);
            BoardFreeDto boardFreeDto = new BoardFreeDto();
            boardFreeDto.setId(free.getId());
            boardFreeDto.setTitle(free.getTitle());
            boardFreeDto.setCreatedTime(free.getCreatedDate());
            boardFreeDto.setModifiedTime(free.getModifiedDate());
            boardFreeDto.setContent(free.getContent());
            boardFreeDto.setNickname(free.getUser().getNickname());
            boardFreeDto.setHit(free.getHit());
            boardFreeDto.setIsReport(free.getIsReport());
            List<Comment> comments = boardFreeDAO.getCommentByBoardId(free.getId());
            List<CommentDto> commentDtos = new ArrayList<CommentDto>();
            for (Comment comment:
                 comments) {
                CommentDto commentDto = new CommentDto();
                commentDto.setId(comment.getId());
                commentDto.setNickname(comment.getUser().getNickname());
                commentDto.setContent(comment.getContent());
                commentDto.setCreatedTime(comment.getCreatedDate());
                commentDtos.add(commentDto);
            }
            boardFreeDto.setComments(commentDtos);
            boardDtos.add(boardFreeDto);
        }
        return boardDtos;
    }

    @Override
    @Transactional
    public BoardFreeDto getBoardFree(int id) {
        BoardFree board = boardFreeDAO.getBoardFree(id);
        if(board != null){
        	board.setHit(board.getHit() + 1);
        	boardFreeDAO.saveFree(board);
            BoardFreeDto boardFreeDto = new BoardFreeDto();
            boardFreeDto.setHit(board.getHit() + 1);
            boardFreeDto.setNickname(board.getUser().getNickname());
            boardFreeDto.setTitle(board.getTitle());
            boardFreeDto.setContent(board.getContent());
            boardFreeDto.setId(board.getId());
            boardFreeDto.setCreatedTime(board.getCreatedDate());
            boardFreeDto.setModifiedTime(board.getModifiedDate());
            boardFreeDto.setIsReport(board.getIsReport());
            List<Comment> comments = boardFreeDAO.getCommentByBoardId(board.getId());
            List<CommentDto> commentDtos = new ArrayList<CommentDto>();
            for (Comment comment:
                    comments) {
                CommentDto commentDto = new CommentDto();
                commentDto.setId(comment.getId());
                commentDto.setNickname(comment.getUser().getNickname());
                commentDto.setContent(comment.getContent());
                commentDto.setCreatedTime(comment.getCreatedDate());
                commentDto.setModifiedTime(comment.getModifiedDate());
                commentDtos.add(commentDto);
            }
            boardFreeDto.setComments(commentDtos);
            return boardFreeDto;
        }
        return null;
    }

    @Override
    @Transactional
    public boolean createFreeComment(int id, CommentDto commentDto) {
        BoardFree board = boardFreeDAO.getBoardFree(id);
        User user = userDAO.checkNickname(commentDto.getNickname());
        if(user != null) {
        	Comment comment = new Comment();
        	comment.setBoardFree(board);
        	comment.setUser(user);
        	comment.setContent(commentDto.getContent());
        	return boardFreeDAO.saveFreeComment(comment);
        }
        else {
        	return false;
        }

    }


	@Override
	@Transactional
	public boolean changeFree(int id, BoardDto boardDto) {
		BoardFree board = boardFreeDAO.getBoardFree(id);
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(board == null) return false;
        if(!board.getUser().getEmail().equals(principal.getUsername())) return false;
		board.setContent(boardDto.getContent());
		board.setTitle(boardDto.getTitle());
		return boardFreeDAO.saveFree(board);
	}


	@Override
	@Transactional
	public boolean deleteFree(int id) {
        BoardFree board = boardFreeDAO.getBoardFree(id);
        org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(board == null) return false;
        if(!board.getUser().getEmail().equals(principal.getUsername())) return false;
		return boardFreeDAO.deleteFree(id);
	}


	@Override
	@Transactional
	public boolean changeComment(int commentId, CommentDto commentDto) {
		Comment comment = boardFreeDAO.getComment(commentId); 
		if(comment != null) {
            org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(!comment.getUser().getEmail().equals(principal.getUsername())) return false;
			comment.setContent(commentDto.getContent());
			boardFreeDAO.saveFreeComment(comment);
			return true;
		}
		return false;
	}


	@Override
	@Transactional
	public boolean deleteComment(int commentId) {
        Comment comment = boardFreeDAO.getComment(commentId);
        if(comment != null) {
            org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if(!comment.getUser().getEmail().equals(principal.getUsername())) return false;
		    return boardFreeDAO.deleteComment(commentId);

        }
        return false;
	}


	@Override
	public boolean reportPost(int id) {
		BoardFree board = boardFreeDAO.getBoardFree(id);
		if(board != null) {
			board.setIsReport((byte)1);
			boardFreeDAO.saveFree(board);
			return true;
		}
		return false;
	}


	@Override
	public boolean clearPostReport(int id) {
		BoardFree board = boardFreeDAO.getBoardFree(id);
		if(board != null) {
			board.setIsReport((byte)0);
			boardFreeDAO.saveFree(board);
			return true;
		}
		return false;
	}
}

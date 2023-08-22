package com.ssafy.realcart.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.realcart.data.dao.inter.IBoardReportDAO;
import com.ssafy.realcart.data.dao.inter.IUserDAO;
import com.ssafy.realcart.data.dto.AnswerDto;
import com.ssafy.realcart.data.dto.BoardReportDto;
import com.ssafy.realcart.data.dto.BoardReportRequestDto;
import com.ssafy.realcart.data.entity.Answer;
import com.ssafy.realcart.data.entity.BoardReport;
import com.ssafy.realcart.data.entity.User;
import com.ssafy.realcart.service.inter.IBoardReportService;
@Service
public class BoardReportService implements IBoardReportService {

	IBoardReportDAO boardReportDAO;
	IUserDAO userDAO;
	private final Logger LOGGER = LoggerFactory.getLogger(BoardReportService.class);
	@Autowired
	public BoardReportService(IBoardReportDAO boardReportDAO, IUserDAO userDAO) {
		this.boardReportDAO = boardReportDAO;
		this.userDAO = userDAO;
	}
	
	@Override
	@Transactional
	public boolean createReport(BoardReportRequestDto boardDto){
		BoardReport boardReport = new BoardReport();
		boardReport.setContent(boardDto.getContent());
		boardReport.setTitle(boardDto.getTitle());
		User user = userDAO.checkNickname(boardDto.getNickname());
		if(user != null) {
			boardReport.setUser(user);
		}
		else return false;
		boardReport.setCategory(boardDto.getCategory());
		return boardReportDAO.saveReport(boardReport);
	}

	@Override
	@Transactional(readOnly = true)
	public List<BoardReportDto> getBoardReportAll() {
		List<BoardReport> boardReports = boardReportDAO.getBoardReportAll();
		List<BoardReportDto> boardReportDtos = new ArrayList<BoardReportDto>();
		for (int i = boardReports.size() - 1; i >= 0; i--) {
			BoardReport boardReport = boardReports.get(i);
			BoardReportDto boardReportDto = new BoardReportDto();
			boardReportDto.setCreatedTime(boardReport.getCreatedDate());
			boardReportDto.setHit(boardReport.getHit());
			boardReportDto.setId(boardReport.getId());
			boardReportDto.setModifiedTime(boardReport.getModifiedDate());
			boardReportDto.setNickname(boardReport.getUser().getNickname());
			boardReportDto.setTitle(boardReport.getTitle());
			boardReportDto.setCategory(boardReport.getCategory());
			boardReportDto.setIsEnd(boardReport.getIsEnd());
			boardReportDto.setIsPrivate(boardReport.getIsPrivate());
			boardReportDtos.add(boardReportDto);
		}
		return boardReportDtos;
	}

	@Override
	@Transactional
	public BoardReportDto getBoardReport(int id) {
		BoardReport boardReport = boardReportDAO.getBoardReport(id);
		if(boardReport == null) return null;
		if(boardReport.getIsPrivate() == (byte) 1){
			org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			if(!principal.getUsername().equals(boardReport.getUser().getEmail())){
				return null;
			}
		}
		boardReport.setHit(boardReport.getHit() + 1);
		boardReportDAO.saveReport(boardReport);
		BoardReportDto boardReportDto = new BoardReportDto();
		boardReportDto.setContent(boardReport.getContent());
		boardReportDto.setCreatedTime(boardReport.getCreatedDate());
		boardReportDto.setHit(boardReport.getHit()+1);
		boardReportDto.setId(boardReport.getId());
		boardReportDto.setModifiedTime(boardReport.getModifiedDate());
		boardReportDto.setNickname(boardReport.getUser().getNickname());
		boardReportDto.setTitle(boardReport.getTitle());
		boardReportDto.setCategory(boardReport.getCategory());
		boardReportDto.setIsEnd(boardReport.getIsEnd());
		boardReportDto.setIsPrivate(boardReport.getIsPrivate());
		List<Answer> list = boardReportDAO.getAnswerByBoardFK(boardReport.getId());
		List<AnswerDto> dtoList = new ArrayList<AnswerDto>();
		for (Answer answer : list) {
			AnswerDto answerDto = new AnswerDto();
			answerDto.setId(answer.getId());
			answerDto.setCreatedTime(answer.getCreatedDate());
			answerDto.setModifiedTime(answer.getModifiedDate());
			answerDto.setContent(answer.getContent());
			dtoList.add(answerDto);
		}
		boardReportDto.setAnswers(dtoList);
		return boardReportDto;
	}

	@Override
	@Transactional
	public boolean changeReport(int id, BoardReportRequestDto boardDto) {
		BoardReport boardReport = boardReportDAO.getBoardReport(id);
		org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(boardReport != null) {
			if(!boardReport.getUser().getEmail().equals(principal.getUsername())) return false;
			boardReport.setContent(boardDto.getContent());
			boardReport.setTitle(boardDto.getTitle());
			boardReport.setCategory(boardDto.getCategory());
			boardReportDAO.saveReport(boardReport);
			return true;
		}
		return false;
	}

	@Override
	@Transactional
	public boolean deleteReport(int id) {

		BoardReport boardReport = boardReportDAO.getBoardReport(id);
		org.springframework.security.core.userdetails.User principal = (org.springframework.security.core.userdetails.User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(boardReport != null) {
			if (!boardReport.getUser().getEmail().equals(principal.getUsername())) return false;
			return boardReportDAO.deleteReport(id);
		}
		return false;
	}

	@Override
	public boolean addAnswer(int id, AnswerDto answerDto) {
		BoardReport boardReport = boardReportDAO.getBoardReport(id);
		if(boardReport == null) return false;
		Answer answer = new Answer();
		answer.setBoardReport(boardReport);
		answer.setContent(answerDto.getContent());
		boardReportDAO.saveAnswer(answer);
		return true;
	}

	@Override
	public boolean changeAnswer(int answerId, AnswerDto answerDto) {
		Answer answer = boardReportDAO.getAnswer(answerId);
		if(answer == null) return false;
		answer.setContent(answerDto.getContent());
		boardReportDAO.saveAnswer(answer);
		return true;
	}

	@Override
	public boolean deleteAnswer(int answerId) {
		boardReportDAO.deleteAnswer(answerId);
		return true;
	}

	@Override
	public boolean changeReportEndState(int id) {
		BoardReport boardReport = boardReportDAO.getBoardReport(id);
		if(boardReport == null) return false;
		boardReport.setIsEnd((byte)(boardReport.getIsEnd() ^ 1));
		boardReportDAO.saveReport(boardReport);
		return true;
	}

}

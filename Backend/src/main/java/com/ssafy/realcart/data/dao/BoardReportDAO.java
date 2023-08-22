package com.ssafy.realcart.data.dao;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ssafy.realcart.data.dao.inter.IBoardReportDAO;
import com.ssafy.realcart.data.entity.Answer;
import com.ssafy.realcart.data.entity.BoardReport;
import com.ssafy.realcart.data.repository.IAnswerRepository;
import com.ssafy.realcart.data.repository.IBoardReportRepository;
@Component
public class BoardReportDAO implements IBoardReportDAO {

	IBoardReportRepository boardReportRepository;
	IAnswerRepository answerRepository;
	private final Logger LOGGER = LoggerFactory.getLogger(BoardReportDAO.class);
	
	@Autowired
	public BoardReportDAO(IBoardReportRepository boardReportRepository, IAnswerRepository answerRepository) {
		this.boardReportRepository = boardReportRepository;
		this.answerRepository = answerRepository;
	}
	
	@Override
	public boolean saveReport(BoardReport boardReport) {
		if(boardReportRepository.save(boardReport) != null) {
			return true;
		}
		return false;
	}

	@Override
	public List<BoardReport> getBoardReportAll() {
		return boardReportRepository.findAll();
	}

	@Override
	public BoardReport getBoardReport(int id) {
		Optional<BoardReport> selectedBoardReport = boardReportRepository.findById(id);
		if(selectedBoardReport.isPresent()) {
			BoardReport boardReport = selectedBoardReport.get();
			
			return boardReport;
		}
		return null;
	}

	@Override
	public boolean deleteReport(int id) {
		Optional<BoardReport> selectedBoardReport = boardReportRepository.findById(id);
		if(selectedBoardReport.isPresent()) {
			BoardReport boardReport = selectedBoardReport.get();
			boardReportRepository.delete(boardReport);
			return true;
		}
		return false;
	}

	@Override
	public void saveAnswer(Answer answer) {
		answerRepository.save(answer);
	}

	@Override
	public Answer getAnswer(int answerId) {
		Optional<Answer> selectedAnswer = answerRepository.findById(answerId);
		if(selectedAnswer.isPresent()) {
			Answer answer = selectedAnswer.get();
			return answer;
		}
		return null;
	}

	@Override
	public void deleteAnswer(int answerId) {
		answerRepository.deleteById(answerId);
		
	}

	@Override
	public List<Answer> getAnswerByBoardFK(int id) {
		return answerRepository.findByBOARD_FK(id);
	}

}

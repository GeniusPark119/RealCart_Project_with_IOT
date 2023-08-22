package com.ssafy.realcart.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.realcart.data.dto.AnswerDto;
import com.ssafy.realcart.data.dto.BoardDto;
import com.ssafy.realcart.data.dto.BoardFreeDto;
import com.ssafy.realcart.data.dto.BoardNoticeDto;
import com.ssafy.realcart.data.dto.BoardReportDto;
import com.ssafy.realcart.data.dto.BoardReportRequestDto;
import com.ssafy.realcart.data.dto.CommentDto;
import com.ssafy.realcart.service.inter.IBoardFreeService;
import com.ssafy.realcart.service.inter.IBoardNoticeService;
import com.ssafy.realcart.service.inter.IBoardReportService;

@RestController
@RequestMapping("/board")
public class BoardController {


    IBoardFreeService boardFreeService;
    IBoardNoticeService boardNoticeService;
    IBoardReportService boardReportService;
    private final Logger LOGGER = LoggerFactory.getLogger(BoardController.class);

    @Autowired
    public BoardController(IBoardFreeService boardFreeService, IBoardNoticeService boardNoticeService, IBoardReportService boardReportService){
        this.boardFreeService = boardFreeService;
        this.boardNoticeService = boardNoticeService;
        this.boardReportService = boardReportService;
    }

    @GetMapping(value="/free")
    public ResponseEntity<List<BoardFreeDto>> getBoardFreeAll(){
    	LOGGER.info("getBoardFreeAll 메서드를  BoardController에서 진입");
        List<BoardFreeDto> list = boardFreeService.getBoardFreeAll();

        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @GetMapping(value="/notice")
    public ResponseEntity<List<BoardNoticeDto>> getBoardNoticeAll(){
    	LOGGER.info("getBoardNoticeAll 메서드를  BoardController에서 진입");
    	List<BoardNoticeDto> list = boardNoticeService.getBoardNoticeAll();
    	
    	return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @GetMapping(value="/report")
    public ResponseEntity<List<BoardReportDto>> getBoardReportAll(){
    	LOGGER.info("getBoardReportAll 메서드를  BoardController에서 진입");
    	List<BoardReportDto> list = boardReportService.getBoardReportAll();
    	
    	return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @PostMapping(value="/free")
    public ResponseEntity<String> createFree(@RequestBody BoardDto boardDto){
    	LOGGER.info("createFree 메서드를  BoardController에서 진입");
        if(boardFreeService.createFree(boardDto)){
            return ResponseEntity.status(HttpStatus.OK).body("글 게시 성공");
        }
        else{
            return ResponseEntity.status(HttpStatus.OK).body("글 게시 실패");
        }
    }

    @PostMapping(value="/notice")
    public ResponseEntity<String>  createNotice(@RequestBody BoardDto boardDto){
    	LOGGER.info("createNotice 메서드를  BoardController에서 진입");
    	if(boardNoticeService.createNotice(boardDto)){
            return ResponseEntity.status(HttpStatus.OK).body("글 게시 성공");
        }
        else{
            return ResponseEntity.status(HttpStatus.OK).body("글 게시 실패");
        }
    }

    @PostMapping(value="/report")
    public ResponseEntity<String>  createReport(@RequestBody BoardReportRequestDto boardDto){
    	LOGGER.info("createReport 메서드를  BoardController에서 진입");

    	if(boardReportService.createReport(boardDto)){
            return ResponseEntity.status(HttpStatus.OK).body("글 게시 성공");
        }
        else{
            return ResponseEntity.status(HttpStatus.OK).body("글 게시 실패");
        }
    }

    @PutMapping(value="/free/{id}")
    public ResponseEntity<String> changeFree(@PathVariable int id, @RequestBody BoardDto boardDto){
    	LOGGER.info("changeFree 메서드를  BoardController에서 진입");
    	if(boardFreeService.changeFree(id, boardDto)) {
    		return ResponseEntity.status(HttpStatus.OK).body("글 수정 성공");
    	}

        return ResponseEntity.status(HttpStatus.OK).body("글 수정 실패");
    }

    @PutMapping(value="/notice/{id}")
    public ResponseEntity<String>  changeNotice(@PathVariable int id, @RequestBody BoardDto boardDto){
    	LOGGER.info("changeNotice 메서드를  BoardController에서 진입");

    	if(boardNoticeService.changeNotice(id, boardDto)) {
    		return ResponseEntity.status(HttpStatus.OK).body("글 수정 성공");
    	}

        return ResponseEntity.status(HttpStatus.OK).body("글 수정 실패");
    }

    @PutMapping(value="/report/{id}")
    public ResponseEntity<String>  changeReport(@PathVariable int id, @RequestBody BoardReportRequestDto boardDto){
    	LOGGER.info("changeReport 메서드를  BoardController에서 진입");
    	if(boardReportService.changeReport(id, boardDto)) {
    		return ResponseEntity.status(HttpStatus.OK).body("글 수정 성공");
    	}

        return ResponseEntity.status(HttpStatus.OK).body("글 수정 실패");
    }

    @DeleteMapping(value="/free/{id}")
    public ResponseEntity<String> deleteFree(@PathVariable int id){
    	LOGGER.info("deleteFree 메서드를  BoardController에서 진입");
    	if(boardFreeService.deleteFree(id)) {
    		return ResponseEntity.status(HttpStatus.OK).body("글 삭제 성공");
    	}
    	return ResponseEntity.status(HttpStatus.OK).body("글 삭제 실패");
    }

    @DeleteMapping(value="/notice/{id}")
    public ResponseEntity<String>  deleteNotice(@PathVariable int id){
    	LOGGER.info("deleteNotice 메서드를  BoardController에서 진입");
    	if(boardNoticeService.deleteNotice(id)) {
    		return ResponseEntity.status(HttpStatus.OK).body("글 삭제 성공");
    	}
    	return ResponseEntity.status(HttpStatus.OK).body("글 삭제 실패");
    }

    @DeleteMapping(value="/report/{id}")
    public ResponseEntity<String>  deleteReport(@PathVariable int id){
    	LOGGER.info("deleteReport 메서드를  BoardController에서 진입");
    	if(boardReportService.deleteReport(id)) {
    		return ResponseEntity.status(HttpStatus.OK).body("글 삭제 성공");
    	}
    	return ResponseEntity.status(HttpStatus.OK).body("글 삭제 실패");
    }

    @GetMapping(value="/free/{id}")
    public ResponseEntity<BoardFreeDto> getFree(@PathVariable("id") int id){
    	LOGGER.info("getFree 메서드를  BoardController에서 진입");
        BoardFreeDto boardDto = boardFreeService.getBoardFree(id);

        return ResponseEntity.status(HttpStatus.OK).body(boardDto);
    }

    @GetMapping(value="/notice/{id}")
    public ResponseEntity<BoardNoticeDto> getNotice(@PathVariable("id") int id){
    	LOGGER.info("getNotice 메서드를  BoardController에서 진입");
    	BoardNoticeDto boardDto = boardNoticeService.getBoardNotice(id);

        return ResponseEntity.status(HttpStatus.OK).body(boardDto);
    }

    @GetMapping(value="/report/{id}")
    public ResponseEntity<BoardReportDto> getReport(@PathVariable("id") int id){
    	LOGGER.info("getReport 메서드를  BoardController에서 진입");
    	BoardReportDto boardDto = boardReportService.getBoardReport(id);

        return ResponseEntity.status(HttpStatus.OK).body(boardDto);
    }

    @PostMapping(value="/free/{id}")
    public ResponseEntity<String> createComment(@PathVariable int id, @RequestBody CommentDto commentDto){
    	LOGGER.info("createComment 메서드를  BoardController에서 진입");
        if(boardFreeService.createFreeComment(id, commentDto)){
            return ResponseEntity.status(HttpStatus.OK).body("댓글 게시 성공");
        }
        return ResponseEntity.status(HttpStatus.OK).body("댓글 게시 실패");
    }

    @PutMapping(value="/free/{id}/{commentId}")
    public ResponseEntity<String> changeComment(@PathVariable int id, @PathVariable int commentId, @RequestBody CommentDto commentDto){
    	LOGGER.info("changeComment 메서드를  BoardController에서 진입");
    	if(boardFreeService.changeComment(commentId, commentDto)) {
    		return ResponseEntity.status(HttpStatus.OK).body("댓글 수정 성공");
    	}
        return ResponseEntity.status(HttpStatus.OK).body("댓글 수정 실패");
    }

    @DeleteMapping(value="/free/{id}/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable int id, @PathVariable int commentId){
    	LOGGER.info("deleteComment 메서드를  BoardController에서 진입");
    	if(boardFreeService.deleteComment(commentId)) {
    		return ResponseEntity.status(HttpStatus.OK).body("댓글 삭제 성공");
    		
    	}
        return ResponseEntity.status(HttpStatus.OK).body("댓글 삭제 실패");
    }
    @PostMapping(value="/report/{id}")
    public ResponseEntity<String> addAnswer(@PathVariable int id, @RequestBody AnswerDto answerDto){
    	LOGGER.info("addAnswer 메서드를  BoardController에서 진입");
    	if(boardReportService.addAnswer(id, answerDto)){
    		return ResponseEntity.status(HttpStatus.OK).body("답변 게시 성공");
    	}
    	return ResponseEntity.status(HttpStatus.OK).body("답변 게시 실패");
    }
    
    @PutMapping(value="/report/{id}/{answerId}")
    public ResponseEntity<String> changeAnswer(@PathVariable int id, @PathVariable int answerId, @RequestBody AnswerDto answerDto){
    	LOGGER.info("changeAnswer 메서드를  BoardController에서 진입");
    	if(boardReportService.changeAnswer(answerId, answerDto)) {
    		return ResponseEntity.status(HttpStatus.OK).body("답변 수정 성공");
    	}
    	return ResponseEntity.status(HttpStatus.OK).body("답변 수정 실패");
    }
    
    @DeleteMapping(value="/report/{id}/{answerId}")
    public ResponseEntity<String> deleteAnswer(@PathVariable int id, @PathVariable int answerId){
    	LOGGER.info("deleteAnswer 메서드를  BoardController에서 진입");
    	if(boardReportService.deleteAnswer(answerId)) {
    		return ResponseEntity.status(HttpStatus.OK).body("답변 삭제 성공");
    		
    	}
    	return ResponseEntity.status(HttpStatus.OK).body("답변 삭제 실패");
    }
    
    @PostMapping(value="/free/report/{id}")
    public ResponseEntity<String> reportPost(@PathVariable int id){
    	LOGGER.info("reportPost 메서드를  BoardController에서 진입");
        if(boardFreeService.reportPost(id)){
            return ResponseEntity.status(HttpStatus.OK).body("게시글 신고 성공");
        }
        return ResponseEntity.status(HttpStatus.OK).body("게시글 신고 실패");
    }
    
    @PutMapping(value="/free/report/{id}")
    public ResponseEntity<String> clearPostReport(@PathVariable int id){
    	LOGGER.info("clearPostReport 메서드를  BoardController에서 진입");
        if(boardFreeService.clearPostReport(id)){
            return ResponseEntity.status(HttpStatus.OK).body("게시글 신고 해제");
        }
        return ResponseEntity.status(HttpStatus.OK).body("게시글 신고 해제 실패");
    }
    
    @PutMapping(value="/report/end/{id}")
    public ResponseEntity<String> changeReportEndState(@PathVariable int id){
    	LOGGER.info("changeReportEndState 메서드를  BoardController에서 진입");
        if(boardReportService.changeReportEndState(id)){
            return ResponseEntity.status(HttpStatus.OK).body("문의 해결");
        }
        return ResponseEntity.status(HttpStatus.OK).body("문의 해결 실패");
    }

}

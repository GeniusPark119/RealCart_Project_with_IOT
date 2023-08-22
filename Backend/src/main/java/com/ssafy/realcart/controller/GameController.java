package com.ssafy.realcart.controller;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.StringTokenizer;

import com.ssafy.realcart.data.dto.BetDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.realcart.data.dto.GameDto;
import com.ssafy.realcart.data.dto.PlayDto;
import com.ssafy.realcart.data.dto.UserDto;
import com.ssafy.realcart.service.inter.IGameService;

@RestController
@RequestMapping("/game")
public class GameController {
	
    private Queue<String> queue = new ArrayDeque<String>();
    
    private final Logger LOGGER = LoggerFactory.getLogger(GameController.class);

    private IGameService gameService;
    
    @Autowired
    public GameController(IGameService gameService){
        this.gameService = gameService;
    }
    
    @GetMapping()
    public ResponseEntity<GameDto> getCurrentGame(){
    	GameDto gameDto = gameService.getGame();
        return ResponseEntity.status(HttpStatus.OK).body(gameDto);
    }
    
    @GetMapping(value="/{id}")
    public ResponseEntity<GameDto> getGame(@PathVariable int id){
    	GameDto gameDto = gameService.getGame(id);
        return ResponseEntity.status(HttpStatus.OK).body(gameDto);
    }
    
    @GetMapping(value="/participate")
    public ResponseEntity<Integer> participateGame(@RequestParam String nickname) {
        LOGGER.info("participateGame 메서드가 gameController에서 호출되었습니다.");
        int num = gameService.participateGame(nickname);
        return new ResponseEntity<>(num, HttpStatus.OK);
    }

    @PostMapping(value="/up")
    public ResponseEntity<String> upBet(@RequestBody Map<String, Integer> teamMap) {
        LOGGER.info("UP 메서드가 gameController에서 호출되었습니다.");
        if(gameService.up(teamMap.get("teamId"))){
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value="/bet")
    public ResponseEntity<BetDto> getBet() {
        LOGGER.info("getUP 메서드가 gameController에서 호출되었습니다.");
        BetDto betDto = gameService.getBet();
        if(betDto != null){
            return new ResponseEntity<BetDto>(betDto, HttpStatus.OK);
        }
        return new ResponseEntity<BetDto>(betDto, HttpStatus.BAD_REQUEST);
    }

    @GetMapping(value="/queue")
    public ResponseEntity<String> checkQueue() {

        LOGGER.info("checkQueue 메서드가 gameController에서 호출되었습니다.");
        String queue = gameService.checkQueue();
        return new ResponseEntity<>(queue, HttpStatus.OK);
    }
    
    @PostMapping(value="/result", consumes = "text/plain")
    public ResponseEntity<String> endGame(@RequestBody String string) {
        LOGGER.info("endGame 메서드가 gameController에서 호출되었습니다.");
        System.out.println(string);
        StringTokenizer st = new StringTokenizer(string, ",");
        PlayDto playDto = new PlayDto();
        String nickname1 = st.nextToken();
        if(nickname1 != null){
            playDto.setNickname1(nickname1.substring(2, nickname1.length()));
        }
        playDto.setLaptime1(Long.parseLong(st.nextToken()));
        playDto.setNickname2(st.nextToken());
        playDto.setLaptime2(Long.parseLong(st.nextToken()));
        if(playDto.getLaptime1() <= 0) {
        	playDto.setLaptime1(Long.MAX_VALUE);
        }
        if(playDto.getLaptime2() <= 0) {
        	playDto.setLaptime2(Long.MAX_VALUE);
        }
        if(gameService.endGame(playDto)) {
        	return new ResponseEntity<>("Good", HttpStatus.OK);
        }
        else {
        	return new ResponseEntity<>("Bad", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping()
    public ResponseEntity<String> createGame(){
    	if(gameService.createGame()) {
    		return ResponseEntity.status(HttpStatus.OK).body("게임 생성 완료");
    	}
    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게임 생성 실패");
    }

    @PutMapping()
    public ResponseEntity<String> changeGame(@RequestBody GameDto gameDto){

        return ResponseEntity.status(HttpStatus.OK).body("게임 수정 완료");

    }
}

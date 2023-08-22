package com.ssafy.realcart.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssafy.realcart.data.dao.inter.IPlayDAO;
import com.ssafy.realcart.data.dao.inter.IRecordDAO;
import com.ssafy.realcart.data.dao.inter.IUserDAO;
import com.ssafy.realcart.data.dto.PlayDto;
import com.ssafy.realcart.data.dto.PlayResponseDto;
import com.ssafy.realcart.data.dto.RecordDto;
import com.ssafy.realcart.data.entity.Game;
import com.ssafy.realcart.data.entity.Play;
import com.ssafy.realcart.data.entity.Record;
import com.ssafy.realcart.data.entity.User;
import com.ssafy.realcart.service.inter.IRecordService;

@Service
public class RecordService implements IRecordService {

	private IRecordDAO recordDAO;
	private IPlayDAO playDAO;
	private IUserDAO userDAO;
    private final Logger LOGGER = LoggerFactory.getLogger(RecordService.class);

    @Autowired
    public RecordService(IRecordDAO recordDAO, IUserDAO userDAO, IPlayDAO playDAO){
        this.recordDAO = recordDAO;
        this.userDAO = userDAO;
        this.playDAO = playDAO;
    }

	@Override
	public List<RecordDto> getRecord() {
		List<Record> list = recordDAO.getAllRecord();
		List<RecordDto> dtolist = new ArrayList<RecordDto>();
		SimpleDateFormat sdf = new SimpleDateFormat("mm:ss.SSS");
		int rank = 1;
		for (Record record : list) {
			RecordDto recordDto = new RecordDto();
			if(record.getLapTime() == Long.MAX_VALUE) {
				recordDto.setLapTime("기권");
			}
			else {
				recordDto.setLapTime(sdf.format(new Date(record.getLapTime())));
			}
			recordDto.setNickname(record.getUser().getNickname());
			recordDto.setRank(rank++);
			dtolist.add(recordDto);
		}
		return dtolist;
	}

	@Override
	public List<PlayResponseDto> getUserRecord(String nickname) {
		User user = userDAO.checkNickname(nickname);
		if(user == null) {
			return null;
		}
		List<Play> list = playDAO.getAllPlay(user.getUserId());
		SimpleDateFormat sdf = new SimpleDateFormat("mm:ss.SSS");
		List<PlayResponseDto> answer = new ArrayList<PlayResponseDto>();
		for (Play play : list) {
			PlayResponseDto playResponseDto = new PlayResponseDto();
			Game game = play.getGame();
			playResponseDto.setGameId(game.getId());
			playResponseDto.setGameTime(game.getCreatedDate());
			List<Play> gamelist = playDAO.getPlay(game.getId());
			for (Play play2 : gamelist) {
				if(!play2.getUser().getNickname().equals(nickname)) {
					playResponseDto.setOppo(play2.getUser().getNickname());
					if(play2.getLapTime() == Long.MAX_VALUE) {
						playResponseDto.setOppoLapTime("기권");
					}
					else {
						playResponseDto.setOppoLapTime(sdf.format(new Date(play2.getLapTime())));
					}
				}
			}
			playResponseDto.setIsWin(play.getIsWin());
			if(play.getLapTime() == Long.MAX_VALUE) {
				playResponseDto.setLapTime("기권");
			}
			else {
				playResponseDto.setLapTime(sdf.format(new Date(play.getLapTime())));
			}
			playResponseDto.setNickname(nickname);
			answer.add(playResponseDto);
		}
		return answer;
	}

	@Override
	public RecordDto getBestRecord(String nickname) {
		List<RecordDto> list = getRecord();
		for (RecordDto recordDto : list) {
			if(recordDto.getNickname().equals(nickname)) {
				return recordDto;
			}
		}
		return null;
	}
    
    
}

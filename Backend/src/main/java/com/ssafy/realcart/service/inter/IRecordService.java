package com.ssafy.realcart.service.inter;

import java.util.List;

import com.ssafy.realcart.data.dto.PlayResponseDto;
import com.ssafy.realcart.data.dto.RecordDto;

public interface IRecordService {

	List<RecordDto> getRecord();

	List<PlayResponseDto> getUserRecord(String nickname);

	RecordDto getBestRecord(String nickname);

}

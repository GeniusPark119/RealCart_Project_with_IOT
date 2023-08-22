package com.ssafy.realcart.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.realcart.data.dto.PlayResponseDto;
import com.ssafy.realcart.data.dto.RecordDto;
import com.ssafy.realcart.service.inter.IRecordService;

@RestController
@RequestMapping("/record")
public class RecordController {

	private IRecordService recordService;
    private final Logger LOGGER = LoggerFactory.getLogger(RecordController.class);

    @Autowired
    public RecordController(IRecordService recordService){
        this.recordService = recordService;
    }
    @GetMapping("/{nickname}")
    public ResponseEntity<List<PlayResponseDto>> getUserRecord(@PathVariable("nickname") String nickname){
        List<PlayResponseDto> list = recordService.getUserRecord(nickname);
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @GetMapping("best/{nickname}")
    public ResponseEntity<RecordDto> getBestRecord(@PathVariable("nickname") String nickname){
        RecordDto recordDto = recordService.getBestRecord(nickname);
        return ResponseEntity.status(HttpStatus.OK).body(recordDto);
    }
    
    @GetMapping()
    public ResponseEntity<List<RecordDto>> getRecord(){
        List<RecordDto> list = recordService.getRecord();
        return ResponseEntity.status(HttpStatus.OK).body(list);
    }

    @PutMapping()
    public ResponseEntity<Boolean> updateRecord(@RequestBody RecordDto recordDto){

        return ResponseEntity.status(HttpStatus.OK).body(true);
    }

}

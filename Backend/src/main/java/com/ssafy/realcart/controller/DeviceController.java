package com.ssafy.realcart.controller;

import java.util.ArrayList;
import java.util.List;

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

import com.ssafy.realcart.data.dto.DeviceDto;

@RestController
@RequestMapping("/device")
public class DeviceController {

    @GetMapping()
    public ResponseEntity<List<DeviceDto>> getDeviceList(){
        List<DeviceDto> deviceList = new ArrayList<>();
        DeviceDto deviceDto = new DeviceDto();
        deviceDto.setName("컬러센서1");
        deviceDto.setModel("A403-01");
        deviceDto.setStatus("Good");
        deviceDto.setId(1);
        deviceDto.setType("센서");
        deviceDto.setCreatedTime("2023-01-18 15:06:54.288323");
        deviceDto.setModifiedTime("2024-01-18 15:06:54.288323");
        deviceList.add(deviceDto);
        return ResponseEntity.status(HttpStatus.OK).body(deviceList);
    }

    @GetMapping(value="/{id}")
    public ResponseEntity<DeviceDto> getDevice(@PathVariable int id){
        DeviceDto deviceDto = new DeviceDto();
        deviceDto.setName("컬러센서1");
        deviceDto.setModel("A403-01");
        deviceDto.setStatus("Good");
        deviceDto.setId(1);
        deviceDto.setType("센서");
        deviceDto.setCreatedTime("2023-01-18 15:06:54.288323");
        deviceDto.setModifiedTime("2024-01-18 15:06:54.288323");
        return ResponseEntity.status(HttpStatus.OK).body(deviceDto);
    }

    @PostMapping()
    public ResponseEntity<String> createDevice(@RequestBody DeviceDto deviceDto){

        return ResponseEntity.status(HttpStatus.OK).body("디바이스 생성 완료");
    }

    @PutMapping(value="/{id}")
    public ResponseEntity<String> changeDevice(@PathVariable("id") int id, @RequestBody DeviceDto deviceDto){

        return ResponseEntity.status(HttpStatus.OK).body("디바이스 수정 완료");
    }

    @DeleteMapping(value="/{id}")
    public ResponseEntity<String> deleteDevice(@PathVariable("id") int id){

        return ResponseEntity.status(HttpStatus.OK).body("디바이스 삭제 완료");
    }
}

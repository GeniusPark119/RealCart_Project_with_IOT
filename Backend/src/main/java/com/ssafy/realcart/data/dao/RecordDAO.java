package com.ssafy.realcart.data.dao;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ssafy.realcart.data.dao.inter.IRecordDAO;
import com.ssafy.realcart.data.entity.Record;
import com.ssafy.realcart.data.repository.IRecordRepository;
@Component
public class RecordDAO implements IRecordDAO {

	private IRecordRepository recordRepository;
    private final Logger LOGGER = LoggerFactory.getLogger(RecordDAO.class);


    @Autowired
    public RecordDAO(IRecordRepository recordRepository) {
        this.recordRepository = recordRepository;
    }
	@Override
	public void saveRecord(Record record) {
		recordRepository.save(record);
		
	}

	@Override
	public Record getRecord(int userId) {
		return recordRepository.findByUSER_FK(userId);
	}
	@Override
	public List<Record> getAllRecord() {
		return recordRepository.findAllOrderByLapTime();
	}

}

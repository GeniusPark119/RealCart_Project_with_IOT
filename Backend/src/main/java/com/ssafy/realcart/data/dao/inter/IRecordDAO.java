package com.ssafy.realcart.data.dao.inter;

import java.util.List;

import com.ssafy.realcart.data.entity.Record;

public interface IRecordDAO {

	void saveRecord(Record record);

	Record getRecord(int userId);
	
	List<Record> getAllRecord();

}

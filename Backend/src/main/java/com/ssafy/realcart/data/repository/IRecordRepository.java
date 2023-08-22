package com.ssafy.realcart.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.realcart.data.entity.Record;

public interface IRecordRepository extends JpaRepository<Record, Integer>{

	@Query(value="select * from RECORD_TB where USER_FK = :id",nativeQuery=true)
    Record findByUSER_FK(@Param("id")int id);
	
	@Query(value="select * from RECORD_TB order by lap_time",nativeQuery=true)
    List<Record> findAllOrderByLapTime();
}

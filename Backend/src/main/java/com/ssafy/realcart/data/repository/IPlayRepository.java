package com.ssafy.realcart.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.realcart.data.entity.Play;

public interface IPlayRepository extends JpaRepository<Play, Integer>{
	@Query(value="select * from PLAY_TB where GAME_FK = :id",nativeQuery=true)
    List<Play> findByGAME_FK(@Param("id")int id);
	
	@Query(value="select * from PLAY_TB where USER_FK = :id",nativeQuery=true)
    List<Play> findByUSER_FK(@Param("id")int id);

}

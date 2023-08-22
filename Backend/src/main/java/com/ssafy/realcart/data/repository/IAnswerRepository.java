package com.ssafy.realcart.data.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.realcart.data.entity.Answer;

public interface IAnswerRepository extends JpaRepository<Answer, Integer>{


	@Query(value="select * from ANSWER_TB where BOARD_FK = :id",nativeQuery=true)
    List<Answer> findByBOARD_FK(@Param("id")int id);
}

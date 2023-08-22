package com.ssafy.realcart.data.repository;

import com.ssafy.realcart.data.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ICommentRepository extends JpaRepository<Comment, Integer> {
    @Query(value="select * from COMMENT_TB where BOARD_FK = :id",nativeQuery=true)
    List<Comment> findByBOARD_FK(@Param("id")int id);
}

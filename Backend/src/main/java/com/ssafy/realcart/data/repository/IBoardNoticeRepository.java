package com.ssafy.realcart.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.realcart.data.entity.BoardNotice;

public interface IBoardNoticeRepository extends JpaRepository<BoardNotice, Integer> {

}

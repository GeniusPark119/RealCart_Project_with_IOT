package com.ssafy.realcart.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.realcart.data.entity.BoardReport;

public interface IBoardReportRepository extends JpaRepository<BoardReport, Integer>{

}

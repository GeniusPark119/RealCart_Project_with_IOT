package com.ssafy.realcart.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.realcart.data.entity.Game;

public interface IGameRepository extends JpaRepository<Game, Integer>{

}

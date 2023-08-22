package com.ssafy.realcart.data.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.ssafy.realcart.config.BaseTime;
import com.ssafy.realcart.data.dto.AdDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name="BOARD_NOTICE_TB")
public class BoardNotice extends BaseTime{
	@Id
    @Column(name="BOARD_NOTICE_PK")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
	@Column(columnDefinition = "integer default 0", name="hit")
    private int hit;
    @Column(length = 500, nullable = false, name="title")
    private String title;
    @Column(columnDefinition = "TEXT", nullable = false, name="content")
    private String content;
}

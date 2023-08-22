package com.ssafy.realcart.data.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ssafy.realcart.data.entity.User;


public interface IUserRepository extends JpaRepository<User, Integer> {
    User findByNickname(String nickname);
    User findByEmail(String email);
    User saveAndFlush(User user);

    @Query(value="select * from USER_TB where email = :useremail and refresh_token = :refreshtoken",nativeQuery=true)
	User findByEmailAndRefreshToken(@Param("useremail")String userEmail, @Param("refreshtoken")String refreshToken);
}

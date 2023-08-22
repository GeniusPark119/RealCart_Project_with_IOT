package com.ssafy.realcart.service.auth;

import com.ssafy.realcart.data.entity.User;
import com.ssafy.realcart.data.entity.auth.ProviderType;
import com.ssafy.realcart.data.entity.auth.RoleType;
import com.ssafy.realcart.data.entity.auth.UserPrincipal;
import com.ssafy.realcart.data.repository.IUserRepository;
import com.ssafy.realcart.exception.OAuthProviderMissMatchException;
import com.ssafy.realcart.info.OAuth2UserInfo;
import com.ssafy.realcart.info.OAuth2UserInfoFactory;
import com.ssafy.realcart.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final IUserRepository userRepository;
    private final Logger LOGGER = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);

        try {
            return this.process(userRequest, user);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User process(OAuth2UserRequest userRequest, OAuth2User user) {
        LOGGER.debug("process 메서드가 CustomOAuth2UserService에서 실행됨");
        ProviderType providerType = ProviderType.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());

        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerType, user.getAttributes());
        User savedUser = userRepository.findByEmail(userInfo.getEmail());

        if (savedUser != null) {
            if (providerType != savedUser.getProviderType()) {
                throw new OAuthProviderMissMatchException(
                        "Looks like you're signed up with " + providerType +
                                " account. Please use your " + savedUser.getProviderType() + " account to login."
                );
            }
            updateUser(savedUser, userInfo);
        } else {
            // DB에 저장된 user가 없으면
            savedUser = createUser(userInfo, providerType);
        }

        return UserPrincipal.create(savedUser, user.getAttributes());
    }

    private User createUser(OAuth2UserInfo userInfo, ProviderType providerType) {
        LOGGER.debug("createUser 메서드가 CustomOAuth2UserService에서 실행됨");
        LocalDateTime now = LocalDateTime.now();
        User user = new User(

                userInfo.getName(),
                userInfo.getEmail(),
                providerType + "-" + userInfo.getId(),
                (byte) 1,
                userInfo.getImageUrl(),
                (byte) 0,
                providerType
        );
        return userRepository.saveAndFlush(user);
    }

    private User updateUser(User user, OAuth2UserInfo userInfo) {

        if (userInfo.getName() != null && !userInfo.getName().equals(user.getUsername())) {
            user.setUsername(userInfo.getName());
        }

        if (userInfo.getImageUrl() != null && !userInfo.getImageUrl().equals(user.getProfileImageUrl())) {
            user.setProfileImageUrl(userInfo.getImageUrl());
        }

        return user;
    }
}
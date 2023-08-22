package com.ssafy.realcart.config.auth;

import java.util.Arrays;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ssafy.realcart.config.filter.TokenAuthenticationFilter;
import com.ssafy.realcart.config.handler.OAuth2AuthenticationFailureHandler;
import com.ssafy.realcart.config.handler.OAuth2AuthenticationSuccessHandler;
import com.ssafy.realcart.config.handler.TokenAccessDeniedHandler;
import com.ssafy.realcart.data.entity.auth.RoleType;
import com.ssafy.realcart.data.repository.IUserRepository;
import com.ssafy.realcart.data.repository.OAuth2AuthorizationRequestBasedOnCookieRepository;
import com.ssafy.realcart.exception.RestAuthenticationEntryPoint;
import com.ssafy.realcart.service.auth.AuthTokenProvider;
import com.ssafy.realcart.service.auth.CustomOAuth2UserService;
import com.ssafy.realcart.service.auth.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final CorsProperties corsProperties;
    private final AppProperties appProperties;
    private final AuthTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;
    private final CustomOAuth2UserService oAuth2UserService;
    private final TokenAccessDeniedHandler tokenAccessDeniedHandler;
    private final IUserRepository userRepository;

    /*
     * UserDetailsService 설정
     * */
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                    .cors()
                .and()
                    .sessionManagement()  // 세션을 관리하겠다.
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                    .csrf().disable()
                    .formLogin().disable()
                    .httpBasic().disable()
                    .exceptionHandling()
                    .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                    .accessDeniedHandler(tokenAccessDeniedHandler)
                .and()
                .authorizeRequests()
                .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                .antMatchers("/**/admin/**").hasAnyAuthority(RoleType.ADMIN.getCode())
                .antMatchers("/accounts/auth/**").permitAll()
                .antMatchers(HttpMethod.GET, "/board/report").permitAll()
                .antMatchers(HttpMethod.GET, "/board/free").permitAll()
                .antMatchers(HttpMethod.GET, "/game/participate").hasAnyAuthority(RoleType.USER.getCode())
                .antMatchers(HttpMethod.GET, "/board/report/**").hasAnyAuthority(RoleType.USER.getCode())
                .antMatchers(HttpMethod.GET, "/board/free/**").hasAnyAuthority(RoleType.USER.getCode())
                .antMatchers(HttpMethod.GET, "/user/all").hasAnyAuthority(RoleType.ADMIN.getCode())
                .antMatchers(HttpMethod.GET, "/**").permitAll()
                .antMatchers(HttpMethod.POST, "/user/register").permitAll()
                .antMatchers(HttpMethod.POST, "/user/findpwd").permitAll()
                .antMatchers(HttpMethod.POST, "/game/**").permitAll()
                .antMatchers(HttpMethod.POST, "/user").permitAll()
                .antMatchers(HttpMethod.POST, "/board/report").hasAnyAuthority(RoleType.USER.getCode())
                .antMatchers(HttpMethod.POST, "/board/report/*").hasAnyAuthority(RoleType.ADMIN.getCode())
                .antMatchers(HttpMethod.POST, "/board/notice").hasAnyAuthority(RoleType.ADMIN.getCode())
                .antMatchers(HttpMethod.POST, "/**").hasAnyAuthority(RoleType.USER.getCode())
                .antMatchers(HttpMethod.PUT, "/board/report/*/*").hasAnyAuthority(RoleType.ADMIN.getCode())
                .antMatchers(HttpMethod.PUT, "/board/notice/*").hasAnyAuthority(RoleType.ADMIN.getCode())
                .antMatchers(HttpMethod.PUT, "/**").hasAnyAuthority(RoleType.USER.getCode())
                .antMatchers(HttpMethod.DELETE, "/board/notice/*").hasAnyAuthority(RoleType.ADMIN.getCode())
                .antMatchers(HttpMethod.DELETE, "/board/report/*/*").hasAnyAuthority(RoleType.ADMIN.getCode())
                .antMatchers(HttpMethod.DELETE, "/**").hasAnyAuthority(RoleType.USER.getCode())
                .anyRequest().authenticated()
                .and()
                    .oauth2Login()
                    .authorizationEndpoint()
                    .baseUri("/oauth2/authorization")   // 해당 uri로 들어오면 oauth2 인가 요청
                    .authorizationRequestRepository(oAuth2AuthorizationRequestBasedOnCookieRepository())
                .and()
                    .redirectionEndpoint()
                    .baseUri("/*/oauth2/code/*")
                .and()
                    .userInfoEndpoint()
                    .userService(oAuth2UserService)
                .and()
                    .successHandler(oAuth2AuthenticationSuccessHandler())
                    .failureHandler(oAuth2AuthenticationFailureHandler());
        // URL /login 요청이 오면 실행되는 UserPasswordAuthenticationFilter 이전에 tokenAuthenticationFilter()를 넣겠다.
        http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    /*
     * auth 매니저 설정
     * */
    @Override
    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    /*
     * security 설정 시, 사용할 인코더 설정
     * */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /*
     * 토큰 필터 설정
     * */
    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter(tokenProvider);
    }

    /*
     * 쿠키 기반 인가 Repository
     * 인가 응답을 연계 하고 검증할 때 사용.
     * */
    @Bean
    public OAuth2AuthorizationRequestBasedOnCookieRepository oAuth2AuthorizationRequestBasedOnCookieRepository() {
        return new OAuth2AuthorizationRequestBasedOnCookieRepository();
    }

    /*
     * Oauth 인증 성공 핸들러
     * */
    @Bean
    public OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler() {
        return new OAuth2AuthenticationSuccessHandler(
                tokenProvider,
                appProperties,
                userRepository,
                oAuth2AuthorizationRequestBasedOnCookieRepository()
        );
    }

    /*
     * Oauth 인증 실패 핸들러
     * */
    @Bean
    public OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler() {
        return new OAuth2AuthenticationFailureHandler(oAuth2AuthorizationRequestBasedOnCookieRepository());
    }

    /*
     * Cors 설정
     * */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource corsConfigSource = new UrlBasedCorsConfigurationSource();

        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedHeaders(Arrays.asList(corsProperties.getAllowedHeaders().split(",")));
        corsConfig.setAllowedMethods(Arrays.asList(corsProperties.getAllowedMethods().split(",")));
        corsConfig.setAllowedOrigins(Arrays.asList(corsProperties.getAllowedOrigins().split(",")));
        corsConfig.setAllowCredentials(true);
        corsConfig.setMaxAge(corsConfig.getMaxAge());

        corsConfigSource.registerCorsConfiguration("/**", corsConfig);
        return corsConfigSource;
    }
    
}
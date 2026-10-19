package com.skillswap.security;

import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final String redirectUri;

    public OAuth2AuthenticationSuccessHandler(
            JwtUtils jwtUtils,
            UserRepository userRepository,
            @Value("${app.oauth2.authorizedRedirectUris}") String redirectUri
    ) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.redirectUri = redirectUri;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        String avatarUrl = picture != null
                ? picture
                : (String) attributes.get("avatar_url"); // GitHub fallback
        String provider = determineProvider(attributes);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Set<User.Role> roles = new HashSet<>();
            roles.add(User.Role.ROLE_USER);
            return User.builder()
                    .email(email)
                    .name(name)
                    .avatar(avatarUrl)
                    .authProvider(provider)
                    .emailVerified(true)
                    .active(true)
                    .rating(0.0)
                    .reviewCount(0)
                    .completedBookings(0)
                    .roles(roles)
                    .build();
        });

        user.setName(name);
        if (avatarUrl != null) {
            user.setAvatar(avatarUrl);
        }
        userRepository.save(user);

        String token = jwtUtils.generateToken(email);
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build()
                .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private String determineProvider(Map<String, Object> attributes) {
        if (attributes.containsKey("sub")) return "GOOGLE";
        if (attributes.containsKey("login")) return "GITHUB";
        return "LOCAL";
    }
}

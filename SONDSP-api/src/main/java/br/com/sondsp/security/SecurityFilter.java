package br.com.sondsp.security;

import br.com.sondsp.entities.Users;
import br.com.sondsp.repositories.UsersRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsersRepository usersRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try{
            String token = this.recoverToken(request);
            if (token != null) {
                String username = this.tokenService.validateToken(token);
                UserDetails userDetails = usersRepository.findByUsername(username);

                if (userDetails == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);

                if (userDetails instanceof Users user) {
                    if (!user.getStatus()) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário inativo");
                    }
                }

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            filterChain.doFilter(request, response);

        } catch (ResponseStatusException ex) {
            response.setStatus(ex.getStatusCode().value());
            response.setContentType("application/json");
            response.getWriter().write(
                    String.format("{\"message\": \"%s\", \"error\": \"UNAUTHORIZED\"}",
                            ex.getReason() != null ? ex.getReason() : "Unauthorized")
            );
        }

    }

    private String recoverToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) return authHeader.substring(7);
        else return null;
    }
}

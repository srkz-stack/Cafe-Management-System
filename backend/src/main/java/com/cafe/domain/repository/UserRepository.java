package com.cafe.domain.repository;
import com.cafe.domain.model.User;
import java.util.Optional;
public interface UserRepository {
    Optional<User> findByUsername(String username);
    User save(User user);
    boolean existsByUsername(String username);
}
